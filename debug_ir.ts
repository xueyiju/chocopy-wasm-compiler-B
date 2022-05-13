import {parse} from './parser';
import { run, Config, augmentEnv } from "./runner";
import {emptyLocalTypeEnv, GlobalTypeEnv, tc, tcStmt} from  './type-check';
import { Program, Type, Value, SourceLocation, BinOp, UniOp } from './ast';
import { lowerProgram } from './lower';
import { importObject, addLibs  } from "./tests/import-object.test";
import { BasicREPL } from "./repl";
import * as ir from './ir';
import { optimizeAst } from "./optimize_ast"
import { CliRenderer } from "@diagrams-ts/graphviz-cli-renderer";


export function printProgIR(p: ir.Program<[Type, SourceLocation]>) {
  // p.body.map(bb => bb.stmts.map(stmt => printStmt(stmt)));
  p.body.map(bb => {
    console.log("--------------------------------")
    console.log("L: " + bb.label);
    bb.stmts.map(stmt => printStmt(stmt));
    console.log("--------------------------------")
  });
}

function printStmt(stmt: ir.Stmt<[Type, SourceLocation]>) {
  console.log("--" + stmt.tag);
  switch (stmt.tag) {
  case "assign":
    console.log("  " + stmt.name + " = ");
    printExpr(stmt.value);
    break;
  case "return":
    console.log(" RETURN ");
    break;
  case "expr":
    console.log(stmt.expr.tag);
    printExpr(stmt.expr);
    break;
  case "pass":
    console.log(" PASS ");
    break;
  case "ifjmp":
    console.log(" --> " + stmt.thn + " IF ");
    printVal(stmt.cond); 
    console.log(" --> " + stmt.els + " ELSE ");
    break;
  case "jmp":
    console.log(" --> " + stmt.lbl);
    break;
  case "store":
    console.log(" Not handled yet " + stmt.tag);
    break;
  }
  console.log("\n");
}

function printExpr(expr: ir.Expr<[Type, SourceLocation]>) {
  console.log("----" + expr.tag);
  switch (expr.tag) {
  case "value":
    printVal(expr.value);
    break;
  case "binop":
    printVal(expr.left);
    console.log(BinOp[expr.op]);
    printVal(expr.right);
    break;
  case "uniop":
    console.log(UniOp[expr.op]);
    printVal(expr.expr);
    break;
  case "builtin1":
    console.log(expr.name);
    printVal(expr.arg);
    break;
  case "builtin2":
    printVal(expr.left);
    console.log(expr.name);
    printVal(expr.right);
    break;
  case "call":
    console.log("F() " + expr.name);
    expr.arguments.map(printVal);
    break;
  case "alloc":
    console.log("ALLOC " + expr.amount);
    break;
  case "load":
    console.log("LOAD " + expr.start + " " + expr.offset);
    break;
  }
  console.log("\n");
}

function printVal(val: ir.Value<[Type, SourceLocation]>) {
  console.log(" ");
  switch (val.tag) {
  case "num":
  case "wasmint":
  case "bool":
    console.log(val.value.toString());
    break;
  case "id":
    console.log(val.name);
    break;
  case "none":
    console.log("None");
    break;
  }
  console.log(" ");
}

export enum JumpType { IF = 'green', ELSE = 'red', GOTO = 'black'}

function createBlock(label: string, stmtStrs: Array<string>): string {
  const lid = `<lbl> ${label}`;
  const stmts = stmtStrs.map((s, i) => `<ins${i}> ${s}`);
  if (stmts.length > 0) {
    return `"${label}" [label="${lid} | {${stmts.join(' | ')}}"];`;
  } else {
    return `"${label}" [label="${lid}"];`; 
  }
}

type EdgeTarget = [string, string]
function createEdge(s: EdgeTarget, t: EdgeTarget, jt: JumpType) {
  return `${s[0]}:${s[1]} -> ${t[0]}:${t[1]} [color = ${jt}];`
}

export function dotProg(p: ir.Program<[Type, SourceLocation]>): string {
  const dotStr: Array<string> = [];
  dotStr.push("digraph IR {");
  dotStr.push("node [shape=record];");
  p.body.forEach(bb => {
    const stmtStrs: Array<string>= [], jmps: Array<string> = [];
    bb.stmts.forEach((stmt, i) => {
      const sj = inLineStmt(stmt, bb.label, i)
      stmtStrs.push(sj[0]);
      jmps.push(...sj[1]);
    });
    dotStr.push(createBlock(bb.label, stmtStrs));
    dotStr.push(...jmps);
  });
  dotStr.push("}");
  const dotCode = dotStr.join("\n");
  console.log(dotCode);
  return dotCode;

  return `
  digraph structs {
    node [shape=record];
    "$struct1":f1 -> "struct2":l [color = "green"];
    "$struct1" [label="<l> $left | <f1> mid& . #92; dle | <f2> valname1 ? $then1:$else1}"];
    "struct2" [label="<l> one|<f1> two"];
    "struct4" [label="<l> one"];
    "struct3" [label="hello&#92;nworld |{ b |{c|<here> d|e}| f}| g | h"];
    "$struct1":f2 -> "struct3":here;
}
  `;
}

function inLineStmt(stmt: ir.Stmt<[Type, SourceLocation]>, curBlock: string, i: number): [string, Array<string>] {
  switch (stmt.tag) {
    case "assign": {
      return [stmt.name + " = " + exprInline(stmt.value), []];
    }
    case "return": {
      return ["return " + valInline(stmt.value), []];
    }
    case "expr": {
      return [exprInline(stmt.expr), []];
    }
    case "pass": {
      return ["pass", []];
    }
    case "ifjmp":
      const ifjmpLabel = valInline(stmt.cond) + " ? " + stmt.thn + ":" + stmt.els;
      const jmpIf = createEdge([`"${curBlock}"`, `ins${i.toString()}`], [`"${stmt.thn}"`, "lbl"], JumpType.IF);
      const jmpElse = createEdge([`"${curBlock}"`, `ins${i.toString()}`], [`"${stmt.els}"`, "lbl"], JumpType.ELSE);
      return [ifjmpLabel, [jmpIf, jmpElse]];
    case "jmp":
      const jmpLabel = "goto: " + stmt.lbl;
      return [jmpLabel, [createEdge([`"${curBlock}"`, `ins${i.toString()}`], [`"${stmt.lbl}"`, "lbl"], JumpType.GOTO)]];
    case "store":
      const storeLabel = "st " + valInline(stmt.value) + ": " + valInline(stmt.start) + " -> " + valInline(stmt.offset);
      return [storeLabel, []];
  }
}

function exprInline(expr: ir.Expr<[Type, SourceLocation]>): string {
  switch (expr.tag) {
    case "value":
      return valInline(expr.value);
    case "binop":
      return valInline(expr.left) + " " + BinOp[expr.op] + " " + valInline(expr.right);
    case "uniop":
      return UniOp[expr.op] + " " + valInline(expr.expr);
    case "builtin1":
      return expr.name + " " + valInline(expr.arg);
    case "builtin2":
      return valInline(expr.left) + " " + expr.name + " " + valInline(expr.right);
    case "call":
      const argStrs = expr.arguments.map(valInline);
      return expr.name + "(" + argStrs.join(", ") + ")";
    case "alloc":
      return "alloc " + expr.amount;
    case "load":
      return "ld " + expr.start + " -> " + expr.offset
    }
}

function valInline(val: ir.Value<[Type, SourceLocation]>): string {
  switch (val.tag) {
  case "num":
  case "wasmint":
  case "bool":
    return val.value.toString()
  case "id":
    return val.name;
  case "none":
    return "None";
  }
}

// entry point for debugging
async function debug() {
  var source = 
`
x: int = 0
y: int = 1
if x < 1: 
  print(1)
`
  const parsed = parse(source);
  // console.log(JSON.stringify(parsed, null, 2));
  const repl = new BasicREPL(await addLibs());
  // const program_type = repl.tc(source);
  const config : Config = {importObject: repl.importObject, env: repl.currentEnv, typeEnv: repl.currentTypeEnv, functions: repl.functions};
  const [tprogram, tenv] = tc(config.typeEnv, parsed);
  console.log(JSON.stringify(tprogram, null, 2));
  const globalEnv = augmentEnv(config.env, tprogram);
  const irprogram = lowerProgram(tprogram, globalEnv);
  console.log(JSON.stringify(irprogram, (k, v) => typeof v === "bigint" ? v.toString(): v, 2));
  printProgIR(irprogram);

  const render = CliRenderer({ outputFile: "./example.png", format: "png" });
  const dot = dotProg(irprogram);
  await render(dot);
}

// debug();
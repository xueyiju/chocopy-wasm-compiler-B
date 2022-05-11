import {parse} from './parser';
import { run, Config, augmentEnv } from "./runner";
import { compile, GlobalEnv } from './compiler';
import {emptyLocalTypeEnv, GlobalTypeEnv, tc, tcStmt} from  './type-check';
import { Program, Type, Value, SourceLocation } from './ast';
import { PyValue, NONE, BOOL, NUM, CLASS } from "./utils";
import { lowerProgram } from './lower';
import { importObject, addLibs  } from "./tests/import-object.test";
import { BasicREPL } from "./repl";

// entry point for debugging
async function debug() {
  var source = 
`
x: int = 0
1 + x + 2
`
  const parsed = parse(source);
  console.log(JSON.stringify(parsed, null, 2));
  const repl = new BasicREPL(await addLibs());
  // const program_type = repl.tc(source);
  const config : Config = {importObject: repl.importObject, env: repl.currentEnv, typeEnv: repl.currentTypeEnv, functions: repl.functions};
  const [tprogram, tenv] = tc(config.typeEnv, parsed);
  console.log(JSON.stringify(tprogram, null, 2));
  const globalEnv = augmentEnv(config.env, tprogram);
  const irprogram = lowerProgram(tprogram, globalEnv);
  // console.log(JSON.stringify(irprogram, null, 2));
  console.log(irprogram, null, 2);
}

debug();


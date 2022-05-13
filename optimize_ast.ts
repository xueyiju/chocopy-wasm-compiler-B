import { Type, Program, SourceLocation, FunDef, Expr, Stmt, Literal, BinOp, UniOp, Class} from './ast';

export function optimizeAst(program: Program<[Type, SourceLocation]>) : Program<[Type, SourceLocation]> {
    const optFuns = program.funs.map(fun => optimizeFuncDef(fun));
    var optStmts = program.stmts.map(stmt => optimizeStmt(stmt));
    const optClasses = program.classes.map(classDef => optimizeClassDef(classDef));
    // optmize ifstmts
    var optStmts = optimizeIfStmt(optStmts);
    return {...program, funs: optFuns, stmts: optStmts, classes: optClasses};
}

function optimizeFuncDef(funDef: FunDef<[Type, SourceLocation]>): FunDef<[Type, SourceLocation]> {
    // Constant folding
    var optBody = funDef.body.map(stmt => optimizeStmt(stmt));
    // Eliminate unreachable codes after return
    optBody = removeStmtAfterReturn(optBody);
    // Eliminate if branches with boolean literal condition
    optBody = optimizeIfStmt(optBody);
    return {...funDef, body: optBody};
}

/**
 * Dead code elimination: Remove the unreachable codes after return statement
 * 
 * Note: This function will return the exact same array if there were no return statement in the array
 * @param stmts An array of statements as the body of function/if-branch/loops
 * @returns an array statements with no statement after return statement
 */
function removeStmtAfterReturn(stmts: Array<Stmt<[Type, SourceLocation]>>): Array<Stmt<[Type, SourceLocation]>> {
    const newStmts: Array<Stmt<[Type, SourceLocation]>> = [];
    for (let stmt of stmts) {
        switch(stmt.tag) {
            case "return": {
                newStmts.push(stmt);
                return newStmts;
            } case "if": {
                const newThenBody = removeStmtAfterReturn(stmt.thn);
                const newElseBody = removeStmtAfterReturn(stmt.els);
                const newIfStmt = {...stmt, thn: newThenBody, els: newElseBody};
                newStmts.push(newIfStmt);
                break;
            } case "while": {
                const newLoopBody = removeStmtAfterReturn(stmt.body);
                const newWhileStmt = {...stmt, body: newLoopBody};
                newStmts.push(newWhileStmt);
                break;
            } default: {
                newStmts.push(stmt);
                break;
            }
        }
    }

    return newStmts;
}

function optimizeClassDef(classDef: Class<[Type, SourceLocation]>): Class<[Type, SourceLocation]> {
    // Dead code Elimination: Remove the statements after return inside method body
    const newMethods: Array<FunDef<[Type, SourceLocation]>> = classDef.methods.map(method => {
        return optimizeFuncDef(method);
    });

    return {...classDef, methods: newMethods};
}

function optimizeExpr(expr: Expr<[Type, SourceLocation]>): Expr<[Type, SourceLocation]> {
    switch (expr.tag){
        case "binop":
            var optLhs = optimizeExpr(expr.left);
            var optRhs = optimizeExpr(expr.right);
            if(optLhs.tag == "literal" && optRhs.tag == "literal"){
                var A = expr.a;
                var lit = foldBinop(optLhs.value, optRhs.value, expr.op);
                return  { a: A, tag: "literal", value: lit};
            }
            return {...expr, left:optLhs, right:optRhs};
        case "uniop":
           var optExpr = optimizeExpr(expr.expr);
           if(optExpr.tag == "literal"){
               var A = expr.a;
               var lit = foldUniop(optExpr.value, expr.op);
               return {a: A, tag: "literal", value: lit};
           }
           return {...expr, expr: optExpr};
        case "call":
            var optArgs = expr.arguments.map(e => optimizeExpr(e));
            return {...expr, arguments: optArgs};
        case "builtin1":
            var optArg = optimizeExpr(expr.arg);
            if (optArg.tag == "literal" && expr.name == "abs" && optArg.value.tag == "num") {
                return {tag: "literal", value: {tag: "num", value: Math.abs(optArg.value.value)}, a: expr.a};
            }
            return {...expr, arg: optArg};
        case "builtin2":
            var optLeft = optimizeExpr(expr.left);
            var optRight = optimizeExpr(expr.right);
            if (optLeft.tag == "literal" && optRight.tag == "literal") {
                const value = foldBuiltin2(optLeft.value, optRight.value, expr.name);
                return {tag: "literal", value, a: expr.a};
            }
            return {...expr, left: optLeft, right: optRight};
        case "method-call":
            var optArgs = expr.arguments.map(e => optimizeExpr(e));
            return {...expr, arguments: optArgs};
        default:
            return {...expr};
    }
}

function optimizeStmt(stmt: Stmt<[Type, SourceLocation]>): Stmt<[Type, SourceLocation]> {
    switch (stmt.tag){
        case "assign":
            var optValue = optimizeExpr(stmt.value);
            return {...stmt, value: optValue};
        case "expr":
            var optExpr = optimizeExpr(stmt.expr);
            return {...stmt, expr: optExpr};
        case "if":
            return {...stmt};
        case "return":
            var optValue = optimizeExpr(stmt.value);
            return {...stmt, value: optValue};
        case "while":
            var optCond = optimizeExpr(stmt.cond);
            var optBody = stmt.body.map(stmt => optimizeStmt(stmt));
            return {...stmt, cond: optCond, body: optBody};
        case "field-assign":
            var optValue = optimizeExpr(stmt.value);
            return {...stmt, value: optValue};
        default:
            return {...stmt};
    }
}

function foldBuiltin2(lsh: Literal, rhs: Literal, name: string): Literal {
    switch (name) {
        case "max":
            if (lsh.tag === "num" && rhs.tag === "num")
                return {tag: "num", value: Math.max(lsh.value, rhs.value)};
            return {tag: "none"};
        case "min":
            if (lsh.tag === "num" && rhs.tag === "num")
                return {tag: "num", value: Math.min(lsh.value, rhs.value)};
            return {tag: "none"};
        case "pow":
            if (lsh.tag === "num" && rhs.tag === "num")
                return {tag: "num", value: Math.pow(lsh.value, rhs.value)};
            return {tag: "none"};
        default:
            return {tag: "none"};
    }
}

function foldBinop(lhs: Literal, rhs: Literal, op: BinOp): Literal{
    switch(op) {
        case BinOp.Plus:
            if(lhs.tag !== "num" || rhs.tag !== "num"){
                return {tag: "none"};
            }  
            return {tag: "num", value: lhs.value + rhs.value};
        case BinOp.Minus:
            if(lhs.tag !== "num" || rhs.tag !== "num"){
                return {tag: "none"};
            }  
            return {tag: "num", value: lhs.value - rhs.value};
        case BinOp.Mul:
            if(lhs.tag !== "num" || rhs.tag !== "num"){
                return {tag: "none"};
            }  
            return {tag: "num", value: lhs.value * rhs.value};
        case BinOp.IDiv:
            if(lhs.tag !== "num" || rhs.tag !== "num"){
                return {tag: "none"};
            }  
            return {tag: "num", value: lhs.value / rhs.value};
        case BinOp.Mod:
            if(lhs.tag !== "num" || rhs.tag !== "num"){
                return {tag: "none"};
            }  
            return {tag: "num", value: lhs.value + rhs.value};
        case BinOp.Eq:
            if(lhs.tag === "none" || rhs.tag === "none"){
                return {tag: "bool", value: true};
            }  
            return {tag: "bool", value: lhs.value === rhs.value};
        case BinOp.Neq:
            if(lhs.tag === "none" || rhs.tag === "none"){
                return {tag: "bool", value: false};
            }  
            return {tag: "bool", value: lhs.value !== rhs.value};
        case BinOp.Lte:
            if(lhs.tag !== "num" || rhs.tag !== "num"){
                return {tag: "none"};
            }   
            return {tag: "bool", value: lhs.value <= rhs.value};
        case BinOp.Gte:
            if(lhs.tag !== "num" || rhs.tag !== "num"){
                return {tag: "none"};
            }    
            return {tag: "bool", value: lhs.value >= rhs.value};
        case BinOp.Lt:
            if(lhs.tag !== "num" || rhs.tag !== "num"){
                return {tag: "none"};
            }   
            return {tag: "bool", value: lhs.value < rhs.value};
        case BinOp.Gt:
            if(lhs.tag !== "num" || rhs.tag !== "num"){
                return {tag: "none"};
            }  
            return {tag: "bool", value: lhs.value > rhs.value};
        case BinOp.And:
            if(lhs.tag !== "bool" || rhs.tag !== "bool"){
                return {tag: "none"};
            }   
            return {tag: "bool", value: lhs.value && rhs.value};
        case BinOp.Or:
            if(lhs.tag !== "bool" || rhs.tag !== "bool"){
                return {tag: "none"};
            }  
            return {tag: "bool", value: lhs.value || rhs.value};
        default:
            return {tag: "none"};
      }
}

function foldUniop(expr: Literal, op: UniOp): Literal{
    switch (op){
        case UniOp.Neg:
            if(expr.tag != "num"){
                return {tag: "none"};
            }
            return {tag: "num", value: -1*expr.value};
        case UniOp.Not:
            if(expr.tag != "bool"){
                return {tag: "none"};
            }
            return {tag: "bool", value: !(expr.value)};
        default:
            return {tag: "none"};
    }
}

function optimizeIfStmt(stmts: Array<Stmt<[Type, SourceLocation]>>): Array<Stmt<[Type, SourceLocation]>> {
    var rstmts : Stmt<[Type, SourceLocation]>[] = [];
    for (var stmt of stmts) {
        switch(stmt.tag) {
            case "if":
                if (stmt.cond.tag === "literal" && stmt.cond.value.tag === "bool" && stmt.cond.value.value === true) {
                    if (stmt.thn === null) {
                        //console.log("b");
                        break;
                    }
                    //console.log("c");
                    //console.log(stmt.thn);
                    const optStmts = optimizeIfStmt(stmt.thn);
                    //console.log(optStmts);
                    for (var optStmt of optStmts) {
                        rstmts.push(optStmt)
                    }
                    
                } else if(stmt.cond.tag === "literal" && stmt.cond.value.tag === "bool" && stmt.cond.value.value !== true) {
                    if (stmt.els === null) {
                        //console.log("d");
                        break;
                    }
                    const optStmts = optimizeIfStmt(stmt.els);
                    //console.log("e");
                    for (var optStmt of optStmts) {
                        rstmts.push(optStmt)
                    }
                }
                break
            default:
                //console.log(stmt)
                rstmts.push(stmt);
        }
    }

    return rstmts;
}

import { Type, Program, SourceLocation, FunDef, Expr, Stmt, Literal, BinOp, UniOp} from './ast';

export function optimizeAst(program: Program<[Type, SourceLocation]>) : Program<[Type, SourceLocation]> {
    // TODO: Add more details
    const optFuns = program.funs.map(fun => optimizeFuncDef(fun));
    var optStmts = program.stmts.map(stmt => optimizeStmt(stmt));
    // optmize ifstmts
    var optStmtsWithIf = optimizeIfStmt(optStmts)
    //console.log(optStmtsWithIf)
    return {...program, funs: optFuns, stmts: optStmtsWithIf};
}

function optimizeFuncDef(funDef: FunDef<[Type, SourceLocation]>): FunDef<[Type, SourceLocation]> {
    // TODO: Add more details
    var optBody = funDef.body.map(stmt => optimizeStmt(stmt));
    return {...funDef, body: optBody};
}

function optimizeExpr(expr: Expr<[Type, SourceLocation]>): Expr<[Type, SourceLocation]> {
    // TODO: Add more details
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
            return {...expr, arg: optArg};
        case "builtin2":
            var optLeft = optimizeExpr(expr.left);
            var optRight = optimizeExpr(expr.right);
            return {...expr, left: optLeft, right: optRight};
        case "method-call":
            var optArgs = expr.arguments.map(e => optimizeExpr(e));
            return {...expr, arguments: optArgs};
        default:
            return {...expr};
    }
}

function optimizeStmt(stmt: Stmt<[Type, SourceLocation]>): Stmt<[Type, SourceLocation]> {
    // TODO: Add more details
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

    return rstmts
}
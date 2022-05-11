import { Type, Program, SourceLocation, FunDef, Expr, Stmt } from './ast';

export function optimizeAst(program: Program<[Type, SourceLocation]>) : Program<[Type, SourceLocation]> {
    // TODO: Add more details
    return {...program};
}

function optimizeFuncDef(funDef: FunDef<[Type, SourceLocation]>): FunDef<[Type, SourceLocation]> {
    // TODO: Add more details
    return {...funDef};
}

function optimizeExpr(expr: Expr<[Type, SourceLocation]>): Expr<[Type, SourceLocation]> {
    // TODO: Add more details
    return {...expr};
}

function optimizeStmt(stmt: Stmt<[Type, SourceLocation]>): Stmt<[Type, SourceLocation]> {
    // TODO: Add more details
    return {...stmt};
}
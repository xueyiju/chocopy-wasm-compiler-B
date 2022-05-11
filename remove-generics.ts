import { Program, Expr, Stmt, UniOp, BinOp, Parameter, Type, FunDef, VarInit, Class, Literal } from "./ast";
import { TYPE_VAR } from "./utils";

type GenericEnv = {
    generics: Map<string, Literal>,
    genericInstances: Map<string, Array<Type>>
}

export function monomorphize(ast: Program<null>): Program<null> {
    let genericNames : Array<string> = [];
    ast.inits.forEach(i => {
        if (i.type == TYPE_VAR) {
            genericNames.push(i.name);
        }
    });

    let genericClasses: Array<Class<null>> = [];

    return ast;
}

export function monomorphizeClass(generic_class: Class<null>, types: Array<Type>): Array<Class<null>> {
    return [generic_class];
}

export function monomorphizeFunDef(fun: FunDef<null>, generics: GenericEnv): FunDef<null> {
    //fun.inits.map(i => i.)
    return fun;
}
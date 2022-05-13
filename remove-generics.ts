import { type } from "os";
import { stringify } from "querystring";
import { Program, Expr, Stmt, UniOp, BinOp, Parameter, Type, FunDef, VarInit, Class, Literal } from "./ast";
import { CLASS, TYPE_VAR } from "./utils";

type GenericEnv = {
    typeVars: Map<string, Literal>,
    typeVarSpecializations: Map<string, Set<Type>>
}

type ClassEnv = {
    genericArgs: Map<string, Array<string>>
}

export function removeGenerics(ast: Program<null>): Program<null> {
    // Find the TypeVars for this program. Right now I'm just searching the program global variables but ideally in the future
    // this could be done in functions and methods as well.
    let bodyTypeVars = findTypeVarInits(ast.inits);
    let genericsEnv = {typeVars: bodyTypeVars, typeVarSpecializations: new Map<string, Set<Type>>()};

    // Find what TypeVars each class definition uses. For example:
    // class Box(Generic[T], object):
    // gives the classEnv entry Box => [T]
    const classEnv = programClassEnv(ast);

    // Now, we need to do two things: 
    // 1. For each TypeVar we need to find out which types it takes on (or how it is specialized)
    // 2. Change the Type of each generic object in the Ast from (for example) Box[int] to something like Box_number
    //  This is because we're creating a new Box_[type] class for each specialization.
    const newGlobalInits = ast.inits.map(i => {
        if(i.type.tag == "class" && i.type.genericArgs) {
            addSpecializationsForType(i.type, genericsEnv, classEnv);

            const specializationName = typeString(i.type);
            const newType = CLASS(specializationName);
            return {...i, type: newType};
        }
        return i;
    });

    const newFuns = ast.funs.map(f => specializeFun(f, genericsEnv, classEnv));

    // now just replace the generic classes with the specialized classes.
    // ex. Create all the Box_number, Box_bool, etc classes for each type in genericsEnv.typeVarSpecializations["T"]
    let genericClasses: Array<Class<null>> = [];

    return ast;
}

function programClassEnv(ast: Program<null>): ClassEnv {
    let env = {genericArgs: new Map<string, Array<string>>()};
    ast.classes.forEach(c => {
        const parentGenericArgs = c.parents.map(p => {
            if(p.tag == "class" && p.genericArgs) {
                if(p.name != "Generic") {
                    throw new Error("classes cannot inherit generic classes yet");
                }

                return p.genericArgs.filter(ga => ga.tag == "class").map(ga => {
                    if(ga.tag == "class") {
                        return ga.name;
                    } else {
                        return "";
                    }
                });
            }
            return [];
        }).flat()

        env.genericArgs.set(c.name, parentGenericArgs);
    });

    return env;
}

function makeClassWithTypes(generic_class: Class<null>, types: Array<Type>): Array<Class<null>> {
    return [generic_class];
}

function getOrDefault(genericTypes: Map<string, Set<Type>>, key: string): Set<Type> {
    if (!genericTypes.has(key)) {
        genericTypes.set(key, new Set<Type>());
    }
    return genericTypes.get(key);
}

// This creates the mangled string for generic object types.
// For example, it turns Box[int] to Box_number
function typeString(type: Type): string {
    let name = "";
    if(type.tag=="class") {
        name = type.name;

        if(type.genericArgs) {
            type.genericArgs.forEach(ga => {
                name += "_" + typeString(ga);
            });
        }

        return name;
    } else if(type.tag == "either") {
        return typeString(type.left) + "#" + typeString(type.right); 
    } else {
        return type.tag;
    }
}

function addSpecializationsForType(type: Type, genericsEnv: GenericEnv, classEnv: ClassEnv) {
    if(type.tag != "class") {
        return;
    }

    const classTypeVars = classEnv.genericArgs.get(type.name);
    type.genericArgs.forEach((ga, i) => {
        const classTypeVar = classTypeVars[i];
        let specializations = getOrDefault(genericsEnv.typeVarSpecializations, classTypeVar);
        specializations.add(ga);
    });
}

function specializeFun(fun: FunDef<null>, genericsEnv: GenericEnv, classEnv: ClassEnv): FunDef<null> {
    const newInits = fun.inits.map(i => {
        if(i.type.tag == "class" && i.type.genericArgs) {
            addSpecializationsForType(i.type, genericsEnv, classEnv);
            
            const specializationName = typeString(i.type);
            const newType = CLASS(specializationName);
            return {...i, type: newType};
        }
        return i;
    });

    const newParams = fun.parameters.map(p => {
        if(p.type.tag == "class" && p.type.genericArgs) {
            addSpecializationsForType(p.type, genericsEnv, classEnv);

            const specializationName = typeString(p.type);
            const newType = CLASS(specializationName);
            return {...p, type: newType};
        }
        return p;
    });

    let newRet = fun.ret;
    if(fun.ret.tag == "class" && fun.ret.genericArgs) {
        addSpecializationsForType(fun.ret, genericsEnv, classEnv);

        const specializationName = typeString(fun.ret);
        newRet = CLASS(specializationName);
    }

    return {...fun, parameters: newParams, ret: newRet, inits: newInits};
}

function findTypeVarInits(inits: Array<VarInit<null>>): Map<string, Literal> {
    let genericNames = new Map<string, Literal>();
    inits.forEach(i => {
        if (i.type == TYPE_VAR) {
            genericNames.set(i.name, i.value);
        }
    });

    return genericNames;
}
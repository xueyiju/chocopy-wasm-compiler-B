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
    }).filter(i => i.type.tag != "type-var");

    const newStmts = ast.stmts.map(s => {
        if(s.tag == "assign" && s.value.tag == "call" && classEnv.genericArgs.has(s.value.name)) {
            let newName = s.value.name;
            s.value.genericArgs.forEach(ga => {
                newName += '_' + typeString(ga);
            })

            const newCall = {...s.value, name: newName};
            return {...s, value: newCall};
        }
        return s;
    });

    const newFuns = ast.funs.map(f => removeGenericsFromFun(f, genericsEnv, classEnv));

    // now just replace the generic classes with the specialized classes.
    // ex. Create all the Box_number, Box_bool, etc classes for each type in genericsEnv.typeVarSpecializations["T"]
    const specializedClasses = ast.classes.map(c => specializeClass(c, genericsEnv, classEnv)).flat();
    const newClasses = specializedClasses.map(c => removeGenericsFromClass(c, genericsEnv, classEnv));

    return {...ast, inits: newGlobalInits, funs: newFuns, classes: newClasses, stmts: newStmts};
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

function removeGenericsFromFun(fun: FunDef<null>, genericsEnv: GenericEnv, classEnv: ClassEnv): FunDef<null> {
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

function removeGenericsFromType(type: Type, variant: Map<string, Type>): Type {
    if(type.tag == "class" && type.genericArgs){
        const newGenericArgs = type.genericArgs.map(argType => {
            return removeGenericsFromType(argType, variant);
        });

        return {...type, genericArgs: newGenericArgs};
    } else if (type.tag == "class" && variant.has(type.name)) {
        return variant.get(type.name);
    }
    return type;
}

function specializeClass(classDef: Class<null>, genericsEnv: GenericEnv, classEnv: ClassEnv): Array<Class<null>> {
    const genericParent = classDef.parents.find(p => p.tag == "class" && p.name == "Generic" && p.genericArgs);
    if(!genericParent) {
        return [classDef];
    }

    if(genericParent.tag != "class") {
        return [classDef];
    }

    const typeVarNames = genericParent.genericArgs.map(ga => {
        if(ga.tag == "class") {
            return ga.name;
        } else {
            throw new Error("Expected TypeVar in Generic parent args");
        }
    });

    let allVariants = [new Map<string, Type>()];
    typeVarNames.forEach(name => {
        let newAllVariants: Array<Map<string, Type>> = [];
        let specializationsForTypeVar = genericsEnv.typeVarSpecializations.get(name)
        if(!specializationsForTypeVar) {
            return;
        }

        specializationsForTypeVar.forEach(type => {
            newAllVariants = newAllVariants.concat(allVariants.map(v => {
                let newV = new Map<string, Type>(v);
                newV.set(name, type);
                return newV;
            }));
        });

        allVariants = newAllVariants;
    });

    const newClasses = allVariants.map(variant => {
        let newName = classDef.name;
        variant.forEach(t => {newName += "_" + typeString(t);});

        // TODO: fields
        const newMethods = classDef.methods.map(method => {
            const newInits = method.inits.map(init => {
                const newType = removeGenericsFromType(init.type, variant);
                return {...init, type: newType};
            });

            const newParams = method.parameters.map(param => {
                const newType = removeGenericsFromType(param.type, variant);
                return {...param, type: newType};
            })

            const newRet = removeGenericsFromType(method.ret, variant);

            return {...method, inits: newInits, parameters: newParams, ret: newRet};
        });

        // TODO: get rid of Generic parent objects

        return {...classDef, name: newName, methods: newMethods};
    });


    return newClasses;
}

function removeGenericsFromClass(classDef: Class<null>, genericsEnv: GenericEnv, classEnv: ClassEnv): Class<null> {
    // Second, rename all specialized generics like with functions, ex. Box[int] to Box_int.
    
    const newFields = classDef.fields.map(f => {
        addSpecializationsForType(f.type, genericsEnv, classEnv);

        const specializationName = typeString(f.type);
        const newType = CLASS(specializationName);
        return {...f, type: newType};
    });

    const newMethods = classDef.methods.map(m => removeGenericsFromFun(m, genericsEnv, classEnv));

    return {...classDef, fields: newFields, methods: newMethods};
}
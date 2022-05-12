import { parse } from "./parser";
import { BasicREPL } from "./repl";
import { importObject, addLibs  } from "./tests/import-object.test";


// entry point for debugging
async function debug() {
   var source = `a,b = 1,2`
// class C(object):
//   def f(self: C) -> int:
//     if True:
//       return 0
//     else:
//       return`
  const ast = parse(source);
  
  // const repl = new BasicREPL(await addLibs());
  // const result = repl.run(source).then(result => {
  //   console.log(result);    
  // })  
}

//debug();

var source = `
b = (1,2)\n
a,_ = b`
// class C(object):
//   def f(self: C) -> int:
//     if True:
//       return 0
//     else:
//       return`
const ast = parse(source);
console.log(ast);


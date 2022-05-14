import { parse } from "./parser";
import { BasicREPL } from "./repl";
import { importObject, addLibs  } from "./tests/import-object.test";


// entry point for debugging
async function debug() {
  var source = `
  set_1 : set[int] = None
  a : bool = False
  set_1 = {1,2}
  set_1.add(3)
  a = 4 in set_1
  print(a)`

  const ast = parse(source);
  
  const repl = new BasicREPL(await addLibs());
  //const result = repl.tc(source);
  //console.log(result);
  const result = repl.run(source).then(result => {
    console.log(result);    
  })  
}

debug();


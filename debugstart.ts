import { parse } from "./parser";
import { BasicREPL } from "./repl";
import { importObject, addLibs  } from "./tests/import-object.test";


// entry point for debugging
async function debug() {
  var source = `
x: int = 2
y: int = 1
x = max(2 * 4, x + (1 + 2))
y = abs(1 - 2 * 4)
print(x + y)
`
  const ast = parse(source);
  
  const repl = new BasicREPL(await addLibs());
  const result = repl.run(source, true, true).then(result => {
    console.log(result);    
  })  
}

debug();


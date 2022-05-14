import { parse } from "./parser";
import { BasicREPL } from "./repl";
import { importObject, addLibs  } from "./tests/import-object.test";
import {parser} from "lezer-python";
import { TreeCursor} from "lezer-tree";
import { stringifyTree } from "./treeprinter";


// entry point for debugging
async function debug() {
  var source = `
  i: int = 0
  for i in range(5):
      print(i * 100)
      continue
      print(i)`

  const t = parser.parse(source);
  const str = stringifyTree(t.cursor(), source, 0);
  console.log(str)
  const ast = parse(source);
  
  const repl = new BasicREPL(await addLibs());
  const result = repl.run(source).then(result => {
    console.log(result);    
  })  
}

debug();


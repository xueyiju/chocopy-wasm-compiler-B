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
  a = set_1.contains(3)`

  var source1 = `
  class C(object):
    def f(self: C) -> int:
      if True:
        return 0
      else:
        return 100
  d: int = 10
  c: C = None

  print(d)`
  console.log(source.length)
  const ast = parse(source);
  
  const repl = new BasicREPL(await addLibs());
  const result = repl.tc(source);
  console.log(result);
  // const result = repl.run(source).then(result => {
  //   console.log(result);    
  // })  
}

debug();


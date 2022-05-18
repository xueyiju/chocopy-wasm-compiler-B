import { run, Config } from "./runner";
// import { GlobalEnv } from "./compiler";
import { GlobalEnv } from "./compiler";
import { tc, defaultTypeEnv, GlobalTypeEnv } from "./type-check";
import { Value, Type } from "./ast";
import { parse } from "./parser";

interface REPL {
  run(source : string) : Promise<any>;
}

export const builtinClasses : string = `
class Range(object):
  cur : int = 0
  min : int = 0
  max : int = 0
  stp : int = 0
  def new(self : Range, min : int, max : int, stp : int)->Range:
    self.min = min
    self.cur = min
    self.max = max
    self.stp = stp
    return self
  def next(self : Range)->int:
    c : int = 0
    c = self.cur
    self.cur = self.cur + self.stp
    return c
  def hasnext(self : Range)->bool:
    return self.cur < self.max

class generator(object):
  size : int = 0
  addr : int = 0
  def new(self : generator, size : int, addr : int)->generator:
    self.size = size
    self.addr = addr
    return self
  def next(self : generator)->int:
    c : int = 0
    c = self.addr
    self.size = self.size - 1
    self.addr = self.addr + 4
    return c
  def hasnext(self : generator)->bool:
    return self.size < 1

`

export class BasicREPL {
  currentEnv: GlobalEnv
  currentTypeEnv: GlobalTypeEnv
  functions: string
  importObject: any
  memory: any
  constructor(importObject : any) {
    this.importObject = importObject;
    if(!importObject.js) {
      const memory = new WebAssembly.Memory({initial:2000, maximum:2000});
      const view = new Int32Array(memory.buffer);
      view[0] = 4;
      this.importObject.js = { memory: memory };
    }
    this.currentEnv = {
      globals: new Map(),
      classes: new Map(),
      locals: new Set(),
      labels: [],
      offset: 1
    };
    this.currentTypeEnv = defaultTypeEnv;
    this.functions = "";
  }
  async run(source : string) : Promise<Value> {

    // check if built-in classes are parsed
    var sourceCode = source;
    if (!this.currentEnv.classes.has("Range") || !this.currentEnv.classes.has("generator")) {
      sourceCode = builtinClasses + source;
    }

    const config : Config = {importObject: this.importObject, env: this.currentEnv, typeEnv: this.currentTypeEnv, functions: this.functions};
    const [result, newEnv, newTypeEnv, newFunctions, instance] = await run(sourceCode, config);
    this.currentEnv = newEnv;
    this.currentTypeEnv = newTypeEnv;
    this.functions += newFunctions;
    const currentGlobals = this.importObject.env || {};
    console.log(instance);
    Object.keys(instance.instance.exports).forEach(k => {
      console.log("Consider key ", k);
      const maybeGlobal = instance.instance.exports[k];
      if(maybeGlobal instanceof WebAssembly.Global) {
        currentGlobals[k] = maybeGlobal;
      }
    });
    this.importObject.env = currentGlobals;
    return result;
  }
  tc(source: string): Type {
    const config: Config = { importObject: this.importObject, env: this.currentEnv, typeEnv: this.currentTypeEnv, functions: this.functions };
    const parsed = parse(source);
    const [result, _] = tc(this.currentTypeEnv, parsed);
    return result.a[0];
  }
}
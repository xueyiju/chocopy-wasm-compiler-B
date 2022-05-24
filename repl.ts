import { run, Config } from "./runner";
// import { GlobalEnv } from "./compiler";
import { GlobalEnv } from "./compiler";
import { tc, defaultTypeEnv, GlobalTypeEnv } from "./type-check";
import { Value, Type } from "./ast";
import { parse } from "./parser";
import { removeGenerics } from "./remove-generics";

export type ObjectField = 
|{tag:"num", fieldName: string, value: Value}
|{tag:"bool", fieldName: string, value: Value}
|{tag:"none", fieldName: string, value: Value}
|{tag:"object", fieldName: string, value: Value, objectTrackList: Array<ObjectField>}

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
    if stp == 0:
      return None
    if min <= max and stp < 0:
      stp = 1
    if min >= max and stp > 0:
      stp = -1
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
    return self.cur < self.max if self.stp >=0 else self.cur > self.max

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
    // console.log(instance);
    Object.keys(instance.instance.exports).forEach(k => {
      // console.log("Consider key ", k);
      const maybeGlobal = instance.instance.exports[k];
      if(maybeGlobal instanceof WebAssembly.Global) {
        currentGlobals[k] = maybeGlobal;
      }
    });
    this.importObject.env = currentGlobals; //seems useless for now
    return result;
  }

  trackObject(result: Value, heapView: Int32Array): Array<ObjectField>{
    let list = new Array<ObjectField>();
    if(result.tag === "bool" || result.tag === "none" || result.tag === "num" || result.tag === "TypeVar"){
      return list;
    }

    // list.push({field: "address", value: {tag:"num", value: result.address}}); //what if a real field named address?
    //get the field of object
    const fields = this.currentTypeEnv.classes.get(result.name)[0];
    let index = result.address / 4;
    fields.forEach((value: Type, key: string) => {
      switch(value.tag){
        case "number":
          list.push({tag:"num", fieldName: key, value: {tag: "num", value: heapView.at(index)}});
          break;
        case "bool":
          list.push({tag:"bool", fieldName: key, value: {tag: "bool", value: Boolean(heapView.at(index))}});
          break;
        case "none":
          list.push({tag:"none", fieldName: key, value: {tag: "none", value: heapView.at(index)}});
          break;
        case "class":
          const objectResult : Value = {tag: "object", name: value.name, address: heapView.at(index)};
          const fieldList = this.trackObject(objectResult, heapView);
          list.push({tag: "object", fieldName: key, value: objectResult, objectTrackList: fieldList});
          break;
      }
      index += 1
    });
  
    return list;
  }

  // need information from menmory
  trackHeap(): Int32Array{
    const heapView = new Int32Array(this.importObject.js.memory.buffer);
    return heapView;
  }

  tc(source: string): Type {
    const config: Config = { importObject: this.importObject, env: this.currentEnv, typeEnv: this.currentTypeEnv, functions: this.functions };
    const parsed = parse(source);
    const simplified = removeGenerics(parsed);
    const [result, _] = tc(this.currentTypeEnv, simplified);
    return result.a[0];
  }
}
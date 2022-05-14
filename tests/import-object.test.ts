import { readFileSync } from "fs";

enum Type { Num, Bool, None }

function stringify(typ: Type, arg: any): string {
  switch (typ) {
    case Type.Num:
      return (arg as number).toString();
    case Type.Bool:
      return (arg as boolean) ? "True" : "False";
    case Type.None:
      return "None";
  }
}

function print(typ: Type, arg: any): any {
  importObject.output += stringify(typ, arg);
  importObject.output += "\n";
  return arg;
}

function assert_not_none(arg: any) : any {
  if (arg === 0)
    throw new Error("RUNTIME ERROR: cannot perform operation on none");
  return arg;
}

function check_range_error(arg: any) : any {
  if (arg === 0)
    throw new Error("RUNTIME ERROR: range() arg 3 must not be zero");
  return arg;
}

function check_range_index(start: any, stop:any, step:any, val:any) : any {
  if(start * step >= stop * step)
    throw new Error(`RUNTIME ERROR: ${val} is not in range`)

  stop -= Math.sign(step)
  const len = Math.abs(stop - start)
  if(len < Math.abs(val - start) || len < Math.abs(val - stop )) 
    throw new Error(`RUNTIME ERROR: ${val} is not in range`)

  if(Math.abs(val - start) % step != 0) {
    throw new Error(`RUNTIME ERROR: ${val} is not in range`)
  }
  return val
}

export async function addLibs() {
  const bytes = readFileSync("build/memory.wasm");
  const memory = new WebAssembly.Memory({initial:10, maximum:100});
  const memoryModule = await WebAssembly.instantiate(bytes, { js: { mem: memory } })
  const rangeModule = await WebAssembly.instantiate(readFileSync("build/range.wasm"), {js: { mem: memory},  libmemory: memoryModule.instance.exports ,
  imports: {
    check_range_error: (arg: any) => check_range_error(arg) ,
    check_range_index: (arg1: any, arg2:any, arg3:any, arg4:any) => check_range_index(arg1, arg2, arg3, arg4)}});
  importObject.libmemory = memoryModule.instance.exports;
  importObject.rangelib = rangeModule.instance.exports;
  importObject.memory_values = memory;
  importObject.js = {memory};
  return importObject;
}

export const importObject : any = {
  imports: {
    // we typically define print to mean logging to the console. To make testing
    // the compiler easier, we define print so it logs to a string object.
    //  We can then examine output to see what would have been printed in the
    //  console.
    assert_not_none: (arg: any) => assert_not_none(arg),
    check_range_error: (arg: any) => check_range_error(arg),
    check_range_index: (arg1: any, arg2:any, arg3:any, arg4:any) => check_range_index(arg1, arg2, arg3, arg4),
    print: (arg: any) => print(Type.Num, arg),
    print_num: (arg: number) => print(Type.Num, arg),
    print_bool: (arg: number) => print(Type.Bool, arg),
    print_none: (arg: number) => print(Type.None, arg),
    abs: Math.abs,
    min: Math.min,
    max: Math.max,
    pow: Math.pow,
  },
  output: "",
};

import { RunTimeError } from "./error_reporting";
import { sourceCode } from "./runner";

var runtimeStack: Array<number> = [];

export function assert_not_none(arg: any, line: number, col: number) : any {
    if (arg === 0)
      throw new RunTimeError("cannot perform operation on none in line " + line.toString() + " at column " + col.toString() + "\n" + splitString()[line-1].trim());
    return arg;
  }

export function division_by_zero(arg: number, line: number, col: number) : any {
    if (arg === 0)
      throw new RunTimeError("division by zero in line " + line.toString() + " at column " + col.toString() + "\n" + splitString()[line-1].trim());
    return arg;
  }

export function stack_push(line: number) {
    runtimeStack.push(line);
} 

export function stack_clear() {
  runtimeStack = [];
} 

export function stackTrace() : string {
  var srcArray = splitString();
  var res = "Traceback (most recent call last): \n";
  runtimeStack.forEach(element => {
    res = res + "in line " + element.toString() + ": " + srcArray[element-1].trim() + " \n";
  });
  return res;
}

function splitString() : Array<string> {
  return sourceCode.split("\n");
}
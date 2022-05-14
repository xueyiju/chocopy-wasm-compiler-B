export function assert_not_none(arg: any, line: number, col: number) : any {
    if (arg === 0)
      throw new Error("RUNTIME ERROR: cannot perform operation on none in line " + line.toString() + " at column " + col.toString());
    return arg;
  }

export function division_by_zero(arg: number, line: number, col: number) : any {
    if (arg === 0)
      throw new Error("RUNTIME ERROR: division by zero in line " + line.toString() + " at column " + col.toString());
    return arg;
  }
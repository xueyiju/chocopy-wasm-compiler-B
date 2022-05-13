import { assertPrint, assertFail, assertTCFail, assertTC, assertOptimize } from "./asserts.test";
import { NUM, BOOL, NONE, CLASS } from "./helpers.test"

describe("Optimization tests", () => {
  // 1
  assertOptimize("constant folding (add in print)", `print(100 + 20 + 3)`);
  // 2
  assertOptimize("constant folding (add)", `
  x:int = 100
  x = 1 + 2 + 3 + 4
  print(x)
  `);
  // 3
  assertOptimize("constant folding (multiply)", `
  x:int = 100
  x = 1 * 2 * 3 * 4
  print(x)
  `);
  // 4
  assertOptimize("constant folding (boolean)", `
  x:bool = True
  x = not True
  print(x)
  `);
  // 5
  assertOptimize("constant folding (builtin2-max)",
  `
  x:int = 1
  x = max(3,4)
  print(x)
  `);
  // 6
  assertOptimize("constant folding (builtin2-min)",
  `
  x:int = 1
  x = min(3,4)
  print(x)
  `),
  // 7
  assertOptimize("constant folding (builtin2-pow)",
  `
  x:int = 1
  x = pow(3,2)
  print(x)
  `),
  // 8
  assertOptimize("constant folding (mod)",
  `
  x:int = 1
  x = 8 % 3
  print(x)
  `)
  // 9
  assertOptimize("constant folding (greater than)",
  `
  x:bool = True
  x = 0 > 1
  print(x)
  `),
  // 10
  assertOptimize("constant folding (Not equal)",
  `
  x:bool = True
  x = 1 != 1
  print(x)
  `),
  // 11
  assertOptimize("Dead code elimination (statements after return)",
  `
  def f() -> int:
      return 100
      print(100)
  f()
  `),
  assertOptimize("Dead code elimination (if branch)",
  `
  def f() -> int:
      return 100
      print(100)
  f()
  `),
  assertOptimize("Dead code elimination (while loop)",
  `
  a:int = 0
  while False:
      a = a + 100000
  while a < 5:
      print(a)
      a = a + 1
  `)
});

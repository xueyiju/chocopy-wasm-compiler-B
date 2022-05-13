import { assertPrint, assertFail, assertTCFail, assertTC, assertOptimize } from "./asserts.test";
import { NUM, BOOL, NONE, CLASS } from "./helpers.test"

describe("optimize tests", () => {
  // 1
  assertOptimize("constant-fold", `print(100 + 20 + 3)`);
  // 2
});

import { assertPrint, assertFail, assertTCFail, assertTC } from "./asserts.test";
import { NUM, BOOL, NONE, CLASS } from "./helpers.test"

describe("List tests", () => {
    // 1
    assertTC("create-list", `
    a: [int] = None
    a = [1, 2, 3]`, NONE);

    // 2
    // assertTC("create-list-empty", `
    // a: [int] = None
    // a = []`, NONE);

    // 3
    assertPrint("access-element", `
    a: [int] = None
    a = [2, 4, 6, 8]
    print(a[0])`, [`2`]);

    // 4
    // assertFail("out-of-bounds", `
    // a: [int] = None
    // a = [2, 4, 6, 8]
    // a[4]`);

    // 5    
    // assertFail("negative-index", `
    // a: [int] = None
    // a = [1, 2, 3]
    // a[-1]`);

    // 6
    assertPrint("expr-elements", `
    a: [int] = None
    b: int = 100
    a = [1 + 2, b, (-50)]
    print(a[0])
    print(a[1])
    print(a[2])`, [`3`, `100`, `-50`]);

    // 7
    assertPrint("store-element", `
    a: [int] = None
    a = [1, 2, 3]
    a[0] = 5
    print(a[0])`, [`5`]);

    // 8
    assertPrint("replace-list-reference", `
    a: [int] = None
    a = [1, 2, 3]
    a = [4, 5, 6, 7, 8, 9]
    print(a[4])`, [`8`]);

    // 9
    assertTCFail("assign-wrong-type", `
    a: [int] = None
    a = [1, 2, 3]
    a[2] = True`);

    // 10
    assertTC("create-bool-list", `
    a: [bool] = None
    a = [True]`, NONE);
});
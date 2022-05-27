import { assertPrint, assertTCFail, assertTC, assertFail } from "./asserts.test";
import { NUM, BOOL, NONE, CLASS } from "./helpers.test"

describe("set-functionalities", () => {
    
    assertPrint("initialize-set", `
    set_1 : set[int] = None
    set_1 = {1,2}
    print(set_1.length())`, [`2`]);

    assertPrint("set-add", `
    set_1 : set[int] = None
    set_1 = {1,2}
    set_1.add(3)
    print(set_1.length())`, [`3`]);

    assertPrint("set-add-in", `
    set_1 : set[int] = None
    set_1 = {1,2}
    set_1.add(3)
    print(3 in set_1)`, [`True`]);

    assertPrint("set-add-not-in", `
    set_1 : set[int] = None
    set_1 = {1,2}
    set_1.add(3)
    print(4 in set_1)`, [`False`]);

    assertPrint("set-add-duplicate", `
    set_1 : set[int] = None
    set_1 = {1,2}
    set_1.add(1)
    print(set_1.length())`, [`2`]);   
    
    assertPrint("set-remove", `
    set_1 : set[int] = None
    set_1 = {1,2}
    set_1.remove(1)
    print(set_1.length())`, [`1`]);   
    
    assertPrint("set-remove-in", `
    set_1 : set[int] = None
    set_1 = {1,2}
    set_1.remove(1)
    print(1 in set_1)`, [`False`]);  

    assertPrint("set-print", `
    set_1: set[int] = None
    set_1 = {1, 2}
    print(set_1)`, ["1", "2"])

    assertPrint("set-constructor", `
    set_1: set[int] = None
    set_1 = set({1, 2})
    print(set_1)`, ["1", "2"]) 
});

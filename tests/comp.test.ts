import { assertPrint } from "./asserts.test";

describe("Comprehension Tests", () => {

assertPrint("ternary assignTrue test", `
a:int = 3
a = a + 3 if a > 0 else a - 3
print(a)`, ['6']);

assertPrint("ternary assignFalse test", `
a:int = 3
a = a + 3 if a < 0 else a - 3
print(a)`, ['0']);

assertPrint("ternary comprehensive test", `
a:int = 0
print(min(a - 1, 3) if a > 3 else max(a + 3, 4))`, ['4']);

assertPrint("range basic test 1", `
r:Range = None
r = Range().new(0, 5, 1)
print(r.next())`, ['0']);

assertPrint("range basic test 2", `
r:Range = None
r = Range().new(0, 5, 1)
r.next()
print(r.next())`, ['1']);

assertPrint("range basic test 3", `
r:Range = None
r = Range().new(0, 5, 1)
r.next()
r.next()
r.next()
r.next()
r.next()
print(r.hasnext())`, ['False']);

assertPrint("range positive step test", `
r:Range = None
r = Range().new(0, 5, 2)
r.next()
print(r.next())`, ['2']);

assertPrint("range negative step test", `
r:Range = None
r = Range().new(5, 0, -2)
r.next()
print(r.next())`, ['3']);

assertPrint("comprehension basic test", `
(print(num) for num in Range().new(0, 5, 1))`, ['0','1','2','3','4']);

assertPrint("comprehension if condition test", `
(print(num) for num in Range().new(0, 5, 1) if num % 2 == 0)`, ['0','2','4']);

assertPrint("comprehension lhs expr test", `
(print(min(num, 3)) for num in Range().new(0, 6, 1))`, ['0','1','2','3','3','3']);

assertPrint("comprehension lhs ternary test", `
(print(num) if num % 4 == 0 else print(num + 100) for num in Range().new(0, 10, 1))`,
['0','101','102','103','4','105','106','107','8','109']);

assertPrint("comprehension comprehensive test", `
(print(num if num % 4 == 0 else num + 100) for num in Range().new(0, 20, 1) if num % 2 == 0)`,
['0','102','4','106','8','110','12','114','16','118']);

});
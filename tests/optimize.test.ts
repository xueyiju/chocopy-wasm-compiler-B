import { assertPrint, assertFail, assertTCFail, assertTC, assertOptimize, assertPass } from "./asserts.test";
import { NUM, BOOL, NONE, CLASS } from "./helpers.test"

describe("Optimization tests", () => {
  // 1
  assertOptimize("Constant Folding (add in print)", `print(100 + 20 + 3)`);
  // 2
  assertOptimize("Constant Folding (add)", `
x:int = 100
x = 1 + 2 + 3 + 4
print(x)
  `);
  // 3
  assertOptimize("Constant Folding (multiply)", `
x:int = 100
x = 1 * 2 * 3 * 4
print(x)
  `);
  // 4
  assertOptimize("Constant Folding (boolean)", `
x:bool = True
x = not True
print(x)
  `);
  // 5
  assertOptimize("Constant Folding (builtin2-max)",
  `
x:int = 1
x = max(3,4)
print(x)
  `);
  // 6
  assertOptimize("Constant Folding (builtin2-min)",
  `
x:int = 1
x = min(3,4)
print(x)
  `),
  // 7
  assertOptimize("Constant Folding (builtin2-pow)",
  `
x:int = 1
x = pow(3,2)
print(x)
  `),
  // 8
  assertOptimize("Constant Folding (mod)",
  `
x:int = 1
x = 8 % 3
print(x)
  `)
  // 9
  assertOptimize("Constant Folding (greater than)",
  `
x:bool = True
x = 0 > 1
print(x)
  `),
  // 10
  assertOptimize("Constant Folding (Not equal)",
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
  // 12
  assertOptimize("Dead code elimination (if branch)",
`
print(100)
if True:
    print(1+2+3+4)
else:
    print(5*6*7)
  
if False:
    print(10000)
else:
    print(1*2*3*4)
  `)
  // 13
  assertOptimize("Dead code elimination (while loop)",
  `
a:int = 0
while False:
    a = a + 100000
while a < 5:
    print(a)
    a = a + 1
`),
  // 14
  assertPass("Dead code elimination (pass statement)",
  `
a:int = 0
if a > 0:
    pass
else:
    pass
    print(100)
    pass
pass
print(1+2+3+4)
pass
while False:
    pass
pass
print(1*2*3*4)
`),
  // 15
  assertPass("Dead code elimination (pass statement with one line)",
  `
def f():
    pass

pass
f()
pass
`),
  // 16
  assertOptimize("Dead code elimination (Nested while and if)",
  `
a:int = 0
if a <= 0:
    if True:
        a = a + 1
    else:
        a = a - 1
else:
    pass

while a > 0:
    while False:
        print(a)
    a = a - 1
    pass
pass
print(a)
`),
  // 17
  assertOptimize("Optimization (Class definition)",
  `
class Rat:
    def __init__(self:Rat):
        pass
    def f(self:Rat):
        pass
        print(100)
        while False:
            print(123)
    def b(self:Rat):
        if True:
            print(1+2+3+4)
r:Rat = None
r = Rat()
r.f()
r.b()
`),
  // 18
  assertOptimize("Optimization (Anonymous Class)",
  `
class Rat:
    def __init__(self:Rat):
        pass
    def f(self:Rat):
        pass
        print(100)
        while False:
            print(123)
    def b(self:Rat):
        if True:
            print(1+2+3+4)
Rat().f()
Rat().b()
`),
  // 19
  assertOptimize("Optimization (UniOp)",
  `
a:int = 0
a = -2
if not True:
    print(111)
else:
    print(a)

if not False:
    print((1+2+3+4)*1*2*3)
`),
  // 20
  assertOptimize("Optimization (Return in if branch)",
  `
class C(object):
    def f(self: C) -> int:
        if True:
            return 0
        else:
            return 1
C().f()
`),
  // 21
  assertOptimize("Optimization (Return in while loop)",
  `
def f() -> int:
    a:int = 100
    while a > 0:
        return a
        print(a)
        pass
    pass
    return 100
`),
  // 22
  assertOptimize("Optimization (Linkedlist)",
  `
class LinkedList(object):
    value : int = 0
    next: LinkedList = None
    def new(self: LinkedList, value: int, next: LinkedList) -> LinkedList:
        self.value = value
        self.next = next
        return self
        print(1+2+3)

    def sum(self: LinkedList) -> int:
        if self.next is None:
            return self.value
            print(1+2+3)
        else:
            return self.value + self.next.sum()
            print(1+2+3)

    def f(self: LinkedList):
        pass
        print(100)

l: LinkedList = None
l = LinkedList().new(1, LinkedList().new(2, LinkedList().new(3, None)))
print(l.sum())
print(l.next.sum())
l.f()
while False:
    l = LinkedList()
`),
  // 23
  assertOptimize("Optimization (And/Or ops for boolean literals)",
  `
x:bool = True
y:bool = True
z:bool = True
a:bool = False

x = True and True and False
y = False or False or True or False
z = (True or False) and False or (True or False) and (False or False)
a = True or (False and (True or (False and True)))
`),
  // 24
  // Calculate the variance of [2, 3, 4]
  assertOptimize("Optimization (Calculate variance)",
  `
variance:int = 0
variance = pow(((2+3+4)//3 - 2), 2) + pow(((2+3+4)//3 - 2), 3) + pow(((2+3+4)//3 - 2), 4)
print(variance)
`),
  // 25
  assertOptimize("Optimization (Number comparison)",
  `
a:bool = False
b:bool = False
c:bool = False
a = a or (1 > 0)
b = True and (100 > 200)
c = c and True and (100!=200)
print(a)
print(b)
`),
  // 26
  assertOptimize("Optimization (Modulus)",
  `
b:int = 0
b = (100 % 3) % 10 % 2 % 1
print(b)
`);
});

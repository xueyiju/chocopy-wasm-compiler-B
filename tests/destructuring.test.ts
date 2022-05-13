import { assert, assertPrint, assertFail, assertTCFail, assertTC, assertParserFail } from "./asserts.test";
import { NUM, BOOL, NONE, CLASS } from "./helpers.test"


describe("Destructuring Tests", () => {

assertTCFail("length mismatch left and right hand side of assignment expression", `
x : bool = True
y : int = 12
x,y = 1,2,3`)

assertTCFail("length mismatch left and right hand side of assignment expression", `
x : bool = True
y : int = 12
x,y,z = 1,2`);

assertTCFail("length mismatch left and right hand side of assignment expression", `
x : bool = True
y : int = 12
x,y = 1+2`);

assertTCFail("length mismatch left and right hand side of assignment expression", `
x : bool = True
y : int = 12
x,y,z = 1,2+3`);

assertTCFail("length mismatch left and right hand side of assignment expression", `
x : bool = True
y : int = 12
x,y,_ = 1,2`);

assertTCFail("length mismatch left and right hand side of assignment expression", `
x : bool = True
y : int = 12
x,y,_ = 1,2,3,4`);

assertTCFail("length mismatch left and right hand side of assignment expression", `
x : bool = True
y : int = 12
x,y,_ = 1,2+3`);

assertTCFail("length mismatch left and right hand side of assignment expression", `
x : bool = True
y : int = 12
x,y,_ = 1,2,3+4,5`);

assertTCFail("length mismatch left and right hand side of assignment expression", `
x : bool = True
y : int = 12
x,y,_,*c = 2,3`);

assertTCFail("length mismatch left and right hand side of assignment expression", `
x : bool = True
y : int = 12
x,y,*c = 2`);

assertTCFail("length mismatch left and right hand side of assignment expression", `
x : bool = True
y : int = 12
x,y,_,*c = 5+6`);

assertParserFail("Multiple starred", `
a : int = 0
b : int = 0
c : int = 0
d : int = 0
a, *b,c,*d = 3,4,5,6`)

assertParserFail("Unsupported Expr", `
a : int = 0
b : int = 0
a, b + 2 = 5, 6`)

assertPrint("basic-destr", `
x : int = 0
y : int  = 0
x, y = 5, 6
print(x)
print(y)` , ["5", "6"]);

assertPrint("destr-underscore", `
x : int = 0
y : int  = 0
x,_, y = 5, 6, 7
print(x)
print(y)` , ["5", "7"]);

assertPrint("destr-multiple-types", `
x : int = 0
y : bool  = False
x,_, y = 5, False, True
print(x)
print(y)` , ["5", "True"]);

assertPrint("destr-lookup", `
class C(object):
 x : int = 123

x : int = 0
y : bool = False
c : C = None
c = C()

x,c.x, y = 5, 10, True
print(x)
print(c.x)
print(y)` , ["5", "10", "True"]);

assertPrint("destr-expressions", `
class C(object):
 x : int = 123

x : int = 0
y : bool = False
c : C = None
c = C()

x,c.x, y = c.x, 10 + 20, True or False
print(x)
print(c.x)
print(y)` , ["123", "30", "True"]);

assertPrint("destr-starred", `
x : int = 0
y : int = 0
z : int = 0

x, *y, z = 5, 10, 20
print(x)
print(y)
print(z)` , ["5", "10", "20"]);

});

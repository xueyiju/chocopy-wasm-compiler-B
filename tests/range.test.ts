import { expect } from "chai";
import { parse } from "../parser";
import { assert, assertPrint, assertTC, assertFail } from "./asserts.test";
import { NUM, BOOL, NONE, CLASS, typeCheck } from "./helpers.test";
import { TypeCheckError } from "../type-check";
import { PyInt, PyBool, PyNone, PyObj } from '../utils';

describe("Basic range functionalities", () => {

    assertPrint('range: one parameter', `
    i: int = 0
    for i in range(5):
        print(i)
        `, ["0","1","2","3","4"]);
    
    assertPrint('range: two parameters', `
    i: int = 0
    for i in range(5,10):
        print(i)
        `, ["5","6","7","8","9"]);
    
    assertPrint('range: three parameters', `
    i: int = 0
    for i in range(0,10,2):
        print(i)
        `, ["0","2","4","6", "8"]);
    
    assertPrint('range: negative step', `
    i: int = 0
    for i in range(0,-10,-2):
        print(i)
        `, ["0","-2","-4", "-6", "-8"]);

    assertPrint('range: for loop with break', `
    i: int = 0
    for i in range(0,-10,-2):
        print(i)
        break
        `, ["0"]);

    assertPrint('range: for loop with break', `
    i: int = 0
    for i in range(0,-10,-2):
        print(i)
        break
        `, ["0"]);

    assertPrint('range: for loop with break with an if and else statement', `
    i: int = 0
    for i in range(10):
        if i > 5:
            break
        else:
            print(i)
        `, ["0", "1", "2", "3", "4","5"]);

    assertPrint('range: for loop with continue inside the main body', `
    i: int = 0
    for i in range(5):
        print(i * 100)
        continue
        print(i)
        `, ["0", "100", "200", "300", "400"]);    

    assertPrint('range: for loop with continue inside a if statement', `
    i : int = 0
    for i in range(0, 10, 1):
        if i % 2 == 0:
            continue
        else:
            print(i)
        `, ["1", "3", "5", "7", "9"]);      

    assertPrint('range: for else construct 1', `
    i : int = 0
    for i in range(10, 0, -1):
        if i < 5:
            break
        else:
            print(i)
    else:
        print(123456)
        `, ["10", "9", "8", "7", "6", "5"]);  
        
    assertPrint('range: for else construct 2', `
    i : int = 0
    for i in range(10, 5, -1):
        if i < 5:
            break
        else:
            print(i)
    else:
        print(123456)
        `, ["10", "9", "8", "7", "6", "123456"]);  

    assertPrint('range: nested for with break', `
    i:int = 0
    j:int = 0
    for i in range(4):
        for j in range(4):
            j = j + 1
            print(j)
        break
        print(10)
        `, ["1", "2", "3", "4"]);  
    
    assertPrint('range: inbuilt functions on range 1 ', `
    r : range = None
    r = range(20, 0, -2)
    print(r.index(2))
        `, ["9"]);    
        
    assertFail('range: inbuilt functions on range 2 ', `
    r : range = None
    r = range(0, 10)
    print(r.index(10))
        `);    
    
    assertFail('range: value error in range parameters', `
    i:int = 0
    for i in range(1, 10, 0):
        print(i)
        `);    
        
    assertTCFail('range: type checking for loop variable ', `
    i : bool = False
    for i in range(10):
        print(i)
        `);   

    assertTCFail('range: type checking for range parameters 1', `
    i : int = 0
    for i in range(10, 20, 1, 1):
        print(i)
        `);   
});



// Helpers

/**
 * Given a test case name, source program, and expected Program output, test if the
 * given Program can successfully be parsed.
 */
function assertParse(name: string, source: string) {
  it(name, () => {
    expect(() => parse(source)).to.not.throw();
  });
}
/**
 * Ensures that when parsing source, the parser throws an exception.
 */
function assertParseFail(name: string, source: string) {
  it(name, () => expect(() => parse(source)).to.throw(Error));
}

/**
 * Ensure during typechecking, a TypeError is thrown.
 */
function assertTCFail(name: string, source: string) {
  it(name, async () => {
    expect(() => typeCheck(source)).to.throw(TypeCheckError);
  });
}

// import { PyInt, PyBool, PyNone, PyObj } from '../utils';
// import { assert, asserts, assertPrint } from "./utils.test";

// // We write end-to-end tests here to make sure the compiler works as expected.
// // You should write enough end-to-end tests until you are confident the compiler
// // runs as expected. 
describe('run', () => {

//   runWasm('i64 return value', '(module (func (export "exported_func") (result i64) (i64.const 234)))', BigInt(234));

  assert('range: one parameter', `
i: int = 0
sum: int = 0
for i in range(10):
    sum = sum + i
sum
`, PyInt(45));

assert('range: two parameters', `
i: int = 0
sum: int = 0
for i in range(5,10):
    sum = sum + i
sum
`, PyInt(35));

assert('range: three parameters', `
i: int = 0
sum: int = 0
for i in range(0,10,2):
    sum = sum + i
sum
`, PyInt(20));

assert('range: negative step', `
i: int = 0
sum: int = 0
for i in range(0,-10,-1):
    sum = sum + i
sum
`, PyInt(-45));
});


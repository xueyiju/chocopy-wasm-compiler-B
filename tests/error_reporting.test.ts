import "mocha";
import { expect } from "chai";
import {run} from "./helpers.test";
import { fail } from 'assert'

export function assertParseFail(name: string, source: string, line: number, col: number, sourceCode: string ) {
    it(name, async () => {
      try {
        await run(source);
        fail("Expected an exception");
      } catch (err) {
        expect(err.message).to.contain("PARSE ERROR:");
        expect(err.message).to.contain("in line " + line.toString());
        expect(err.message).to.contain("at column " + col.toString());
        expect(err.message).to.contain(sourceCode)
      }
    });
  }
  
  
  export function assertTypeCheckFail(name: string, source: string, line: number, col: number, sourceCode: string ) {
    it(name, async () => {
      try {
        await run(source);
        fail("Expected an exception");
      } catch (err) {
        expect(err.message).to.contain("TYPE ERROR:");
        expect(err.message).to.contain("in line " + line.toString());
        expect(err.message).to.contain("at column " + col.toString());
        expect(err.message).to.contain(sourceCode)
      }
    });
  }
  
  export function assertRunFail(name: string, source: string, line: number, col: number) {
    it(name, async () => {
      try {
        await run(source);
        fail("Expected an exception");
      } catch (err) {
        expect(err.message).to.contain("RUNTIME ERROR:");
        expect(err.message).to.contain("in line " + line.toString());
        expect(err.message).to.contain("at column " + col.toString());
      }
    });
  }
describe("Error Reporting tests", () => {
    //1
    assertParseFail("missing-parenthesis-in-expression", 
    `x: int = 4\nif (x == 6\n\tprint (6)`, 2, 10, "if (x == 6");

    //2
    assertParseFail("invalid-syntax", 
    `x: int = 4\nif (x == 4)::\n\tprint(x)`, 2, 13, 'if (x == 4)::');

    //3
    assertParseFail("missing-type-annotation", 
    `def f(c):
        print(3)
    f(2)
    `, 1, 8, 'def f(c):');

    //4
    assertTypeCheckFail("type-mismatch", 
    `x: int = 1\nx = True`, 2, 8, 'x = True');

    //5
    assertTypeCheckFail("function-call-type-mismatch", 
    `def f(c: int):\n\tprint(c)\nf(2,3)`, 3, 6, 'f(2,3)');

    //6
    assertTypeCheckFail("variable-not-defined-before-accessing", 
    `z = 1`, 1, 5, 'z = 1');

    //7
    assertTypeCheckFail("function-not-defined-before-calling", 
    `def sum(a: int, b: int) -> int:\n\treturn a + b\ndiff(5,7)`, 3,9, 'diff(5,7)');

    //8
    assertTypeCheckFail("return-type-mismatch", 
    `def f(c: int) -> int:\n\treturn True\nf(2)`, 2,12, 'return True');

    //9
    assertRunFail("division-by-zero", 
    `x: int = 100\nx//0`,2,4);

    //10
    assertRunFail("division-by-zero", 
    `x: int = 100\nx%0`,2,3);

 });
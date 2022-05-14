# Chocopy Compiler B
## Error Reporting 

For the Chocopy WASM Compiler B, we are implementing interfaces for error reporting. Our progress for week 7 is that we implemented interfaces for reporting the below errors.

<br/>

### **Types of Errors**
The following is the list of errors, we reported for the week 7
1. Compile-time Error
	- Parse Error
	- Type Error
2. Runtime Error
	- Division by zero
	- Assert on none

<br/>

### **Error Reporting Format**
The following is format of the reported errors, we have implemented for week 7
1. Type of error
2. Error message
3. Source location :
	- line number
	- column number
	- source code

<br/>

###  **AST Changes**
The following type has to be included in the ast.ts for keeping track of the source location to report the errors:
> export type SourceLocation = { line: number, column: number, srcCode: string }

<br/>

### **Changes in parser.ts and type-checker.ts**
SourceLocation is computed with the help of the Lezer tree using "getSourceLocation()" function in parser.ts
We also added annotation changes to parser.ts and type-check.ts. Propagated these changes to other files as required (lower.ts, compiler.ts, repl.ts, runner.ts)

Below is the format of the program which the parser and the typechecker takes as input and emits as output:
```
parser.ts:
- Input: Program<null>
- Output: Program <SourceLocation>

type-check.ts
- Input: Program<SourceLocation>
- Output: Program<[Type, SourceLocation]>
```

<br/>

### **Interface for reporting error**
We added a new file "error_reporting.ts" with includes the following implemented interfaces for throwing errors.
```
export class CompileTimeError extends Error {
	...
 }

export class TypeCheckError extends CompileTimeError {
	...
 }

 export class ParseError extends CompileTimeError {
	 ...
 }

 export class RunTimeError extends Error {
	 ...
 }
```

To use this interface, below commands can be used as reference for format:
- TypeCheckError:
	> throw new TypeCheckError(\<message\>, \<SourceLocation\>);
- ParseError:
	> throw new ParseError(\<message\>, \<SourceLocation\>);
- RunTimeError:
	> throw new RunTimeError(\<message\>);

We also added a new file 'runtime_error.ts' which includes the functions to be called in the wasm code for generating runtime errors.
While implementing the runtime error, the source location is pushed to the wasm stack and they are retrieved while checking for runtime error in wasm.

<br/>

### **Test Cases**
For testing the error reporting interfaces, we added the test file 'tests/error_reporting.test.ts'. All the tests included are currently passing. Below are the input test program and their respective error reports.

1.  Parse Error: Missing parenthesis in expression
```
x: int = 4

if (x == 6
	print (6)
```

> "Error: PARSE ERROR: Missing parenthesis in line 3 at column 10  
if (x == 6"

2.  Parse Error: Invalid syntax
```
x: int = 4
	
if (x == 4)::
	print(x)
```

> "Error: PARSE ERROR: Could not parse stmt at 25 26: : in line 3 at column 13  
if (x == 4)::"

3. Parse Error: Missing type annotation in function definition
```
def f(c):
	print(3)

f(2)
```

> "Error: PARSE ERROR: Missed type annotation for parameter c in line 1 at column 8  
def f(c):"

4.  Type Error: Type mismatch
```
x: int = 1
x = True
```

> "Error: TYPE ERROR: `bool` cannot be assigned to `number` type in line 2 at column 8  
x = True"

5.  Type Error: Function call type mismatch
```    
def f(c: int):
	print(c)

f(2,3)
```

> "Error: TYPE ERROR: Function call type mismatch: f in line 4 at column 6  
f(2,3)"

6.  Type Error: Variable not defined before accessing
```    
z = 1
```

> "Error: TYPE ERROR: Unbound id: z in line 1 at column 5  
z = 1"

7.  Type Error: Function not defined before calling
```
def sum(a: int, b: int) -> int:
	return a + b

diff(5,7)
```

> "Error: TYPE ERROR: Undefined function: diff in line 4 at column 9  
diff(5,7)" 

8. Type Error: Return type mismatch in a function definition
```
def f(c: int) -> int:
	return True

f(2)
```

> "Error: TYPE ERROR: expected return type `number`; got type `bool` in line 2 at column 12  
	return True"  

9. Runtime Error: Operation on none
```
class C(object):
	x: int = 0

c: C = None
c.x
```
> "Error: RUNTIME ERROR: cannot perform operation on none in line 5 at column 3"

10. Runtime Error: Division by zero
```
x: int = 100
x//0
```
> "Error: RUNTIME ERROR: division by zero in line 2 at column 4"

11. Runtime Error: Division by zero
```
x: int = 100
x%0
```
> "Error: RUNTIME ERROR: division by zero in line 2 at column 3"

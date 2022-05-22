<h1> Project Milestone 2 : Merges and Planning (Compiler B) </h1>


<h2> Inheritance </h2>
<h3>Places where our features overlap and will need more implementation to make them work together</h3>

1. parser.ts

All the errors thrown in the `parser.ts` should be modified to reuse the `ParseError()` interface provided in `error_reporting.ts` For example, the following statement should be modified from
> throw  new  Error(`Class must have at least one super class: ${className}`);

to
> throw  new  ParseError(`Class must have at least one super class: ${className}`, \<message\>);

2. type-check.ts

All the errors thrown in the `type-check.ts` should be modified to reuse the `TypeCheckError()` interface provided in `error_reporting.ts` . 
For example, the following statement should be modified from
> throw  new  TypeCheckError(`Keywords cannot be super class`);

to
> throw  new  TypeCheckError(`Keywords cannot be super class`,\<message\>);

3. lower.ts

The returned IR in the `lower.ts` should include the annotation to avoid unintended test failures.
For example, the following statement should be modified from
```
const callMethod : IR.Expr<[Type, SourceLocation]> = {
	tag: "call-indirect",
	method_offset: env.classesMethods.get(className).get(e.method)[0],
	name: `${className}$${e.method}`,
	arguments: [objval, ...argvals],
	ret: env.classesMethods.get(className).get(e.method)[1],
	}
```
to
```
const callMethod : IR.Expr<[Type, SourceLocation]> = {
	a: e.a,
	tag: "call-indirect",
	method_offset: env.classesMethods.get(className).get(e.method)[0],
	name: `${className}$${e.method}`,
	arguments: [objval, ...argvals],
	ret: env.classesMethods.get(className).get(e.method)[1],
	}
```

<h3> Representative test case </h3>

Currently, the error messages do not include line number and column number. Usage of our error reporting interfaces will include more information like line number, column number, and the source string where the error occurs.
```
class A(object):
	a : int = 1
class B(A):
	a: int = 0
```
Current Output:
> TYPE ERROR: Cannot re-define attribute a

Expected Output:
> TYPE ERROR: Cannot re-define attribute a in line 4 at column 12  
> a: int = 0
<h2> Lists </h2>

<h3>Places where our features overlap and will need more implementation to make them work together</h3>

1. parser.ts

All the errors thrown in the `parser.ts` should be modified to reuse the `ParseError()` interface provided in `error_reporting.ts` 
For example, the following statement should be modified from
> throw  new  Error("Parse error at "  +  s.substring(c.from,  c.to));

to
> throw  new  ParseError("Parse error at "  +  s.substring(c.from,  c.to), \<message\>);

2. type-check.ts

All the errors thrown in the `type-check.ts` should be modified to reuse the `TypeCheckError()` interface provided in `error_reporting.ts` . 
For example, the following statement should be modified from
> throw  new  TypeCheckError("Index needs to evaluate to a number");

to
> throw  new  TypeCheckError("Index needs to evaluate to a number", \<message\>);

3. webstart.ts and import-object.test.ts

All the errors thrown in the `webstart.ts` should be modified to reuse the `RunTimeError()` interface provided in `error_reporting.ts`. The function definition should also include line number as `line: number` and column number as `col: number`. 
The error message should be constructed as
> stackTrace() + "\nRUNTIME ERROR: \<message\>" + line.toString() + " at column " + col.toString() + "\n" + splitString()[line-1].trim()

For example, the following function should be modified to reflect the above changes :

    function list_index_oob(length: any, index: any): any {
	    if (index < 0 || index >= length)
		    throw new Error(`RUNTIME ERROR: Index ${index} out of bounds`);
	    return index;
    }

Please check `runtime_error.ts` file for reference.

<h3> Representative test case </h3>

Currently, the error messages do not include line number and column number. Usage of our error reporting interfaces will include more information like line number, column number, and the source string where the error occurs.
```
a: [int] = None
a = [2, 4, 6, 8]
a[4]
```
Current output:
> Error: RUNTIME ERROR: Index 4 out of bounds

Expected output:
> Error: Traceback (most recent call last):   
> in line 3: a[4]  
> RUNTIME ERROR: Index 4 out of bounds in line 3 at column 4  
> a[4]

<h2> Memory management </h2>

<h3>Places where our features overlap and will need more implementation to make them work together</h3>

The major implementation of the memory management seems to be taking place via functions defined and imported in wasm code. They have defined `test_refcount` which is basically supposed to throw runtime errors. Upon inspection, it found that it is a wasm function which returns 0 or 1 (converted to true or false) based on equality checks of the refcount of the object and its argument. They have not thrown any specific error for the same. Till now it does not seem there is any interaction with the error reporting interface. However, few runtime errors like checking for `MemoryLeakErrors` could be implemented using the interface provided in `error_reporting.ts`

Please check `runtime_error.ts` file for reference.

<h2> Optimization </h2>

The optimization team work is focused mainly on the optimizing the existing compiler functionality. They are mainly focused on eliminating dead code, unreachable code, constant propagation, constant folding and all of these include changes at `ir.ts` and `ast.ts` level. They don't have to include any new error since code optimization happens after lowering of the code and till that point the errors are being handled by the other teams. The runtime error is also not covered while the optimization of the code so there is no interaction between our features.

*Before Optimization*

```
    def f(i:int):
        if True
          return i + 1
        else:
          return i * 2 
```
The above code snippet has a parse error in the `if` statement (missing colon). Had the entire code been error-free, after the optimization, it would have looked like the below code snippet.

*After Optimization*
```
def f(i:int):
    return i + 1
```
But since, the error gets thrown at the parsing state, optimization of the code does not take place. Hence, there is no interaction between our features.
 
<h2> Set/Tuple/Dictionary </h2>
<h3>Places where our features overlap and will need more implementation to make them work together</h3>

A few of the files that need changes are as follows :

1. parser.ts

Parse errors should be included for the new feature added.

2. type-check.ts

All the errors thrown in the `type-check.ts` should be modified to reuse the `TypeCheckError()` interface provided in `error_reporting.ts` and also 

For example, the following statement should be modified from

> throw new Error("Set constructor not implemented yet");

to
> throw new TypeCheckError("Set constructor not implemented yet", \<SourceLocation\>);

3. lower.ts

The returned IR in the `lower.ts` should include the annotation to avoid unintended test failures.

For example, the following statement should be modified from
> expr: { tag:  "call", name:  `set$add`, arguments: [{ tag:  "id", name:  newSetName}, value]}

to
> expr: { a:  e.a, tag:  "call", name:  `set$add`, arguments: [{ tag:  "id", name:  newSetName}, value]}

4. RunTime errors like `KeyError` should be included for the new feature added. 

<h3> Representative test case </h3>

Currently, the test file do not include test where the program would generate error messages. While including such test cases, the interface provided in the `tests/error_reporting.test.ts` can be used.
```
set_1 : set[int] = None
set_1 = {1,2}
set_1.remove(3)
```
Current output :
Currently, the implementation of handling this case was not found.

Expected output :

> Error: Traceback (most recent call last):   
> in line 3: set_1.remove(3)  
> RUNTIME ERROR: Key Error in line 3 at column 15  
> set_1.remove(3)


 <h2> Strings </h2>
<h3>Places where our features overlap and will need more implementation to make them work together</h3>

A few of the files that need changes are as follows :

 1. parser.ts

All the errors thrown in the `parser.ts` should be modified to reuse the `ParseError()` interface provided in `error_reporting.ts`
For example, the following statement should be modified from 
> throw new Error("Error: there should have at least one value inside the brackets");

to
>throw  new  ParseError(" there should have at least one value inside the brackets", \<SourceLocation\>);
2. type-check.ts 

All the errors thrown in the `type-check.ts` should be modified to reuse the `TypeCheckError()` interface provided in `error_reporting.ts`
For example, the following statement should be modified from 
> throw new TypeCheckError("string is immutable")
 
to
>throw  new  TypeCheckError("string is immutable", \<SourceLocation\>);
3. webstart.ts and string-import-object.test.ts

All the errors thrown in the `webstart.ts` should be modified to reuse the `RunTimeError()` interface provided in `error_reporting.ts`
The function definition should also include line number as  `line: number` and column number as `col: number.`  The error message should be constructed as 
> stackTrace() + "\nRUNTIME ERROR: \<message\>" + line.toString() + " at column " + col.toString() + "\n" + splitString()[line-1].trim()

For example, the following function should be modified to reflect the above changes :
```
    function assert_in_range(length: any, index: any): any {
    	if (index < 0) {
    	    throw new Error("RUNTIME ERROR: index less than 0");
        }
        if (length <= index) {
    	    throw new Error("RUNTIME ERROR: index not in range");
        }
        return index;
    }
```

Please check `runtime_error.ts` file for reference. 

<h3> Representative test case </h3>
Currently, the error messages do not include line number and column number. Usage of our error reporting interfaces will include more information like line number, column number, and the source string where the error occurs. 

    s:str = "asdf"
    s[1] = "p"

Current output : 
> Type Error: String immutable

Expected output : 
> Error: TYPE ERROR: String immutable in line 2 at column 10 </br> s[1] = "p" 


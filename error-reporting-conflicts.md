<h1> Project Milestone 2 : Merges and Planning (Compiler B) </h1>

 <h2> Fancy calling conventions </h2>
<h3>Places where our features overlap and will need more implementation to make them work together</h3>

A few of the files that need changes are as follows :

 1. parser.ts

All the errors thrown in the `parser.ts` should be modified to reuse the `ParseError()` interface provided in `error_reporting.ts`
For example, the following statement should be modified from 
> throw  new  ParseError("Can't have non default parameters after default parameters", getSourceLocation(c,s).line);
> 
to
>throw  new  ParseError("Can't have non default parameters after default parameters", getSourceLocation(c,s));

2. type-check.ts 
All the errors thrown in the `type-check.ts` should be modified to reuse the `TypeCheckError()` interface provided in `error_reporting.ts`
For example, the following statement should be modified from 
> throw  new  TypeCheckError("Type mismatch for default value of argument ${p.name}");
 
to
>throw  new  TypeCheckError("Type mismatch for default value of argument ${p.name}", \<SourceLocation\>);
3. lower.ts
There are two type check errors in the `lower.ts` file that do not use our latest implementation of `TypeCheckError()` interface.
For example, the following statement should be modified from 
> throw  new  Error("method call not properly type checked");
 
to
>throw  new  TypeCheckError("method call not properly type checked", \<SourceLocation\>);



In future, if you find any runtime errors, please use the RunTimeError() interface provided in `error_reporting.ts`. Please check `runtime_error.ts` file for reference. 

Currently, the test file - `tests/callingconventions.test.ts` does not use the interfaces we have provided in the `tests/error_reporting.test.ts` which test for error information like line number, column number etc. 

<h3> Representative test case </h3>
Currently, error messages do not include line number and column number. Usage of our error reporting interfaces will include more information like line number, column number, and the source string where the error occurs. 

    def test(x : bool = 3):

Current output : 
> TYPE ERROR: x is not a bool

Expected output : 
>Error: TYPE ERROR:  x is not a bool in line 1 at column 23  
>def test(x : bool = 3):



 <h2> For loops/iterators </h2>
<h3>Places where our features overlap and will need more implementation to make them work together</h3>

A few of the files that need changes are as follows :

 1. parser.ts

No parse errors are added for the new functionality. 

2. type-check.ts 
All the errors thrown in the `type-check.ts` should be modified to reuse the `TypeCheckError()` interface provided in `error_reporting.ts`
For example, the following statement should be modified from 
> throw  new  TypeCheckError("Not an iterable");

to
>throw  new  TypeCheckError("Not an iterable", \<SourceLocation\>);
3. lower.ts
There are a few errors in the `lower.ts` file that do not use our latest implementation of error reporting interfaces.
For example, the following statement should be modified from 
> throw  new  Error("Tuple assignment not supported")
 
to
>throw  new  ParseError("Tuple assignment not supported", \<SourceLocation\>);

4. webstart.ts and tests/import-object.test.ts
All the errors thrown in the `webstart.ts` and `tests/import-object.test.ts` should be modified to reuse the `RunTimeError()` interface provided in `error_reporting.ts`
The function definition should also include line number as `line: number` and column number as `col: number.` The error message should be constructed as

> stackTrace() + "\nRUNTIME ERROR: \<message\>" + line.toString() + " at column " + col.toString() + "\n" + splitString()[line-1].trim()

 For example, the following function should be modified to reflect the above changes :```

    function check_range_error(arg: any) : any {
	    if (arg === 0)
		    throw new Error("RUNTIME ERROR: range() arg 3 must not be zero");
	    return arg;
    }


Note: Currently, the test file - `tests/range.test.ts` does not use the interfaces we have provided in the `tests/error_reporting.test.ts` which test for error information like line number, column number etc. 

<h3> Representative test case </h3>
Currently, error messages do not include line number and column number. Usage of our error reporting interfaces will include more information like line number, column number, and the source string where the error occurs.

```

    r : range = None
    r = range(0, 10)
    print(r.index(10))

```
Current output : 
> ValueError: 10 is not in range

Expected output : 
>Error: Traceback (most recent call last):  
>in line 3: print(r.index(10))  
>RUNTIME ERROR: ValueError: 10 is not in range in line 3 at column 18  
>print(r.index(10))

 <h2> Front-end user interface </h2>

There is interaction between error reporting code and the code implementing user-interface but there are no changes made to the way the error messages are displayed on the user-interface because of which there will be no conflicts currently. The only change is that the `renderError(result : any) : void` function is moved from `webstart.ts` to `ouputrender.ts` file, but the function still accepts an argument `result` of any type and sets `elt.innerText`  = `String(result)` as before.  

For example, 

    def f(c: int) -> int:
	    return True
    f(2)

> Error: TYPE ERROR: expected return type `number`; got type `bool` in line 2 at column 12  
> return True

The above example program generates the error message as intended because it aligns with how the UI team has implemented the `renderError()` function.

<h2> Generics and polymorphism </h2>
<h3>Places where our features overlap and will need more implementation to make them work together</h3>
A few of the files that need changes are as follows :

1. parser.ts
Currently, there are no parse errors added for this feature. In the future, when Parse errors are added (for verifying syntax like commas, brackets etc.) , please reuse the `ParseError()` interface provided in `error_reporting.ts` for reporting the error messages with line number, column number and the source code string where the parse error is caught.

2. type-check.ts and remove-generics.ts

All the errors thrown in the `type-check.ts` should be modified to reuse the `TypeCheckError()` interface provided in `error_reporting.ts`

For example, the following statement should be modified from

> throw  new  Error("TYPE ERROR: print can't be called on objects");

to

>throw new TypeCheckError("print can't be called on objects", \<SourceLocation\>);

Note: In future, if you find any runtime errors, please use the RunTimeError() interface provided in `error_reporting.ts`. Please check `runtime_error.ts` file for reference. 

Currently, the test file - `tests/generics.test.ts,  does not use the interfaces we have provided in the `tests/error_reporting.test.ts` which test for error information like line number, column number etc. 

<h3> Representative test case </h3>

Currently, the error messages do not include line number and column number. Usage of our error reporting interfaces will include more information like line number, column number, and the source string where the error occurs.


    T: TypeVar = TypeVar('T')
    T: TypeVar = TypeVar('T')
    class Box(object):
        val: int = 10
    class Printer(Generic[T]):
       def print(self: Printer, x: T):
           print(x)
    p: Printer[int] = None
    p = Printer[int]()
    p.print(Box())

Current output :

> Type Error: print can't be called on objects"

Expected output :

> Error: TYPE ERROR: print can't be called on objects in line 10 at column 15  
> p.print(Box())

 <h2> I/O,  files </h2>
We could not find any parse or type-check errors for this functionality. We observed that the runtime errors are not thrown, but are displayed by printing special numbers like `99999`
In the following weeks, please use our RunTimeError() interface provided in `error_reporting.ts` for displaying runtime errors. Please check `runtime_error.ts` file for reference. 

Currently, there are no test files to test the new functionality implemented. In future, when tests are added,  please use the interfaces we have provided in the `tests/error_reporting.test.ts` which test for error information like line number, column number etc. 

<h3> Representative test case </h3>
Usage of our error reporting interfaces will print the specific error messages including more information like line number, column number, and the source string where the error occurs. 

    f : File = None
    f = open('test', 'rb')
    f.close()
    f.read()

Current output : 
> ValueError: I/O operation on closed file.

Expected output : 
>Error: Traceback (most recent call last):  
>f.read()  
>RUNTIME ERROR: ValueError: I/O operation on closed file. in line 4 at column 8  
>f.read()


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


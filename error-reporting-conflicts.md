<h1> Project Milestone 2 : Merges and Planning (Compiler B) </h1>
 <h2> Strings </h2>
<h3>Places where our features overlap and will need more implementation to make them work together</h3>

A few of the files that need changes are as follows :

 1. parser.ts

All the errors thrown in the `parser.ts` should be modified to reuse the `ParseError()` interface provided in `error_reporting.ts`
For example, the following statement should be modified from 
> throw new Error("Error: there should have at least one value inside the brackets");
> 
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
> Error: TYPE ERROR: String immutable in line 2 at column 10
s[1] = "p" 





  


  
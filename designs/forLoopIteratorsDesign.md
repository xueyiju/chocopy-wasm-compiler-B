# For Loops and Iterators #
## Test Cases ##
* **Test Case 1**: for loop with range and one parameter in range
 
Input:
```
i: int = 0
for i in range(5):
    print(i)
```
Output:
```
0
1
2
3
4
```
* **Test Case 2**: for loop with range and two parameters in range
 
Input:
```
i: int = 0
for i in range(5,10):
    print(i)
```
Output:
```
5
6
7
8
9
```
 
* **Test Case 3**: for loop with range and three parameters in range
 
Input:
```
i : int = 0
for i in range(0,10,2):
    print(i)
```
Output:
```
0
2
4
6
8
```

* **Test Case 4**: for loop with negative step
 
Input:
```
i : int = 0
for i in range(0,-10,-2):
    print(i)
```
Output:
```
0
-2
-4
-6
-8
```


* **Test Case 5**: for loop with break in the main for loop body
 
Input:
```
i : int = 0
for i in range(10):
    print(i)
    break
```
Output:
```
0
```
* **Test Case 6**:  for loop with break inside a if body
 
Input:
```
i : int = 0
for i in range(10):
    If i\>5:
        break
    else: 
        print(i)
```
Output:
```
0
1
2
3
4
5
```
 
* **Test Case 7**:  for loop with continue inside the main for body
 
Input:
```
i : int = 0
for i in range(5):
    print(i*100)
    continue
    print(i)
```
Output:
```
0
100
200
300
400
```
 
* **Test Case 8**:  for loop with continue inside a if body
 
Input:
```
i : int = 0
for i in range(10):
    if i%2==0:
        continue
    else:
        print(i)
```
Output:
```
1
3
5
7
9
```
 
* **Test Case 9**: for else construct 1
 
Input:
```
i : int = 0
for i in range(10, 0, -1):
    if i < 5:
        break
    else:
        print(i)
else:
    print(123456)
```
Output:
```
10
9
8
7
6
5
```

* **Test Case 10**: for else construct 1
 
Input:
```
i : int = 0
for i in range(10, 5, -1):
    if i < 5:
        break
    else:
        print(i)
else:
    print(123456)
```
Output:
```
10
9
8
7
6
123456
```
* **Test Case 11**: inbuilt functions on range, index() returning Value Error
 
Input:
```
r : range = None
r = range(0, 10)
print(r.index(10))
```
Output:
```
ValueError: 10 is not in range
```
* **Test Case 12**:  inbuilt functions on range, index() returning index of reachable number
 
Input:
```
r : range = None
r = range(20, 0, -2)
print(r.index(2))
```
Output:
```
9
```
* **Test Case 13**: range returning Value Error
 
Input:
```
 i:int = 0
for i in range(1, 10, 0):
    print(i)
```
Output:
```
ValueError: arg3 can't be 0 for range
```

* **Test Case 14**: type checking for loop variable
 
Input:
```
i : bool = False
for i in range(10):
    print(i)
```
Output:
```
TypeError: bool object cannot be interpreted as integer
```
* **Test Case 15**: type checking for range parameters
 
Input:
```
range(0, 10, 1, 2)
```
Output:
```
TypeError: range expected at most 3 arguments, got 4
```
## Changes required in AST, IR and builtin libraries ##
 
* The following changes will be required in ast.ts:
 
    * In type Stmt\<A\>:
        * { a?: Type, tag: "for", vars: Expr\<A\>, iterable: Expr\<A\>, body: Array\<Stmt\<A\>\>, elseBody?: Stmt\<A\>}
        * { a?: Type, tag: "break", loopDepth: [string, number] }
        * { a?: Type, tag: "continue", loopDepth: [string, number]  }
        * { a?: A, tag: "construct", name: string, arguments?: Array<Expr<A>> } : we added an optional parameter here called arguments to make a parameterized constructor call work


* We shall not need any changes in ir.ts, since for, break and continue are control flow statements, and ifjmp and jmp in ir.ts cover the behavior that we need to implement these.
 
* We shall need changes in the builtin libraries. We will need to add all the built-in methods described below, we shall do that in a new file called range.wat in the stdlib folder, similar to memory.wat

* Type checking for statement: the iterable must have their class name as one of the six sequence types in python (https://techvidvan.com/tutorials/python-sequences/#:~:text=In%20Python%20programming%2C%20sequences%20are,byte%20arrays%2C%20and%20range%20objects)


* Since, we are implementing the for statement for the range object this week, we shall typecheck that the iterable must be a range object. Given this arrangement we shall check that vars must be a single variable of type int.

## Adding new functions, datatypes, or files to the codebase ##

### Changes to type-check.ts ###
We will add a "built-in" class in the global typechecking environment called range with the following specifications:

defaultGlobalClasses:

class name: range
fields: 
```start: int
stop: int
step: int
hasnext: bool
currvalue: int
```
methods: 
```__init__(self, param1, param2, param3) -> range object
index(self, param) -> int
__hasnext__(self) -> bool
__next__(self) -> int
```
 
Further, we added the following to the LocalTypeEnv to correctly use break and continue statements:
* forCount (number): to keep a count of the for loops used
* whileCount (number): to keep a count of the while loops used
* currLoop (Array<[string, number]>): a stack which stores the loop type (for or while) and its respective count

### Changes to webstart.ts and import-object.test.ts ###
Added the following to the importObject:
* imports: check_range_error : this is for typechecking the third argument to prevent infinite loops
* imports: check_range_index : this is for the inbuilt range.index() function
* rangelib: to import the entire range module from range.wasm (created from range.wat)

### Changes to runner.ts ###
Added the imports of the inbuilt range functions from the rangelib as well as the check_range_error function

### Changes to parser.ts and lower.ts ###

We added the functionalities for for, break and continue statements.

### New file range.test.ts

This contains all the tests shown above.

For new files: We will need to add all the built-in methods described below, we shall do that in a new file called range.wat in the stdlib folder, similar to memory.wat
 
## Description of the value representation and memory layout for any new runtime values added ##
 
The following represents the memory layout for adding a "range value" whenever a call to range is made. Each block is 4 bytes.
 
|    start    |     stop    |     step    |   hasnext  |   currvalue   |
| ----------- | ----------- | ----------- | ----------- | ----------------- |

## Next week's to-dos and limitations of this implementation

* range.wat doesn't use alloc, store and load, we will import libmemory in the next implementation
* break and continue are currently not working for nested loops, will look into this in the next implementation


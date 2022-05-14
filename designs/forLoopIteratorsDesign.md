# For Loops and Iterators #
## Test Cases ##
* **Test Case 1**: for loop with range and one parameter in range
 
Input:
```
i : int = 0
for i in range(10):
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
6
7
8
9
```
* **Test Case 2**: for loop with range and two parameters in range
 
Input:
```
i : int = 0
for i in range(3,6):
    print(i)
```
Output:
```
3
4
5
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
* **Test Case 4**: for loop with break in the main for loop body
 
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
* **Test Case 5**:  for loop with break inside a if body
 
Input:
```
i : int = 0
for i in range(10):
    If i\>5:
        break
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
 
* **Test Case 6**:  for loop with continue inside the main for body
 
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
 
* **Test Case 7**:  for loop with continue inside a if body
 
Input:
```
i : int = 0
for i in range(10):
    If i%2:
        continue
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
 
* **Test Case 8**: for else construct
 
Input:
```
i : int = 0
for i in range(10):
    If i\>5:
        break
    print(i)
else:
    print(“i was greater than 5”) // will only work if basic strings are implemented, we can change this to print(i*100) or something
```
Output:
```
0
1
2
3
4
5
i was greater than 5
```
* **Test Case 9**: inbuilt functions on range, index() returning Value Error
 
Input:
```
r : range = None
r = range(0, 20, 2)
print(r.index(11))
```
Output:
```
ValueError: 11 is not in range
```
* **Test Case 10**:  inbuilt functions on range, index() returning index of reachable number
 
Input:
```
r : range = None
r = range(0, 20, 2)
print(r.index(10))
```
Output:
```
5
```
* **Test Case 11**: type checking for loop variable
 
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
* **Test Case 12**: type checking for range parameters
 
Input:
```
range(0, 10.2, 0.2)
```
Output:
```
TypeError: float object cannot be interpreted as integer
```
* **Test Case 13**: type checking for range parameters
 
Input:
```
range(0, 10, 1, 2)
```
Output:
```
TypeError: range expected at most 3 arguments, got 4
```
* **Test Case 14**: type checking for range parameters
 
Input:
```
range()
```
Output:
```
TypeError: range expected 1 argument, got 0
```
* **Test Case 15**: type checking for range parameters
 
Input:
```
range()
```
Output:
```
TypeError: range expected 1 argument, got 0
```
## Changes required in AST, IR and builtin libraries ##
 
* The following changes will be required in ast.ts:
 
    * In type Stmt\<A\>:
        * { a?: Type, tag: "for", vars: Expr\<A\>, iterable: Expr\<A\>, body: Array\<Stmt\<A\>\>, elseBody?: Stmt\<A\>}
        * { a?: Type, tag: "break" }
        * { a?: Type, tag: "continue" }
 
* We shall not need any changes in ir.ts, since for, break and continue are control flow statements, and ifjmp and jmp in ir.ts cover the behavior that we need to implement these.
 
* We shall need changes in the builtin libraries. We will need to add all the built-in methods described below, we shall do that in a new file called range.wat in the stdlib folder, similar to memory.wat

* Type checking for statement: the iterable must have their class name as one of the six sequence types in python (https://techvidvan.com/tutorials/python-sequences/#:~:text=In%20Python%20programming%2C%20sequences%20are,byte%20arrays%2C%20and%20range%20objects)


* Since, we are implementing the for statement for the range object this week, we shall typecheck that the iterable must be a range object. Given this arrangement we shall check that vars must be a single variable of type int.

## Adding new functions, datatypes, or files to the codebase ##

We will add a "built-in" class in the global typechecking environment called range with the following specifications:

class name: range
fields: start: int, stop: int, step: int, has_next: bool, current_value: int
methods: __init__(param1, param2, param3) -> range object, index(param) -> int
 
For new files: We will need to add all the built-in methods described below, we shall do that in a new file called range.wat in the stdlib folder, similar to memory.wat
 
## Description of the value representation and memory layout for any new runtime values added ##
 
The following represents the memory layout for adding a "range value" whenever a call to range is made. Each block is 4 bytes.
 
|    start    |     stop    |     step    |   has_next  |   current_value   |
| ----------- | ----------- | ----------- | ----------- | ----------------- |

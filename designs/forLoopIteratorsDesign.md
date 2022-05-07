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
* **Test Case 9**: operations on range
 
Input:
```
r : range = None
r = range(0, 20, 2)
print(11 in r)
```
Output:
```
False
```
* **Test Case 10**: inbuilt functions on range, index() returning Value Error
 
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
* **Test Case 11**:  inbuilt functions on range, index() returning index of reachable number
 
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
        * { a?: Type, tag: "for", cond: Expr\<A\>, body: Array\<Stmt\<A\>\>, elseBody?: Stmt<A>}
        * { a?: Type, tag: "break" }
        * { a?: Type, tag: "continue" }
    * In enum BinOp:
        * Add a BinOP called: In
            * Note: Thinking ahead, for the left operand of the in operator we are assuming here that an Expr can be a tuple (for loop_variable). We shall have this functionality after the group on sets/tuples/dictionaries will include it in Expr\<A\>. For now, since we are only implementing the range iterator, we shall concern ourselves with using **in** with the right operand as range only and hence, the left operand as being an id/literal which is an Expr\<A\>.
 
* We shall not need any changes in ir.ts, since for, break and continue are control flow statements, and ifjmp and jmp in ir.ts cover the behavior that we need to implement these.
 
* We do not need any changes in the builtin libraries. However, at a later stage of the project we might need some changes here depending on how we choose to implement general iterators
 
## Adding new functions, datatypes, or files to the codebase ##
 
We will not need to add any additional files or datatypes to the code base.
 
For functions: we will need to add ```function rangeBuiltInFuns():``` to compilers.ts, and have functions like index() in here.
 
## Description of the value representation and memory layout for any new runtime values added ##
 
The following represents the memory layout for adding a "range value" whenever a call to range is made. Each block is 4 bytes.
 
|    Buffer   |   Buffer    |    start    |     end     |     step    |   has_next  |   current_value   |
| ----------- | ----------- | ----------- | ----------- | ----------- | ----------- | ----------------- |
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 



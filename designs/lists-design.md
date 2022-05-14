# Week 7 Update (5/13/22)

We were not able to get all 10 of our test cases from last week to pass. Tests 1, 2, 3, 6, 7, 8, 9, and 10 pass, but tests 4 and 5 do not yet behave as we eventually intend them to.

We currently have some basic list functionality implemented. A list can be created by enclosing a series of comma-separated values in square brackets. Currently, all the elements in the list must be of the same type. Elements can be accessed using the `listname[index]` syntax, and elements can also be assigned using the `listname[index] = newvalue` syntax.

The tests that do not yet behave as we want are the ones that were supposed to have `index out of bounds` errors. We knew that this would be a runtime check, but we did not realize initially that in order to print the error message, we would need to add a call to a new TypeScript function from the WASM that would print this error message.

One challenge we encountered when trying to add this runtime check was working with the IR. Before we had the IR, we could directly write the assembly code needed for each kind of expression or statement, such as the code to load a value at a specific address, add 1 to it, and use it in the next operation. Now, with the IR, it seems like we have to figure out how that code would look like in the IR format, so that `compiler.ts` can generate the WASM. We are thinking about some different ways to approach this.

Here are some test cases that we know are behaving in an undesireable way, which we plan to work on next: (this is for us just as much as the instructors!)
```
a: [int] = None
b: int = 100

a = [1, 2, 3]
a[3] = 99999999

b
```
*Output:* `99999999`

The way that it is right now, we are able to assign elements to indexes are out of bounds. This is pretty bad because we could modify the memory of other parts of the program. In the above example, setting `a[3]` to `99999999` actually modifies the value of `b`. Even if we can't get the proper `index out of bounds` error yet, we hope to make this at least produce a WASM error so that this bad memory modification is not allowed.

---

```
a: [int] = None
a = [66, -5, 10]
a[1+0]
```
*Output:* `66`

Whenever the index expression is anything other than a literal value, the index access is off by 1. This is due to the way we have our lists laid out in memory (scroll to the very bottom of this file to see). In order to access the element at index `i`, the offset for the load needs to be `i+1`. Currently when we lower the code and make the `"load"` expression, we're just adding 1 to whatever the index evaluates to, which works for literal numbers. However, for anything other than a literal, the `IR.Value` will be an `"id"`, so we can't directly add 1 to that. We are still figuring out what to do about that.

---

```
a: [bool] = None
a = []
```
*Output:* `Error: TYPE ERROR: Non-assignable types`

This shouldn't have any errors, as an empty list should be assignable as a list of booleans. We are still trying to figure out what type to respresent the empty list as, maybe as a list of some sort of "any" type that another group will come up with.

---

```
a: [[int]] = None
a = [[100, 4], [5], [99, -7, 3]]
a[0][1]
```
*Output:* `1`

For some reason we haven't figured out yet, the last element of each list in this list always seems to come out as `1`. All the other list accesses seem to give the value that we expect, but `a[0][1]`, `a[1][0]`, and `a[2][2]` all evaluate to `1`.

# Week 6 Update (5/6/22)

## Test cases for lists


### 1. Create a list with some elements in it

*Input:*
```
a: [int] = None
a = [1, 2, 3]
```
*Output:*
(no output)

---

### 2. Create a list with no elements in it

*Input:*
```
a: [int] = None
a = []
```
*Output:*
(no output)

---

### 3. Access an element in the list

*Input:*
```
a: [int] = None
a = [2, 4, 6, 8]
a[0]
```
*Output:*
```
2
```

---

### 4. Access an element, out of bounds
*Input:*
```
a: [int] = None
a = [2, 4, 6, 8]
a[4]
```
*Output:*
```
Error: Index 4 out of bounds
```
---

### 5. Access a negative index
*Input:*
```
a: [int] = None
a = [1, 2, 3]
a[-1]
```
*Output:*
```
Error: Index -1 out of bounds
```
---

### 6. Elements of the lists are expressions
*Input:*
```
a: [int] = None
b: int = 100
a = [1 + 2, b, (-50)]
print(a[0])
print(a[1])
print(a[2])
```
*Output:*
```
3
100
-50
```
---

### 7. Store an element at a certain index in the list
*Input:*
```
a: [int] = None
a = [1, 2, 3]
a[0] = 5
a[0]
```
*Output:*
```
5
```
---

### 8. Replace the reference for a list with a new one
*Input:*
```
a: [int] = None
a = [1, 2, 3]
a = [4, 5, 6, 7, 8, 9]
a[4]
```
*Output:*
```
8
```
---

### 9. Assign an element of the wrong type
*Input:*
```
a: [int] = None
a = [1, 2, 3]
a[2] = True
```
*Output:*
```
Error: Expected type `int`, got type `bool`
```
---

### 10. Create a list of type bool
*Input:*
```
a: [bool] = None
a = [True]
```
*Output:*
(no output)


## Changes to the AST/IR
(added some code in ast.ts)

- For tag "listliteral": this will represent list literals in the code, for example `[1, 2, 3]`. Each element in the list is an expression, so the AST representation consists of a list of expressions.
- For tag "listlookup": represents an element lookup, for example `a[0]`. The list to look in is an expression (some examples: a name `a[0]`, a list literal `[4, 5, 6][0],` a list lookup `a[1][0]`). The index to lookup is also an expression.
- For tag "listelementassign": represents a statement to assign a new value to a certain index in a list. The list, the index to assign, and the value to assign are all expressions.

Changes to the IR:
- In `flattenExprToExpr()` in `lower.ts`, we will need to add cases for the tags "listliteral" and "listlookup".
  - "listliteral" will require: `IR.Value`s for the elements in the list, `IR.Value`s to indicate the address to store each of these values, and `Stmt`s with the tag "store" to store these values at the indicated address
  - "listlookup" will require: statements to get the address of the array to look in, an `IR.Value` for the index to look up, and an `IR.Expr` with the tag "load" to get this value.
- In `flattenStmt()` in `lower.ts`, we will need to add a case for the tag "listelementassign". It should look similar to the case for the tag "field-assign", except we would calculate the offset using the given index instead of the field name.

## New datatypes
(added some code in ast.ts)

New `Type` with the tag "list", where the element `type` represents the intended type of all the elements in the list.


## Description of the value representation and memory layout
The lists will go on the heap, and when a list is assigned to a variable, that variable will store the address of the list on the heap. At this address will be the number of elements in the list. After that, each value in the list will be stored in consecutive 4-byte blocks of memory. To calculate the address of a specific element in the list, it would be `(address of the list) + (4 * (index + 1))`.

Example:

*Input:*
```
a: [int] = None
a = [9, 8, 7]
```
*Heap:*
```
4     8     12    16
 ----- ----- ----- -----
|  3  |  9  |  8  |  7  |
 ----- ----- ----- -----

 `a` stores the address 4.
```
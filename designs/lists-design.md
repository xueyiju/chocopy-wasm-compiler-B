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
# Destructuring Assignment - Design

For Milestone 1, we aim to support the following test cases. We look to support the *TupleExpression* and the basic destructuring assignment operations along with Parse and Type Errors in this milestone.

## Test Cases

### Valid Cases

1. Destructuring without paranthesized expression

```python
a:int = 0
b:int = 0
a,b = 5,6
print(a)
print(b)
```

_Expected Output_ : 
```
5
6
```

2. Destructuring with paranthesized expression on RHS


```python
a:int = 0
b:int = 0
a,b = (5,6)
print(a)
print(b)
```

_Expected Output_ : 
```
5
6
```

3. Destructuring with paranthesized expression and binary operation on RHS

```python
a:int = 0
b:int = 0
a,b = (5 + 6,6)
print(a)
print(b)
```

_Expected Output_ : 
```
11
6
```

4. Destructuring with paranthesized expression on both sides

```python
a:int = 0
b:int = 0
(a,b) = (5,6)
print(a)
print(b)
```

_Expected Output_ : 
```
5
6
```

5. Destructuring with a function call on RHS

```python
def f(x:int)->int:
    return x

a:int = 0
b:int = 0
(a,b) = (5,f(6))

print(a)
print(b)
```

_Expected Output_ : 
```
5
6
```


### Error Cases

1. Type Error thrown while destructuring due to unbound IDs

```python
(a,b) = (5,6)
```

_Expected Output_ : 
```
TYPE ERROR : Unbound ID
```

2. Type Error thrown while destructuring due to inconsistent types

```python
a:int = 0
b:int = 0
(a, b) = (5, False)
```

_Expected Output_ : 
```
TYPE ERROR : Inconsistent Types
```

3. Type Error thrown while destructuring due to mismatch of arguments while unpacking

```python
a:int = 0
b:int = 0
(a, b) = (5, 6, 7)
```

_Expected Output_ : 
```
TYPE ERROR : Incorrect number of arguments
```


4. Parse Error thrown while destructuring due to binary expression on LHS

```python
a:int = 0
b:int = 0
(a + 5, b) = (5, 6)
```

_Expected Output_ : 
```
PARSE ERROR : Cannot parse ID
```


5. Parse Error thrown while destructuring due to incorrect syntax

```python
a:int = 0
b:int = 0
( , ) = (5,4)
```

_Expected Output_ : 
```
PARSE ERROR : Invalid syntax
```


## Changes Required

### AST

**Current AST**:  ``` expr = { a?: A, tag: "assign", name: string, value: Expr<A> } ... ```

**New AST**:
```
expr = { a?: A, tag: "assign", destr: Destructure<A> } ...

export type Destructure<A> =
   { a?: A, tag: "basic", name: string, value: Expr<A> }
|  { a?: A, tag: "destructure", name: Expr<A>[], value: Expr<A>[] , type?: Type<A>[]}

```

### IR
Same changes as AST.


### Built-in Libraries
We currently forsee no changes to built-in libraries for this functionality.

### Type Checker
As part of the TypeChecker for Milestone 1, we will support : 

- LHS variables are declared (following ChocoPy recommendation of declaration before definition)
- LHS and RHS have same number of arguments
- LHS and RHS have the same respective types (including call expressions)

### Parser
For the parser in Milestone 1, we will support : 

- Parsing of multiple variables and values on LHS and RHS
- Parsing of **TupleExpression** for destructuring
- Parsing *BinaryExpression*, *CallExpression*, *Builtins* 
- Check for parse errors for ID and syntax.



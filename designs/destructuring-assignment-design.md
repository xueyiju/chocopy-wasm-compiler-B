# Destructuring Assignment - Design

For Milestone 1, we aim to support the following test cases. 

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

### IR

### Built-in Libraries


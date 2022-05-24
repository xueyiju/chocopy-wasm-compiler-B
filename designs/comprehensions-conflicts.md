# Comprehensions Conflicts Document


## Lists
```python
print([x for x in Range().new(0, 5, 1)])
```
### *expected output*
```python
[0,1,2,3,4]
```
### *changes required*


---

## for loops/iterators
```python

```
### *expected output*
```python

```
### *changes required*

---

## Strings
```python

```
### *expected output*
```python

```
### *changes required*

---

## Sets and/or tuples and/or dictionaries
```python

```
### *expected output*
```python

```
### *changes required*

---

## Destructuring assignment
```python

```
### *expected output*
```python

```
### *changes required*

---

## Bignums
```python

```
### *expected output*
```python

```
### *changes required*

---
## Built-in libraries
```python
print([factorial(x) for x in Range().new(0, 4, 1)])
```
### *expected output*
```python
[0, 1, 2, 6]
```
### *changes required*
**No change is required.**

Currently we have no changes required for the built-in group. Currently the built-in group are now only focusing on basic functions like math, time and sleep. Only math functions calls will appear in comprehension expressions, and they are like any other expressions. If parsed correctly, they will be handled properly and won't result in any conflicts.

---

## Import/FFI
### *changes required*
**No change is required.**

Currently we have no changes required for the import/ffi group, because our feature really don't interact much.

---

## Error reporting
```python
print((x for x in Range().new(0, 3, 1)])
```
### *expected output*
```python
Error: PARSE ERROR: Comprehension start and end mismatch in line 1 at column 27
```
### *changes required*
**No change is required for them, but we will need to change some details.**

For example, currently our error message doesn't include line number and column number. We will need to modify our files in order to use theirs error reporting interface.

---

## Fancy calling conventions
```python
def f(x : int, y : int = 3) -> int:
    return x + y:
print([f(i) for i in Range().new(0, 3, 1)])
```
### *expected output*
```python
[3, 4, 5]
```
### *changes required*
**No change is required.**

Currently we have no changes required for the fancy calling group. Our group could interact with their group if a fancy function call expression appears in our comprehension expression. Yet fancy call expression is no different from a normal function call expression, if implemented correctly. Thus, there will be no conflicts and no changes required. 

---

## Front-end user interface
```python

```
### *expected output*
```python

```
### *changes required*

---

## Generics and polymorphism
```python

```
### *expected output*
```python

```
### *changes required*

---

## I/O, files

### *changes required*
**No change is required.**

Currently we have no changes required for the I/O, files group, because our features don't really interact much.

---

## Inheritance
```python

```
### *expected output*
```python

```
### *changes required*

---

## Memory management
```python

```
### *expected output*
```python

```
### *changes required*

---

## Optimization
```python

```
### *expected output*
```python

```
### *changes required*

---

## Closures/first class/anonymous functions
```python
def adder(x:int) -> Callable[[int], int]:
  def f(y:int) -> int:
    return x+y
  return f
add1: Callable[[int], int] = None
add1 = adder(1)
print([add1(x) for x in Range().new(0, 3, 1)])
```
### *expected output*
```python
[1, 2, 3]
```
### *changes required*
**No change is required.**

Currently we have no changes required for the closure group. Users can call closures or define lambdas in comprehension expressions, but they are no different from normal call expressions. Thus our features interact fine without conflicts.


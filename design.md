## Design of Optimization on Compiler B

### 1. Test cases / Scenarios

#### 1. Eliminate unreachable codes after return

**Before Optimization**
```python
def f(i:int):
    return i
    print(i+1)
```
**After Optimization**
```python
def f(i:int):
    return i
```

#### 2. Optimize inline functions

**Before Optimization**
```python
def f(i:int):
    print(i)
a:int = 100
f(a)
```
**After Optimization**
```python
a:int = 100
print(a)
```

#### 3. Replace constant variables

**Before Optimization**
```python
x:int = 100
y:int = 10
y = x + 1
y = y + x
```
**After Optimization**

```python
y:int = 10
y = 100 + 1
y = y + 100
```

#### 4. Replace constant add BinOp with its result

**Before Optimization**
```python
x:int = 0
x = 1 + 2
x = x + 3 + 4
```
**After Optimization**
```python
x:int = 0
x = 3
x = x + 7
```

#### 5. Replace Multiply BinOp if the multiplicand or multiplier is 1

**Before Optimization**
```python
x:int = 0
y:int = 0
x = 1 * 2 * 3
y = 100 * 1000 * 1
```
**After Optimization**
```python
x:int = 0
y:int = 0
x = 2 * 3
y = 100 * 1000
```

#### 6. Eliminate redundant assignment

**Before Optimization**
```python
x:int = 0
y:int = 1
y = x
print(x)
print(y)
```

**After Optimization**
```python
x:int = 0
print(x)
print(x)
```

#### 7. Replace variable assignment with itself 

**Before Optimization**
```python
x:int = 0
x = x
print(x)
```
**After Optimization**
```python
x:int = 0
print(x)
```

#### 8. Optimize for loop

**Before Optimization**
```python
x:int = 0
for i in range(1000):
    x = x + 1
```
**After Optimization**
```python
x:int = 0
x = x + 1000
```

#### 9. Replace common substrings with its result

**Before Optimization**
```python
x:int = 1
y:int = 2
a:int = 0
a = 2 * (x+y) + 3 * (y + x) + 5 * (x+y)
```

**After Optimization**

```python
x:int = 1
y:int = 2
a:int = 0
e:int = x + y
a = 2 * e + 3 * e + 5 * e
```

#### 10. Replace `not` operator used explictly on boolean literals

**Before Optimization**
```python
x:bool = True
x = not x
```
**After Optimization**
```python
x:bool = True
x = not True
```

Then it will become

```python
x:bool = True
x = False
```

### 2. Code Modification

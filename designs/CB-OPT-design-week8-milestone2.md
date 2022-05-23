# Design of Optimization on Compiler B Week8 Milestone 2

## A. Test cases / Scenarios

> New features we plan to add for milestone 2

### 1. Liveness Analysis
We are thinking about doing a backward lookup and maintaining a live set for all variables, and potentially count referring instructions for each variable.

**Pseudocode**
```python
1: b: int = 3
2: c: int = 5
3: d: int = 4
4: a: int = 1
5: a = f(b + c)
6: return a
```

**Living Var at each Block**
```python
1: {}
2: b
3: b, c
4: b, c
5: a, b, c
6: a
```

### 2. Eliminate instructions that only affects dead variables

**Before Optimization**
```python
a: int = 1
b: int = 2
a = a + 1
b = b + a
return a
```

**After Optimization**
```python
a: int = 1
b: int = 2
a = a + 1
return a
```

### 3. Constant Propagation

**Before Optimization**
```python
x:int = 100
y:int = 10
y = x + 1
x = x + x
```
**After Optimization**

```python
y:int = 10
y = 100 + 1
x = 100 + 100
```

### 4. Combine Redundant Code

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
e:int = 0
e = x + y
a = 2 * e + 3 * e + 5 * e
```

### 5. Eliminate Redundant Code
**Before Optimization**
```python
x:int = 1
x = x
```

**After Optimization**
```python
x:int = 1
```

## B. Modification on AST and IR
We intent to keep the definition of AST and IR intact, and optimization on AST or IR will be implemented in the manner of AST $\rightarrow$ AST or IR $\rightarrow$ IR.


## C. New changes
We plan to implement the following optimizations in the next sprint: 1. Constant propagation 2. Liveness Analysis. 

Most likely, we will try to use control-flow anlyasis metioned in class for our implementation on constant propagation which indicates that we will implement constant propagtaion in "optimize_ir.ts" first. 

We also plan to implement liveness analysis at `ir` first since the control flow at this level is less complex, but it does not preclude our intention to introduce this analysis at `ast` since removing dead variable at the earlier stage may bring more benefits, and we can exploit more control-flow semantics despite its complexity.

We already observe noticable difference in the optimality of enforcing the same optimization techniques at different levels. For constant folding, if we can merge operations at `ast`, less intermediate variable will be generated compared with applying folding at `ir` level. Although these redundant variables may be eliminated by further propagation and folding at `ir`, wipping the **seed** out at `ast` can definitely simplify the further optimization. 

## D. Test

We plan to add a few global boolean flag variables and more self-defined test cases in the optimization step so that we could test different optimization features separately. Besides, we will also refer to the test cases of other teams to make sure we did not introduce other bugs into compiler B.

## E. Value Rep and Memory Layout
Dynamic optimizations that happen at runtime or may rely on runtime informations are beyond our scope, so we may not introduce new modifications to the runtime environment. Overall, we aim to optimize the program without imposing restrictions or new assumptions on other groups.

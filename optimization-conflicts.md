# Chocopy Compiler B - Optimization Conflicts

## Bignums
This group change the `Literal: num` to typescript `bigint`, which conflicts with our optimization at the ast level since our implementation uses built-in functions that only accept `number` types. E.g, we use `Math.max`, which does not allow `bigint` as inputs, to fold a `max` binary operation. To accomodate this, we would replace all folding operations with generic-fuctions that accept type as the additional information for compatibility.

Fortunately, the class representation of a `bigint` only occurs at the code generation stage, which does not interact with our optimizations on either `ast` or `ir`, otherwise we wont be able to fold any operations as only constant literals are expected when applying the folding.

## Built-in libraries/Modules/FFI
This group eliminates the identity of built-in functions and make all function calls go through the `{tag:call}` logic. This might obfuscate our constant folding pass as currently we rely on explicit awareness of `built-in` calls, in both `ir` and `ast`, to fold the operation. If built-in functions are still considered to be optimizable candidates, we can utilize the exported built-in list to identify foldable operations and call the function by indexing the list. In terms of efficiency and maintainability, we would appreciate it if this group can export a table `builtin_env` that maps the callname to the index/entry within that built-in list. 

## Closures/first class/anonymous functions
The newly added `closure` will result in a `class` at `ast` level after parsing. We can optimize a closure as a normal class with minor modification. The given test-case below
```python
def getAdder(a:int) -> Callable[[int], int]:
    def adder(b: int) -> int:
        return a + b
    return adder
f: Callable[[int], int] = None
f = getAdder(1)
```
will be transformed into a class `Closure1`, where we should be able to propagate `self.a`, `b` and folding the `+` operation with the knowledege that `self.a` is constant. 
```python
class Closure1(Callable[[int], int]):
    a: int = 0
    def __call__(self: Closure1, b: int) -> int:
        return self.a + b
def getAdder(a:int) -> Callable[[int], int]:
    adder: Closure1 = None
    adder = Closure1()
    adder.a = a
    return adder
f: Callable[[int], int] = None
f = getAdder(1)
```
To facilitate this, we may need additional information to indicate that fields inside a **closure** class will not change overtime, which can be injected during the conversion. The same mechanism should be available when implementing the `lambda` functions.

## Comprehensions
As this group stated in their design, their modification on `ast` will be mapped to current `ir` framework, which indicates that our optimization on `ir` will not be affected. We will not support optimization for comprehension at `ast` since the control-flow is more complex at that level. Besides, given that there are a lot of new features to come, our implementation may need significant changes acording to their development in the next milestone.

## Destructuring assignment

When destructuring an assignment, the expression on the left hand side could be affected by constant folding implemented by us. For example,

```python
a, b, c = max(1, 2), min(2, 3), 2+3
```

could be optimized to

```python
a, b, c = 2, 2, 5
```

As a type of statement, destructing could show up in the body of if/while/for/function body, which interact with dead code elimination.

For example, 

```python
def f():
    return 100
    a, b, c = 1, 2, 3

if True:
    pass
    d, e = f(), f()
    pass
```

Could be optimized as,

```python
def f():
    return 100

d, e = f(), f()
```

Despite overlapping, we don't think these features will cause any conflicts, since destructuring does not modify the definition of `expr` or `stmt` inside `ast.ts` and `ir.ts`, but rather adding new tags. To add optimization to destructuring, we only need to add the tags of destructuring assignment inside `optimizeStmt`. In the future, there might also be overlapping after we implemented constant propagation.

## Error reporting

Error reporting team added `SourceLocation` to the `A` tag inside `ast.ts`. There is no overlapping since error reporting team change the code when an error is thrown and our team assume that all of the program to be optimized is totally correct. For example,

```python
a:int = True
if True:
    print(a)
```

This program will never made it to the optimization step, since it will be intercepted and throw an TypeError during type checking. 

With that said, to support printing source code location when throwing an error, the code of our team has integrated the features of `SourceLocation` since last merge.

## Fancy calling conventions

Constant folding could be overlapping with the default values of fancy calling conventions. For example,

```python
def f(x:int = 1 + 2):
    return x
```

Could be optimized as,

```python
def f(x:int = 3):
    return x
```

To support this feature, we need to call `optimizeExpr` to optimize the expression of default values. With that said, the features of this team will not cause conflicts with our implementations of optimization.

## for loops/iterators

The `for` loop team did not modify the original definitions in `ast.ts` and `ir.ts` but rather adding new definitions, so there would be no conflict with our implementation. However, a few overlapping exists for optimization of `for` loops. With our current features, both constant folding and dead code elimination could be added to `for` loops:

```python
for i in range(0, 1+2, 1):
    if True:
        pass
        break
        print(i)
```

The code above could be optimized to

```python
# Constant folding and dead code elimination of if branch
for i in range(0, 3, 1):
    pass
    break
    print(i)
```

Then the code could be further optimized to

```python
# Dead code elimination for pass statement and statements after break statement
for i in range(0, 3, 1):
    break
```

Then the code could be completely removed since it does nothing. These features will require us to expand our optimization features, ideally adding a new function specially for `for` loops. There would be more overlapping after we implement constant propagation.

## Front-end user interface
## Generics and polymorphism
## I/O, files
## Inheritance
## Lists
## Memory management
## Optimization
## Sets and/or tuples and/or dictionaries
## Strings
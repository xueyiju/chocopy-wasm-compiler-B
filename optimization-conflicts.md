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
## Error reporting
## Fancy calling conventions
## for loops/iterators
## Front-end user interface
## Generics and polymorphism
## I/O, files
## Inheritance
## Lists
## Memory management
## Optimization
## Sets and/or tuples and/or dictionaries
## Strings
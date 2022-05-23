# Conflict Evaluation

## 1. Bignums

## 2. Built-in libraries/Modules/FFI


## 3. Closures/first class/anonymous functions

## 4. comprehensions

In `repl.ts`, they appended the source code of buildin classes to the original source code,
and then replace the `source` with `sourceCode` which includes buildin classes.

Since their change will not affect the other part of source code, we can resolve the conflict
by using their modification. 

## 5. Destructuring assignment
Destructuring assignment team mainly changes files in the ast and type checker as well as parsing parts. Below is a typical exapmle of destructuring assignment.
```
def f(x:int)->int:
    return x

a:int = 0
b:int = 0
(a,b) = (5,f(6))

print(a)
print(b)
```
And the changes Destructuring Assignment team made in the Ast, Ir, Type Checker and Parser will not influence front-end functionalities. And the parse error and type error they added can be thrown out to the front-end and be displayed.
## 6. Error reporting

## 7. Fancy calling conventions

## 8. for loops/iterators

## 9. Front-end user interface

## 10. Generics and polymorphism

## 11. I/O, files

Potential conflict may occur in extenstion part in `webpack.config.js`. We add `.js` to resolve
files with `.js` extenstion.

Since supporting more extension will not affect other feature implementation, we can resolve the
conflict by using our modification.

## 12. Inheritance

## 13. Lists

## 14. Memory management

## 15. Optimization

## 16. Sets and/or tuples and/or dictionaries

## 17. Strings

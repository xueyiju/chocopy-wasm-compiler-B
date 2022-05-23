# Conflict Evaluation

## 1. Bignums
For the bignums, they change every number fields in ast and ir to bigint. 

The confict might exist when we want to demonstrate the int fields of an object, we need to use the function `reconstructBigint` to get the number of that fields.

## 2. Built-in libraries/Modules/FFI


## 3. Closures/first class/anonymous functions

## 4. comprehensions

In `repl.ts`, they appended the source code of buildin classes to the original source code,
and then replace the `source` with `sourceCode` which includes buildin classes.

Since their change will not affect the other part of source code, we can resolve the conflict
by using their modification. 

## 5. Destructuring assignment

## 6. Error reporting

## 7. Fancy calling conventions

## 8. for loops/iterators

## 9. Generics and polymorphism

## 10. I/O, files

Potential conflict may occur in extenstion part in `webpack.config.js`. We add `.js` to resolve
files with `.js` extenstion.

Since supporting more extension will not affect other feature implementation, we can resolve the
conflict by using our modification.

## 11. Inheritance
For the inheritance, they add vtable address for each object so the conflict might be when we are printing the fields of an object, we might want to skip the vtable address or add function name on the user interface.

## 12. Lists
In the list design, the length of list will be stored in the first location at the list address. Therefore, when we printed out the list, firstly we will read the length of the list and then determine the length we will read on the heap. But it raise another question, what if list can append element? I am not sure about list future design.  

## 13. Memory management

## 14. Optimization

## 15. Sets and/or tuples and/or dictionaries

## 16. Strings
The string team implment the print function on their own which might lead to some minor conflict. Because out front end move the print function into a new file. To solve that conflict, we can extract out a function abou how to construct a string from wasm int like big num team.

Our major conflicts might lie on the print function in webstart and make all new added object coordinate to each other. 

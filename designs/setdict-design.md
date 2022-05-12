# Set/Tuple/Dictionary: Project Milestone For Week 7

## Test Cases
1. Initialize a set.   
```python
set_1 : set[int] = {1, 2} 
print(set_1)   # should output {1, 2}
```

2. Add a single value to the set.
```python 
set_1 : set[int] = {1}
set_1.add(5)  
print(set_1)   # should output {1, 5}
```

3. Remove a certain value that exists in the set.  
```python 
set_1 : set[int] = {1, 2} 
set_1.remove(1)
print(set_1)   # should output {2}
```

4. Initialize an empty set using the set constructor.
```python
set_1 : set[int] = set() 
print(set_1)    # should output set()
```

5. Add elements to the set. The parameter should be iterable 
```python
set_1 : set[int] = {1, 2} 
set_1.update({3,4})
print(set_1)   # should output {1, 2, 3, 4}
```

6. Add the same element to the set
```python
set_1 : set[int] = {1}
set_1.add(5)  
print(set_1)   # should output {1, 5}
set_1.add(5)
print(set_1)   # should output {1, 5}
```

7. Try to remove non existing element from the set, raise KeyError
```python
set_1 : set[int] = {5, 6}
set_1.remove(2)    # KeyError: key doesn't exist
```

8. Try to add unhashable elements to the set using add(). Raise TypeError.
```python
set_1 : set[int] = {1}
set_1.add({5, 6})   # TypeError: unhashable type "set"
```

9. Try to update the set with non iterable elements. Raise TypeError
```python
set_1 : set[int] = {1, 2} 
set_1.update(3)   # TypeError: 3 is not iterable
```

10. Remove all elements in the set
```python
set_1 : set[int] = {1, 2} 
set_1.clear()
print(set_1)   # should output set()
```


## Changes To AST/IR
AST:
```python
export type Type =
  | { tag: "set", key: Type }
export type Expr<A> =
  | { a?: A, tag: "set", contents: Array<Expr<A>>}
```

No need to update IR for now.

## New Functions/Datatypes
The new datatype Set will be added to the codebase. We will likely need to add a new function in `lower.ts` to handle different method calls of sets (i.e., `update()`, `add()`, `remove()`, `clear()`). 

## Value Representation & Memory Layout
One variable stores the memory address of the set object, and each element in the set will be represented as i32. We will implement the set using a hash table that is represented as a fixed-size array of buckets of hashables. Each bucket will be pointed to a linked list that stores hashables. All hashables in the same bucket share the same hash value that is used to index into the array of buckets. We create a hash function that turns a key into an index and determines which bucket the hashable will go into. The hash function will also be used to determine how many buckets we need to create. 

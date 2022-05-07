# Set/Tuple/Dictionary: Project Milestone For Week 7
For now, we'd like to start with dictionary. The following design document will be based on dictionary, but may be subject to change later.

## Test Cases
1. Initialize the empty dictionary in Chocopy.   
```python
dict_1 : [int, int] = None 
dict_1 = {}
```

2. Store a value in the dictionary given a key.  
```python 
dict_1 : [int, int] = None
dict_1 = {}   
dict_1[1] = 2
```

3. Extract the value from the dictionary given a key that exists in the dictionary.  
```python 
dict_1 : [int, int] = None 
dict_1 = {} 
dict_1[1] = 2   
print(dict_1[1])  # should output 2
```

4. Obtain the type of the dictionary object. 
```python
dict_1 : [int, int] = None 
dict_1 = {} 
print(type(dict_1))  # should output "dict"
```

5. Get the value from the dictionary using the method get(). Return None if doesn't exist.
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2, 3:4})
dict_1.get(1)   # should return 2
dict_1.get(2)   # should return None
```

6. Update the value of an existing key, or create a new key-value pair if key doesn't exist.
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2})
dict_1.update({1:5})
print(dict_1[1])  # should output 5
```

7. Check the type of the dictionary. Return type error if inserting wrong type.
```python
dict_1 : [int, int] = None 
dict_1 = {} 
dict_1[1] = True   # Type Error, should store int value
```

8. Clear the dictionary. Removing all the key-value pairs and return an empty dictionary.
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2})
dict_1.clear()
print(dict_1)  # should output empty dictionary
```

9. Extract all values of the dictionary as a list (requires cooperation with the list team)
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2, 3:4})
dict_1.values()  # should return [2, 4]
```

10. Extract all keys of the dictionary as a list (requires cooperation with the list team)
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2, 3:4})
dict_1.keys()  # should return [1, 3]
```

11. Check if a key exists in the dictionary. Return True if yes, False otherwise.
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2, 3:4})
dict_1.has_key(1)  # should return True
dict_1.has_key(5)  # should return False
```

## Changes To AST/IR
```python
export type Type =
  | { tag: "dict", key: Type, value: Type }
export type Expr<A> =
  | { a?: A, tag: "dict", entries: Array<[Expr<A>, Expr<A>]>}
  | { a?: A, tag: "dict-lookup", name: string, key: Expr<A>}
export type Value =
  | { tag: "dict", key: Type, value: Type}
export type Stmt<A> = 
  | { a?: A, tag: "dict-assign", name: string, key: Expr<A>, value: Expr<A>}
```
It is possible to combine dict-lookup and dict-assign with the work done by the list group, need further discussion and collaboration.

## New Functions/Datatypes
We will likely need to add a new function in `compiler.ts` to handle different method calls of dictionary (i.e., `update()`, `get()`, `keys()`, `values()`, and `has_key()`). We also need to add code to handle the dict-lookup and dict-assign in `traverseExpr` and `traverseStmt` in `parser.ts`, in `tcStmt` and `tcExpr` in `type-check.ts`, and in `codeGenStmt` and `codeGenExpr` in `compiler.ts` mainly. 

## Value Representation & Memory Layout
We represent the dictionary data structure as a built-in "dict" class. There will be several class methods such as `update()`, `get()`, `keys()`, `values()`, and `has_key()`. We will likely implement the dictionary using a hash table to store the key-value pairs of the dictionary. Everytime we initialize a dictionary, we allocate some memory for the hash table. Each time a new key-value pair is inserted, we allocate memory in the hash table for it.

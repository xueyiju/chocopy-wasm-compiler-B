# Set/Tuple/Dictionary: Project Milestone For Week 7
For now, we'd like to start with dictionary. The following design document will be based on dictionary, but may be subject to change later.

## Test Cases
// TODO
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

5. Initialize a dictionary using the dict() constructor.  
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2, 3:4})
```

6. Get the value from the dictionary using the method get(). Return None if doesn't exist.
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2, 3:4})
dict_1.get(1)   # should return 2
dict_1.get(2)   # should return None
```

7. Update the value of an existing key, or create a new key-value pair if key doesn't exist.
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2})
dict_1.update({1:5})
print(dict_1[1])  # should output 5
```

8. Check the type of the dictionary. Return type error if inserting wrong type.
```python
dict_1 : [int, int] = None 
dict_1 = {} 
dict_1[1] = True   # Type Error, should store int value
```

9. Clear the dictionary. Removing all the key-value pairs and return an empty dictionary.
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2})
dict_1.clear()
print(dict_1)  # should output empty dictionary
```

10. Extract all values of the dictionary as a list (requires cooperation with the list team)
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2, 3:4})
dict_1.values()  # should return [2, 4]
```

11. Extract all keys of the dictionary as a list (requires cooperation with the list team)
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2, 3:4})
dict_1.keys()  # should return [1, 3]
```

12. Check if a key exists in the dictionary. Return True if yes, False otherwise.
```python
dict_1 : [int, int] = None 
dict_1 = dict({1:2, 3:4})
dict_1.has_key(1)  # should return True
dict_1.has_key(5)  # should return False
```

## Changes To AST/IR
// TODO

## New Functions/Datatypes
// TODO

## Value Representation & Memory Layout
// TODO

## Test cases for lists


### 1. Create a list with some elements in it

*Input:*
```
a: [int] = None
a = [1, 2, 3]
```
*Output:*
(no output)

---

### 2. Create a list with no elements in it

*Input:*
```
a: [int] = None
a = []
```
*Output:*
(no output)

---

### 3. Access an element in the list

*Input:*
```
a: [int] = None
a = [2, 4, 6, 8]
a[0]
```
*Output:*
```
1
```

---

### 4. Access an element, out of bounds
*Input:*
```
a: [int] = None
a = [2, 4, 6, 8]
a[4]
```
*Output:*
```
Error: Index 4 out of bounds
```

### 5. Access a negative index
*Input:*
```
a: [int] = None
a = [1, 2, 3]
a[-1]
```
*Output:*
```
Error: Index -1 out of bounds
```

### 6. Print a list
*Input:*
```
a: [int] = None
a = [1, 2, 3]
print(a)
```
*Output:*
```
[1, 2, 3]
```

### 7. Store an element at a certain index in the list
*Input:*
```
a: [int] = None
a = [1, 2, 3]
a[0] = 5
print(a)
```
*Output:*
```
[5, 2, 3]
```

### 8. Replace the reference for a list with a new one
*Input:*
```
a: [int] = None
a = [1, 2, 3]
a = [4, 5, 6, 7, 8, 9]
a[4]
```
*Output:*
```
8
```

### 9. Assign an element of the wrong type
*Input:*
```
a: [int] = None
a = [1, 2, 3]
a[2] = True
```
*Output:*
```
Error: Expected type `int`, got type `bool`
```

### 10. Create a list of type bool
*Input:*
```
a: [bool] = None
a = [True]
```
*Output:*
(no output)
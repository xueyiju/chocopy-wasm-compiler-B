## Lists conflicts

### Bignums

### Built-in libraries/Modules/FFI

We may need to coordinate with the built-in libraries group to ensure that they are able to implement functions such as `len([1,2,3,4,5]) => 5` and `print([1,2,3])=> "[1,2,3]"`. This would require an understanding of how we have our lists laid out in memory. It does not seem like we will need to add or change anything about our implementation to make our features work together, but the other group will have to refer to our implementation to understand how to find the elements in the list and how to make a new list.

### Closures/first class/anonymous functions

There is no conflict with this group because they are using classes to represent closures. An instance of a class is represented as an address in memory, and in our implementation, each element in a list of objects would be an address. In a list of closures, each element would also need to be an address. Since "closures are all translated to class definitions and initializations" according to the group's design document, we don't need to add anything additional because we already have this correct functionality in place for classes.

### Comprehensions

Our features would interact in a test case such as `[num * 2 for num in range(5)]`, which should evaluate to `[0, 2, 4, 6, 8]`. Similar to other groups that may be implementing something that involves lists, this group would need to understand the way we represent lists in memory so that they can create lists and modify to values of the elements in the list.

### Destructuring assignment

*Input:*
```
a: int = 0
b: int = 0
c: int = 0

a, b, c = [0, 1, 2]

print(a)
print(b)
print(c)
```

*Expected output:* 
```
0
1
2
```

For a test case like the one above, it may be helpful to know the length of the list on the right-hand side of `=`. We have the length of the list stored as metadata in memory, so the comprehensions group could look at our design document to figure out how to get the length of a list. Our group would not need to make any changes.

### Error reporting

### Fancy calling conventions

### for loops/iterators

### Front-end user interface

### Generics and polymorphism

### I/O + files

### Inheritance

### Memory management

Based on the memory management group's test cases, there will not really be any conflicts. There are test cases to check how many references were created. If we created a list `[0, 1, 2]`, only 1 reference is created, which is what is expected. One thing we might want to add later on, depending on how our group chooses to implement things like `append()` and `remove()`, we may need to allocate new memory. So we may want to work with the memory management group on that.

### Optimization

### Sets and/or tuples and/or dictionaries

### Strings

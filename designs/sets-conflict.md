# Set/Tuple/Dictionary: Merges and Planning

## Week 8 Update
Read the other features’ pull requests for your compiler, and for each of them, either:

Describe in a few sentences why your feature and that feature don’t really interact much. Give an example of a program that showcases your feature and theirs without interacting, and justify why it’s representative (that is, why there isn’t some other interesting interaction between your features)

Identify a place where your features overlap and will need more implementation to make them work together. This might be an opportunity for cool new stuff, or something that’s broken.
Describe it with a representatitve test case/scenario. This could be a Python program that will have an issue and crash the compiler because the two features were combined, or a novel combination of features that need good behavior. It could also be a UI interaction, a reason libraries won’t work well together, etc.
Describe what changes you think are needed to make these features work together: What should the new expected output be? What new additions to the compiler are needed to make them work together? Does their design need to change a bit, or does yours? How? Treat this like the first
### Compiler B: Bignums
There is overlap between our group's implementation and bignums.
We need to store the big integer into the set. Our group have 
gone through their implementation, they store the big num as a 
built-in new class. So when our code is doing typechecking, we 
need to allow the big int value to be passed at that time. 

To be detailed, the most possible test case would be like:
```python
set_1 : set[int] = None
set_1 = {999999999999999999999999999999999999999999999999,
99999999999999999999999999999999999999999999998}
set_1.add(99999999999999999999999999999999999999999999997)
print(len(set_1)) # output 3
```

Above would be the simplest example testing on the big integer value.
Recalling back from their design, each time we find that we create a
big int, it is still an integer type. So for our code, when we add a
new integer value, we would first check if it is a big num value in the 
parser. When typechecking, we should allow the set[int] maintain a big
integer value. 

Meanwhile, there should be another testing example:
```python
set_1 : set[int] = None
set_1 = {1,
99999999999999999999999999999999999999999999998}
set_1.add(99999999999999999999999999999999999999999999997)
print(len(set_1)) # output 3
```
In this design, we suppose the big int value should be compatible with 
the small integer value. For our code implementation, we are able to 
store both of the value into the set[int]. Our group recognize this case
does not require us to do further amendment on our code if we complete the
case above. It would be a compatibility problem for big int group.
### Compiler B: Built-in libraries/Modules/FFI
Our group think their work has some overlaps with our feature. They support 
factorial, max, pow, randint, randrange, time, LCM, GCD, combination and perm. 
Most of these functions have no relationship with us, however, max/min operations
can be done on the set.
```python
set_1 : set[int] = None
set_1 = {1,2,3}
a: int = 0
a = max(set_1)
print(a) # output 3
b: int = 2
b = min(set_1)
print(b) # output 1
```
So max and min function can be done on the set[int]. Actually, if the data type
in the set is comparable, then the max and min function should be callable. For 
our implementation, we should go through the whole set to find out the maximum
value in it. When typechecking, if it is calling max/min on a non-comparable data
type, it should report an error. To be honest, we need to find out how to implement
them. As the max function is almost implemented by their group, we need to find out
how to use their code on the set. The details need to be determined after enough discussions.

### Compiler B: Closures/first class/anonymous functions
In this section, after going through their design.md. Our group supposes the closure
has no relationship with the set. The closure do operations on different function type.
They do no operations on the set type.
```python
a: int = 10
f: Callable[[int], int] = None
f = getAdder(1) 
f(2) 
```

Recalling their example, set does not need to support such kind of operation. So our
group may do not need to have any interactions with them.

### Compiler B: comprehensions

After going through their pull request, our group find out that their implementation is
not completed at this moment. However, they have listed the potential interaction with 
our group. I would give examples here:
```python
print({3 for _ in range(5)}) # output {3}
```

```python
print({3 if val % 3 == 0 else (2 if val % 2 == 0 else 1) for val in range(8)})
# output {1, 2, 3}
```

As our group only implements the set here, these are the cases our group would focus on more. 
Generally speaking, there would be no big adjustment on our code. We would have further
discussion after communicating with them after their completion.
### Compiler B: Destructuring assignment
Currently speaking, their group has no overlap with our work. They only support operations
on the built-in type such as int. In the future, as set is unordered, so there may be only
very simple overlap between us. We would give out some examples here:

```python
a:set[int] = None
b:set[int] = None
a = {1, 2, 3}
b = {2, 3, 4}
(a, b) = (b, a)
```

Because the set is unordered, so change the order inside a set is meaningless. Our group
thinks the case above would be the only one meaningful when testing. Our group wonder
if such kind of swap would be supported in the following version, if so, we would 
concentrate on supporting the example here. For our code, I think our implementation 
does need to be changed. For them, the key part is to determine whether the rhs can contain
the id.

### Compiler B: String
Our task overlap with the string group because string should be able to be stored in a set. In a set, two strings with exact same characters in the same postions should be considered same elements. Therefore, we might need a method to compare two strings when adding it to the set. 
A case is:
```python
set_1 : set[string] = None
set_1 = {"hello world"} #the set stores one string "hello world"
set_1.add("hi") #the set stores two strings "hello world" and "hi"
set_1.add("hello world") #the set still stores two strings "hello world" and "hi", it needs to compare the new "hello world" with the previous one and "hi" and get the results that the first comparation is same and the second is not. 
```

When storing the string in the set, we need the information of how long the string is in order to leave enough space for properly storing the string.
The above are the main overlap of our task with string group. 

### Compiler B: Optimization
our task does not overlap with the task of optimization group. How does the optimization work is to find out which line of code can be executed, which which cannot be reached. Therefore, in order to realize their goal, whether the code involves a set operation is not important. 
An example is:
```python
# 1
if True:
  set_1.add(1)
else:
  set_1.add(2)
  
# 2
if True:
  a = 1
else:
  a = 2
```
In the two examples, the optimization tool should eliminate the else line regardless of whether the operation is an set operation or an int operation. The optimization tool will only decide to eliminate according to the if statement condition.

### Compiler B: List
Set and List will overlap when we try to update the set with a list.
For instance: 
```python
set_1 : set[int] = None
set_1 = set()
set_1.update([1,2,3,1])
```
In the case above, we needs to identify the list inside udpate method and iterate through the elements in the list, find the duplicated elements to eliminate and store the uniqe elements. 
Even though there is overlap between our groups. There is not much sychornizations needed, as long as the list group can do the proper list type check to make sure the elements in a list are of the same type. The other process of updating with list should be done when compiling the set.udpate funciton.


### Compiler B: I/O, files
The work of I/O group does not overlap with our group's work. Because set does not involve in the I/O operation, the read file content will not be stored in set. And After reading the design description, we found that there is not similar expression with I/O group and our set group.
From the design doc, all the operations invloved in I/O and File functions are:
```python
f : File = None
f = open('test', 'wb')
f.read()
f.write(...)
f.close()
```
None of the above lines of code includes set.

### Compiler B: Inheritance
Inheritance has no connection with set. Inheritance is the feature of class. However, set does not belong to class in Python. Therefore, inheritance group does not need to consider how set is implemented, neither set group doesn't have to interact with the inheritance feature. 
Below is a basic inheritance operation:
```python
class A(object):
    x : int = 1
    def foo(self : A):
        print(self.x)

class B(A):
    def foo2(self : B):
        print(self.x * 2)
```
One has to define class to take use of inheritance. Hence, set is not one of the cases involved in inheritance. 

### Compiler B: Memory management
Our project has no conflict with memory management.

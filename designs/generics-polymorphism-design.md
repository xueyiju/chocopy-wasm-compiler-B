# Test cases we plan to pass:

1. Test compiling a simple inheritance hierarchy
The following should compile without errors:
```
class List(object):
    def sum(self: List) -> int:
        return 1 / 0

class Empty(List):
    def sum(self: Empty) -> int:
        return 0

class Link(List):
    val: int
    next: List

    def sum(self: Link) -> int:
        return self.val + self.next.sum()

    def new(self, val: int, next: List):
        self.val = val
        self.next = next
```

2. Test improper override with wrong return type
The following should compile with errors:
```
class List(object):
    def sum(self: List) -> int:
        return 1 / 0

class Empty(List):
    def sum(self: Empty) -> int:
        return 0

class Link(List):
    val: int
    next: List

    def sum(self: Link) -> bool: # TYPE ERROR here: Return type differs from parent's when overriding this method
        return self.val + self.next.sum()

    def new(self, val: int, next: List): 
        self.val = val
        self.next = next
```

3. Test improper override with wrong type for self
The following should compile with errors
```
class List(object):
    def sum(self: List) -> int:
        return 1 / 0

class Empty(List):
    def sum(self: List) -> int: # TYPE ERROR here: type of self should be Empty when overriding this method
        return 0
```

4. Test calling method that was not overriden. 
The following should print 0:
```
class Animal(object):
    def id(self: Animal) -> int:
        return 0

class Dog(Animal):
    pass

dog: Dog = None
dog = Dog()
print(dog.id())
```

5. Test calling nonexistent method on parent type
The following should give a compiler error:
```
class Animal(object):
    pass

class Dog(Animal):
    def id(self: Animal) -> int:
        return 0

dog: Animal = None
dog = Dog()
print(dog.id()) # compiler error here: dog is of type animal which does not have the method id()
```

6. Test assigning parent object to child type
The following should give a compiler error:
```
class Animal(object):
    pass

class Dog(Animal):
    pass

dog: Dog = Animal() # TYPE ERROR here: Animal cannot be assigned to object of type Dog
```

7. Test calling polymorphic methods
The following should print 1, then 2
```
class Base(object):
    def id(self: Base) -> int:
        return 0

class A(Base):
    def id(self: A) -> int:
        return 1

class B(Base):
    def id(self: B) -> int:
        return 2

obj_1: Base = None
obj_2: Base = None

obj_1 = A()
obj_2 = B()

print(obj_1.id())
print(obj_2.id())
```

8. Test passing generic objects to functions
The following should print 1
```
class Base(object):
    def id(self: Base) -> int:
        return 0

class A(Base):
    def id(self: A) -> int:
        return 1

def print_id(obj: Base):
    print(obj.id())

tmp: A = None
tmp = A()
print_id(tmp)
```

9. Test generic object members
The following should print 1, then 2
```
class Base(object):
    def id(self: Base) -> int:
        return 0

class A(Base):
    def id(self: A) -> int:
        return 1

class B(Base):
    def id(self: B) -> int:
        return 2

class Pair(object):
    first: Base
    second: Base
    def new(self: Pair, first: Base, second: Base) -> Pair:
        self.first = first
        self.second = second
        return self

    def print(self: Pair):
        print(self.first)
        print(self.second)   

tmp: Pair = None
tmp = Pair().new(A(), B())
tmp.print()
```

10. Test recursive polymorphic method call.
The following should print 18:
```
class List(object):
    def sum(self: List) -> int:
        return 1 / 0

class Empty(List):
    def sum(self: Empty) -> int:
        return 0

class Link(List):
    val: int
    next: List

    def sum(self: Link) -> int:
        return self.val + self.next.sum()

    def new(self, val: int, next: List):
        self.val = val
        self.next = next

l: List = None
l = Link().new(5, Link().new(13, Empty()))
print(l.sum())
```

# Planned additions to the AST
We plan to change the Class type to optionally include the parent name
```
export type Class<A> = { a?: A, name: string, parent: string, fields: Array<VarInit<A>>, methods: Array<FunDef<A>>}
```

We plan to differentiate between a call and call_indirect in the codegen pass, so we don't plan on making any other changes to the AST or IR representation.

# Other additions to the codebase
Most of our work will be in compiler.ts, where we plan to write code to generate the vtable and perform the indirect method calls.
We will also do some work in type-check.ts to do basic type checking for polymorphic method calls.

# Changes to the runtime memory layout
We plan to make two changes to the runtime memory layout:
1. Add a function table of all overriden methods at the top of the program, organized by class.
2. Add an extra hidden field to the end of all objects that override their parent's methods. This field will be a simple integer that stores this object's offset into the indirect dispatch function table.


# For Loops and Iterators #
## Test Cases ##

We shall join the following code at the start of each input:

```
class __range__(object):
    start: int = 0
    stop: int = 0
    step: int = 1
    hasNext: bool = False
    currval: int = 0
    def __init__(self: __range__):
        pass
    def new(self: __range__, start: int, stop: int, step: int) -> __range__:
        self.start = start
        self.stop = stop
        self.step = step
        self.currval = start
        return self

    def next(self: __range__) -> int:
        prev: int = 0
        nextval: int = 0
        if(self.hasnext()):
            prev = self.currval
            nextval = prev+self.step
            self.currval = nextval
            return prev
        
    def hasnext(self: __range__) -> bool:
        nextval: int = 0
        nextval = self.currval
        if((self.step>0 and nextval<self.stop) or (self.step<0 and nextval>self.stop)):
            self.hasNext = True
        else:
            self.hasNext = False
        return self.hasNext

def range(start: int, stop: int, step: int) -> __range__:
    return __range__().new(start, stop, step)
```

* **Test Case 1**: for loop with range
 
Input:
```
i: int = 0
for i in range(0,10,2):
    print(i)
```
Output:
```
0
2
4
6
8
```
* **Test Case 2**: for loop with range: called inside a fucntion with function parameters
 
Input:
```
def f(x: int, y: int):
    i: int = 0
    for i in range(x*1,y*1,1*2*abs(1)):
        print(i)
f(0,10)
```
Output:
```
0
2
4
6
8
```
 
* **Test Case 3**: for loop with range: negative step
Input:
```
i: int = 0
for i in range(0,-10,-2):
    print(i)
```
Output:
```
0
-2
-4
-6
-8
```

* **Test Case 4**: for loop with break in the main for loop body
 
Input:
```
i : int = 0
for i in range(10):
    print(i)
    break
```
Output:
```
0
```
* **Test Case 5**:  for loop with break inside a if body
 
Input:
```
i : int = 0
for i in range(10):
    If i\>5:
        break
    else: 
        print(i)
```
Output:
```
0
1
2
3
4
5
```
 
* **Test Case 6**:  for loop with continue inside the main for body
 
Input:
```
i : int = 0
for i in range(5):
    print(i*100)
    continue
    print(i)
```
Output:
```
0
100
200
300
400
```
 
* **Test Case 7**:  for loop with continue inside a if body
 
Input:
```
i : int = 0
for i in range(10):
    if i%2==0:
        continue
    else:
        print(i)
```
Output:
```
1
3
5
7
9
```

* **Test Case 8**:  range: nested for loop with break
 
Input:
```
i: int = 0
j:int = 0
for i in range(0,5,1):
    print(i)
    for j in range(0,2,1):
        print(j) 
    break   
```
Output:
```
0
0
1
```

* **Test Case 9**: range: complex break, continue 1
 
Input:
```
i: int = 0
j:int = 0
for i in range(0,5,1):
    j = 0
    print(i)
    while(j<i):
        print(j) 
        j=j+1
        if j%2==0:
            continue
    break   
```
Output:
```
0
```

* **Test Case 10**:  range: complex break, continue 2
 
Input:
```
i: int = 0
j:int = 0
for i in range(0,5,1):
    j = 0
    print(i)
    while(j<i):
        print(j) 
        j=j+1
        if i%2==0:
            continue
    if i%2==1:
        continue  
```
Output:
```
0
1
0
2
0
1
3
0
1
2
4
0
1
2
3
```

* **Test Case 11**:   range: complex break, continue 3
 
Input:
```
i: int = 0
j:int = 0
k: int =0
for i in range(0,5,1):
    j = 0
    print(i)
    while(j<i):
        print(j) 
        j=j+1
        if i%2==0:
            continue
        else:
        	pass
        for k in range(100,0,-10):
            if k%30==0:
                print(k)
                continue
            else:
            	pass
    if i%2==1:
        continue 
```
Output:
```
0
1
0
90
60
30
2
0
1
3
0
90
60
30
1
90
60
30
2
90
60
30
4
0
1
2
3
```

* **Test Case 12**:   range: complex break, continue 4
 
Input:
```
i: int = 0
j:int = 0
k: int =0
for i in range(0,5,1):
    j = 0
    print(i)
    while(j<i):
        print(j) 
        j=j+1
        if i%2==0:
            continue
        else:
        	pass
        for k in range(100,0,-10):
            if k%30==0:
                print(k)
                break
            else:
            	pass
    if i%2==1:
        continue  
```
Output:
```
0
1
0
90
2
0
1
3
0
90
1
90
2
90
4
0
1
2
3
```

* **Test Case 13**:   range: complex break, continue 5
 
Input:
```
i: int = 0
j:int  = 0
k: int = 0 
for i in range(10, -10, -1):
    for j in range(1, 5, 1):
        for k in range(1, 5, 2):
            if(i + j + k == 0):
                print(i)
                print(j)
                print(k)
                break
            else:
                continue
        if(i + j + k == 0):
            break
        else:
            continue
    if(i + j + k == 0):
        break
    else:
        continue
```
Output:
```
-2
1
1
```
 
* **Test Case 14**: for else construct 1
 
Input:
```
i : int = 0
for i in range(10, 0, -1):
    if i < 5:
        break
    else:
        print(i)
else:
    print(123456)
```
Output:
```
10
9
8
7
6
5
```

* **Test Case 15**: for else construct 2
 
Input:
```
i : int = 0
for i in range(10, 5, -1):
    if i < 5:
        break
    else:
        print(i)
else:
    print(123456)
```
Output:
```
10
9
8
7
6
123456
```
* **Test Case 16**: Custom Iterator 1
 
Input:
```
class EvenNumbers(object):
    num:int = 0
    def __init__(self: EvenNumbers):
        pass
    def next(self: EvenNumbers) -> int:
        ret: int  = 0 
        ret = self.num
        self.num = self.num + 2
        return ret
    def hasnext(self: EvenNumbers) -> bool:
        if self.num > 10:
            return False
        else:
            return True

i: int = 0
for i in EvenNumbers():
    print(i)
```
Output:
```
0
2
4
6
8
10
```
* **Test Case 17**:  Custom Iterator called range
 
Input:
```
class range(object):
  num:int = 1
  def __init__(self: range):
      pass
  def next(self: range) -> int:
      ret: int  = 0 
      ret = self.num
      self.num = self.num * 2
      return ret
  def hasnext(self: range) -> bool:
      if self.num > 16:
          return False
      else:
          return True

i: int = 0
for i in range():
  print(i)

```
Output:
```
1
2
4
8
16
```
* **Test Case 18**: Custom bool iterator
 
Input:
```
class BoolIterable(object):
    val:bool = True
    num:int = 0
    def __init__(self: BoolIterable):
        pass
    def next(self: BoolIterable) -> bool:
        ret: bool = True
        ret = self.val
        self.num = self.num + 1
        self.val = not self.val
        return ret
    def hasnext(self: BoolIterable) -> bool:
        if self.num > 5:
            return False
        else:
            return True

i: bool = True
for i in BoolIterable():
    print(i)
```
Output:
```
True
False
True
False
True
False
```

* **Test Case 19**: type checking for loop variable 1
 
Input:
```
i : bool = False
for i in range(10):
    print(i)
```
Output:
```
TypeCheckError: bool object cannot be interpreted as integer
```

* **Test Case 20**: type checking for loop variable 2
 
Input:
```
for i in range(10):
    print(i)
```
Output:
```
TypeCheckError: Unbound id: i
```

* **Test Case 21**: range: type checking for one parameter
 
Input:
```
i: int = 0
for i in range(5):
    print(i)
```
Output:
```
TypeError: range expected 3 arguments, got 1
```

* **Test Case 22**: range: type checking for two parameters
 
Input:
```
i: int = 0
for i in range(5,10):
    print(i)
```
Output:
```
TypeError: range expected 3 arguments, got 2
```

* **Test Case 23**: range: type checking for range parameters
 
Input:
```
i : int = 0
for i in range(10, 20, 1, 1):
    print(i)
```
Output:
```
TypeError: range expected 3 arguments, got 4
```

* **Test Case 24**: Type Checking: not an iterator 1
 
Input:
```
class range(object):
    num:int = 1
    def __init__(self: range):
        pass
    def hasnext(self: range) -> bool:
        if self.num > 16:
            return False
        else:
            return True

i: int = 0
for i in range():
    print(i)
```
Output:
```
TypeCheckError: Not an iterable
```

* **Test Case 25**: Type Checking: not an iterator 2
 
Input:
```
class range(object):
    num:int = 1
    def __init__(self: range):
        pass
    def next(self: range) -> int:
        ret: int  = 0 
        ret = self.num
        self.num = self.num * 2
        return ret
i: int = 0
for i in range():
    print(i)  
```
Output:
```
TypeCheckError: Not an iterable
```

## Changes required in AST, IR and builtin libraries ##
 
* The following changes will be required in ast.ts:
 
    * In type Stmt\<A\>:
        * { a?: Type, tag: "for", vars: Expr\<A\>, iterable: Expr\<A\>, body: Array\<Stmt\<A\>\>, elseBody?: Stmt\<A\>}
        * { a?: Type, tag: "break", loopDepth: [string, number] }
        * { a?: Type, tag: "continue", loopDepth: [string, number]  }
        * { a?: A, tag: "construct", name: string, arguments?: Array<Expr<A>> } : we added an optional parameter here called arguments to make a parameterized constructor call work


* We shall not need any changes in ir.ts, since for, break and continue are control flow statements, and ifjmp and jmp in ir.ts cover the behavior that we need to implement these.
 
* We shall need changes in the builtin libraries. We will need to add all the built-in methods described below, we shall do that in a new file called range.wat in the stdlib folder, similar to memory.wat

* Type checking for statement: the iterable must have their class name as one of the six sequence types in python (https://techvidvan.com/tutorials/python-sequences/#:~:text=In%20Python%20programming%2C%20sequences%20are,byte%20arrays%2C%20and%20range%20objects)


* Since, we are implementing the for statement for the range object this week, we shall typecheck that the iterable must be a range object. Given this arrangement we shall check that vars must be a single variable of type int.

## Adding new functions, datatypes, or files to the codebase ##

### Changes to type-check.ts ###
We will add a "built-in" class in the global typechecking environment called range with the following specifications:

defaultGlobalClasses:

class name: range
fields: 
```start: int
stop: int
step: int
hasnext: bool
currvalue: int
```
methods: 
```__init__(self, param1, param2, param3) -> range object
index(self, param) -> int
__hasnext__(self) -> bool
__next__(self) -> int
```
 
Further, we added the following to the LocalTypeEnv to correctly use break and continue statements:
* forCount (number): to keep a count of the for loops used
* whileCount (number): to keep a count of the while loops used
* currLoop (Array<[string, number]>): a stack which stores the loop type (for or while) and its respective count

### Changes to webstart.ts and import-object.test.ts ###
Added the following to the importObject:
* imports: check_range_error : this is for typechecking the third argument to prevent infinite loops
* imports: check_range_index : this is for the inbuilt range.index() function
* rangelib: to import the entire range module from range.wasm (created from range.wat)

### Changes to runner.ts ###
Added the imports of the inbuilt range functions from the rangelib as well as the check_range_error function

### Changes to parser.ts and lower.ts ###

We added the functionalities for for, break and continue statements.

### New file range.test.ts

This contains all the tests shown above.

For new files: We will need to add all the built-in methods described below, we shall do that in a new file called range.wat in the stdlib folder, similar to memory.wat
 
## Description of the value representation and memory layout for any new runtime values added ##
 
The following represents the memory layout for adding a "range value" whenever a call to range is made. Each block is 4 bytes.
 
|    start    |     stop    |     step    |   hasnext  |   currvalue   |
| ----------- | ----------- | ----------- | ----------- | ----------------- |
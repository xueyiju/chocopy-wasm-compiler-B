# For Loops and Iterators #
## Test Cases ##

We shall concatenate the following code at the start of each input:

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
for i in range(0,10,1):
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
for i in range(0,10,1):
    If i>5:
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
for i in range(0,5,1):
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
for i in range(0,10,1):
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
 
## AST changes ##
 
* The following changes will be required in `ast.ts` to `type Stmt<A>`:
```        
{ a?: Type, tag: "for", vars: Expr\<A\>, iterable: Expr\<A\>, body: Array\<Stmt\<A\>\>, elseBody?: Stmt\<A\>}
{ a?: Type, tag: "break", loopDepth?: [string, number] }
{ a?: Type, tag: "continue", loopDepth?: [string, number]  }
 ```    
`vars` can be a variable or a tuple expression. Once we merge the changes from the destructuring group, we will support tuple assignment for the loop variables (as well as relevant typechecking).
`iterable` can be any inbuilt/user-defined class object with a `next` and a `hasnext` function.
`loopDepth` is an optional argument in the AST because we populate these values in the type-checker.

## Parser changes ##
We add functionalities for `for`, `break` and `continue` statements.

## range class ##
For the first milestone, we implement an inbuilt `range(0, 5, 1)` as a function which returns a `__range__` class object. This object is an iterable with an inbuilt `new`, `next` and `hasnext` function. The range class is written in Python and will be compiled in `runner.ts` to produce a `.wasm` file in the later stages.
```
def range(start: int, stop: int, step: int) -> __range__:
    return __range__().new(start, stop, step)
```
Note that users can create a custom `range` iterator as well.

## Type-check changes ##
We will add a "built-in" class in the global typechecking environment (`defaultGlobalClasses`) called `__range__` with the following specifications:

**Fields**: 
```
start: int
stop: int
step: int
hasnext: bool
currvalue: int
```
**Methods**: 
```
__init__(self, param1, param2, param3)
new(self, param) -> int
__hasnext__(self) -> bool
__next__(self) -> int
```
There is also the aforementioned `range` function added in `defaultGlobalFunctions`. Our current implementation doesn't require adding this inbuilt class and function to the  global type-checking environment. But it will be required once we generate a `range.wasm` file from the  Python implementation.

We add `forCount`, `whileCount` and  `currLoop` to the `LocalTypeEnv`.  `forCount`, `whileCount` store the global for and while loop counters. `currLoop` behaves as a stack and populates `loopDepth` for break and continue statements. 

```
locals.currLoop.push(["for",locals.forCount]);
var tForBody = tcBlock(env, locals, stmt.body);
locals.currLoop.pop();
```

## Lower changes ##
We implement a generalizable for loop which can take any iterable and uses the `next` and `hasnext` function to go over the each element. We generate a new `rangeObject` which initializes the iterable class object. We call the `hasnext` function in `forstart` body, assign the loop variables to `next` function in start of `forbody`. There is an additional block of `forelse` which we jump to when there are no breaks encountered in the body statements.  

We  use `loopDepth` to label `break` and `continue` statements with a unique loop index. Accordingly, we jump to `forend` and `forstart` blocks of the specific loop index for break and contine respectively. 

## IR changes ##
We don't need any changes in ir.ts, since for, break and continue are control flow statements, and ifjmp and jmp in ir.ts cover the behavior that we need to implement these.

## Code Gen changes ##
No changes in the code generation are required for our interface,

### New file range.test.ts
This contains all the tests shown above.
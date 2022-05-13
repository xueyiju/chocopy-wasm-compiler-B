# 10 Test Cases

Sadly, all we can do right now are simply math functions. Other builtin functions, like reduce, map and filter, are related to the implmentation of iterable Object, Generics and polymorphism. So maybe we will write these high level functions later.

### Factorial

input: 
c : int = 4
print(factorial(c))
Output: 
24

### Max

input: 
c : int = 3
d: int = 2
print(max(factorial(c), factorial(d)))
Output: 
6

### Pow

input: 
c : int = 3
d: int = 2
print(pow(c, d))
Output: 
9

### Randint

input: 
a : int = 0
b : int = 5
print(randint(a,b))
Output: 
A random integer between 0 and 5

### Randrange

input: 
a : int = 0
b: int = 101
print(randrange(0, 101, 2))
Output: 
A random even integer from 0 to 100

### Time

input: 
print(time())
Output: 
1436428326(the current time stamp)

### LCM (least common multiple)

input: 
1
Output: 
12
15
8

### GCD (greatest common divisor)

input: 
print(gcd(4,6))
print(gcd(3,5))
print(gcd(2,8))
Output: 
2
1
2

### Combination

input: 
print(comb(4,2))
print(comb(10,3))
print(comb(20,5))
Output: 
6
120
15504

### Perm

input: 
print(perm(4,2))
print(perm(10,3))
print(perm(20,5))
Output: 
12
720
1860480

# AST/IR changes to make

Since we will have to high-level functions, we suggest to add another basic type function like below in ast.ts

Type = 

​	|... 

​	| {

​		tag: "function",

​		params: Type[],

​		ret: Type,

​	}

# New functions and datatypes

Adding the function type to our compiler would help our team to build high-level functions like map and reduce.

Also we would like to add some import functions as we mentioned in the first section.

factorial :: int -> int

pow :: int -> int -> int

randint :: int -> int -> int

randrange :: int -> int -> int -> int

time :: () -> int

lcm :: int -> int -> int

gcd :: int -> int -> int

comb :: int -> int -> int

perm :: int -> int -> int

# Value representation and memory layout

we think a better way to represent functions is to place them all, including methods and functions, into the v table. And a function     is just a int32 variable in wasm indicating the its index in vtable. In this way, we can treat functions just like any other variables, so we can write high-level functions like map and reduce.

A rough thinking is to do this step in lower.ts/lowerFunDef. When we define a function, we actually do the following thing

from 

def f(x:int)->int

​	xxx

to 

1. Add a new function to vtable, the name can be like this $$function{# of function index} so it won't affect the user name space
2. assign f, which is of type {tag:"function", params: [int], ret: int}, with the function index in vtable.

$$FunDef { name = $$function{index of function}, ...}

f = Value{ tag:"number", value = {index of function}}






# Conflicts

## Bignums

It overlaps with our team's implementation.

For example:

```python
print(1)
```

Since in bigness team every number is stored in heap, our implementation needs two extra steps in our implementation: 

	1. decode numbers on the heap to a bigint in JS.
	1. encode the computed result and return it.

And also, since now numbers are on the heap, we can nolonger use i32.add/i32.minus/..., instead we need to introduce several basic builtin function like add and minus in JS which can handle the encode and decode logic.

## Closures/first class/anonymous functions

Right now there are no conflicts here, since our implmentation now only focus on basic functions like math, time and sleep. 

But in future, we might introduce map/reduce, which is highly related to this group.

## Comprehensions

There are no conflicts here, since we now only focus on basic functions like math, time and sleep. But in the future, we might give some fancy built-in functions about comprehension.

For example

```python
<expr> for <name> in <iterable-expr> [if <expr>]?
```

Any built-in functions are just like any other functions. In principle, there is no intersection here.

## Destructuring assignment

There are no conflicts here, since we now only focus on basic functions like math, time and sleep.

For example:

```python
a:int = 0
b:int = 0
a, b = max(5,6), 10
```

In here, the builtin function max just return a value like any other functions.
# Frontend Design

## Week 6 Front End Design

### 1. Change the Code input box of compiler side

The input box is slightly out of screen and the result will show on the side of interaction mode.
What we try to implement here is to move result to the bottom of compiler mode and make sure they can shown on the same page. The size of box will keep unchanged and we can scoll inside the box.

### 2. The input box of interaction mode remains center

Right now, the box of interaction will add to the bottom of all the input boxes and dispear if user doesn't scoll down. We can keep the the last one box still seen to users when users doesn't operate.

### 3. Make adjustment of proportion of two mode on Web page

The compiler sides will need more space. We will also try to adjust the layout and elements to make it more beautiful. Refer to the design method of VS Code and Jupyter Notebook.

### 4. The size of input box of interation mode remains the same

The input boxes of interaction mode can change to different size. We want to keep them in same size.

### 5. Show the number of code line on the compiler side

It is important to display line numbers on the right side of the code editing area. This helps us understand the code and locate errors. We will add line numbers to the edit area on the comiler side. This could be an element that changes dynamically with the input text.

### 6. Show all kinds of error and correct results properly

Try to run different source code on the page to make sure the website displays the correct results.  
In the same way, use the features' testcases written by each group, try to input different error source codes, trigger the parse error, type error and runtime error, to make sure that our front-end page displays the results correctly and beautifully.

### 7. print all the fields in an object properly

In interaction mode, whenever we instantiate a class, we want to be able to let the user to monitor the current objects and the fields in that objects like the IDE's debugger. This can be achieved by analyzing the current AST and searching the heap.

### 8. Display the space that heap have used

It may need information from the memorry management team.

We can access the memory in the module through `WebAssembly.Memory`, where `Memory.prototype.buffer` is an `ArrayBuffer` with the contents of linear memory. Also, the WebAssembly call stack is not stored in memory, and is not accessible, so the stack of called functions and their locals can not be displayed.

### 9. Show the global variable of wasm

The global variable seems can be get from

```javascript
Object.keys(instance.instance.exports).forEach(k => {
      console.log("Consider key ", k);
      const maybeGlobal = instance.instance.exports[k];
      if(maybeGlobal instanceof WebAssembly.Global) {
        currentGlobals[k] = maybeGlobal;
      }
    });
```

### 10. highlight the code

This can be done step by step:

- Modify Application Code `webstart.ts`

- Add packages in `package.json`

- Modify `webpack.congfig.js`

We probably will refer to [CodeMirror](https://codemirror.net/) as our code editer JS library.

## Week 7 Update

### Done

This week, we took a deep dive into the existing implementation and learned the front-end interface from scratch. On the one hand, we fixed the obejct display bug in the original code, and on the other hand, we completed most of the tasks committed last week.

- Fixed existing front-end bugs, refactored some render codes, and created an outputrender.ts to display the results of repl.
- Tested to make sure the frontend can display all kinds of error and correct results properly.
- Significantly refined the layout, making the buttons more intuitive and the interaction mode more beautiful.
- Implemented code highlighting and line number display through the CodeMirror library.
- Introduced new design, save and load functions that allow users to run and save scripts locally.
- Implemented heap tracking and printing all current object and its fields, showing with the accordion effect.

You could try this script to see our implement.

```Python
class C(object):
    x:int = 0

c:C = None
c = C()
c
```

### Plan

- Print current heap status. In our code, the heap value can already be read as console.log, however, it is necessary to discuss with the memory management team to further determine the best solution for displaying the heap.
- Introduce Cypress to automate front-end testing.
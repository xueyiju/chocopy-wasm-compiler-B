# First Week of Front End Design

## 1. Change the Code input box of compiler side

## 2. The input box of interaction mode remains center

## 3. Make adjustment of proportion of two mode on Web page

## 4. The size of input box of interation mode remains the same

## 5. Show the number of code line on the compiler side

## 6. Show all kinds of error properly

## 7. print all the fields in an object properly 

## 8. Display the space that heap have used

It may need information from the memorry management team.

## 9. Show the global variable of wasm

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
## 10. highlight the code

This can be done step by step:

- Modify Application Code `webstart.ts`

- Add packages in `package.json`

- Modify `webpack.congfig.js`


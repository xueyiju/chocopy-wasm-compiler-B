# First Week of Front End Design

## 1. Change the Code input box of compiler side

The input box is slightly out of screen and the result will show on the side of interaction mode.
What we try to implement here is to move result to the bottom of compiler mode and make sure they can shown on the same page. The size of box will keep unchanged and we can scoll inside the box.

## 2. The input box of interaction mode remains center

Right now, the box of interaction will add to the bottom of all the input boxes and dispear if user doesn't scoll down. We can keep the the last one box still seen to users when users doesn't operate.

## 3. Make adjustment of proportion of two mode on Web page

The compiler sides will need more space. 

## 4. The size of input box of interation mode remains the same

The input boxes of interaction mode can change to different size. We want to keep them in same size.

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


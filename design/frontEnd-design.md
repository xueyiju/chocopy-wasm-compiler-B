# first week front end design

## 1. Make adjustment of layout  

## 2. Show all kinds of error properly in compiler mode

## 3. Display all kinds of error properly in interaction mode

## 4. Display the result of compiler mode

## 5. Display the result of interaction mode

## 4. print all the fields in an object properly 

## 5. Display the space that heap have used

## 6. Show the global variable of wasm

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

## 7. Display the running time for user

## 8. 

## 9. 

## 10.
import { BasicREPL } from "./repl";
import { Type, Value } from "./ast";
import { NUM, BOOL, NONE, PyValue,CLASS } from "./utils";

function stringify(typ: Type, arg: any) : string {
  switch(typ.tag) {
    case "number":
      return (arg as number).toString();
    case "bool":
      return (arg as boolean)? "True" : "False";
    case "none":
      return "None";
    case "class":
      return typ.name;
  }
}

export function renderNewLine(result: Value, elt: HTMLElement){
    document.getElementById("output").appendChild(elt);
    switch (result.tag) {
      case "num":
        elt.innerText = String(result.value);
        break;
      case "bool":
        elt.innerHTML = (result.value) ? "True" : "False";
        break;
      case "object":
        elt.innerHTML = `${result.name} object at ${String(result.address)}`
        break
      default: throw new Error(`Could not render value: ${result}`);
    }
}

export function renderResult(result : Value) : void {
  if(result === undefined) { console.log("skip"); return; }
  if (result.tag === "none") return;
  const elt = document.createElement("pre");
  renderNewLine(result, elt);
}

export function renderPrint(typ: Type, arg : number) : any {
  console.log("Logging from WASM: ", arg);
  const elt = document.createElement("pre");
  document.getElementById("output").appendChild(elt);
  elt.innerText = stringify(typ, arg);
  return arg;
}

export function renderError(result : any) : void {
  const elt = document.createElement("pre");
  document.getElementById("output").appendChild(elt);
  elt.setAttribute("style", "color: red");
  elt.innerText = String(result);
}

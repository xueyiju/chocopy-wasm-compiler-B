import {BasicREPL} from './repl';
import { Type, Value } from './ast';
import { defaultTypeEnv } from './type-check';
import { NUM, BOOL, NONE } from './utils';
// import CodeMirror from "codemirror";
import { renderResult, renderError, renderPrint } from "./ouputrender";
import "./style.scss";

function assert_not_none(arg: any) : any {
  if (arg === 0)
    throw new Error("RUNTIME ERROR: cannot perform operation on none");
  return arg;
}

function webStart() {
  var filecontent: string | ArrayBuffer;
  document.addEventListener("DOMContentLoaded", async function() {

    // https://github.com/mdn/webassembly-examples/issues/5

    const memory = new WebAssembly.Memory({initial:10, maximum:100});
    const memoryModule = await fetch('memory.wasm').then(response => 
      response.arrayBuffer()
    ).then(bytes => 
      WebAssembly.instantiate(bytes, { js: { mem: memory } })
    );

    var importObject = {
      imports: {
        assert_not_none: (arg: any) => assert_not_none(arg),
        print_num: (arg: number) => renderPrint(NUM, arg),
        print_bool: (arg: number) => renderPrint(BOOL, arg),
        print_none: (arg: number) => renderPrint(NONE, arg),
        abs: Math.abs,
        min: Math.min,
        max: Math.max,
        pow: Math.pow
      },
      libmemory: memoryModule.instance.exports,
      memory_values: memory, //it is kind of pointer pointing to heap
      js: {memory: memory}
    };
    var repl = new BasicREPL(importObject);

    function setupRepl() {
      document.getElementById("output").innerHTML = "";
      const replCodeElement = document.getElementById("next-code") as HTMLTextAreaElement;
      replCodeElement.addEventListener("keypress", (e) => {

        if(e.shiftKey && e.key === "Enter") {
        } else if (e.key === "Enter") {
          e.preventDefault();
          const output = document.createElement("div");
          const prompt = document.createElement("span");
          prompt.innerText = "»";
          output.appendChild(prompt);
          const elt = document.createElement("textarea");
          // elt.type = "text";
          elt.disabled = true;
          elt.className = "repl-code";
          output.appendChild(elt);
          document.getElementById("output").appendChild(output);
          const source = replCodeElement.value;
          elt.value = source;
          replCodeElement.value = "";
          repl.run(source).then((r) => { 
            console.log(r);
            var objectTrackList = repl.trackObject(r, repl.trackHeap());
            renderResult(r, objectTrackList);
            console.log ("run finished");})
              .catch((e) => { renderError(e); console.log("run failed", e) });;
        }
      });
    }

    function resetRepl() {
      document.getElementById("output").innerHTML = "";
    }

    document.getElementById("run").addEventListener("click", function(e) {
      repl = new BasicREPL(importObject);
      const source = document.getElementById("user-code") as HTMLTextAreaElement;
      resetRepl();
      console.log(source);
      repl.run(source.value).then((r) => {
        console.log(r); 
        console.log(repl.trackHeap());
        console.log(repl.trackObject(r, repl.trackHeap()));
        var objectTrackList = repl.trackObject(r, repl.trackHeap());
        renderResult(r, objectTrackList); 
        console.log ("run finished") 
        
      })
        .catch((e) => { renderError(e); console.log("run failed", e) });;
    });

    document.getElementById("choose_file").addEventListener("change", function (e) {
      //load file
      var input: any = e.target;
      var reader = new FileReader();
      reader.onload = function () {
        filecontent = reader.result;
      };
      reader.readAsText(input.files[0]);
    });

    document.getElementById("load").addEventListener("click", function (e) {
      //clear repl output
      resetRepl();
      //reset environment
      repl = new BasicREPL(importObject);
      // Repalce text area with the content in the uploaded file
      const source = document.getElementById("user-code") as HTMLTextAreaElement;
      source. value = filecontent.toString();
    });

    document.getElementById("save").addEventListener("click", function (e) {
      //download the code in the user-code text area
      var FileSaver = require("file-saver");
      var title = (document.getElementById("save_title") as any).value;
      const source = document.getElementById("user-code") as HTMLTextAreaElement;
      var blob = new Blob([source.value], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, title);
    });
    
    setupRepl();
  });
}

webStart();

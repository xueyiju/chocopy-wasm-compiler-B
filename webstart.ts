import { BasicREPL} from './repl';
import { Type, Value } from './ast';
import { defaultTypeEnv } from './type-check';
import { NUM, BOOL, NONE } from './utils';
// import CodeMirror from "codemirror";
import { renderResult, renderError, renderPrint } from "./ouputrender";

import CodeMirror from "codemirror";
import "codemirror/addon/edit/closebrackets";
import "codemirror/mode/python/python";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/comment-fold";
import "./style.scss";
import { log } from 'console';

function assert_not_none(arg: any) : any {
  if (arg === 0)
    throw new Error("RUNTIME ERROR: cannot perform operation on none");
  return arg;
}

function webStart() {
  var filecontent: string | ArrayBuffer;
  document.addEventListener("DOMContentLoaded", async function() {

    // https://github.com/mdn/webassembly-examples/issues/5

    const memory = new WebAssembly.Memory({ initial: 10, maximum: 100 });
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

    setupRepl(repl);

    function resetRepl() {
      document.getElementById("output").innerHTML = "";
    }

    document.getElementById("run").addEventListener("click", function (e) {
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
        console.log("run finished")

      })
        .catch((e) => { renderError(e); console.log("run failed", e) });;
    });

    document.getElementById("choose_file").addEventListener("change", function (e) {
      //load file
      var input: any = e.target;
      var reader = new FileReader();
      reader.onload = function () {
        filecontent = reader.result;
        resetRepl();
        //reset environment
        repl = new BasicREPL(importObject);
        // Repalce text area with the content in the uploaded file
        editor.setValue(filecontent.toString());
      };
      reader.readAsText(input.files[0]);
    });

    document.getElementById("import").addEventListener("click", function () {
      document.getElementById("choose_file").click();
    });

    document.getElementById("save").addEventListener("click", function (e) {
      //download the code in the user-code text area
      var FileSaver = require("file-saver");
      var title = "download";
      const source = editor.getValue();
      var blob = new Blob([source], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, title);
    });

    const textarea = document.getElementById("user-code") as HTMLTextAreaElement;
    const editor = CodeMirror.fromTextArea(textarea, {
      mode: "python",
      theme: "blackboard",
      lineNumbers: true,
      autoCloseBrackets: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      extraKeys: {
        "Ctrl": "autocomplete",
      },
      // scrollbarStyle: "simple",
    } as any);
    console.log('thy this is not run textarea', textarea)
    console.log(editor)
    
    editor.on("change", (cm, change) => {

        textarea.value = editor.getValue();
    })
    editor.on('inputRead', function onChange(editor, input) {
        if (input.text[0] === ';' || input.text[0] === ' ' || input.text[0] === ":") {
            return;
        }
        (editor as any).showHint({
        });
    });

    dragbarFunction();
    promptTextArea();

  });

}

function dragbarFunction(){
  var bar = document.getElementById("dragbar") as HTMLElement;
  console.log(bar);
  var wrapper = bar.closest('.dynamic-content-border') as HTMLElement;
  var codeEditor = wrapper.querySelector('.absolute-content-border') as HTMLElement;
  var isDragging = false;

  document.addEventListener('mousedown', function(e){
    if(e.target === bar){
      isDragging = true;
    }
  });

  document.addEventListener('mousemove', function(e){
    if(!isDragging){
      return false;
    }

    var containerOffsetLeft = wrapper.offsetLeft;
    var pointerRelativeXpos = e.clientX - containerOffsetLeft;
    var editorMinWidth = 60;

    codeEditor.style.width = (Math.max(editorMinWidth, pointerRelativeXpos - 8)) + 'px';
    codeEditor.style.flexGrow = '0';

  });

  document.addEventListener('mouseup', function(e){
    isDragging = false;
  });
}

function setupRepl(repl: BasicREPL) {
  document.getElementById("output").innerHTML = "";
  const replCodeElement = document.getElementById("next-code") as HTMLTextAreaElement;
  replCodeElement.addEventListener("keydown", (e)=>{
    console.log(e);
  })
  replCodeElement.addEventListener("keypress", (e) => {

    console.log(e);
    console.log(replCodeElement.selectionStart);
    console.log(replCodeElement.selectionEnd);

    if (e.shiftKey && e.key === "Enter") {
    } else if (e.key === "Enter") {
      e.preventDefault();
      const source = replCodeElement.value;

      const output = document.createElement("div");
      const prompt = document.createElement("span");
      prompt.innerText = "» " + source;
      output.appendChild(prompt);
      // const elt = document.createElement("textarea");
      // // elt.type = "text";
      // elt.disabled = true;
      // elt.className = "repl-code";
      // output.appendChild(elt);
      document.getElementById("output").appendChild(output);
      
      // elt.value = source;
      replCodeElement.value = "";

      if(source === ""){
        return false;
      }
      repl.run(source).then((r) => {
        console.log(r);
        var objectTrackList = repl.trackObject(r, repl.trackHeap());
        renderResult(r, objectTrackList);
        console.log("run finished");
      })
        .catch((e) => { renderError(e); console.log("run failed", e) });;
    }
  });
}

function promptTextArea(){
  document.getElementById("interactions").addEventListener("click", (e)=>{
    document.getElementById("next-code").focus();
  });

  document.getElementById("next-code").addEventListener("focus", (e)=>{
    document.addEventListener("keypress", (e)=>{
      console.log(e);
      var nextCode = document.getElementById("next-code") as HTMLTextAreaElement;
      nextCode.selectionStart
    })
  });



  
}

webStart();


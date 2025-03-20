import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode"; // VS Code Theme
import './Custom.css';
function CodeEditor({ code, setCode }) {
  return (
    <div className="w-full h-full rounded-lg border-2 items-center bg-{#2d2d2d} p-2 custom-editor flex flex-col   ">
      <h2 className="text-xl font-bold mb-4">JavaScript Code</h2>
      <CodeMirror
        value={code}
        height="295px"
        width="490px"
        extensions={[javascript()]}
        onChange={(value) => setCode(value)}
        theme={vscodeDark} 
        basicSetup={{
          lineNumbers: true, 
          foldGutter: true, 
          highlightActiveLine: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;

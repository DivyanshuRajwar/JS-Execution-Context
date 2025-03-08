import React, { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import TopRight from "./TopRight";
import ExecutionTerminal from "./ExecutionTerminal";
import Console from "./ConsoleCompo";
import CallStack from "./CallStack";
import StackTerminal from "./StackTerminal";
import ExecuteEngine from "./ExecuteEngine";
import { use } from "framer-motion/m";
function Wrapper() {
  const [code, setCode] = useState("// Write your JavaScript code here...");
  const [logs, setLogs] = useState([]);
  const [FunctionCall , setFunctionCall] = useState(false);
  const [memoryBlock, setMemoryBlock] = useState({
    global: {
      variables: {
      },
      functions: {
      }
    },
    local: {}
  });
  const [updatedMemory, setUpdatedMemory] = useState({});
  const [controlAction, setControlAction] = useState(null);
  const [CallStackUpdate, setCallStackUpdate] = useState([]);
  const [codeExecution, setCodeExecution] = useState([]);
  const [phase, setPhase] = useState(1);
  const[consoleUpdate,setConsoleUpdate] = useState([]);
  const resetFunctionCall = () => {
    setFunctionCall(false); 
  };

 ;
  return (
    <div className="w-screen h-screen bg-[#01152b] flex flex-col p-1 text-white">
      {/* TOP Section */}
      <div className="w-[100%] h-1/2 flex justify-evenly ">
        {/* Code Editor Left */}
        <div className="w-[34%] h-[350px]">
          <CodeEditor code={code} setCode={setCode} />
        </div>
        {/* Execution Context Right */}
        <div className=" w-[65%]  h-full border rounded-lg">
          <TopRight
            setControlAction={setControlAction}
            memoryBlock={memoryBlock}
            phase={phase}
            codeExecution={codeExecution}
            FunctionCall={FunctionCall}
            resetFunctionCall={resetFunctionCall}
            updatedMemory={updatedMemory}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-[100%] h-1/2 flex justify-evenly">
        {/* Terminal and Console */}
        <div className="h-full w-[57%] flex p-1 m-1 gap-1 justify-between">
          <ExecutionTerminal logs={logs} />
          <Console consoleUpdate={consoleUpdate} />
        </div>
        {/* Call Stack and Terminal */}
        <div className="h-full w-[43%] border flex">
          <CallStack CallStackUpdate={CallStackUpdate}/>
          <StackTerminal CallStackUpdate={CallStackUpdate} />
        </div>
      </div>

      {/* Execution Engine (Handles Code Execution) */}
      <ExecuteEngine
        code={code}
        setLogs={setLogs}
        controlAction={controlAction}
        memoryBlock={memoryBlock}
        setMemoryBlock={setMemoryBlock}
        setCallStackUpdate={setCallStackUpdate}
        phase={phase}
        setPhase={setPhase}
        setConsoleUpdate={setConsoleUpdate}
        setCodeExecution={setCodeExecution}
        setFunctionCall={setFunctionCall}
        setUpdatedMemory={setUpdatedMemory}
      />
    </div>
  );
}

export default Wrapper;

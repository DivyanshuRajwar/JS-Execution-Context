import React, { useEffect, useState, useRef } from "react";
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
  const [logs, setLogs] = useState([]); //Execution Terminal
  const [FunctionCall, setFunctionCall] = useState(false);
  const [memoryBlock, setMemoryBlock] = useState({
    global: {
      variables: {},
      functions: {},
    },
    local: {},
  });
  const [updatedMemory, setUpdatedMemory] = useState({});
  const [controlAction, setControlAction] = useState(null);
  const [CallStackUpdate, setCallStackUpdate] = useState([]);
  const [callStackTerminal , setCallStackterminal] = useState({})
  const [codeExecution, setCodeExecution] = useState([]);
  const [phase, setPhase] = useState(1);
  const [consoleUpdate, setConsoleUpdate] = useState([]);
  const [functionName, setFunctionName] = useState(null);
  const resetFunctionCall = () => {
    setFunctionCall(false);
  };
  const isPausedRef = useRef(false);

  return (
    <div className="w-screen h-screen bg-[#2d2d2d] flex flex-col p-1 text-white">
      {/* TOP Section */}
      <div className="w-[100%] h-1/2 flex justify-evenly ">
        {/* Code Editor Left */}
        <div className="w-[34%] h-[350px]">
          <CodeEditor code={code} setCode={setCode} />
        </div>
        {/* Execution Context Right */}
        <div className=" w-[65%]  h-full border-2 rounded-lg">
          <TopRight
            setControlAction={setControlAction}
            memoryBlock={memoryBlock}
            phase={phase}
            codeExecution={codeExecution}
            FunctionCall={FunctionCall}
            resetFunctionCall={resetFunctionCall}
            updatedMemory={updatedMemory}
            isPausedRef={isPausedRef}
            setCallStackUpdate={setCallStackUpdate}
            setLogs={setLogs}
            setConsoleUpdate={setConsoleUpdate}
            functionName={functionName}
            setCallStackterminal={setCallStackterminal}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-[100%] h-1/2 flex gap-2 pl-1">
        {/* Call Stack and Terminal */}
        <div className="h-full w-[50%]    flex gap-1 ">
          <CallStack CallStackUpdate={CallStackUpdate} />
          <StackTerminal callStackTerminal={callStackTerminal} />
        </div>
        {/* Terminal and Console */}
        <div className="h-full w-[50%] flex  gap-1 ">
          <ExecutionTerminal logs={logs} />
          <Console consoleUpdate={consoleUpdate} />
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
        isPausedRef={isPausedRef}
        setFunctionName={setFunctionName}
        setCallStackterminal={setCallStackterminal}
      />
    </div>
  );
}

export default Wrapper;

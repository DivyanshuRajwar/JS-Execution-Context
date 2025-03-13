import React, { useEffect, useState ,useRef } from "react";
import "./Custom.css";
import FunctionExecutionContext from "./FunctionExecutionContext";
import { pre } from "framer-motion/m";

function ExecutionContext({
  memoryBlock,
  phase,
  codeExecution,
  FunctionCall,
  resetFunctionCall,
  updatedMemory,
  isPausedRef,
  setCallStackUpdate,
  setLogs,
  setConsoleUpdate,
  functionName
}) {
  const [codeLog, setCodeLog] = useState([]);
  const [executionIndex, setExecutionIndex] = useState(0);
    const memoryRef = useRef(null);
    const codeRef = useRef(null);
  
    useEffect(() => {
      if (memoryRef.current) {
        memoryRef.current.scrollTo({
          top: memoryRef.current.scrollHeight,
          behavior: "smooth", // Enables smooth scrolling
        });
      }
    }, [updatedMemory]);
    useEffect(() => {
      if (codeRef.current) {
        codeRef.current.scrollTo({
          top: codeRef.current.scrollHeight,
          behavior: "smooth", // Enables smooth scrolling
        });
      }
    }, [codeLog]);

  
  
  // Effect to add codeExecution logs one by one
  useEffect(() => {
    if (codeExecution.length > 0 && executionIndex < codeExecution.length) {
      
        setCodeLog((prevLog) => [...prevLog, codeExecution[executionIndex]]);
        setExecutionIndex((prevIndex) => prevIndex + 1); }
  }, [executionIndex, codeExecution]);

  // Effect to add FunctionExecutionContext when FunctionCall is true
  useEffect(() => {
    if (FunctionCall) {
      setCodeLog((prevLog) => [...prevLog, 
      <FunctionExecutionContext 
        key={prevLog.length}
        setLogs={setLogs}
        setConsoleUpdate={setConsoleUpdate}
        updatedMemory={updatedMemory}
        functionName={functionName}
        setOnComplete={()=>{isPausedRef.current = false}}
      />]);
      resetFunctionCall(); // Mark FunctionCall as false after adding
      setCallStackUpdate((prev) => ({
        ...prev,
        FEC: "Function Execution Context is created and pushed"
      }));
      isPausedRef.current = true
    }
  }, [FunctionCall, resetFunctionCall]);

  return (
    <div className="w-[85%] h-full flex flex-col  bg-[#212121]">
      <div className="w-full h-full flex">
        {/* Memory Block */}
        <div className="w-[40%] h-full border  rounded-bl-lg p-4">
          <h2 className="text-white text-lg font-semibold">Memory</h2>
          <hr className="border-gray-500 my-2" />
          <div ref={memoryRef} className="text-gray-300 text-lg overflow-y-auto h-[225px] ">
            {Object.keys(updatedMemory).length > 0 ? (
              <ul className="list-disc pl-4">
                {Object.entries(updatedMemory).map(
                  ([varName, details], index) => (
                    <li key={index} className="mb-1 list-none text-xl">
                      <span className="text-blue-400">{varName}</span>:{" "}
                      <span className="text-yellow-400">
                        {details.type === "Function"
                          ? "[Function Body]"
                          : String(details.value)}
                      </span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500">No variables allocated yet.</p>
            )}
          </div>
        </div>

        {/* Code Execution */}
        <div className="w-[60%] h-full border  rounded-r-lg p-4">
          <h2 className="text-white text-lg font-semibold">
            Code Execution (Phase {phase})
          </h2>
          <hr className="border-gray-500 my-2" />
          <div ref={codeRef} className="w-full h-[88%] overflow-y-auto text-gray-300 text-lg custom-scroller ">
            {codeLog.length > 0 ? (
              <ul className="list-none pl-2">
                {codeLog.map((log, index) => (
                  <li key={index} className="mb-1">
                    {React.isValidElement(log) ? log : <span className="text-cyan-400">→ {log}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No code executed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecutionContext;

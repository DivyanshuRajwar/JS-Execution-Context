import React, { useEffect, useState } from "react";
import "./Custom.css";
import FunctionExecutionContext from "./FunctionExecutionContext";

function ExecutionContext({
  memoryBlock,
  phase,
  codeExecution,
  FunctionCall,
  resetFunctionCall,
  updatedMemory
}) {
  const [codeLog, setCodeLog] = useState([]);
  const [executionIndex, setExecutionIndex] = useState(0);
  
  useEffect(()=>{
    console.log(updatedMemory)
    console.log(memoryBlock)
  },[updatedMemory])
  // Effect to add codeExecution logs one by one
  useEffect(() => {
    if (codeExecution.length > 0 && executionIndex < codeExecution.length) {
      
        setCodeLog((prevLog) => [...prevLog, codeExecution[executionIndex]]);
        setExecutionIndex((prevIndex) => prevIndex + 1); }
  }, [executionIndex, codeExecution]);

  // Effect to add FunctionExecutionContext when FunctionCall is true
  useEffect(() => {
    if (FunctionCall) {
      setCodeLog((prevLog) => [...prevLog, <FunctionExecutionContext key={prevLog.length} />]);
      resetFunctionCall(); // Mark FunctionCall as false after adding
    }
  }, [FunctionCall, resetFunctionCall]);

  return (
    <div className="w-[85%] h-full flex flex-col ml-1 bg-[#212121]">
      <div className="w-full h-full flex">
        {/* Memory Block */}
        <div className="w-[40%] h-full border border-white rounded-l-lg p-4">
          <h2 className="text-white text-lg font-semibold">Memory</h2>
          <hr className="border-gray-500 my-2" />
          <div className="text-gray-300 text-sm overflow-y-scroll">
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
        <div className="w-[60%] h-full border border-white rounded-r-lg p-4">
          <h2 className="text-white text-lg font-semibold">
            Code Execution (Phase {phase})
          </h2>
          <hr className="border-gray-500 my-2" />
          <div className="w-full h-[60%] overflow-y-auto text-gray-300 text-sm custom-editor">
            {codeLog.length > 0 ? (
              <ul className="list-none pl-2">
                {codeLog.map((log, index) => (
                  <li key={index} className="mb-1">
                    {React.isValidElement(log) ? log : <span className="text-green-400">→ {log}</span>}
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

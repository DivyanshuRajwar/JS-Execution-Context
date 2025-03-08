import { useEffect, useState } from "react";

const FunctionExecutionContext = () => {


  return (
    <div className="w-full h-full flex">
      {/* Memory Section (40% width) */}
      <div className="w-[40%] h-full border border-white rounded-l-lg p-4">
        <h2 className="text-white text-lg font-semibold">Memory</h2>
        <hr className="border-gray-500 my-2" />

        <div className="text-gray-300 text-sm overflow-y-auto max-h-[85%]">
          {/* {Object.keys(globalVariables).length > 0 ? (
            <ul className="list-disc pl-4">
              {Object.entries(globalVariables).map(([varName, value], index) => (
                <li key={index} className="mb-1 list-none text-lg">
                  <span className="text-blue-400">{varName}</span>:{" "}
                  <span className="text-yellow-400">{String(value)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No variables allocated yet.</p>
          )} */}
          <p className="text-gray-500">No variables allocated yet.</p>
        </div>
      </div>

      {/* Code Execution Section (60% width) */}
      <div className="w-[60%]  min-h-20 border border-white rounded-r-lg p-4">
        <h2 className="text-white text-lg font-semibold">
          Code Execution 
          {/* (Phase {phase}) */}
        </h2>
        <hr className="border-gray-500 my-2" />

        <div className="w-full h-[80%] overflow-y-auto text-gray-300 text-sm">
          {/* {executionLog.length > 0 ? (
            <ul className="list-none pl-2">
              {executionLog.map((log, index) => (
                <li key={index} className="mb-1 text-base">
                  <span className="text-green-400">→</span> {log}
                </li>
              ))}
            </ul>
          ) : (
          )} */}
          <p className="text-gray-500">No function execution logs yet.</p>

          {/* {error && <p className="text-red-400 mt-2">{error}</p>} */}
        </div>
      </div>
    </div>
  );
};

export default FunctionExecutionContext;

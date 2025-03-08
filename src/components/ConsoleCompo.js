import React from "react";

function ConsoleCompo({ consoleUpdate }) {
  return (
    <div className="w-[40%] h-full border border-gray-700 rounded-lg flex flex-col bg-[#1e1e1e]">
      {/* Console Header */}
      <div className="bg-[#2d2d2d] text-white px-4 py-2 text-sm font-semibold border-b border-gray-700">
        Console
      </div>

      {/* Console Output */}
      <div className="w-full h-full overflow-y-auto p-4 text-sm font-mono text-gray-300 bg-[#1e1e1e]">
        {consoleUpdate.length > 0 ? (
          consoleUpdate.map((log, index) => (
            <div key={index} className={log.type === "error" ? "text-red-400" : "text-green-400"}>
              {typeof log === "object" ? JSON.stringify(log) : log.message || log}
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">No output yet...</div>
        )}
      </div>
    </div>
  );
}

export default ConsoleCompo;

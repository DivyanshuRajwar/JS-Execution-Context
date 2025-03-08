import React from "react";

function ExecutionTerminal({ logs }) {
  return (
    <div className="w-1/2 h-full bg-black text-white p-2 overflow-y-auto border rounded-lg">
      <h3 className="text-lg font-semibold">Execution Terminal</h3>
      <div className="mt-2">
        {logs.length === 0 ? (
          <p className="text-gray-400">No execution logs...</p>
        ) : (
          logs.map((log, index) => <p key={index} className="text-green-400">{log}</p>)
        )}
      </div>
    </div>
  );
}

export default ExecutionTerminal;

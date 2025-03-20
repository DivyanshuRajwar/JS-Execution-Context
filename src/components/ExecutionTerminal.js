import React, { useEffect, useRef } from "react";

function ExecutionTerminal({ logs }) {
  const terminalRef = useRef(null);

  useEffect(() => {
    console.log(logs)
    if (terminalRef.current) {
      setTimeout(() => { 
        terminalRef.current.scrollTo({
          top: terminalRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100); 
    }
  }, [logs]); 

  return (
    <div
      
      className="w-[60%] h-[100%] bg-[#2d2d2d] border rounded-lg flex flex-col items-center"
    >
      <h3 className="text-white text-lg mt-2 font-semibold">Execution Terminal</h3>
      <div ref={terminalRef} className="p-2 w-full h-[90%] overflow-y-auto bg-[#212121] border rounded-lg pb-2 ">
        {logs.length === 0 ? (
          <p className="text-gray-400">No execution logs...</p>
        ) : (
          logs.map((log, index) => (
            <p key={index} className="text-green-400">
              {log}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

export default ExecutionTerminal;

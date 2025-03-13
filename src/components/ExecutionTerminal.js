import React, { useEffect, useRef } from "react";

function ExecutionTerminal({ logs }) {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: "smooth", // Enables smooth scrolling
      });
    }
  }, [logs]); // Runs whenever logs update

  return (
    <div
      ref={terminalRef}
      className="w-[60%] h-[100%]  bg-[#2d2d2d]  border rounded-lg flex flex-col items-center "
    >
      <h3 className="text-white text-lg mt-2 font-semibold">Execution Terminal</h3>
      <div className=" p-2 w-full h-[90%] overflow-y-auto  bg-[#212121] border rounded-lg ">
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

import { useEffect } from "react";

function StackTerminal({ callStackTerminal }) {
  const messages = Object.values(callStackTerminal);

  return (
    <div className="w-[65%] h-full border-2 rounded-lg flex flex-col justify-between items-center">
      <h2 className="text-white text-lg mt-2 font-semibold">Stack Terminal</h2>
      <div className="w-full h-[88%] bg-[#212121] border rounded-lg p-2 text-lg text-white overflow-auto">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <p className="text-cyan-400" key={index}>{`-> ${message}`}</p>
          ))
        ) : (
          <div className="text-gray-500 text-[17px] ">No code executed yet.</div>
        )}
      </div>
    </div>
  );
}

export default StackTerminal;
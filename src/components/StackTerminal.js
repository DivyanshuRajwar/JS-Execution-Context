import { useEffect, useState } from "react";

function StackTerminal({ callStackTerminal }) {
  const [stackTerminal, setStackTerminal] = useState([]); // Store all messages permanently

  useEffect(() => {
    if (Object.keys(callStackTerminal).length > 0) {
      const newMessages = Object.values(callStackTerminal).filter(
        (message) => !stackTerminal.includes(message) // Prevent duplicates
      );

      if (newMessages.length > 0) {
        setStackTerminal((prev) => [...prev, ...newMessages]);
      }
    }
  }, [callStackTerminal]);

  return (
    <div className="w-[65%] h-full border-2 rounded-lg flex flex-col justify-between items-center">
      <h2 className="text-white text-lg mt-2 font-semibold">Stack Terminal</h2>
      <div className="w-full h-[88%] bg-[#212121] border rounded-lg p-2 text-lg text-white overflow-auto">
        {stackTerminal.map((message, index) => (
          <p className="text-cyan-400" key={index}>{`-> ${message}`}</p>
        ))}
      </div>
    </div>
  );
}

export default StackTerminal;

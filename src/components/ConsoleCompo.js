import {React , useEffect , useRef} from "react";

function ConsoleCompo({ consoleUpdate }) {
  const consoleRef = useRef(null);
    
      useEffect(() => {
        if (consoleRef.current) {
          consoleRef.current.scrollTo({
            top: consoleRef.current.scrollHeight,
            behavior: "smooth", // Enables smooth scrolling
          });
        }
      }, [consoleUpdate]);
  return (
    <div className="w-[40%] h-full border-2 rounded-lg flex flex-col items-center bg-[#2d2d2d]">
      
      <h3 className="text-white text-lg mt-2 font-semibold">Console</h3>

      {/* Console Output */}
      <div ref={consoleRef} className="w-full h-full overflow-y-auto p-2 text-lg  text-gray-500 bg-[#1e1e1e] border rounded-lg ">
        {consoleUpdate.length > 0 ? (
          consoleUpdate.map((log, index) => (
            <div key={index} className={log.type === "error" ? "text-red-400" : "text-green-400"}>
              {typeof log === "object" ? JSON.stringify(log) : log.message || log}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No output yet...</div>
        )}
      </div>
    </div>
  );
}

export default ConsoleCompo;

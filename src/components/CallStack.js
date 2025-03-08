import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CallStack({ CallStackUpdate }) {
  const [stack, setStack] = useState([]);

  useEffect(() => {
    if (CallStackUpdate) {
      setStack(Object.keys(CallStackUpdate));
    }
  }, [CallStackUpdate]);

  return (
    <div className="w-[40%] h-full border rounded-lg flex flex-col items-center bg-[#0a1f44] p-2">
      <h2 className="text-white text-lg font-semibold mb-2">Call Stack</h2>
      <div className="w-[80%] h-[80%] border-2 border-gray-300 rounded-xl relative overflow-hidden flex flex-col-reverse">
        <AnimatePresence>
          {stack.map((item, index) => (
            <motion.div
              key={item}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full bg-blue-500 text-white text-center font-bold p-2 rounded-md border border-white shadow-md mb-2"
            >
              {item}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CallStack;

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
    <div className="w-[35%] h-full border rounded-lg flex flex-col items-center bg-[#2d2d2d] ">
      <h2 className="text-white text-lg font-semibold mt-2 mb-2">Call Stack</h2>
      <div className="w-full h-[90%] border border-gray-300 rounded-lg overflow-hidden flex flex-col-reverse bg-[#212121] ">
        <AnimatePresence>
          {stack.map((item, index) => (
            <motion.div
              key={item}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full text-xl bg-gray-800 text-white text-center font-bold p-2 rounded-lg border border-gray-700 shadow-md mb-2"
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

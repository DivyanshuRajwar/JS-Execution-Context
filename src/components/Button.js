

import React from "react";

const Button = ({ label,onClick }) => {
  return (
    <button onClick={onClick} className="relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-700 to-gray-900 p-[2px] text-white font-bold text-lg cursor-pointer transition-transform duration-300 hover:scale-105">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900 opacity-10 hover:opacity-30 transition-opacity"></div>
      <span className="flex items-center gap-3 px-5 py-3 rounded-lg bg-gray-800 shadow-md transition-all duration-300 hover:bg-gray-700">
        {label}
        </span>
    </button>
  );
};

export default Button;

import React from "react";

const SideSheet = ({ isOpen, onClose, title = "", children }) => {
  if (!isOpen) return null; // completely unmount when closed
  return (
    <div className="fixed inset-0 z-50 transition-all duration-300">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-[#00000057] transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Side Sheet */}
      <div
        className={`absolute right-0 top-0 h-full w-[800px] bg-white shadow-lg transition-transform duration-200 ease-in-out rounded-bl-[12px] rounded-tl-[12px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>X</button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SideSheet;

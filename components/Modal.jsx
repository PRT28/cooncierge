import React from "react";

const Modal = ({ isOpen, onClose, children, title="Modal Titlte" }) => {
  const isMobile = window.innerWidth < 768;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#00000032] flex justify-center items-center md:items-center">
      <div
        className={`bg-white rounded-t-2xl md:rounded-lg shadow-lg  max-h-[90vh] overflow-y-auto transition-transform ${
          isMobile ? "absolute bottom-0" : ""
        }`}
        style={{width: 'fit-content'}}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-[#114958] text-[1.75rem] font-bold text-center w-full">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

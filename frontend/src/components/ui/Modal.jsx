import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay flex-center">
      <div className="modal-content animate-slide-up">
        <div className="modal-header flex-between">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", showCancel = true }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container-inner" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          {title && <h2 className="modal-title-text">{title}</h2>}
          <p className="modal-message-text">{message}</p>
        </div>
        <div className="modal-buttons">
          {showCancel && (
            <button type="button" className="btn-modal cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button type="button" className="btn-modal confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
import React from 'react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay flex-center">
      <div className="modal-content animate-slide-up">
        <div className="modal-header flex-between">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="product-card glass skeleton-animate">
        <div className="aspect-square bg-slate-200" />
        <div className="p-5 space-y-3">
          <div className="h-2 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-6 w-20 bg-slate-200 rounded mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-animate bg-slate-200 rounded-md w-full h-10" />
  );
};

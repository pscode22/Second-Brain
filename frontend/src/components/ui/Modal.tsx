// gpt-code.
import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Backdrop and panel click handling
  function handleBackdropClick(e: React.MouseEvent) {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  }

  // Basic focus trap
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const modalEl = panelRef.current;
    const focusable = modalEl.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];
  
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    }
  
    modalEl.addEventListener('keydown', handleKey);
    // Autofocus first element
    firstEl?.focus();
  
    return () => {
      modalEl.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);
  

  // Prevent rendering when closed
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-4xl cursor-pointer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

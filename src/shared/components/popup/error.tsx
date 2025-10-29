"use client";

import { useEffect, useState, useCallback } from "react";
import { X, AlertCircle } from "lucide-react";

interface ErrorPopupProps {
  error?: string;
  onClose?: () => void;
  duration?: number;
}

export function ErrorPopup({ error, onClose, duration }: ErrorPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      onClose?.();
    }, 200); // Durasi animasi keluar
  }, [onClose]);

  useEffect(() => {
    if (error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
       
      setIsExiting(false);

      if (duration) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [error, duration, handleClose]);

  // Kita hanya render jika 'isVisible' true. Animasi keluar
  // ditangani oleh state 'isExiting' di className.
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div
        className={`pointer-events-auto w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-sm border border-red-200 rounded-xl shadow-lg transform transition-all duration-200 ease-out ${
          isExiting ? "opacity-0 translate-x-6" : "opacity-100 translate-x-0"
        }`}
      >
        <div className="p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-4.5 h-4.5 text-red-500" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-red-900 mb-0.5">
                Error
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{error}</p>
            </div>

            <button
              onClick={handleClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors -mt-0.5 -mr-0.5 p-1 rounded-full"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {duration && (
            <div className="absolute bottom-0 left-0 right-0 p-1">
              <div className="h-0.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-red-500"
                  style={{
                    animation: `progress ${duration}ms linear forwards`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";

interface PopupProps {
  message?: string;
  onClose?: () => void;
  duration?: number;
  variant?: "success" | "error";
}

export function Popup({
  message,
  onClose,
  duration = 5000,
  variant = "error",
}: PopupProps) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (duration && message) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [duration, message, handleClose]);

  // Jika tidak ada message, jangan render apa-apa
  if (!message) return null;

  const variants = {
    error: {
      border: "border-red-200",
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      title: "Error",
      titleColor: "text-red-900",
      progressGradient: "from-red-400 to-red-500",
      Icon: AlertCircle,
    },
    success: {
      border: "border-green-200",
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      title: "Success",
      titleColor: "text-green-900",
      progressGradient: "from-green-400 to-green-500",
      Icon: CheckCircle,
    },
  };

  const config = variants[variant];

  return (
    <>
      <style>{`
        @keyframes popup-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        @keyframes popup-slide-in {
          from {
            opacity: 0;
            transform: translateX(1.5rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="fixed top-4 right-4 z-99999 pointer-events-none">
        <div
          className={`pointer-events-auto w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-sm border ${
            config.border
          } rounded-xl shadow-lg transform transition-all duration-200 ease-out ${
            isExiting ? "opacity-0 translate-x-6" : ""
          }`}
          style={{
            animation: isExiting ? undefined : "popup-slide-in 200ms ease-out",
          }}
        >
          <div className="p-3.5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div
                  className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center`}
                >
                  <config.Icon className={`w-4.5 h-4.5 ${config.iconColor}`} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`text-sm font-semibold ${config.titleColor} mb-0.5`}
                >
                  {config.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {message}
                </p>
              </div>

              <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors -mt-0.5 -mr-0.5 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {duration && (
              <div className="absolute bottom-0 left-0 right-0 p-1">
                <div className="h-0.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${config.progressGradient}`}
                    style={{
                      animation: `popup-progress ${duration}ms linear forwards`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

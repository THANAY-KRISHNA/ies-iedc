import React, { useEffect, useState } from 'react';

export const LoadingSplash: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 2.0-second total duration (1500ms fill + 500ms smooth fade-out transition)
    const startTime = Date.now();
    const duration = 1500;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setFadingOut(true);

        setTimeout(() => {
          setVisible(false);
        }, 500); // Match 500ms CSS transition
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#F8F9FA] text-[#1E232A] transition-all duration-500 ease-in-out select-none ${
        fadingOut ? 'opacity-0 scale-[0.99] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      {/* Standard Light Theme Card Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-8 py-10 rounded-3xl bg-white border border-[#E5E7EB] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] text-center">
        
        {/* Official Brand Logo Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black border border-black flex items-center justify-center p-2 shadow-md mb-5 animate-pulse">
          <img
            src="/logo.png"
            alt="IES IEDC Emblem"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.fallback-txt')) {
                const txt = document.createElement('span');
                txt.className = 'fallback-txt text-white font-extrabold text-xl';
                txt.innerText = 'IEDC';
                parent.appendChild(txt);
              }
            }}
          />
        </div>

        {/* Brand Names & Titles */}
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1E232A] mb-1 font-display">
          IES <span className="text-[#FF6B35]">IEDC</span>
        </h1>
        <p className="text-[11px] font-semibold tracking-wider uppercase text-[#10B981] mb-1">
          Innovation & Entrepreneurship Development Centre
        </p>
        <p className="text-[11px] font-medium text-[#6C727F] mb-6">
          IES College of Engineering
        </p>

        {/* Standard Brand Progress Loader */}
        <div className="w-48 sm:w-56">
          <div className="h-1.5 w-full bg-[#E9EBEF] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1A365D] via-[#10B981] to-[#FF6B35] rounded-full transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Loader Percentage Status */}
          <div className="flex items-center justify-between mt-2.5 text-[11px] text-[#6C727F] font-mono">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              Loading...
            </span>
            <span className="font-bold text-[#1A365D]">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

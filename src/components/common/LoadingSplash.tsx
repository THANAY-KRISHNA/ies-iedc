import React, { useEffect, useState } from 'react';

export const LoadingSplash: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 2-second total splash loader (1700ms fill + 300ms fade out)
    const startTime = Date.now();
    const duration = 1700; // ms to reach 100%

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setFadingOut(true);

        setTimeout(() => {
          setVisible(false);
        }, 350); // Match CSS fade duration
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#090D16] text-white transition-opacity duration-300 ease-out select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-orange-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Logo & Content Box */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* Animated Logo Container with Pulsing Glow */}
        <div className="relative mb-8 group">
          {/* Outer Pulsing Aura Ring */}
          <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 rounded-3xl opacity-50 blur-lg animate-pulse" />
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0F172A] border border-white/15 shadow-2xl flex items-center justify-center p-3 overflow-hidden backdrop-blur-xl">
            <img
              src="/logo.png"
              alt="IES IEDC Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-transform duration-500 scale-100 group-hover:scale-105"
              onError={(e) => {
                // Fallback glowing bulb badge if image asset fails
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector('.fallback-badge')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'fallback-badge flex flex-col items-center justify-center text-emerald-400 font-extrabold text-2xl';
                  fallback.innerHTML = '⚡ IEDC';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        </div>

        {/* Branding Titles */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1 font-display">
          IES <span className="bg-gradient-to-r from-emerald-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">IEDC</span>
        </h1>
        <p className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
          Innovation & Entrepreneurship Development Centre
        </p>
        <p className="text-[10px] text-slate-500 font-medium mb-8">
          IES College of Engineering
        </p>

        {/* Sleek Progress Bar Container */}
        <div className="w-56 sm:w-64">
          <div className="relative h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/10 p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status Label & Percentage */}
          <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Loading Portal...
            </span>
            <span className="font-bold text-emerald-400">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Comprehensive Code Inspect & DevTools Prevention Utility
 * Secures the web application against inspect element, DevTools panel opening,
 * DOM tree browsing, view-source, and right-click context menus.
 */

export function initInspectProtection() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Disable Right-Click Context Menu
  document.addEventListener(
    'contextmenu',
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    { capture: true }
  );

  // 2. Disable DevTools Keyboard Shortcuts
  document.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const isAlt = e.altKey;
      const key = e.key ? e.key.toLowerCase() : '';
      const keyCode = e.keyCode;

      // F12 (DevTools)
      if (key === 'f12' || keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I / Cmd+Option+I (Inspect Element)
      if (isCmdOrCtrl && (isShift || isAlt) && (key === 'i' || keyCode === 73)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+J / Cmd+Option+J (Console)
      if (isCmdOrCtrl && (isShift || isAlt) && (key === 'j' || keyCode === 74)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+C / Cmd+Option+C (Inspect Element Picker)
      if (isCmdOrCtrl && (isShift || isAlt) && (key === 'c' || keyCode === 67)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U / Cmd+Option+U (View Page Source)
      if (isCmdOrCtrl && (key === 'u' || keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S / Cmd+S (Save Page)
      if (isCmdOrCtrl && (key === 's' || keyCode === 83)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    { capture: true }
  );

  // 3. Prevent dragging images/links to external inspector windows
  document.addEventListener('dragstart', (e: DragEvent) => {
    e.preventDefault();
    return false;
  });

  // 4. Infinite Debugger Trap to Freeze Inspector if DevTools is Opened
  const launchDebuggerTrap = () => {
    const loop = () => {
      try {
        const start = performance.now();
        // Dynamically invoke debugger
        (function () {})['constructor']('debugger')();
        const end = performance.now();

        // If debugger paused execution (meaning DevTools is open), lock page
        if (end - start > 100) {
          triggerDevToolsLockdown();
        }
      } catch (err) {}
    };

    setInterval(loop, 200);
  };

  // 5. DevTools Window Dimension & State Detection
  let isLocked = false;
  const triggerDevToolsLockdown = () => {
    if (isLocked) return;
    isLocked = true;

    // Clear console continuously
    try {
      console.clear();
      console.log('%c🔒 Developer Tools Disabled', 'color: red; font-size: 24px; font-weight: bold;');
    } catch {}

    // Inject security lockdown overlay if DevTools panel is detected
    let lockOverlay = document.getElementById('security-inspect-lockout');
    if (!lockOverlay) {
      lockOverlay = document.createElement('div');
      lockOverlay.id = 'security-inspect-lockout';
      lockOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(15, 23, 42, 0.98);
        color: #ffffff;
        z-index: 9999999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: system-ui, -apple-system, sans-serif;
        text-align: center;
        padding: 2rem;
        backdrop-filter: blur(12px);
      `;
      lockOverlay.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 2rem; border-radius: 1rem; max-width: 500px;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
          <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #f87171;">Developer Tools Locked</h2>
          <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.5;">
            Code inspection and browser developer tools are restricted on this portal for security reasons.
          </p>
          <button onclick="window.location.reload()" style="margin-top: 1.5rem; background: #ef4444; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
            Close Inspector & Reload
          </button>
        </div>
      `;
      document.body.appendChild(lockOverlay);
    }
  };

  const detectDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    if (widthThreshold || heightThreshold) {
      triggerDevToolsLockdown();
    } else {
      const lockOverlay = document.getElementById('security-inspect-lockout');
      if (lockOverlay && !widthThreshold && !heightThreshold) {
        lockOverlay.remove();
        isLocked = false;
      }
    }
  };

  // Poll for DevTools window dock/open state
  window.addEventListener('resize', detectDevTools);
  setInterval(detectDevTools, 500);

  // Activate debugger trap
  launchDebuggerTrap();

  // 6. Production Console Override
  if (import.meta.env.PROD || process.env.NODE_ENV === 'production') {
    const noop = () => {};
    window.console.log = noop;
    window.console.debug = noop;
    window.console.info = noop;
    window.console.warn = noop;
  }
}

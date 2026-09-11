/**
 * Code Inspect & DevTools Prevention Utility
 * Secures the frontend application against code inspection, source viewing,
 * right-click context menus, and DevTools keyboard shortcuts.
 */

export function initInspectProtection() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Disable Right-Click Context Menu (Prevents 'Inspect Element' / 'View Page Source')
  document.addEventListener(
    'contextmenu',
    (e: MouseEvent) => {
      e.preventDefault();
      return false;
    },
    { capture: true }
  );

  // 2. Disable DevTools & Source View Keyboard Shortcuts
  document.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const isAlt = e.altKey;
      const key = e.key.toLowerCase();
      const keyCode = e.keyCode;

      // F12 (DevTools)
      if (key === 'f12' || keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I / Cmd+Option+I (Inspect)
      if (isCmdOrCtrl && (isShift || isAlt) && key === 'i') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+J / Cmd+Option+J (Console)
      if (isCmdOrCtrl && (isShift || isAlt) && key === 'j') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+C / Cmd+Option+C (Element Picker)
      if (isCmdOrCtrl && (isShift || isAlt) && key === 'c') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U / Cmd+Option+U (View Page Source)
      if (isCmdOrCtrl && key === 'u') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S / Cmd+S (Save Page)
      if (isCmdOrCtrl && key === 's') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    { capture: true }
  );

  // 3. Prevent dragging images or links to external windows to inspect assets
  document.addEventListener('dragstart', (e: DragEvent) => {
    if (e.target && (e.target as HTMLElement).tagName === 'IMG') {
      e.preventDefault();
    }
  });

  // 4. Console log protection in Production environment
  if (import.meta.env.PROD || process.env.NODE_ENV === 'production') {
    const noop = () => {};
    window.console.log = noop;
    window.console.debug = noop;
    window.console.info = noop;
    window.console.warn = noop;
  }
}

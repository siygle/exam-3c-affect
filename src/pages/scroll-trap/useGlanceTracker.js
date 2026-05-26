import { useCallback, useRef, useState } from "react";

// 追蹤滑鼠在某區域停留的次數與總時間。
// 回傳: stats、onEnter、onLeave、registerExternalGlance（讓 toast 也能算一次）、reset。
export function useGlanceTracker() {
  const [stats, setStats] = useState({ count: 0, totalMs: 0 });
  const enteredAtRef = useRef(null);

  const onEnter = useCallback(() => {
    if (enteredAtRef.current !== null) return;
    enteredAtRef.current = performance.now();
  }, []);

  const onLeave = useCallback(() => {
    if (enteredAtRef.current === null) return;
    const duration = performance.now() - enteredAtRef.current;
    enteredAtRef.current = null;
    setStats((prev) => ({
      count: prev.count + 1,
      totalMs: prev.totalMs + duration,
    }));
  }, []);

  const registerExternalGlance = useCallback((ms) => {
    setStats((prev) => ({
      count: prev.count + 1,
      totalMs: prev.totalMs + ms,
    }));
  }, []);

  const reset = useCallback(() => {
    enteredAtRef.current = null;
    setStats({ count: 0, totalMs: 0 });
  }, []);

  const finalize = useCallback(() => {
    if (enteredAtRef.current !== null) {
      const duration = performance.now() - enteredAtRef.current;
      enteredAtRef.current = null;
      setStats((prev) => ({
        count: prev.count + 1,
        totalMs: prev.totalMs + duration,
      }));
    }
  }, []);

  return { stats, onEnter, onLeave, registerExternalGlance, reset, finalize };
}

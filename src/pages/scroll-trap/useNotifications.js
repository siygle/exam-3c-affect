import { useCallback, useEffect, useRef, useState } from "react";
import { NOTIFICATIONS } from "./data";

// mode: 'on' | 'off' | 'random'
//   on: 每 25–45 秒一張
//   random: 每 35–70 秒一張
//   off: 完全不出
export function useNotifications({ enabled, mode }) {
  const [toasts, setToasts] = useState([]);
  const nextIdRef = useRef(0);
  const clickCountRef = useRef(0);
  const [clickCount, setClickCount] = useState(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleToastClick = useCallback(
    (id) => {
      clickCountRef.current += 1;
      setClickCount(clickCountRef.current);
      dismiss(id);
    },
    [dismiss],
  );

  useEffect(() => {
    if (!enabled || mode === "off") return undefined;
    let timeoutId;
    const schedule = () => {
      const min = mode === "on" ? 25000 : 35000;
      const max = mode === "on" ? 45000 : 70000;
      const delay = Math.floor(Math.random() * (max - min)) + min;
      timeoutId = setTimeout(() => {
        const text = NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];
        const id = nextIdRef.current;
        nextIdRef.current += 1;
        setToasts((prev) => [...prev, { id, text, createdAt: Date.now() }]);
        setTimeout(() => dismiss(id), 4000);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, [enabled, mode, dismiss]);

  const reset = useCallback(() => {
    setToasts([]);
    nextIdRef.current = 0;
    clickCountRef.current = 0;
    setClickCount(0);
  }, []);

  return { toasts, dismiss, handleToastClick, clickCount, reset };
}

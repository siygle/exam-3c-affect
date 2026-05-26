import { useEffect, useRef, useState } from "react";

export function useCountdown(totalSeconds, { onExpire } = {}) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setRunning(false);
          if (onExpireRef.current) onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return {
    remaining,
    running,
    start: () => {
      setRemaining(totalSeconds);
      setRunning(true);
    },
    stop: () => setRunning(false),
    reset: () => {
      setRunning(false);
      setRemaining(totalSeconds);
    },
  };
}

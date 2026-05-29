import { useCallback, useEffect, useRef, useState } from "react";

const IDLE_TIMEOUT_MS = 1200;

// 追蹤使用者「主動去碰動態牆」的互動時段（engagement session）。
// 跨裝置統一：滑鼠移入移出（桌機 hover）、觸控、在 feed 內捲動、點貼文都算互動。
// 任一互動開始或延續一個 session；最後一次互動後 IDLE_TIMEOUT_MS 內沒有新互動，
// session 結束、累計時間並把次數 +1。
export function useGlanceTracker() {
  const [stats, setStats] = useState({ count: 0, totalMs: 0 });
  const sessionStartRef = useRef(null);
  const lastActivityRef = useRef(0);
  const idleTimerRef = useRef(null);
  const hoveringRef = useRef(false); // 桌機游標是否仍在 feed 上

  const closeSession = useCallback(() => {
    if (sessionStartRef.current === null) return;
    const end = Math.max(lastActivityRef.current, sessionStartRef.current);
    const duration = end - sessionStartRef.current;
    sessionStartRef.current = null;
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    setStats((prev) => ({
      count: prev.count + 1,
      totalMs: prev.totalMs + Math.max(duration, 0),
    }));
  }, []);

  // 記錄一次互動：開始或延續 session，並重設 idle 計時器。
  const touch = useCallback(() => {
    const now = performance.now();
    lastActivityRef.current = now;
    if (sessionStartRef.current === null) {
      sessionStartRef.current = now;
    }
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    // 若游標仍停在 feed 上（桌機 hover），不啟動 idle 結算，等 pointerout 才結束。
    if (!hoveringRef.current) {
      idleTimerRef.current = setTimeout(closeSession, IDLE_TIMEOUT_MS);
    }
  }, [closeSession]);

  // 桌機 hover 進入：開始 session 並維持，直到 onPointerLeave。
  const onPointerEnter = useCallback(
    (isMouse) => {
      if (isMouse) hoveringRef.current = true;
      touch();
    },
    [touch],
  );

  const onPointerLeave = useCallback(
    (isMouse) => {
      if (isMouse) {
        hoveringRef.current = false;
        // 游標離開就結束 session（與舊版 hover 行為一致）。
        closeSession();
      }
    },
    [closeSession],
  );

  // 純互動訊號（觸控、捲動、點貼文、通知 toast 點擊）。
  const onActivity = useCallback(() => touch(), [touch]);

  const reset = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = null;
    sessionStartRef.current = null;
    lastActivityRef.current = 0;
    hoveringRef.current = false;
    setStats({ count: 0, totalMs: 0 });
  }, []);

  // 遊戲結束時把尚未關閉的 session 收尾。
  const finalize = useCallback(() => {
    hoveringRef.current = false;
    closeSession();
  }, [closeSession]);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return { stats, onPointerEnter, onPointerLeave, onActivity, reset, finalize };
}

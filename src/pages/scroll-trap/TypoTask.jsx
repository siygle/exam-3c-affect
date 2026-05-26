import React, { useEffect, useMemo, useState } from "react";
import { TYPO_ARTICLE_POOL } from "./data";

export default function TypoTask({ onProgress }) {
  // 每次掛載隨機抽一篇文章
  const article = useMemo(
    () => TYPO_ARTICLE_POOL[Math.floor(Math.random() * TYPO_ARTICLE_POOL.length)],
    [],
  );
  const [marked, setMarked] = useState(() => new Set());

  const totalTypos = useMemo(() => article.filter((s) => s.typo).length, [article]);

  const found = useMemo(() => {
    let n = 0;
    marked.forEach((idx) => {
      if (article[idx]?.typo) n += 1;
    });
    return n;
  }, [marked, article]);

  const wrongMarks = marked.size - found;

  useEffect(() => {
    onProgress({
      score: Math.max(0, found - wrongMarks),
      total: totalTypos,
      completed: found === totalTypos,
    });
  }, [found, wrongMarks, totalTypos, onProgress]);

  const toggle = (idx) => {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <h3 className="text-lg font-bold">找錯字</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
          找到 {found} / {totalTypos}
          {wrongMarks > 0 && <span className="ml-2 text-rose-500">（誤標 {wrongMarks}）</span>}
        </span>
      </div>
      <p className="text-sm text-slate-500">
        文章內藏有 {totalTypos} 個錯字，點擊字即可標記。再點一次取消。
      </p>
      <div className="rounded-2xl bg-white p-6 text-lg leading-loose text-slate-800 shadow-sm">
        {article.map((seg, idx) => {
          const isMarked = marked.has(idx);
          return (
            <span
              key={idx}
              onClick={() => toggle(idx)}
              className={`cursor-pointer rounded px-0.5 transition ${
                isMarked
                  ? seg.typo
                    ? "bg-emerald-200 text-emerald-900"
                    : "bg-rose-200 text-rose-900"
                  : "hover:bg-amber-100"
              }`}
            >
              {seg.c}
            </span>
          );
        })}
      </div>
    </div>
  );
}

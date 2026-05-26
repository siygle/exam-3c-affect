import React, { useEffect, useMemo, useState } from "react";
import { DIFF_PUZZLE } from "./data";

export default function DiffTask({ onProgress }) {
  const [marked, setMarked] = useState(() => new Set());
  const diffSet = useMemo(() => new Set(DIFF_PUZZLE.diffIndices), []);
  const total = DIFF_PUZZLE.diffIndices.length;

  const found = useMemo(() => {
    let n = 0;
    marked.forEach((idx) => {
      if (diffSet.has(idx)) n += 1;
    });
    return n;
  }, [marked, diffSet]);

  const wrongMarks = marked.size - found;

  useEffect(() => {
    onProgress({
      score: Math.max(0, found - wrongMarks),
      total,
      completed: found === total,
    });
  }, [found, wrongMarks, total, onProgress]);

  const toggle = (idx) => {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const renderCell = (cell, idx, sourceGrid) => {
    const isMarked = marked.has(idx);
    const isDiff = diffSet.has(idx);
    return (
      <button
        key={`${sourceGrid}-${idx}`}
        onClick={() => toggle(idx)}
        className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition ${
          isMarked ? (isDiff ? "bg-emerald-200" : "bg-rose-200") : "bg-white hover:bg-amber-100"
        }`}
      >
        {cell}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <h3 className="text-lg font-bold">找不同</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
          找到 {found} / {total}
          {wrongMarks > 0 && <span className="ml-2 text-rose-500">（誤標 {wrongMarks}）</span>}
        </span>
      </div>
      <p className="text-sm text-slate-500">
        兩張圖共有 {total} 處不同，點任一邊對應的位置即可標記。
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {[
          { name: "A", grid: DIFF_PUZZLE.gridA },
          { name: "B", grid: DIFF_PUZZLE.gridB },
        ].map(({ name, grid }) => (
          <div key={name} className="space-y-2 rounded-2xl bg-slate-50 p-3 shadow-sm">
            <div className="text-xs font-semibold text-slate-400">圖 {name}</div>
            <div className="grid grid-cols-5 gap-2">
              {grid.map((cell, idx) => renderCell(cell, idx, name))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

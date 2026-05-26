import React, { useEffect, useMemo, useState } from "react";
import { DIFF_EMOJI_POOL } from "./data";

const GRID_SIZE = 25; // 5x5
const DIFF_COUNT = 5;

function buildPuzzle() {
  const gridA = Array.from(
    { length: GRID_SIZE },
    () => DIFF_EMOJI_POOL[Math.floor(Math.random() * DIFF_EMOJI_POOL.length)],
  );

  // 從 0..24 抽出 DIFF_COUNT 個不重複位置
  const positions = Array.from({ length: GRID_SIZE }, (_, i) => i);
  for (let i = positions.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  const diffPositions = positions.slice(0, DIFF_COUNT);

  const gridB = [...gridA];
  diffPositions.forEach((idx) => {
    let next = DIFF_EMOJI_POOL[Math.floor(Math.random() * DIFF_EMOJI_POOL.length)];
    while (next === gridA[idx]) {
      next = DIFF_EMOJI_POOL[Math.floor(Math.random() * DIFF_EMOJI_POOL.length)];
    }
    gridB[idx] = next;
  });

  return { gridA, gridB, diffIndices: diffPositions };
}

export default function DiffTask({ onProgress }) {
  const puzzle = useMemo(() => buildPuzzle(), []);
  const [marked, setMarked] = useState(() => new Set());
  const diffSet = useMemo(() => new Set(puzzle.diffIndices), [puzzle]);
  const total = puzzle.diffIndices.length;

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
          { name: "A", grid: puzzle.gridA },
          { name: "B", grid: puzzle.gridB },
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

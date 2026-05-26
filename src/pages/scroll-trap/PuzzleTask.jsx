import React, { useEffect, useMemo, useState } from "react";

const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function indexToCoord(i) {
  return { r: Math.floor(i / 3), c: i % 3 };
}

function neighbors(i) {
  const { r, c } = indexToCoord(i);
  const out = [];
  if (r > 0) out.push(i - 3);
  if (r < 2) out.push(i + 3);
  if (c > 0) out.push(i - 1);
  if (c < 2) out.push(i + 1);
  return out;
}

function shuffleFromGoal(steps = 80) {
  const tiles = [...GOAL];
  let emptyIdx = tiles.indexOf(0);
  let lastEmpty = -1;
  for (let i = 0; i < steps; i += 1) {
    const candidates = neighbors(emptyIdx).filter((n) => n !== lastEmpty);
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    [tiles[emptyIdx], tiles[next]] = [tiles[next], tiles[emptyIdx]];
    lastEmpty = emptyIdx;
    emptyIdx = next;
  }
  return tiles;
}

export default function PuzzleTask({ onProgress }) {
  const [tiles, setTiles] = useState(() => shuffleFromGoal());
  const [moves, setMoves] = useState(0);

  const solved = useMemo(() => tiles.every((t, i) => t === GOAL[i]), [tiles]);

  useEffect(() => {
    onProgress({
      score: solved ? 1 : 0,
      total: 1,
      completed: solved,
      extra: { moves },
    });
  }, [solved, moves, onProgress]);

  const onTileClick = (idx) => {
    if (solved) return;
    const emptyIdx = tiles.indexOf(0);
    if (!neighbors(idx).includes(emptyIdx)) return;
    const next = [...tiles];
    [next[idx], next[emptyIdx]] = [next[emptyIdx], next[idx]];
    setTiles(next);
    setMoves((m) => m + 1);
  };

  const reshuffle = () => {
    setTiles(shuffleFromGoal());
    setMoves(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <h3 className="text-lg font-bold">3×3 滑動拼圖</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
          步數 {moves}
          {solved && <span className="ml-2 text-emerald-600">✓ 完成</span>}
        </span>
      </div>
      <p className="text-sm text-slate-500">
        點擊空格旁邊的數字將它滑入空格，把數字依序排成 1 → 8。
      </p>
      <div className="mx-auto grid w-fit grid-cols-3 gap-2 rounded-3xl bg-slate-100 p-3 shadow-sm">
        {tiles.map((t, i) =>
          t === 0 ? (
            <div key={i} className="h-20 w-20 rounded-2xl bg-slate-50" />
          ) : (
            <button
              key={i}
              onClick={() => onTileClick(i)}
              className={`h-20 w-20 rounded-2xl text-2xl font-bold transition ${
                solved
                  ? "bg-emerald-200 text-emerald-900"
                  : "bg-white text-slate-800 hover:-translate-y-0.5 hover:shadow"
              }`}
            >
              {t}
            </button>
          ),
        )}
      </div>
      <div className="text-center">
        <button
          onClick={reshuffle}
          className="rounded-full px-4 py-2 text-xs text-slate-500 hover:text-slate-800"
        >
          重新打散
        </button>
      </div>
    </div>
  );
}

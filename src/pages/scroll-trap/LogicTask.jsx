import React, { useEffect, useState } from "react";
import { LOGIC_QUESTIONS } from "./data";

export default function LogicTask({ onProgress }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  const total = LOGIC_QUESTIONS.length;
  const correctCount = answers.filter((a, i) => a === LOGIC_QUESTIONS[i].answerIndex).length;
  const finished = answers.length === total;

  useEffect(() => {
    onProgress({
      score: correctCount,
      total,
      completed: finished,
    });
  }, [correctCount, total, finished, onProgress]);

  const pick = (optionIndex) => {
    if (answers[current] !== undefined) return;
    const next = [...answers];
    next[current] = optionIndex;
    setAnswers(next);
  };

  const goNext = () => {
    if (current < total - 1) setCurrent(current + 1);
  };

  const goPrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  if (finished) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <h3 className="text-lg font-bold">邏輯推理</h3>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
            答對 {correctCount} / {total}
          </span>
        </div>
        <div className="space-y-3">
          {LOGIC_QUESTIONS.map((q, i) => {
            const ok = answers[i] === q.answerIndex;
            return (
              <div key={i} className="rounded-2xl bg-white p-4 text-sm shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium text-slate-700">
                    {i + 1}. {q.question}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                      ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {ok ? "✓ 對" : "✗ 錯"}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  你的答案：{q.options[answers[i]]} ｜ 正解：
                  {q.options[q.answerIndex]}
                </div>
                <div className="mt-1 text-xs text-slate-400">{q.explain}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const q = LOGIC_QUESTIONS[current];
  const myAnswer = answers[current];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <h3 className="text-lg font-bold">邏輯推理</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
          第 {current + 1} / {total} 題
        </span>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-base text-slate-800">{q.question}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {q.options.map((opt, i) => {
            const picked = myAnswer === i;
            const showCorrect = myAnswer !== undefined && i === q.answerIndex;
            const showWrong = picked && myAnswer !== q.answerIndex;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={myAnswer !== undefined}
                className={`rounded-2xl border p-3 text-left text-sm transition ${
                  showCorrect
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : showWrong
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : picked
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {myAnswer !== undefined && (
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">{q.explain}</div>
        )}
      </div>
      <div className="flex justify-between">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="rounded-full px-4 py-2 text-sm text-slate-500 disabled:opacity-30"
        >
          ← 上一題
        </button>
        <button
          onClick={goNext}
          disabled={myAnswer === undefined || current === total - 1}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-30"
        >
          下一題 →
        </button>
      </div>
    </div>
  );
}

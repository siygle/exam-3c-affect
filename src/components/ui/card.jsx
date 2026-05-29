import React from "react";

export function Card({ className = "", ...props }) {
  // 只有在呼叫端沒指定背景／文字色時才套用預設值，
  // 否則 Tailwind 會因為 CSS 產生順序而讓預設的 bg-white 蓋掉傳入的 bg-slate-900。
  const hasBg = /(^|\s)bg-/.test(className);
  const hasText = /(^|\s)text-/.test(className);
  const base = `rounded-xl border ${hasBg ? "" : "bg-white"} ${hasText ? "" : "text-slate-950"}`;
  return <div className={`${base} ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={`p-6 ${className}`} {...props} />;
}

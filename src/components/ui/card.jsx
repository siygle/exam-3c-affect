import React from "react";

export function Card({ className = "", ...props }) {
  return <div className={`rounded-xl border bg-white text-slate-950 ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={`p-6 ${className}`} {...props} />;
}

import React from "react";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400";
const variants = {
  default: "bg-slate-900 text-white shadow hover:bg-slate-800",
  outline: "border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-900",
};

export function Button({ className = "", variant = "default", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.default} h-10 px-4 py-2 ${className}`}
      {...props}
    />
  );
}

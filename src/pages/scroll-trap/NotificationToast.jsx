import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

export default function NotificationToast({ toasts, onDismiss, onClick }) {
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-72 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => onClick(t.id)}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl bg-slate-900/95 px-4 py-3 text-left text-white shadow-lg backdrop-blur"
          >
            <Bell className="h-4 w-4 shrink-0 text-amber-300" />
            <span className="flex-1 text-sm">{t.text}</span>
            <X
              className="h-4 w-4 shrink-0 text-slate-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(t.id);
              }}
            />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

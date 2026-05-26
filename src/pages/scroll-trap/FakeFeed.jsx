import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { FEED_POSTS } from "./data";

function pickRandomPost(usedIds) {
  const pool = FEED_POSTS.filter((p) => !usedIds.has(p.name));
  const source = pool.length > 0 ? pool : FEED_POSTS;
  const post = source[Math.floor(Math.random() * source.length)];
  return {
    ...post,
    id: `${post.name}-${Date.now()}-${Math.random()}`,
    likes: Math.floor(Math.random() * 200) + 3,
    comments: Math.floor(Math.random() * 30),
  };
}

export default function FakeFeed({ onEnter, onLeave }) {
  const [items, setItems] = useState(() => {
    const seed = [];
    const used = new Set();
    for (let i = 0; i < 3; i += 1) {
      const p = pickRandomPost(used);
      used.add(p.name);
      seed.push(p);
    }
    return seed;
  });
  const usedRef = useRef(new Set(items.map((p) => p.name)));

  useEffect(() => {
    let timeoutId;
    const schedule = () => {
      const delay = Math.floor(Math.random() * 4000) + 4000;
      timeoutId = setTimeout(() => {
        const post = pickRandomPost(usedRef.current);
        usedRef.current.add(post.name);
        if (usedRef.current.size > 12) usedRef.current = new Set([post.name]);
        setItems((prev) => [post, ...prev].slice(0, 8));
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="flex h-[640px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
          <span className="text-sm font-semibold text-slate-700">動態牆</span>
        </div>
        <span className="text-xs text-slate-400">即時更新中</span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-white p-3 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-rose-200 text-lg">
                  {item.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-700">{item.name}</div>
                  <div className="text-[10px] text-slate-400">剛剛</div>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-700">{item.text}</p>
              {item.image && (
                <div className="mt-2 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 text-4xl">
                  {item.image}
                </div>
              )}
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" /> {item.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> {item.comments}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

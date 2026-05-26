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

function FeedImage({ image, avatar }) {
  const [errored, setErrored] = useState(false);

  if (!image) return null;

  if (image.kind === "emoji" || errored) {
    const value = errored ? avatar : image.value;
    return (
      <div className="mt-2 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 text-4xl">
        {value}
      </div>
    );
  }

  // image.tag 是逗號分隔的關鍵字，例如 "cat,kitten"
  // Loremflickr 會根據 tag 回傳對應主題的隨機照片
  const url = `https://loremflickr.com/320/200/${encodeURIComponent(image.tag)}`;
  return (
    <img
      src={url}
      alt=""
      loading="lazy"
      onError={() => setErrored(true)}
      className="mt-2 h-28 w-full rounded-xl bg-slate-100 object-cover"
    />
  );
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
  const touchTimeoutRef = useRef(null);

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

  // 觸控裝置不會觸發 mouseenter/leave；改用 touchstart 開始計時、
  // touchend 之後給 1 秒緩衝，期間若再 touch 就接續累計。
  const handleTouchStart = () => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    } else {
      onEnter();
    }
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      touchTimeoutRef.current = null;
      onLeave();
    }, 1000);
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="flex h-[420px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm md:h-[560px] lg:h-[640px]"
    >
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
          <span className="text-sm font-semibold text-slate-700">動態牆</span>
        </div>
        <span className="text-xs text-slate-400">即時更新中</span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-3 md:p-4">
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
              <FeedImage image={item.image} avatar={item.avatar} />
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

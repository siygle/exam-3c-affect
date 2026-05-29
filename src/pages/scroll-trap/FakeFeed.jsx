import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bell, Eye, ChevronDown } from "lucide-react";
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

function FeedImage({ image, avatar, expanded }) {
  const [errored, setErrored] = useState(false);

  if (!image) return null;

  let inner;
  if (image.kind === "emoji" || errored) {
    const value = errored ? avatar : image.value;
    inner = (
      <div className="flex h-28 items-center justify-center bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 text-4xl">
        {value}
      </div>
    );
  } else {
    // image.tag 是逗號分隔的關鍵字，例如 "cat,kitten"
    // Loremflickr 會根據 tag 回傳對應主題的隨機照片
    const url = `https://loremflickr.com/320/200/${encodeURIComponent(image.tag)}`;
    inner = (
      <img
        src={url}
        alt=""
        loading="lazy"
        onError={() => setErrored(true)}
        className="h-28 w-full bg-slate-100 object-cover"
      />
    );
  }

  return (
    <div className="relative mt-2 overflow-hidden rounded-xl">
      <div className={expanded ? "" : "scale-110 blur-md"}>{inner}</div>
      {!expanded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30">
          <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow">
            <Eye className="h-3.5 w-3.5" /> 點擊看完整圖片
          </span>
        </div>
      )}
    </div>
  );
}

function FeedPost({ item, onActivity }) {
  const [expanded, setExpanded] = useState(false);

  const expand = () => {
    if (expanded) return;
    setExpanded(true);
    onActivity?.();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      onClick={() => onActivity?.()}
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

      <p className={`mt-2 text-sm text-slate-700 ${expanded ? "" : "line-clamp-1"}`}>{item.text}</p>

      {expanded ? (
        <FeedImage image={item.image} avatar={item.avatar} expanded />
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            expand();
          }}
          className="mt-1 w-full text-left"
        >
          {item.image && <FeedImage image={item.image} avatar={item.avatar} expanded={false} />}
          <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-500">
            查看更多 <ChevronDown className="h-3 w-3" />
          </span>
        </button>
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
  );
}

// onPointerEnter(isMouse) / onPointerLeave(isMouse)：桌機游標移入移出
// onActivity()：任何主動互動（觸控、捲動 feed、點貼文）
export default function FakeFeed({ onPointerEnter, onPointerLeave, onActivity }) {
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
  const [unseen, setUnseen] = useState(0);
  const usedRef = useRef(new Set(items.map((p) => p.name)));
  const containerRef = useRef(null);
  const visibleRef = useRef(true);

  // 偵測 feed 是否在畫面內（手機常常滾到看不見）。看得見時清掉「新貼文」提示。
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting && entry.intersectionRatio >= 0.4;
        if (visibleRef.current) setUnseen(0);
      },
      { threshold: [0, 0.4, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let timeoutId;
    const schedule = () => {
      const delay = Math.floor(Math.random() * 4000) + 4000;
      timeoutId = setTimeout(() => {
        const post = pickRandomPost(usedRef.current);
        usedRef.current.add(post.name);
        if (usedRef.current.size > 12) usedRef.current = new Set([post.name]);
        setItems((prev) => [post, ...prev].slice(0, 8));
        if (!visibleRef.current) setUnseen((n) => Math.min(n + 1, 9));
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  const handlePointerEnter = (e) => onPointerEnter?.(e.pointerType === "mouse");
  const handlePointerLeave = (e) => onPointerLeave?.(e.pointerType === "mouse");

  const scrollToFeed = () => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setUnseen(0);
    onActivity?.();
  };

  return (
    <>
      <div
        ref={containerRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={() => onActivity?.()}
        onTouchStart={() => onActivity?.()}
        className="flex h-[420px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm md:h-[560px] lg:h-[640px]"
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
            <span className="text-sm font-semibold text-slate-700">動態牆</span>
          </div>
          <span className="text-xs text-slate-400">即時更新中</span>
        </div>
        <div
          onScroll={() => onActivity?.()}
          className="flex-1 space-y-3 overflow-y-auto p-3 md:p-4"
        >
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <FeedPost key={item.id} item={item} onActivity={onActivity} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 動態牆滾出畫面、又有新貼文時，底部浮出提示誘惑使用者滑回去看 */}
      <AnimatePresence>
        {unseen > 0 && (
          <motion.button
            type="button"
            onClick={scrollToFeed}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-rose-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg lg:hidden"
          >
            <Bell className="h-4 w-4" />
            動態牆有 {unseen} 則新貼文
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

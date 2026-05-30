import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  ShieldAlert,
  Camera,
  Film,
  Gamepad2,
  ClipboardList,
  Tag,
  Lock,
  RotateCcw,
  BookOpen,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import previewImg from "@/assets/trace-me/preview.webp";
import courtImg from "@/assets/trace-me/photo-court.webp";
import drinkImg from "@/assets/trace-me/photo-drink.webp";
import streetImg from "@/assets/trace-me/short-street.webp";
import posterImg from "@/assets/trace-me/event-poster.webp";
import birthdayImg from "@/assets/trace-me/friend-birthday.webp";

// 每條線索的標題、說明與暴露風險值
const CLUES = {
  sport: { title: "運動興趣", detail: "照片文字透露經常練球", risk: 4 },
  schoolBadge: { title: "制服校徽", detail: "背景與衣服可能辨識學校", risk: 14 },
  routine: { title: "固定時段", detail: "每週三放學後的習慣", risk: 12 },
  shop: { title: "店家分店", detail: "飲料照片出現車站分店名稱", risk: 14 },
  sameId: { title: "相同暱稱", detail: "不同平台皆使用 lightball_520", risk: 16 },
  team: { title: "賽事名單", detail: "公告中出現姓名與學校", risk: 18 },
  birthday: { title: "生日標記", detail: "朋友貼文暴露生日月份", risk: 8 },
  liveLocation: { title: "即時位置", detail: "限動顯示當下正在某車站", risk: 16 },
};

// image.src 用內建場景照片（線索畫在圖中）；scene 'forum' 用樣式區塊
const PLATFORMS = [
  {
    id: "photo",
    name: "PhotoGram",
    icon: Camera,
    sublabel: "公開貼文",
    posts: [
      {
        avatar: "🏀",
        user: "@lightball_520",
        time: "週一 18:42",
        text: "今天練球累爆了！但週末比賽一定要贏 🏀",
        textClue: { id: "sport", label: "練球內容" },
        image: { src: courtImg },
        imageNote: "照片中可注意：制服字樣、球場背景、放學後時段感。",
        note: "公開貼文｜所有人皆可查看",
        noteClue: { id: "schoolBadge", label: "制服上的校名" },
      },
      {
        avatar: "🧋",
        user: "@lightball_520",
        time: "週三 17:18",
        text: "練完球的固定儀式！",
        textClue: { id: "routine", label: "「固定」習慣" },
        image: { src: drinkImg },
        note: "門市與車站資訊清楚可見",
        noteClue: { id: "shop", label: "分店名稱與地點" },
      },
    ],
  },
  {
    id: "short",
    name: "ShortVideo",
    icon: Film,
    sublabel: "位置資訊",
    posts: [
      {
        avatar: "🎬",
        user: "@lightball_520",
        time: "今天 18:04",
        text: "放學訓練結束，喝杯奶茶回家～～ #日常碎片 #放學後的生活 #籃球少年",
        image: { src: streetImg },
        note: "短影音畫面同時露出時間、地點與互動資訊",
        noteClue: { id: "liveLocation", label: "即時地點標籤" },
      },
    ],
  },
  {
    id: "game",
    name: "GameHub",
    icon: Gamepad2,
    sublabel: "公開留言",
    posts: [
      {
        avatar: "🎮",
        user: "玩家 lightball_520",
        time: "昨天 21:32",
        text: "星期三我都練球比較晚，九點半後再開團！",
        scene: "forum",
        sceneLines: ["公開論壇留言串", "常用 ID：lightball_520", "與社群平台的公開帳號一致。"],
        sceneClue: { id: "sameId", label: "與 PhotoGram 相同的 ID" },
        note: "即使沒有照片，只要 ID 重複，也可能被跨平台串聯。",
      },
    ],
  },
  {
    id: "event",
    name: "EventBoard",
    icon: ClipboardList,
    sublabel: "活動公告",
    posts: [
      {
        avatar: "📋",
        user: "校際運動公告",
        time: "5 月 12 日",
        text: "新河區國中籃球交流賽得獎名單",
        image: { src: posterImg },
        imageNote: "公告海報上可見參賽者姓名與所屬學校。",
        note: "提醒：有些公開足跡來自活動或他人，而非本人主動發布",
        noteClue: { id: "team", label: "姓名與學校公告" },
      },
    ],
  },
  {
    id: "friend",
    name: "FriendTag",
    icon: Tag,
    sublabel: "朋友標記",
    posts: [
      {
        avatar: "🎂",
        user: "@friend_mimi",
        time: "5 月 20 日",
        text: "小光生日快樂！放學聚餐成功 🎉",
        image: { src: birthdayImg },
        note: "朋友標記與聚會照片也會暴露個人資訊",
        noteClue: { id: "birthday", label: "生日與朋友標記" },
      },
    ],
  },
];

const PLATFORM_MAP = Object.fromEntries(PLATFORMS.map((p) => [p.id, p]));

const REPAIRS = [
  { id: "mask", title: "遮蔽照片中的制服校徽", note: "避免照片直接暴露學校", reduce: 14 },
  {
    id: "delay",
    title: "取消即時地點，延後發布貼文",
    note: "降低當下位置與固定行程風險",
    reduce: 19,
  },
  { id: "alias", title: "遊戲平台改用不同公開暱稱", note: "降低跨平台帳號被輕易串聯", reduce: 16 },
  {
    id: "tag",
    title: "請朋友將公開生日標記改為好友可見",
    note: "處理來自他人的公開足跡",
    reduce: 10,
  },
  {
    id: "privacy",
    title: "將日常生活貼文調整可見範圍",
    note: "減少陌生人取得完整線索",
    reduce: 13,
  },
];

const CHOICES = [
  { id: "share", icon: "📣", title: "貼到班群分享", desc: "讓大家看看你查出的資料。" },
  { id: "dig", icon: "🔎", title: "繼續挖住址", desc: "你想證明自己能找到更多資訊。" },
  { id: "warn", icon: "🛡️", title: "停止並提醒風險", desc: "不散布資訊，整理可以改善的地方。" },
  { id: "report", icon: "🤝", title: "告訴老師討論", desc: "以匿名虛構案例討論，不公開個資。" },
];

const CHOICE_FEEDBACK = {
  share: {
    good: false,
    score: 0,
    html: "這會造成二次傷害。公開資訊不代表可以重新整理、貼標籤並轉傳。散布推測結果可能導致騷擾或霸凌。更安全的行動是停止擴散，改為討論保護方式。",
  },
  dig: {
    good: false,
    score: 1,
    html: "你已跨過合理界線。當教學目的已達成，繼續尋找住址等私人資料不會讓人更安全，反而提高傷害風險。",
  },
  warn: {
    good: true,
    score: 10,
    html: "這是負責任的選擇。你辨識出風險後停止追查，也沒有散布資訊；接下來可以幫助角色管理公開內容。",
  },
  report: {
    good: true,
    score: 10,
    html: "這是適合課堂的處理方式。使用匿名、虛構案例討論風險，而不揭露任何真人資訊，能讓大家學習而不造成傷害。",
  },
};

function riskStatus(risk) {
  if (risk >= 70) return "高風險：可推測身分或行動資訊";
  if (risk >= 38) return "中度風險：多個線索已可串聯";
  if (risk > 0) return "低度風險：已有公開線索";
  return "尚未整理出可辨識線索";
}

function getInferences(clues) {
  const arr = [];
  if (clues.has("sport")) arr.push({ text: "興趣：籃球｜可信度高", low: true });
  if (clues.has("schoolBadge")) arr.push({ text: "可能就讀學校｜中度風險" });
  if (clues.has("routine") && clues.has("shop")) arr.push({ text: "每週三活動地點｜高風險" });
  if (clues.has("sameId")) arr.push({ text: "跨平台帳號串聯｜高風險" });
  if (clues.has("team") && clues.has("schoolBadge")) arr.push({ text: "姓名＋學校｜高度辨識" });
  if (clues.has("birthday")) arr.push({ text: "生日月份與朋友圈｜中度風險" });
  if (clues.has("liveLocation")) arr.push({ text: "當下位置｜高度風險" });
  return arr;
}

function computeUnlocked(clues) {
  const set = new Set(["photo"]);
  if (clues.size >= 2) {
    set.add("short");
    set.add("game");
  }
  if (clues.has("schoolBadge") && clues.has("sameId")) set.add("event");
  if (clues.has("team")) set.add("friend");
  return set;
}

function SceneImage({ image }) {
  return (
    <img
      src={image.src}
      alt=""
      loading="lazy"
      className="mt-3 max-h-72 w-full rounded-xl border border-cyan-900/40 bg-slate-800 object-cover"
    />
  );
}

function ClueButton({ clue, found, onCollect }) {
  return (
    <button
      type="button"
      onClick={() => onCollect(clue.id)}
      className={`mx-0.5 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[13px] transition ${
        found
          ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
          : "border-dashed border-amber-400/55 bg-amber-400/10 text-amber-200 hover:bg-amber-400/25"
      }`}
    >
      {found ? "✓ " : ""}
      {clue.label}
    </button>
  );
}

function Post({ post, clues, onCollect }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4"
    >
      <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-200">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-lg">
          {post.avatar}
        </span>
        <span>{post.user}</span>
        <time className="ml-auto text-xs font-normal text-slate-400">{post.time}</time>
      </div>

      <p className="my-3 text-sm leading-relaxed text-slate-200">
        {post.text}
        {post.textClue && (
          <ClueButton
            clue={post.textClue}
            found={clues.has(post.textClue.id)}
            onCollect={onCollect}
          />
        )}
      </p>

      {post.image && <SceneImage image={post.image} />}
      {post.imageNote && <div className="mt-2 text-xs text-slate-400">{post.imageNote}</div>}

      {post.scene && (
        <div
          className={`mt-1 rounded-xl border p-4 text-sm leading-relaxed ${
            post.scene === "poster"
              ? "border-amber-700/40 bg-gradient-to-br from-amber-900/30 to-slate-800 text-amber-100"
              : "border-cyan-900/40 bg-slate-800 text-slate-200"
          }`}
        >
          {post.sceneLines.map((line, i) => (
            <div key={i} className={i === 0 ? "font-semibold" : "mt-1"}>
              {line}
            </div>
          ))}
          {post.sceneClue && (
            <div className="mt-2">
              <ClueButton
                clue={post.sceneClue}
                found={clues.has(post.sceneClue.id)}
                onCollect={onCollect}
              />
            </div>
          )}
        </div>
      )}

      {post.note && (
        <div className="mt-3 text-xs text-slate-400">
          {post.note}{" "}
          {post.noteClue && (
            <ClueButton
              clue={post.noteClue}
              found={clues.has(post.noteClue.id)}
              onCollect={onCollect}
            />
          )}
        </div>
      )}
    </motion.article>
  );
}

function TeacherModal({ onClose }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4"
    >
      <div className="max-h-[88vh] max-w-2xl overflow-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 text-slate-200 shadow-2xl md:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold">教師引導說明</h2>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          本頁以虛構角色「小光」示範公開貼文如何被串聯。建議投影操作或由小組共同操作，不要求學生查找或揭露自己的實際帳號內容。
        </p>
        <h3 className="mt-5 text-sm font-semibold text-cyan-300">學習目標</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>辨識照片背景、打卡、固定暱稱與朋友標記等數位足跡。</li>
          <li>理解單一線索與交叉比對後的風險差異。</li>
          <li>練習「停止追查、不散布、提出防護」的數位公民行動。</li>
        </ul>
        <h3 className="mt-5 text-sm font-semibold text-cyan-300">建議流程（約 25–35 分鐘）</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>3 分鐘：詢問學生「一張放學自拍能透露什麼？」</li>
          <li>10 分鐘：分組完成調查階段，提醒圈出關鍵線索。</li>
          <li>5 分鐘：停在倫理選擇畫面，全班先討論再點選。</li>
          <li>7 分鐘：完成修復階段，說明有些外部公告並非自己能完全控制。</li>
          <li>5 分鐘：使用結算討論題收束課程。</li>
        </ul>
        <h3 className="mt-5 text-sm font-semibold text-cyan-300">課堂界線</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          所有練習只使用虛構資料或經明確同意的自我檢視資料。不進行真人帳號搜尋競賽、不公開搜尋結果、不將「查得到」誤解為「可以散布」。
        </p>
      </div>
    </div>
  );
}

export default function TraceMe({ onBack }) {
  const [phase, setPhase] = useState("start"); // start|investigation|decision|repair|ending
  const [platform, setPlatform] = useState("photo");
  const [clues, setClues] = useState(() => new Set());
  const [risk, setRisk] = useState(0);
  const [choice, setChoice] = useState(null);
  const [ethics, setEthics] = useState(0);
  const [repairRisk, setRepairRisk] = useState(0);
  const [repairs, setRepairs] = useState(() => new Set());
  const [teacherOpen, setTeacherOpen] = useState(false);

  const unlocked = useMemo(() => computeUnlocked(clues), [clues]);
  const inferences = useMemo(() => getInferences(clues), [clues]);
  const canDecide = clues.size >= 5;

  const reset = () => {
    setPhase("start");
    setPlatform("photo");
    setClues(new Set());
    setRisk(0);
    setChoice(null);
    setEthics(0);
    setRepairRisk(0);
    setRepairs(new Set());
  };

  const startGame = () => {
    setPlatform("photo");
    setClues(new Set());
    setRisk(0);
    setChoice(null);
    setEthics(0);
    setRepairRisk(0);
    setRepairs(new Set());
    setPhase("investigation");
  };

  const collectClue = (id) => {
    if (clues.has(id)) return;
    setClues((prev) => new Set(prev).add(id));
    setRisk((r) => Math.min(100, r + CLUES[id].risk));
  };

  const choose = (id) => {
    setChoice(id);
    setEthics(CHOICE_FEEDBACK[id].score);
  };

  const enterRepair = () => {
    setRepairRisk(risk);
    setRepairs(new Set());
    setPhase("repair");
  };

  const applyRepair = (id) => {
    if (repairs.has(id)) return;
    setRepairs((prev) => new Set(prev).add(id));
    setRepairRisk((r) => Math.max(0, r - REPAIRS.find((x) => x.id === id).reduce));
  };

  const phaseStep = (key) => {
    const order = { investigation: 1, decision: 2, repair: 3 };
    const cur = order[phase] || 1;
    const me = order[key];
    return me === cur ? "active" : "";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-3 py-5 sm:px-4 md:px-6 md:py-8">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                variant="outline"
                onClick={onBack}
                className="rounded-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> 返回首頁
              </Button>
            )}
            <div className="flex items-center gap-2 font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950">
                ◎
              </span>
              <div>
                Trace Me
                <span className="block text-xs font-normal text-slate-400">數位足跡調查室</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTeacherOpen(true)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              <BookOpen className="mr-1 inline h-4 w-4" /> 教師引導
            </button>
            {phase !== "start" && (
              <button
                onClick={reset}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
              >
                <RotateCcw className="mr-1 inline h-4 w-4" /> 重新開始
              </button>
            )}
          </div>
        </header>

        {/* Start */}
        {phase === "start" && (
          <div className="grid gap-6 md:grid-cols-[1.1fr_.9fr] md:items-start">
            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm font-bold text-cyan-300">
                <Search className="h-4 w-4" /> 數位足跡體驗遊戲
              </span>
              <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
                你留下的線索，
                <br />
                <span className="text-cyan-300">陌生人能拼出多少？</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
                從一位虛構角色的公開貼文開始調查。你會發現，普通的照片、暱稱與打卡資訊，被串聯後可能透露超乎預期的生活輪廓。
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={startGame}
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5"
                >
                  開始案件：籃球少年小光
                </button>
                <button
                  onClick={() => setTeacherOpen(true)}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-slate-200 hover:bg-slate-800"
                >
                  課堂使用說明
                </button>
              </div>
              <div className="mt-8 flex gap-2 text-sm leading-relaxed text-slate-400">
                <span>🛡️</span>
                <span>
                  <strong className="text-emerald-400">安全規則：</strong>
                  本遊戲資料皆為虛構。請勿在課堂中搜尋、分享或評論真實同學的個人資訊。
                </span>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>公開貼文預覽</span>
                <span>PhotoGram</span>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-700 text-xl">
                    🏀
                  </span>
                  <div className="space-y-1.5">
                    <div className="h-2 w-24 rounded bg-slate-700" />
                    <div className="h-2 w-14 rounded bg-slate-700" />
                  </div>
                </div>
                <img
                  src={previewImg}
                  alt=""
                  loading="lazy"
                  className="mt-4 max-h-56 w-full rounded-xl border border-slate-700 bg-slate-800 object-cover"
                />
                <div className="mt-3 h-2 w-3/4 rounded bg-slate-700" />
                <div className="mt-2 h-2 w-1/2 rounded bg-slate-700" />
              </div>
              <div className="mt-4 text-sm text-slate-400">
                線索被串聯後，暴露風險可能快速升高：
              </div>
              <div className="mt-2 flex gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded ${i < 3 ? "bg-rose-500" : "bg-slate-700"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Investigation */}
        {phase === "investigation" && (
          <>
            <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_340px]">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-4">
                <div>
                  <h2 className="text-lg font-bold md:text-xl">案件 01｜未知使用者 A</h2>
                  <p className="text-sm text-slate-400">
                    任務：辨識公開資訊造成的風險，並在越界前作出選擇。
                  </p>
                </div>
                <div className="hidden gap-1.5 sm:flex">
                  {[
                    ["investigation", "調查"],
                    ["decision", "倫理選擇"],
                    ["repair", "修復"],
                  ].map(([key, label]) => (
                    <span
                      key={key}
                      className={`rounded-lg border px-2.5 py-2 text-xs ${
                        phaseStep(key) === "active"
                          ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-300"
                          : "border-slate-700 text-slate-400"
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>目前暴露風險</span>
                  <strong className="text-xl text-slate-100">{risk}</strong>
                </div>
                <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-slate-800">
                  <motion.span
                    className="block h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${risk}%` }}
                  />
                </div>
                <div className="mt-2.5 text-xs text-slate-400">{riskStatus(risk)}</div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
              {/* platforms */}
              <aside className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  公開平台
                </div>
                <div className="flex flex-wrap gap-2 lg:flex-col">
                  {PLATFORMS.map((p) => {
                    const Icon = p.icon;
                    const isUnlocked = unlocked.has(p.id);
                    const active = platform === p.id;
                    return (
                      <button
                        key={p.id}
                        disabled={!isUnlocked}
                        onClick={() => isUnlocked && setPlatform(p.id)}
                        className={`flex w-[calc(50%-0.25rem)] items-center gap-3 rounded-xl border p-3 text-left transition lg:w-full ${
                          active
                            ? "border-cyan-600/60 bg-slate-800"
                            : isUnlocked
                              ? "border-transparent hover:border-slate-700 hover:bg-slate-800/60"
                              : "border-transparent text-slate-500"
                        }`}
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-800">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-slate-200">
                            {p.name}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            {isUnlocked ? p.sublabel : "需要更多線索"}
                            {!isUnlocked && <Lock className="h-3 w-3" />}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 border-t border-slate-700 pt-4">
                  <h3 className="text-sm font-semibold">調查提示</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    點擊以黃色虛線標示的細節，將資料加入足跡板。注意：找到越敏感的資料，風險也越高。
                  </p>
                  <span className="mt-3 inline-block rounded-lg bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-300">
                    安全判斷分：{ethics}
                  </span>
                </div>
              </aside>

              {/* feed */}
              <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 md:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold">{PLATFORM_MAP[platform].name}</h3>
                  <span className="text-xs text-slate-400">找出畫面中的公開線索</span>
                </div>
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {PLATFORM_MAP[platform].posts.map((post, i) => (
                      <Post
                        key={`${platform}-${i}`}
                        post={post}
                        clues={clues}
                        onCollect={collectClue}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>

              {/* board */}
              <aside className="flex flex-col rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-bold">足跡拼圖板</h3>
                  <span className="text-xs text-cyan-300">{clues.size} 項線索</span>
                </div>
                {clues.size === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-700 p-5 text-center text-sm text-slate-400">
                    尚未收集線索
                    <br />
                    從貼文細節開始觀察
                  </div>
                ) : (
                  <div className="max-h-60 space-y-2 overflow-auto">
                    {[...clues].map((id) => (
                      <div
                        key={id}
                        className="flex items-start gap-2.5 rounded-xl border border-slate-700 bg-slate-800/60 p-2.5"
                      >
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                        <div>
                          <strong className="block text-[13px] text-slate-100">
                            {CLUES[id].title}
                          </strong>
                          <small className="text-slate-400">{CLUES[id].detail}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 border-t border-slate-700 pt-3.5">
                  <h4 className="mb-2.5 text-sm font-semibold">目前可以推測的輪廓</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {inferences.length === 0 ? (
                      <span className="w-full rounded-lg border border-dashed border-slate-700 p-3 text-center text-xs text-slate-400">
                        資訊不足，無法推測
                      </span>
                    ) : (
                      inferences.map((inf, i) => (
                        <span
                          key={i}
                          className={`rounded-lg border px-2 py-1.5 text-xs ${
                            inf.low
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                              : "border-rose-500/30 bg-rose-500/10 text-rose-200"
                          }`}
                        >
                          {inf.text}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <button
                    disabled={!canDecide}
                    onClick={() => setPhase("decision")}
                    className="w-full rounded-xl bg-cyan-400 py-3 font-bold text-slate-950 transition enabled:hover:-translate-y-0.5 disabled:opacity-40"
                  >
                    {canDecide ? "進入關鍵選擇" : `再找 ${5 - clues.size} 項線索解鎖`}
                  </button>
                  <div className="mt-3 rounded-lg bg-amber-500/10 p-2.5 text-xs leading-relaxed text-amber-200">
                    界線提醒：遊戲的目的不是「找出真人」，而是辨識暴露風險並學會保護自己與他人。
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}

        {/* Decision */}
        {phase === "decision" && (
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-700 bg-slate-900/80 p-6 md:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm font-bold text-cyan-300">
              <ShieldAlert className="h-4 w-4" /> 第二階段｜倫理選擇
            </span>
            <h2 className="mt-4 text-2xl font-bold">你已經拼出了不少資訊</h2>
            <p className="mt-2 leading-relaxed text-slate-300">
              你發現此人的學校、常出沒地點和跨平台帳號可能被串聯。這時，有同學說：「把查到的結果貼到班群，大家一定覺得很厲害！」你會怎麼做？
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {CHOICES.map((c) => {
                const picked = choice === c.id;
                return (
                  <button
                    key={c.id}
                    disabled={choice !== null}
                    onClick={() => choose(c.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      picked
                        ? "border-cyan-500/70 bg-slate-800"
                        : "border-slate-700 bg-slate-800/40 enabled:hover:border-slate-500"
                    } ${choice !== null && !picked ? "opacity-40" : ""}`}
                  >
                    <strong className="block text-base">
                      {c.icon} {c.title}
                    </strong>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-400">
                      {c.desc}
                    </span>
                  </button>
                );
              })}
            </div>
            {choice && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-5 rounded-2xl border p-4 text-sm leading-relaxed ${
                  CHOICE_FEEDBACK[choice].good
                    ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-100"
                    : "border-rose-500/45 bg-rose-500/5 text-rose-100"
                }`}
              >
                {CHOICE_FEEDBACK[choice].html}
              </motion.div>
            )}
            {choice && (
              <button
                onClick={enterRepair}
                className="mt-5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                切換身分：幫助小光修復足跡
              </button>
            )}
          </div>
        )}

        {/* Repair */}
        {phase === "repair" && (
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-700 bg-slate-900/80 p-6 md:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm font-bold text-cyan-300">
              🛠️ 第三階段｜足跡修復
            </span>
            <h2 className="mt-4 text-2xl font-bold">現在，你是小光本人</h2>
            <p className="mt-2 leading-relaxed text-slate-300">
              你無法抹除所有已出現過的資訊，但可以降低未來被串聯辨識的風險。請採取保護行動，讓風險降到
              30 以下。
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_320px]">
              <div className="grid gap-2.5">
                {REPAIRS.map((r) => {
                  const applied = repairs.has(r.id);
                  return (
                    <div
                      key={r.id}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-4 ${
                        applied
                          ? "border-emerald-500/40 opacity-75"
                          : "border-slate-700 bg-slate-800/40"
                      }`}
                    >
                      <div>
                        <strong className="block text-sm">{r.title}</strong>
                        <small className="text-slate-400">
                          {r.note}｜風險 −{r.reduce}
                        </small>
                      </div>
                      <button
                        disabled={applied}
                        onClick={() => applyRepair(r.id)}
                        className={`shrink-0 rounded-lg px-3 py-2 text-sm font-bold ${
                          applied
                            ? "text-emerald-400"
                            : "bg-cyan-900/60 text-cyan-300 hover:bg-cyan-900"
                        }`}
                      >
                        {applied ? "✓ 已完成" : "採取行動"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <aside className="h-max rounded-2xl border border-slate-700 bg-slate-800/40 p-4 md:sticky md:top-5">
                <div className="text-sm text-slate-400">修復後風險</div>
                <div className="my-1.5 text-5xl font-black">{repairRisk}</div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <motion.span
                    className="block h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
                    animate={{ width: `${repairRisk}%` }}
                  />
                </div>
                <div className="mt-3.5 text-xs leading-relaxed text-slate-400">
                  修復提示：
                  <br />✓ 遮蔽可辨識背景
                  <br />✓ 避免即時定位
                  <br />✓ 管理跨平台串聯
                  <br />✓ 尊重朋友的公開範圍
                </div>
                <button
                  disabled={repairRisk >= 30}
                  onClick={() => setPhase("ending")}
                  className="mt-4 w-full rounded-xl bg-cyan-400 py-3 font-bold text-slate-950 transition enabled:hover:-translate-y-0.5 disabled:opacity-40"
                >
                  {repairRisk >= 30 ? "再降到 30 以下" : "完成案件結算"}
                </button>
              </aside>
            </div>
          </div>
        )}

        {/* Ending */}
        {phase === "ending" && (
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-700 bg-slate-900/80 p-8 text-center md:p-10">
            <span
              className={`inline-block rounded-full border px-3 py-2 text-sm ${
                ethics >= 10
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-300"
              }`}
            >
              {ethics >= 10 ? "✓ 案件完成：你選擇了保護，而非擴散" : "案件完成：下次記得先停止擴散"}
            </span>
            <h2 className="mt-4 text-3xl font-bold">數位足跡修復報告</h2>
            <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-slate-300">
              一個人不必公布住址，也可能因零碎線索被拼出生活圈。重要的不只是少發文，更是學會評估「組合後的風險」。
            </p>
            <div className="my-7 grid gap-3 sm:grid-cols-3">
              {[
                [clues.size, "找到的公開線索"],
                [`${risk} → ${repairRisk}`, "暴露風險變化"],
                [ethics, "安全判斷分"],
              ].map(([val, label], i) => (
                <div key={i} className="rounded-2xl border border-slate-700 bg-slate-800/40 p-4">
                  <strong className="block text-3xl">{val}</strong>
                  <span className="text-sm text-slate-400">{label}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border-l-4 border-cyan-400 bg-slate-800/40 p-4 text-left leading-relaxed text-slate-200">
              <strong>討論題：</strong>
              哪一則資訊單獨看最普通，卻最容易在交叉比對後造成風險？如果是朋友不小心標記了你的地點或照片，你會怎麼溝通？
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={startGame}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                重新體驗
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-slate-200 hover:bg-slate-800"
                >
                  回首頁
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {teacherOpen && <TeacherModal onClose={() => setTeacherOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  RotateCcw,
  Sparkles,
  Zap,
  HeartPulse,
  Target,
  CalendarDays,
  AlertTriangle,
  Trophy,
  Cross,
  PlusCircle,
  ArrowLeft,
  Moon,
  UtensilsCrossed,
  Dumbbell,
  Users,
  Smartphone,
  Hourglass,
  Briefcase,
  BookOpen,
  CalendarClock,
  ClipboardList,
  Lock,
  Utensils,
  BatteryFull,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ROLES = [
  {
    id: "student",
    name: "學生的一天",
    description: "明天有小考，今天有社團，晚上也很想滑手機放鬆。",
  },
  {
    id: "worker",
    name: "上班族的一天",
    description: "今天有會議與專案截止，下班後想運動，也想和家人吃飯。",
  },
  {
    id: "freelancer",
    name: "自由工作者的一天",
    description: "沒有固定行程，但有三個案子要推進，很容易拖延。",
  },
];

const BASE_TASKS = [
  {
    id: "sleep",
    name: "睡覺",
    hours: 7,
    energy: -4,
    importance: 5,
    pressure: 3,
    type: "health",
    fixed: true,
    icon: Moon,
    description: "少於 7 小時體力會不足。",
  },
  {
    id: "meals",
    name: "吃飯與整理",
    hours: 2,
    energy: -1,
    importance: 4,
    pressure: 2,
    type: "health",
    fixed: true,
    icon: UtensilsCrossed,
    description: "基本生活維持，沒吃會餓昏。",
  },
  {
    id: "prayer",
    name: "禱告靈修",
    hours: 1,
    energy: -1,
    importance: 4,
    pressure: 1,
    type: "faith",
    repeatable: true,
    icon: Cross,
    description: "安靜親近神，可包含個人禱告、讀經、服事關懷。",
  },
  {
    id: "exercise",
    name: "運動",
    hours: 1,
    energy: 1,
    importance: 3,
    pressure: 1,
    type: "health",
    icon: Dumbbell,
    description: "花時間但提升健康度。",
  },
  {
    id: "family",
    name: "家人朋友時間",
    hours: 1,
    energy: 1,
    importance: 3,
    pressure: 1,
    type: "relationship",
    icon: Users,
    description: "維持關係與情緒支持。",
  },
  {
    id: "entertainment",
    name: "娛樂消遣",
    hours: 1,
    energy: 0,
    importance: 1,
    pressure: 0,
    type: "temptation",
    repeatable: true,
    icon: Smartphone,
    description: "滑手機、追劇、打遊戲都算。爽快 +1，但很容易停不下來。",
  },
  {
    id: "buffer",
    name: "預留緩衝",
    hours: 1,
    energy: 0,
    importance: 3,
    pressure: 0,
    type: "buffer",
    repeatable: true,
    icon: Hourglass,
    description: "面對突發事件的保險。",
  },
];

const ROLE_TASKS = {
  student: [
    {
      id: "club",
      name: "社團活動",
      hours: 2,
      energy: 2,
      importance: 2,
      pressure: 2,
      type: "relationship",
      icon: Users,
      description: "開心但也會消耗時間。",
    },
    {
      id: "quiz",
      name: "小考複習",
      hours: 2,
      energy: 2,
      importance: 5,
      pressure: 5,
      type: "important",
      icon: BookOpen,
      description: "明天就要考。",
    },
  ],
  worker: [
    {
      id: "meeting",
      name: "會議與通勤",
      hours: 3,
      energy: 2,
      importance: 4,
      pressure: 3,
      type: "fixed",
      fixed: true,
      icon: CalendarClock,
      description: "很難取消的固定行程。",
    },
    {
      id: "deadline",
      name: "專案截止",
      hours: 3,
      energy: 4,
      importance: 5,
      pressure: 5,
      type: "important",
      icon: Briefcase,
      description: "今天必須推進。",
    },
  ],
  freelancer: [
    {
      id: "clientA",
      name: "客戶 A 交付",
      hours: 3,
      energy: 3,
      importance: 5,
      pressure: 5,
      type: "important",
      icon: Briefcase,
      description: "最有壓力的交付。",
    },
    {
      id: "admin",
      name: "行政雜事",
      hours: 2,
      energy: 1,
      importance: 2,
      pressure: 2,
      type: "routine",
      icon: ClipboardList,
      description: "不急但容易堆積。",
    },
  ],
};

const EVENTS = [
  {
    id: "phone-trap",
    title: "通知一直跳",
    description: "你不小心多滑了 1 小時手機。若有緩衝，優先用緩衝抵消。",
    effect: { needBuffer: 1, stress: 1, happiness: 1 },
  },
  {
    id: "help-family",
    title: "家人臨時請你幫忙",
    description: "需要 1 小時。沒有緩衝會增加壓力。",
    effect: { needBuffer: 1, stress: 2, relationship: 1 },
  },
  {
    id: "tired",
    title: "太累了，效率下降",
    description: "若睡眠不足，重要任務完成度下降。",
    effect: { sleepCheck: true, stress: 1 },
  },
  {
    id: "tempted",
    title: "心裡有點煩躁",
    description: "如果今天沒有安排信仰時間，壓力會更容易上升。",
    effect: { faithCheck: true, stress: 1 },
  },
  {
    id: "service-call",
    title: "有人需要關懷",
    description: "若你有安排服事或關懷時間，信仰值提升。",
    effect: { faithOpportunity: true, relationship: 1 },
  },
  {
    id: "lucky",
    title: "提早完成一件事",
    description: "你多出 1 小時喘息空間。",
    effect: { bonusBuffer: 1, happiness: 1 },
  },
  {
    id: "computer",
    title: "電腦或網路出問題",
    description: "重要任務被延後 1 小時。沒有緩衝會增加壓力。",
    effect: { needBuffer: 1, stress: 2 },
  },
];

const TYPE_STYLE = {
  important: "bg-red-100 text-red-700 border-red-200",
  health: "bg-emerald-100 text-emerald-700 border-emerald-200",
  relationship: "bg-sky-100 text-sky-700 border-sky-200",
  temptation: "bg-violet-100 text-violet-700 border-violet-200",
  faith: "bg-yellow-100 text-yellow-800 border-yellow-200",
  buffer: "bg-amber-100 text-amber-700 border-amber-200",
  fixed: "bg-slate-100 text-slate-700 border-slate-200",
  routine: "bg-stone-100 text-stone-700 border-stone-200",
};

const TYPE_LABEL = {
  important: "重要",
  health: "健康",
  relationship: "人際",
  temptation: "誘惑",
  faith: "信仰",
  buffer: "緩衝",
  fixed: "固定",
  routine: "例行",
};

const CUSTOM_TASK_TYPES = [
  "important",
  "health",
  "relationship",
  "faith",
  "temptation",
  "buffer",
  "routine",
];

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function getPersonality(scores) {
  const { completion, health, faith, satisfaction, stress } = scores;
  if (completion >= 75 && faith >= 60 && health >= 60) {
    return {
      title: "平衡生活型",
      subtitle: "你能兼顧任務、休息與信仰生活。",
      advice: "接下來可以練習把重要任務、身體需要與靈修時間都固定成可持續的節奏。",
    };
  }
  if (faith >= 75 && completion < 65) {
    return {
      title: "安靜尋求型",
      subtitle: "你很重視信仰與內在方向，但現實任務可能需要更清楚的安排。",
      advice: "可以在禱告後挑出今天最重要的一件事，讓信仰幫助你更有次序地行動。",
    };
  }
  if (completion >= 80 && stress >= 65) {
    return {
      title: "滿檔燃燒型",
      subtitle: "你很積極，但容易把自己排太滿。",
      advice: "建議每天至少留 1–2 小時空白，也為安靜、禱告與休息留下位置。",
    };
  }
  if (completion < 55 && satisfaction >= 65) {
    return {
      title: "享樂優先型",
      subtitle: "你很重視放鬆，但重要任務容易被擠掉。",
      advice: "可以先安排 1 個最重要任務，再安排娛樂，讓放鬆比較不會變成逃避。",
    };
  }
  if (completion < 60 && stress >= 55) {
    return {
      title: "臨時抱佛腳型",
      subtitle: "重要任務常常被拖到壓力累積後才處理。",
      advice: "可以先用 15 分鐘處理最重要任務，再用短禱告或安靜時間重新整理心情。",
    };
  }
  return {
    title: "次序探索型",
    subtitle: "你正在摸索任務、休息、關係與信仰之間的次序。",
    advice: "建議先問：今天什麼事最重要？什麼事最容易偷走我的時間？然後再安排時間格。",
  };
}

const REQUIREMENT_DEFS = [
  { id: "fullness", label: "飽食", icon: Utensils, hint: "排「吃飯與整理」就能達標。" },
  { id: "rest", label: "體力", icon: BatteryFull, hint: "至少 7 小時睡眠才會滿。" },
  {
    id: "progress",
    label: "進度",
    icon: Briefcase,
    hint: "安排今日重要任務（角色限定那張）4 小時即可滿。",
  },
];

function getContributions(task) {
  const out = [];
  if (task.id === "meals") out.push({ key: "fullness", amount: 100 });
  if (task.id === "sleep") {
    out.push({ key: "rest", amount: Math.min(100, Math.round((task.hours / 7) * 100)) });
  }
  if (task.importance >= 4 && task.type === "important") {
    out.push({ key: "progress", amount: Math.min(100, task.hours * 25) });
  }
  return out;
}

function computeRequirements(schedule) {
  const sleepHours = schedule.filter((s) => s.id === "sleep").reduce((sum, s) => sum + s.hours, 0);
  const hasMeals = schedule.some((s) => s.id === "meals");
  const importantHours = schedule
    .filter((s) => s.importance >= 4 && s.type === "important")
    .reduce((sum, s) => sum + s.hours, 0);

  return {
    fullness: hasMeals ? 100 : 0,
    rest: Math.min(100, Math.round((sleepHours / 7) * 100)),
    progress: Math.min(100, Math.round((importantHours / 4) * 100)),
  };
}

function ScoreBar({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium text-slate-700">
          <Icon className="h-4 w-4" /> {label}
        </span>
        <span className="tabular-nums text-slate-500">{Math.round(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <motion.div
          className="h-2 rounded-full bg-slate-800"
          initial={{ width: 0 }}
          animate={{ width: `${clamp(value)}%` }}
        />
      </div>
    </div>
  );
}

function RequirementMeter({ def, value }) {
  const met = value >= 100;
  const Icon = def.icon;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium text-slate-700">
          <Icon className="h-3.5 w-3.5" /> {def.label}
        </span>
        <span
          className={`flex items-center gap-1 tabular-nums ${met ? "text-emerald-600" : "text-slate-400"}`}
        >
          {value}/100 {met && <CheckCircle2 className="h-3 w-3" />}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100">
        <motion.div
          className={`h-1.5 rounded-full ${met ? "bg-emerald-500" : "bg-amber-400"}`}
          initial={{ width: 0 }}
          animate={{ width: `${clamp(value)}%` }}
        />
      </div>
    </div>
  );
}

export default function TimePlannerGame({ onBack }) {
  const [roleId, setRoleId] = useState("student");
  const [schedule, setSchedule] = useState([]);
  const [eventCards, setEventCards] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [customTasks, setCustomTasks] = useState([]);
  const [customTask, setCustomTask] = useState({
    name: "",
    hours: 1,
    type: "routine",
    importance: 3,
    pressure: 1,
    description: "",
    repeatable: true,
  });

  const role = ROLES.find((item) => item.id === roleId);
  const tasks = useMemo(
    () => [...BASE_TASKS, ...(ROLE_TASKS[roleId] || []), ...customTasks],
    [roleId, customTasks],
  );
  const usedHours = schedule.reduce((sum, item) => sum + item.hours, 0);
  const freeHours = 24 - usedHours;
  const requirements = useMemo(() => computeRequirements(schedule), [schedule]);
  const allRequirementsMet = REQUIREMENT_DEFS.every((d) => requirements[d.id] >= 100);
  const unmetLabels = REQUIREMENT_DEFS.filter((d) => requirements[d.id] < 100).map((d) => d.label);
  // 把對門檻有貢獻的卡排到最上面（讓玩家先看到「必須選」的卡）
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const ac = getContributions(a).length;
      const bc = getContributions(b).length;
      return bc - ac;
    });
  }, [tasks]);

  const taskCounts = schedule.reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1;
    return acc;
  }, {});

  const addTask = (task) => {
    if (!task.repeatable && taskCounts[task.id]) return;
    if (freeHours < task.hours) return;
    setSchedule((prev) => [
      ...prev,
      { ...task, instanceId: `${task.id}-${Date.now()}-${Math.random()}` },
    ]);
    setShowResult(false);
  };

  const addCustomTask = () => {
    const name = customTask.name.trim();
    if (!name) return;
    const hours = clamp(Number(customTask.hours) || 1, 1, 12);
    const task = {
      id: `custom-${Date.now()}-${Math.random()}`,
      name,
      hours,
      energy: customTask.type === "health" || customTask.type === "faith" ? -1 : 1,
      importance: clamp(Number(customTask.importance) || 3, 1, 5),
      pressure: clamp(Number(customTask.pressure) || 1, 0, 5),
      type: customTask.type,
      repeatable: customTask.repeatable,
      custom: true,
      description: customTask.description.trim() || "自定義任務。",
    };
    setCustomTasks((prev) => [...prev, task]);
    setCustomTask({
      name: "",
      hours: 1,
      type: "routine",
      importance: 3,
      pressure: 1,
      description: "",
      repeatable: true,
    });
  };

  const removeCustomTask = (taskId) => {
    setCustomTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSchedule((prev) => prev.filter((item) => item.id !== taskId));
    setShowResult(false);
  };

  const removeTask = (instanceId) => {
    setSchedule((prev) => prev.filter((item) => item.instanceId !== instanceId));
    setShowResult(false);
  };

  const resetGame = () => {
    setSchedule([]);
    setEventCards([]);
    setShowResult(false);
  };

  const drawEvents = () => {
    const shuffled = [...EVENTS].sort(() => Math.random() - 0.5).slice(0, 3);
    setEventCards(shuffled);
    setShowResult(true);
  };

  const scores = useMemo(() => {
    const importantTasks = tasks.filter((t) => t.importance >= 4 && t.type !== "temptation");
    const importantTotal = importantTasks.reduce((sum, t) => sum + t.importance + t.pressure, 0);
    const importantDone = importantTasks.reduce((sum, t) => {
      const done = schedule.some((s) => s.id === t.id);
      return sum + (done ? t.importance + t.pressure : 0);
    }, 0);

    const sleepHours = schedule
      .filter((s) => s.id === "sleep")
      .reduce((sum, s) => sum + s.hours, 0);
    const mealDone = schedule.some((s) => s.id === "meals");
    const exerciseDone = schedule.some((s) => s.id === "exercise");
    const health = clamp(
      (sleepHours >= 7 ? 55 : sleepHours >= 6 ? 40 : 20) +
        (mealDone ? 25 : 0) +
        (exerciseDone ? 20 : 0),
    );

    const bufferHours = schedule
      .filter((s) => s.type === "buffer")
      .reduce((sum, s) => sum + s.hours, 0);
    const eventBufferNeed = eventCards.reduce((sum, e) => sum + (e.effect.needBuffer || 0), 0);
    const bonusBuffer = eventCards.reduce((sum, e) => sum + (e.effect.bonusBuffer || 0), 0);
    const effectiveBuffer = bufferHours + bonusBuffer - eventBufferNeed;

    const faithTasks = schedule.filter((s) => s.type === "faith");
    const faithHours = faithTasks.reduce((sum, s) => sum + s.hours, 0);
    const serviceBonus =
      eventCards.some((e) => e.effect.faithOpportunity) && faithTasks.length > 0 ? 15 : 0;
    const faithPenalty = eventCards.some((e) => e.effect.faithCheck) && faithHours === 0 ? 20 : 0;
    const overTemptationPenalty =
      schedule.filter((s) => s.type === "temptation").reduce((sum, s) => sum + s.hours, 0) >= 4
        ? 10
        : 0;
    const faith = clamp(
      25 +
        faithHours * 22 +
        serviceBonus +
        Math.max(effectiveBuffer, 0) * 4 -
        faithPenalty -
        overTemptationPenalty,
    );

    const temptationHours = schedule
      .filter((s) => s.type === "temptation")
      .reduce((sum, s) => sum + s.hours, 0);
    const relationshipHours = schedule
      .filter((s) => s.type === "relationship")
      .reduce((sum, s) => sum + s.hours, 0);
    const happinessBonus = eventCards.reduce((sum, e) => sum + (e.effect.happiness || 0), 0);
    const satisfaction = clamp(
      35 +
        temptationHours * 10 +
        relationshipHours * 12 +
        exerciseDone * 10 +
        happinessBonus * 5 +
        Math.min(faithHours, 2) * 6 -
        Math.max(0, 6 - sleepHours) * 10,
    );

    const baseCompletion = importantTotal ? (importantDone / importantTotal) * 100 : 70;
    const tiredPenalty = eventCards.some((e) => e.effect.sleepCheck) && sleepHours < 6 ? 20 : 0;
    const completion = clamp(baseCompletion - tiredPenalty);

    const stressFromMissingImportant = importantTasks.reduce((sum, t) => {
      const done = schedule.some((s) => s.id === t.id);
      return sum + (done ? 0 : t.pressure * 8);
    }, 0);
    const stressFromEvents = eventCards.reduce((sum, e) => sum + (e.effect.stress || 0) * 10, 0);
    const stressFromNoBuffer = bufferHours === 0 && usedHours >= 20 ? 20 : 0;
    const stressFromOverwork = Math.max(0, usedHours - 22) * 12;
    const stress = clamp(
      stressFromMissingImportant +
        stressFromEvents +
        stressFromNoBuffer +
        stressFromOverwork -
        bufferHours * 8 -
        Math.min(faithHours, 2) * 8,
    );

    return { completion, health, faith, satisfaction, stress };
  }, [schedule, tasks, eventCards, usedHours]);

  const personality = getPersonality(scores);

  const timelineBlocks = [];
  schedule.forEach((item) => {
    for (let i = 0; i < item.hours; i += 1) {
      timelineBlocks.push(item);
    }
  });
  while (timelineBlocks.length < 24) timelineBlocks.push(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 p-3 text-slate-900 sm:p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-4 md:space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {onBack && (
                <Button variant="outline" onClick={onBack} className="rounded-full">
                  <ArrowLeft className="mr-1 h-4 w-4" /> 返回首頁
                </Button>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-slate-600 shadow-sm sm:text-sm">
                <Clock className="h-4 w-4" /> 互動式時間安排測試
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">24 格人生</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              把今天的任務排進 24 小時裡，再抽突發事件，看看你的時間管理人格與信仰生活節奏。
            </p>
          </div>
          <Button
            variant="outline"
            onClick={resetGame}
            className="self-start rounded-2xl md:self-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> 重新開始
          </Button>
        </header>

        <section className="grid gap-4 lg:grid-cols-[340px_1fr_360px]">
          <div className="space-y-4">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="space-y-3 p-5">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Sparkles className="h-5 w-5" /> 1. 選擇今日角色
                </h2>
                <div className="space-y-2">
                  {ROLES.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setRoleId(item.id);
                        resetGame();
                      }}
                      className={`w-full rounded-2xl border p-3 text-left transition ${roleId === item.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                    >
                      <div className="font-semibold">{item.name}</div>
                      <div
                        className={`mt-1 text-sm ${roleId === item.id ? "text-slate-200" : "text-slate-500"}`}
                      >
                        {item.description}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="space-y-3 p-5">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <PlusCircle className="h-5 w-5" /> 自定義任務卡
                </h2>
                <input
                  value={customTask.name}
                  onChange={(e) => setCustomTask((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="任務名稱，例如：詩歌練習"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <label className="space-y-1 text-xs text-slate-500">
                    時間
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={customTask.hours}
                      onChange={(e) =>
                        setCustomTask((prev) => ({ ...prev, hours: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                    />
                  </label>
                  <label className="space-y-1 text-xs text-slate-500">
                    類型
                    <select
                      value={customTask.type}
                      onChange={(e) => setCustomTask((prev) => ({ ...prev, type: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                    >
                      {CUSTOM_TASK_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {TYPE_LABEL[type]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-xs text-slate-500">
                    重要度 1–5
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={customTask.importance}
                      onChange={(e) =>
                        setCustomTask((prev) => ({ ...prev, importance: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                    />
                  </label>
                  <label className="space-y-1 text-xs text-slate-500">
                    壓力 0–5
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={customTask.pressure}
                      onChange={(e) =>
                        setCustomTask((prev) => ({ ...prev, pressure: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                    />
                  </label>
                </div>
                <textarea
                  value={customTask.description}
                  onChange={(e) =>
                    setCustomTask((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="任務描述，可留空"
                  rows={2}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={customTask.repeatable}
                    onChange={(e) =>
                      setCustomTask((prev) => ({ ...prev, repeatable: e.target.checked }))
                    }
                  />
                  可重複安排
                </label>
                <Button onClick={addCustomTask} className="w-full rounded-2xl">
                  <PlusCircle className="mr-2 h-4 w-4" /> 新增任務卡
                </Button>
                {customTasks.length > 0 && (
                  <div className="space-y-2 border-t pt-3">
                    {customTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 p-2 text-sm"
                      >
                        <span className="truncate">{task.name}</span>
                        <button
                          onClick={() => removeCustomTask(task.id)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          刪除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="space-y-3 p-5">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <CalendarDays className="h-5 w-5" /> 2. 加入任務卡
                </h2>
                <div className="space-y-2">
                  {sortedTasks.map((task) => {
                    const disabled =
                      (!task.repeatable && taskCounts[task.id]) || freeHours < task.hours;
                    const contribs = getContributions(task);
                    const TaskIcon = task.icon;
                    return (
                      <button
                        key={task.id}
                        disabled={disabled}
                        onClick={() => addTask(task)}
                        className={`w-full rounded-2xl border p-3 text-left transition ${
                          disabled
                            ? "cursor-not-allowed opacity-40"
                            : contribs.length > 0
                              ? "border-amber-200 bg-amber-50/40 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-sm"
                              : "bg-white hover:-translate-y-0.5 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3">
                            {TaskIcon && (
                              <div
                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                                  contribs.length > 0
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                <TaskIcon className="h-4 w-4" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold">{task.name}</div>
                              <div className="mt-1 text-xs text-slate-500">{task.description}</div>
                            </div>
                          </div>
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                            {task.hours}h
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-xs ${TYPE_STYLE[task.type] || TYPE_STYLE.routine}`}
                          >
                            {TYPE_LABEL[task.type] || "任務"}
                          </span>
                          {contribs.map((c) => {
                            const def = REQUIREMENT_DEFS.find((d) => d.id === c.key);
                            return (
                              <span
                                key={c.key}
                                className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                              >
                                +{c.amount} {def?.label}
                              </span>
                            );
                          })}
                          <span className="ml-auto text-xs text-slate-400">
                            重要 {task.importance} / 壓力 {task.pressure}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">3. 今日 24 小時時間盤</h2>
                    <p className="text-sm text-slate-500">
                      已安排 {usedHours} 小時，剩下 {freeHours} 小時。
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                    {role.name}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-12">
                  {timelineBlocks.map((item, index) => (
                    <motion.div
                      key={`${index}-${item?.instanceId || "empty"}`}
                      layout
                      className={`flex h-20 flex-col justify-between rounded-2xl border p-2 text-xs ${item ? TYPE_STYLE[item.type] || TYPE_STYLE.routine : "border-dashed border-slate-200 bg-white text-slate-300"}`}
                    >
                      <div className="font-bold tabular-nums">
                        {String(index).padStart(2, "0")}:00
                      </div>
                      <div className="line-clamp-2 font-medium">{item ? item.name : "空白"}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">已安排任務</h2>
                    <p className="text-sm text-slate-500">點擊任務可以移除。</p>
                  </div>
                </div>
                {schedule.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-center text-sm text-slate-400">
                    還沒有安排任何任務。從左側加入任務卡開始。
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {schedule.map((item) => (
                      <button
                        key={item.instanceId}
                        onClick={() => removeTask(item.instanceId)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition hover:scale-95 ${TYPE_STYLE[item.type] || TYPE_STYLE.routine}`}
                      >
                        {item.name} · {item.hours}h ×
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Lock className="h-5 w-5" /> 必達門檻
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    三項都滿才能抽事件。沒吃飯、沒睡飽、沒做重要任務都會卡住。
                  </p>
                </div>
                <div className="space-y-3 rounded-2xl bg-slate-50 p-3">
                  {REQUIREMENT_DEFS.map((def) => (
                    <RequirementMeter key={def.id} def={def} value={requirements[def.id]} />
                  ))}
                </div>

                <div className="border-t pt-4">
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <AlertTriangle className="h-5 w-5" /> 4. 抽突發事件
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    安排完成後抽 3 張事件卡，測試你的排程、信仰時間與生活次序是否穩定。
                  </p>
                </div>
                <Button
                  onClick={drawEvents}
                  disabled={schedule.length === 0 || !allRequirementsMet}
                  className="w-full rounded-2xl"
                >
                  <Zap className="mr-2 h-4 w-4" /> 抽事件並計算結果
                </Button>
                {!allRequirementsMet && schedule.length > 0 && (
                  <div className="rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    還缺：{unmetLabels.join("、")}。先把基本生活排進去再抽。
                  </div>
                )}
                <div className="space-y-2">
                  {eventCards.length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">
                      尚未抽事件。
                    </div>
                  ) : (
                    eventCards.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border bg-white p-3"
                      >
                        <div className="font-semibold">{event.title}</div>
                        <div className="mt-1 text-sm text-slate-500">{event.description}</div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Trophy className="h-5 w-5" /> 結果分析
                </h2>
                <ScoreBar label="完成度" value={scores.completion} icon={Target} />
                <ScoreBar label="健康度" value={scores.health} icon={HeartPulse} />
                <ScoreBar label="信仰值" value={scores.faith} icon={Cross} />
                <ScoreBar label="滿意度" value={scores.satisfaction} icon={Sparkles} />
                <ScoreBar label="壓力值" value={scores.stress} icon={AlertTriangle} />

                {showResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-slate-900 p-5 text-white"
                  >
                    <div className="text-sm text-slate-300">你的時間管理人格</div>
                    <div className="mt-1 text-2xl font-bold">{personality.title}</div>
                    <p className="mt-2 text-sm text-slate-200">{personality.subtitle}</p>
                    <div className="mt-4 rounded-2xl bg-white/10 p-3 text-sm text-slate-100">
                      建議：{personality.advice}
                    </div>
                  </motion.div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-400">
                    抽完突發事件後會顯示完整人格結果。
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

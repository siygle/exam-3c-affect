import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Eye, Hourglass, Play, RotateCcw, Smartphone, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import TypoTask from "./scroll-trap/TypoTask";
import DiffTask from "./scroll-trap/DiffTask";
import LogicTask from "./scroll-trap/LogicTask";
import PuzzleTask from "./scroll-trap/PuzzleTask";
import FakeFeed from "./scroll-trap/FakeFeed";
import NotificationToast from "./scroll-trap/NotificationToast";
import { useCountdown } from "./scroll-trap/useCountdown";
import { useGlanceTracker } from "./scroll-trap/useGlanceTracker";
import { useNotifications } from "./scroll-trap/useNotifications";
import { GAME_DURATION_SECONDS, NOTIFICATION_OPTIONS, TASK_OPTIONS } from "./scroll-trap/data";

const TASK_COMPONENTS = {
  typo: TypoTask,
  diff: DiffTask,
  logic: LogicTask,
  puzzle: PuzzleTask,
};

const TASK_LABEL = {
  typo: "找錯字",
  diff: "找不同",
  logic: "邏輯推理",
  puzzle: "拼圖",
};

function pickRandomTask() {
  const ids = ["typo", "diff", "logic", "puzzle"];
  return ids[Math.floor(Math.random() * ids.length)];
}

function resolveNotificationMode(setting) {
  if (setting === "random") return Math.random() < 0.7 ? "on" : "off";
  return setting;
}

function formatMmSs(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function buildReflection(percent) {
  if (percent < 5) {
    return "你幾乎沒被動態牆拉走。注意力是練出來的，你今天的專注力很可貴。";
  }
  if (percent < 20) {
    return "你有被看一下，但很快拉回任務。我們不是不能看，是要會回來。";
  }
  if (percent < 40) {
    return "動態牆悄悄偷走了你不少時間。我們以為自己在專心，但身體誠實。";
  }
  return "動態牆把你的時間吃得不少。下次試試先把手機反過來或放遠一點，給自己一個安靜的環境。";
}

export default function InfiniteScrollTrap({ onBack }) {
  const [phase, setPhase] = useState("setup");
  const [taskSetting, setTaskSetting] = useState("random");
  const [notificationSetting, setNotificationSetting] = useState("random");
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [resolvedNotificationMode, setResolvedNotificationMode] = useState("off");
  const [taskProgress, setTaskProgress] = useState({
    score: 0,
    total: 1,
    completed: false,
  });

  const glance = useGlanceTracker();
  const notifications = useNotifications({
    enabled: phase === "playing",
    mode: resolvedNotificationMode,
  });

  const handleExpire = useCallback(() => {
    glance.finalize();
    setPhase("result");
  }, [glance]);

  const countdown = useCountdown(GAME_DURATION_SECONDS, {
    onExpire: handleExpire,
  });

  const onTaskProgress = useCallback((p) => setTaskProgress(p), []);

  const startGame = () => {
    const id = taskSetting === "random" ? pickRandomTask() : taskSetting;
    setActiveTaskId(id);
    setResolvedNotificationMode(resolveNotificationMode(notificationSetting));
    setTaskProgress({ score: 0, total: 1, completed: false });
    glance.reset();
    notifications.reset();
    setPhase("playing");
    countdown.start();
  };

  const finishEarly = () => {
    countdown.stop();
    glance.finalize();
    setPhase("result");
  };

  const playAgain = () => {
    countdown.reset();
    setPhase("setup");
    setActiveTaskId(null);
  };

  const TaskComponent = activeTaskId ? TASK_COMPONENTS[activeTaskId] : null;
  const elapsedSeconds = GAME_DURATION_SECONDS - countdown.remaining;
  const glanceSeconds = Math.round(glance.stats.totalMs / 100) / 10;
  const glancePercent = elapsedSeconds
    ? Math.min(100, (glance.stats.totalMs / (elapsedSeconds * 1000)) * 100)
    : 0;
  const avgGlance = glance.stats.count
    ? Math.round(glance.stats.totalMs / glance.stats.count / 100) / 10
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 p-3 text-slate-900 sm:p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-4 md:space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {onBack && (
                <Button variant="outline" onClick={onBack} className="rounded-full">
                  <ArrowLeft className="mr-1 h-4 w-4" /> 返回首頁
                </Button>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-slate-600 shadow-sm sm:text-sm">
                <Smartphone className="h-4 w-4" /> 注意力觀察實驗
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">
              無限滑動陷阱
            </h1>
            {phase !== "playing" && (
              <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
                給你一個 3 分鐘的小任務，旁邊放一個自動更新的動態牆。
                不強迫你看，只觀察你被偷走多少時間。
              </p>
            )}
          </div>
        </header>

        {phase === "playing" && (
          <div className="sticky top-2 z-30 flex items-center justify-between gap-3 rounded-2xl bg-slate-900 px-4 py-2 text-white shadow-lg md:px-5 md:py-3">
            <div>
              <div className="text-[10px] text-slate-300 md:text-xs">剩餘時間</div>
              <div className="text-xl font-bold tabular-nums md:text-2xl">
                {formatMmSs(countdown.remaining)}
              </div>
            </div>
            <button
              onClick={finishEarly}
              className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20"
            >
              我完成了，結算
            </button>
          </div>
        )}

        {phase === "setup" && (
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardContent className="space-y-5 p-4 md:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="flex items-center gap-2 font-semibold text-slate-700">
                    <Hourglass className="h-4 w-4" /> 任務類型
                  </span>
                  <select
                    value={taskSetting}
                    onChange={(e) => setTaskSetting(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
                  >
                    {TASK_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-600">
                  <span className="flex items-center gap-2 font-semibold text-slate-700">
                    <Bell className="h-4 w-4" /> 通知模式
                  </span>
                  <select
                    value={notificationSetting}
                    onChange={(e) => setNotificationSetting(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
                  >
                    {NOTIFICATION_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                <div className="font-semibold">遊戲規則</div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>3 分鐘倒數內完成任務。</li>
                  <li>右側動態牆會自動更新，可看可不看，由你決定。</li>
                  <li>結束後會揭曉你主動轉去看動態牆幾次、停留多久。</li>
                  <li>請誠實玩，這不是測你會不會考試，是觀察注意力流向。</li>
                </ul>
              </div>
              <Button onClick={startGame} className="w-full rounded-2xl">
                <Play className="mr-2 h-4 w-4" /> 開始
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === "playing" && TaskComponent && (
          <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="p-4 md:p-6">
                <TaskComponent onProgress={onTaskProgress} />
              </CardContent>
            </Card>
            <FakeFeed
              onPointerEnter={glance.onPointerEnter}
              onPointerLeave={glance.onPointerLeave}
              onActivity={glance.onActivity}
            />
          </section>
        )}

        {phase === "result" && (
          <div className="space-y-4">
            <Card className="rounded-3xl border-0 bg-slate-900 text-white shadow-sm">
              <CardContent className="space-y-4 p-4 md:p-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Eye className="h-4 w-4" /> 注意力流向
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Stat label="主動去看次數" value={glance.stats.count} unit="次" />
                  <Stat label="平均每次" value={avgGlance} unit="秒" />
                  <Stat label="總計停留" value={glanceSeconds} unit={`秒 / ${elapsedSeconds}秒`} />
                </div>
                <div className="rounded-2xl bg-white/10 p-4 text-sm">
                  你的注意力在這 3 分鐘內，有
                  <span className="mx-1 text-xl font-bold text-amber-300">
                    {glancePercent.toFixed(1)}%
                  </span>
                  的時間主動轉去看動態牆。
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-amber-200/20 p-4 text-sm text-amber-100"
                >
                  {buildReflection(glancePercent)}
                </motion.div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="space-y-3 p-4 md:p-6">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Trophy className="h-4 w-4" /> 任務結果（{TASK_LABEL[activeTaskId]}）
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Stat
                    label="任務完成度"
                    value={
                      taskProgress.total
                        ? Math.round((taskProgress.score / taskProgress.total) * 100)
                        : 0
                    }
                    unit="%"
                    light
                  />
                  <Stat
                    label="得分"
                    value={`${taskProgress.score} / ${taskProgress.total}`}
                    light
                  />
                  <Stat label="通知被點" value={notifications.clickCount} unit="次" light />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={playAgain} variant="outline" className="rounded-2xl">
                    <RotateCcw className="mr-2 h-4 w-4" /> 再玩一次
                  </Button>
                  {onBack && (
                    <Button onClick={onBack} className="rounded-2xl">
                      回首頁
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <NotificationToast
        toasts={notifications.toasts}
        onDismiss={notifications.dismiss}
        onClick={(id) => {
          glance.onActivity();
          notifications.handleToastClick(id);
        }}
      />
    </main>
  );
}

function Stat({ label, value, unit, light }) {
  return (
    <div className={`rounded-2xl p-4 ${light ? "bg-slate-50" : "bg-white/5"}`}>
      <div className={`text-xs ${light ? "text-slate-500" : "text-slate-300"}`}>{label}</div>
      <div
        className={`mt-1 text-2xl font-bold tabular-nums ${light ? "text-slate-900" : "text-white"}`}
      >
        {value}
        {unit && (
          <span
            className={`ml-1 text-sm font-normal ${light ? "text-slate-400" : "text-slate-300"}`}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

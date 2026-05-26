import React from "react";
import { motion } from "framer-motion";
import { Clock, Smartphone, ArrowRight, Hourglass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GAMES = [
  {
    id: "time-planner",
    title: "24 格人生",
    tagline: "互動式時間安排測試",
    description: "把今天的任務排進 24 小時裡，再抽突發事件，看看你的時間管理人格與信仰生活節奏。",
    icon: Clock,
    accent: "from-amber-100 to-rose-100",
    iconBg: "bg-amber-200/60 text-amber-700",
    status: "live",
  },
  {
    id: "scroll-trap",
    title: "無限滑動陷阱",
    tagline: "注意力觀察實驗",
    description: "3 分鐘小任務搭配自動更新的動態牆，最後揭曉你的滑鼠在動態牆停留了多久。",
    icon: Smartphone,
    accent: "from-rose-100 to-amber-100",
    iconBg: "bg-rose-200/60 text-rose-700",
    status: "live",
  },
  {
    id: "coming-2",
    title: "Coming soon",
    tagline: "即將推出",
    description: "新的 3C 影響小遊戲正在籌備中。",
    icon: Hourglass,
    accent: "from-slate-100 to-slate-200",
    iconBg: "bg-slate-200 text-slate-500",
    status: "coming",
  },
];

export default function Home({ onSelectGame }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-4 pt-6 md:pt-12">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
            <Smartphone className="h-4 w-4" /> 3C 與生活節奏小遊戲
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            在 3C 的世代，
            <br className="hidden md:block" />
            找回時間與內心的次序
          </h1>
          <p className="max-w-2xl text-base text-slate-600 md:text-lg">
            一系列為信仰青年設計的互動小遊戲，幫助你看見手機、螢幕與時間之間的拉扯，
            重新練習把神、生活與重要的人放在對的位置。
          </p>
        </header>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            選擇一個小遊戲
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {GAMES.map((game, index) => {
              const Icon = game.icon;
              const isLive = game.status === "live";
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card
                    className={`group h-full overflow-hidden rounded-3xl border-0 shadow-sm transition ${isLive ? "hover:-translate-y-1 hover:shadow-md" : "opacity-70"}`}
                  >
                    <div className={`bg-gradient-to-br ${game.accent} px-6 pt-6 pb-4`}>
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${game.iconBg}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <CardContent className="space-y-3 p-6">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          {game.tagline}
                        </span>
                        {isLive ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            可遊玩
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                            敬請期待
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold">{game.title}</h3>
                      <p className="text-sm text-slate-600">{game.description}</p>
                      <div className="pt-2">
                        {isLive ? (
                          <Button onClick={() => onSelectGame(game.id)} className="rounded-2xl">
                            開始遊玩 <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button disabled variant="outline" className="rounded-2xl">
                            尚未開放
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <footer className="pt-8 pb-4 text-center text-xs text-slate-400">
          這是一個持續更新中的 prototype，歡迎之後再回來看看新遊戲。
        </footer>
      </div>
    </main>
  );
}

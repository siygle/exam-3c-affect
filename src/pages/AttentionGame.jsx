import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Play, RotateCcw, MessageSquare, Lightbulb, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ROUNDS = [
  {
    prompt: "如果現在你在滑手機，看到這三則，會點哪一則？",
    options: [
      { text: "OO國小四年級進行戶外教學，學生參觀消防局學習防災知識。", type: "neutral" },
      { text: "老師當場崩潰！這個班的孩子在校外教學做出這種事⋯", type: "inflammatory" },
      { text: "OO國小榮獲全縣品德教育優等獎，師生開心合影。", type: "positive" },
    ],
  },
  {
    prompt: "三家豆花店的介紹，哪一則你會想點進去看？",
    options: [
      { text: "巷口豆花店新開幕，老闆推出芋圓、紅豆等六種口味。", type: "neutral" },
      { text: "再也不去這家豆花店！網友爆料內幕：老闆居然⋯", type: "inflammatory" },
      { text: "全台手作豆花票選 TOP 10 出爐，台南老店奪冠。", type: "positive" },
    ],
  },
  {
    prompt: "都是動物園的消息，先點哪一則？",
    options: [
      { text: "動物園公布今年新生小動物名單，總共有十二隻寶寶。", type: "neutral" },
      { text: "飼育員淚崩！動物園裡發生了讓所有人心碎的事⋯", type: "inflammatory" },
      { text: "貓熊每天要花十四小時吃竹子，研究員大讚牠的食量。", type: "positive" },
    ],
  },
  {
    prompt: "三則網路影片相關訊息，哪一則最吸引你？",
    options: [
      { text: "YouTube 公布今年最熱門影片類型，烹飪與電玩並列第一。", type: "neutral" },
      { text: "網紅當街翻臉！直播失控影片瘋傳，網友看傻眼", type: "inflammatory" },
      { text: "高中生創作的科普影片爆紅，破百萬觀看數。", type: "positive" },
    ],
  },
  {
    prompt: "最後一題！班級公告，你會先看哪一個？",
    options: [
      { text: "五年三班下週四下午舉辦才藝表演，請家長準時出席。", type: "neutral" },
      { text: "驚！五年三班同學間爆發衝突，老師急介入處理⋯", type: "inflammatory" },
      { text: "五年三班才藝表演圓滿落幕，所有同學都好棒！", type: "positive" },
    ],
  },
];

const MARKERS = ["A", "B", "C", "D"];

const TYPE_LABEL = {
  inflammatory: "誇張・衝突",
  neutral: "平淡・事實",
  positive: "正面・溫馨",
};

const TYPE_BAR = {
  inflammatory: "bg-rose-500",
  neutral: "bg-slate-500",
  positive: "bg-emerald-500",
};

const DISPLAY_ORDER = ["inflammatory", "neutral", "positive"];

function shuffleIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function emptyVotes() {
  return ROUNDS.map((r) => r.options.map(() => 0));
}

function buildReflection(winner) {
  if (winner === "inflammatory") {
    return [
      "「誇張、衝突」的訊息得到最多票。",
      "這不是因為我們笨，而是大腦天生對「危險、衝突、嚇人」的訊息更敏感——這個本能在很久很久以前，幫祖先躲過野獸、保住性命。",
      "可是在網路上，這個本能會被利用：寫得越誇張、越嚇人的標題，越多人會點。久而久之，我們會以為世界很糟糕，其實只是「平靜的好消息」比較不會被推到眼前。",
      "下次看到很想點的標題時，先停三秒，問自己：「這是真的嗎？我為什麼想點它？」",
    ];
  }
  if (winner === "positive") {
    return [
      "你們這次選了最多「正面、溫馨」的訊息，很棒！",
      "不過科學家做過很多研究發現，大多數時候「誇張、衝突」的訊息會被點最多次——這是大腦天生對危險和衝突更敏感的本能。",
      "網路上有人會利用這個本能，把標題寫得很嚇人，讓我們忍不住點下去。",
      "下次看到很想點的標題時，先停三秒，問自己：「這是真的嗎？我為什麼想點它？」",
    ];
  }
  return [
    "你們這次選了最多「平淡、事實」的訊息，非常理性！",
    "不過科學家發現，大部分人在網路上會被「誇張、衝突」的標題吸走——這是大腦天生的本能，對危險、衝突會自動更敏感。",
    "網路上有人會利用這個本能，故意把標題寫得很嚇人，讓我們忍不住點下去。",
    "下次看到很想點的標題時，先停三秒，問自己：「這是真的嗎？我為什麼想點它？」",
  ];
}

export default function AttentionGame({ onBack }) {
  const [phase, setPhase] = useState("intro");
  const [currentRound, setCurrentRound] = useState(0);
  const [votes, setVotes] = useState(emptyVotes);
  const [shuffleOrder, setShuffleOrder] = useState(() => shuffleIndices(3));

  const round = ROUNDS[currentRound];
  const currentTotal = votes[currentRound].reduce((a, b) => a + b, 0);
  const isLastRound = currentRound === ROUNDS.length - 1;

  const start = () => {
    setVotes(emptyVotes());
    setCurrentRound(0);
    setShuffleOrder(shuffleIndices(3));
    setPhase("round");
  };

  const vote = (origIdx) => {
    setVotes((prev) => {
      const next = prev.map((row) => [...row]);
      next[currentRound][origIdx] += 1;
      return next;
    });
  };

  const resetCurrent = () => {
    setVotes((prev) => {
      const next = prev.map((row) => [...row]);
      next[currentRound] = ROUNDS[currentRound].options.map(() => 0);
      return next;
    });
  };

  const goNext = () => {
    if (isLastRound) {
      setPhase("reveal");
      return;
    }
    setCurrentRound((r) => r + 1);
    setShuffleOrder(shuffleIndices(3));
  };

  const restart = () => {
    setVotes(emptyVotes());
    setCurrentRound(0);
    setShuffleOrder(shuffleIndices(3));
    setPhase("intro");
  };

  const totals = useMemo(() => {
    const acc = { neutral: 0, inflammatory: 0, positive: 0 };
    ROUNDS.forEach((r, ri) => {
      r.options.forEach((opt, oi) => {
        acc[opt.type] += votes[ri][oi];
      });
    });
    return acc;
  }, [votes]);

  const grandTotal = totals.neutral + totals.inflammatory + totals.positive;
  const maxVal = Math.max(totals.neutral, totals.inflammatory, totals.positive, 1);

  const winner = useMemo(() => {
    let w = "neutral";
    if (totals.inflammatory > totals[w]) w = "inflammatory";
    if (totals.positive > totals[w]) w = "positive";
    return w;
  }, [totals]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-rose-50 p-3 text-slate-900 sm:p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-4 md:space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {onBack && (
              <Button variant="outline" onClick={onBack} className="rounded-full">
                <ArrowLeft className="mr-1 h-4 w-4" /> 返回首頁
              </Button>
            )}
            <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-slate-600 shadow-sm sm:text-sm">
              <Newspaper className="h-4 w-4" /> 媒體素養 · 注意力觀察
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            哪個訊息會吸引你？
          </h1>
          <p className="text-sm text-slate-600 md:text-base">
            看看我們的注意力都被什麼樣的訊息吸走。
          </p>
        </header>

        {phase === "round" && (
          <div className="flex justify-center gap-2">
            {ROUNDS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentRound
                    ? "w-12 bg-rose-500"
                    : i < currentRound
                      ? "w-8 bg-slate-400"
                      : "w-8 bg-slate-200"
                }`}
              />
            ))}
          </div>
        )}

        {phase === "intro" && (
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardContent className="space-y-4 p-6 text-base leading-loose md:p-8 md:text-lg">
              <div className="text-center text-4xl">👀</div>
              <p>我們要玩一個小遊戲。</p>
              <p>
                等一下會出現 <strong className="text-rose-600">5 題</strong>
                ，每一題有三則訊息。
              </p>
              <p>
                請選出「<strong className="text-rose-600">最讓你想點開來看的那一則</strong>
                」——不是最重要的、也不是最該看的，就是「最想點」的。
              </p>
              <p>沒有對錯，誠實選就好。</p>
              <p className="text-sm text-slate-500">
                提示：可以重複點同一個選項累加票數，適合一個班一起玩，由老師代點全班的選擇。
              </p>
              <div className="pt-2">
                <Button onClick={start} className="w-full rounded-2xl">
                  <Play className="mr-2 h-4 w-4" /> 開始
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {phase === "round" && (
          <div className="space-y-4">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="space-y-4 p-5 md:p-6">
                <div>
                  <p className="font-serif text-lg font-semibold md:text-xl">{round.prompt}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    點選最想看的那則。可重複點累加票數。
                  </p>
                </div>
                <div className="space-y-3">
                  {shuffleOrder.map((origIdx, displayIdx) => {
                    const opt = round.options[origIdx];
                    const count = votes[currentRound][origIdx];
                    return (
                      <button
                        key={origIdx}
                        onClick={() => vote(origIdx)}
                        className="flex w-full items-center gap-3 rounded-2xl border-2 border-stone-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md md:gap-4 md:p-4"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 font-serif font-bold text-slate-600">
                          {MARKERS[displayIdx]}
                        </span>
                        <span className="flex-1 text-sm md:text-base">{opt.text}</span>
                        {count > 0 && (
                          <motion.span
                            key={count}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="shrink-0 rounded-full bg-rose-500 px-3 py-0.5 text-sm font-bold text-white"
                          >
                            {count}
                          </motion.span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
                  <Button
                    variant="outline"
                    onClick={resetCurrent}
                    className="rounded-2xl"
                    disabled={currentTotal === 0}
                  >
                    <RotateCcw className="mr-1 h-4 w-4" /> 清除本題票數
                  </Button>
                  <Button onClick={goNext} disabled={currentTotal === 0} className="rounded-2xl">
                    {isLastRound ? "看結果 →" : "下一題 →"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {phase === "reveal" && (
          <div className="space-y-4">
            <div>
              <p className="font-serif text-lg font-semibold md:text-xl">看看大家的選擇⋯</p>
              <p className="mt-1 text-xs text-slate-500">把五題的所有票數，依照訊息「種類」加總</p>
            </div>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="space-y-4 p-5 md:p-6">
                {DISPLAY_ORDER.map((type) => {
                  const count = totals[type];
                  const pct = grandTotal > 0 ? Math.round((count / grandTotal) * 100) : 0;
                  const width = grandTotal > 0 ? (count / maxVal) * 100 : 0;
                  return (
                    <div key={type} className="flex items-center gap-3 md:gap-4">
                      <div className="w-20 shrink-0 text-right text-xs font-semibold md:w-28 md:text-sm">
                        {TYPE_LABEL[type]}
                      </div>
                      <div className="flex-1 overflow-hidden rounded-lg bg-stone-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                          className={`flex h-9 items-center justify-end px-3 text-xs font-bold text-white md:text-sm ${TYPE_BAR[type]}`}
                          style={{ minWidth: count > 0 ? "fit-content" : "0" }}
                        >
                          {count > 0 ? `${count} 票（${pct}%）` : null}
                        </motion.div>
                        {count === 0 && (
                          <div className="-mt-9 flex h-9 items-center pl-3 text-xs text-slate-400">
                            0 票
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="space-y-3 p-5 text-sm leading-loose md:p-6 md:text-base">
                <div className="flex items-center gap-2 text-rose-600">
                  <Lightbulb className="h-4 w-4" />
                  <span className="font-semibold">怎麼看這個結果</span>
                </div>
                {buildReflection(winner).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-l-4 border-rose-500 bg-rose-50/40 shadow-sm">
              <CardContent className="space-y-2 p-5 md:p-6">
                <div className="flex items-center gap-2 font-serif text-base font-semibold md:text-lg">
                  <MessageSquare className="h-5 w-5 text-rose-600" /> 老師可以問同學的問題
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 md:text-base">
                  <li>你剛剛選那一則的時候，心裡在想什麼？</li>
                  <li>「最想點」跟「最該看」是同一件事嗎？</li>
                  <li>如果你是寫新聞的人，你會選哪一種寫法？為什麼？</li>
                  <li>下次手機上跳出讓你很想點的東西，你可以怎麼提醒自己？</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={restart} variant="outline" className="rounded-2xl">
                <RotateCcw className="mr-2 h-4 w-4" /> 換下一班，重新開始
              </Button>
              {onBack && (
                <Button onClick={onBack} className="rounded-2xl">
                  回首頁
                </Button>
              )}
            </div>
          </div>
        )}

        {phase === "intro" && (
          <p className="pt-2 text-center text-xs text-slate-400">
            <Eye className="mr-1 inline h-3 w-3" />
            課堂教學使用 · 媒體素養 / 注意力教育
          </p>
        )}
      </div>
    </main>
  );
}

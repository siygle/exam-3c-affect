import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Scissors,
  Brain,
  Network,
  ThumbsUp,
  Play,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Globe2,
  Code2,
  MessageSquareText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sections = [
  { id: "data", label: "資料", icon: Database },
  { id: "token", label: "Token", icon: Scissors },
  { id: "train", label: "預訓練", icon: Brain },
  { id: "attention", label: "Attention", icon: Network },
  { id: "align", label: "對齊", icon: ThumbsUp },
  { id: "infer", label: "推論", icon: Play },
];

const dataCards = [
  { label: "書籍", icon: BookOpen, desc: "長篇知識與敘事" },
  { label: "網頁", icon: Globe2, desc: "大量公開文字" },
  { label: "程式碼", icon: Code2, desc: "語法、API、模式" },
  { label: "對話", icon: MessageSquareText, desc: "問答與互動語氣" },
];

const sentenceExamples = [
  "我想了解大型語言模型",
  "今天天氣很適合散步",
  "The model predicts the next token",
];

const nextTokenCandidates = [
  { token: "好", p: 42 },
  { token: "熱", p: 31 },
  { token: "舒服", p: 16 },
  { token: "藍色", p: 3 },
  { token: "漢堡", p: 1 },
];

const attentionWords = ["小明", "把", "書", "放進", "書包", "因為", "它", "很重"];

function naiveTokenize(text) {
  if (!text.trim()) return [];
  // 不含 CJK 漢字時，按空白切；否則按字元切（並合併常見詞）。
  if (!/\p{Script=Han}/u.test(text)) {
    return text.trim().split(/\s+/).filter(Boolean);
  }
  return Array.from(text.replace(/\s+/g, "")).reduce((acc, char) => {
    const prev = acc[acc.length - 1];
    const pair = prev + char;
    const commonPairs = ["大型", "語言", "模型", "天氣", "適合", "散步", "了解"];
    if (prev && commonPairs.includes(pair)) acc[acc.length - 1] = pair;
    else acc.push(char);
    return acc;
  }, []);
}

function Section({ id, eyebrow, title, desc, children }) {
  return (
    <section id={id} className="scroll-mt-24 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full border bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
            {eyebrow}
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-4xl">{title}</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">{desc}</p>
        <div className="mt-7">{children}</div>
      </motion.div>
    </section>
  );
}

function ProgressNav({ onBack }) {
  return (
    <div className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">返回首頁</span>
            </Button>
          )}
          <a href="#top" className="flex items-center gap-2 font-semibold text-slate-950">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-white shadow-sm">
              <Sparkles size={16} />
            </div>
            LLM Journey
          </a>
        </div>
        <div className="hidden items-center gap-1 md:flex">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <Icon size={14} />
                {s.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DataPool() {
  const [selected, setSelected] = useState(["書籍", "網頁"]);
  const toggle = (label) =>
    setSelected((v) => (v.includes(label) ? v.filter((x) => x !== label) : [...v, label]));

  return (
    <div className="grid gap-5 md:grid-cols-[1.2fr_.8fr]">
      <div className="grid gap-3 sm:grid-cols-2">
        {dataCards.map((card) => {
          const Icon = card.icon;
          const active = selected.includes(card.label);
          return (
            <button
              key={card.label}
              onClick={() => toggle(card.label)}
              className={`group rounded-3xl border p-5 text-left shadow-sm transition ${
                active
                  ? "border-slate-900 bg-slate-950 text-white"
                  : "bg-white hover:-translate-y-1 hover:shadow-md"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <Icon size={24} />
                <span
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    active ? "bg-white/15" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {active ? "已放入" : "點擊加入"}
                </span>
              </div>
              <div className="text-lg font-semibold">{card.label}</div>
              <div className={`mt-1 text-sm ${active ? "text-slate-200" : "text-slate-500"}`}>
                {card.desc}
              </div>
            </button>
          );
        })}
      </div>
      <Card className="overflow-hidden rounded-3xl border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500">
            <Database size={16} />
            資料池
          </div>
          <div className="min-h-48 rounded-3xl border border-dashed bg-white p-4">
            <AnimatePresence>
              {selected.map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.8, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mb-2 inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {item}
                </motion.div>
              ))}
            </AnimatePresence>
            <p className="mt-5 text-sm leading-6 text-slate-500">
              模型不是直接「背答案」，而是從大量文字裡反覆學習：什麼語境下，下一個 token
              最可能是什麼。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TokenizerDemo() {
  const [text, setText] = useState(sentenceExamples[0]);
  const tokens = useMemo(() => naiveTokenize(text), [text]);
  return (
    <Card className="rounded-3xl bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {sentenceExamples.map((s) => (
            <Button key={s} variant="outline" className="rounded-full" onClick={() => setText(s)}>
              {s}
            </Button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-24 w-full rounded-2xl border bg-slate-50 p-4 text-lg outline-none ring-slate-300 transition focus:ring-4"
        />
        <div className="mt-5 flex flex-wrap gap-2">
          {tokens.map((token, i) => (
            <motion.span
              key={`${token}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border bg-white px-4 py-2 font-mono text-sm shadow-sm"
            >
              {token}
            </motion.span>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          這裡用簡化規則模擬 tokenizer；真實模型會用自己的詞彙表與切分規則。
        </p>
      </CardContent>
    </Card>
  );
}

function TrainingGame() {
  const [picked, setPicked] = useState(null);
  return (
    <div className="grid gap-5 md:grid-cols-[.85fr_1.15fr]">
      <Card className="rounded-3xl bg-slate-950 text-white shadow-sm">
        <CardContent className="p-6">
          <div className="text-sm text-slate-300">訓練題目</div>
          <div className="mt-4 text-3xl font-bold leading-tight">
            今天
            <br />
            天氣
            <br />很 <span className="rounded-xl bg-white/15 px-2">＿＿</span>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            預訓練的核心任務之一，就是不斷猜下一個
            token。猜錯時，模型會調整內部參數，讓下次更接近正確答案。
          </p>
        </CardContent>
      </Card>
      <Card className="rounded-3xl bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="mb-4 text-sm font-medium text-slate-500">
            選一個你覺得最合理的下一個 token
          </div>
          <div className="space-y-3">
            {nextTokenCandidates.map((c) => (
              <button
                key={c.token}
                onClick={() => setPicked(c.token)}
                className="w-full rounded-2xl border bg-slate-50 p-3 text-left transition hover:bg-slate-100"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">{c.token}</span>
                  <span className="text-sm text-slate-500">{c.p}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.p}%` }}
                    className="h-full rounded-full bg-slate-900"
                  />
                </div>
              </button>
            ))}
          </div>
          {picked && (
            <p className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
              你選了「{picked}」。模型在推論時也會面對類似的機率分布，再依照設定挑出下一個 token。
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AttentionDemo() {
  const [focus, setFocus] = useState("它");
  const links = {
    它: ["書", "書包"],
    很重: ["書"],
    書包: ["書", "放進"],
  };
  return (
    <Card className="rounded-3xl bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-white p-6">
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {attentionWords.map((w) => {
              const active = focus === w;
              const related = links[focus]?.includes(w);
              return (
                <button
                  key={w}
                  onMouseEnter={() => setFocus(w)}
                  onClick={() => setFocus(w)}
                  className={`rounded-2xl border px-4 py-3 text-lg font-semibold shadow-sm transition ${
                    active
                      ? "border-slate-950 bg-slate-950 text-white"
                      : related
                        ? "border-slate-900 bg-slate-100"
                        : "bg-white"
                  }`}
                >
                  {w}
                </button>
              );
            })}
          </div>
          <div className="mx-auto max-w-2xl rounded-3xl border bg-white p-5 text-center text-slate-600 shadow-sm">
            目前關注：<span className="font-bold text-slate-950">{focus}</span>
            <div className="mt-2 text-sm">
              {links[focus]
                ? `它會特別參考：${links[focus].join("、")}`
                : "滑到「它」、「很重」或「書包」看看關聯。"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AlignmentDemo() {
  const [choice, setChoice] = useState(null);
  const answers = [
    { id: "A", text: "黑洞是很重的東西。", quality: "太簡略" },
    { id: "B", text: "黑洞是一種重力極強的天體，連光都難以逃脫。", quality: "較清楚、有幫助" },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {answers.map((a) => (
        <button
          key={a.id}
          onClick={() => setChoice(a.id)}
          className={`rounded-3xl border p-6 text-left shadow-sm transition hover:-translate-y-1 ${
            choice === a.id ? "border-slate-950 bg-slate-950 text-white" : "bg-white"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              回答 {a.id}
            </span>
            <ThumbsUp size={18} />
          </div>
          <p className="text-lg leading-8">{a.text}</p>
          {choice === a.id && <p className="mt-4 text-sm text-slate-300">{a.quality}</p>}
        </button>
      ))}
      <div className="rounded-3xl bg-slate-100 p-5 text-sm leading-6 text-slate-600 md:col-span-2">
        預訓練後的模型只是很會補文字；透過示範答案、人類偏好與安全調整，模型才更接近「有幫助、可靠、符合指令」的助手。
      </div>
    </div>
  );
}

function inferPromptIntent(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  const items = [];

  const hasExplain =
    prompt.includes("解釋") ||
    prompt.includes("說明") ||
    prompt.includes("介紹") ||
    lowerPrompt.includes("explain");
  const hasCompare =
    prompt.includes("比較") || prompt.includes("差異") || lowerPrompt.includes("compare");
  const hasCode =
    prompt.includes("程式") ||
    prompt.includes("實作") ||
    prompt.includes("範例") ||
    lowerPrompt.includes("code") ||
    lowerPrompt.includes("typescript") ||
    lowerPrompt.includes("javascript") ||
    lowerPrompt.includes("api");
  const hasSummary =
    prompt.includes("摘要") || prompt.includes("整理") || lowerPrompt.includes("summarize");
  const wantsSimple =
    prompt.includes("小學生") ||
    prompt.includes("簡單") ||
    prompt.includes("容易懂") ||
    lowerPrompt.includes("simple");
  const wantsZh =
    prompt.includes("繁體中文") || prompt.includes("中文") || lowerPrompt.includes("zh-tw");
  const wantsEnglish = prompt.includes("英文") || lowerPrompt.includes("english");

  if (hasExplain) items.push({ label: "任務", value: "解釋概念" });
  else if (hasCompare) items.push({ label: "任務", value: "比較差異" });
  else if (hasCode) items.push({ label: "任務", value: "產生程式 / 範例" });
  else if (hasSummary) items.push({ label: "任務", value: "摘要整理" });
  else items.push({ label: "任務", value: "一般回答" });

  if (prompt.includes("小學生")) items.push({ label: "受眾", value: "小學生" });
  else if (prompt.includes("工程師")) items.push({ label: "受眾", value: "工程師" });

  if (wantsSimple) items.push({ label: "語氣", value: "簡單易懂" });
  if (wantsZh) items.push({ label: "語言", value: "繁體中文" });
  if (wantsEnglish) items.push({ label: "語言", value: "英文" });

  const topicRules = [
    { keys: ["黑洞"], topic: "黑洞" },
    { keys: ["llm", "大型語言模型", "語言模型"], topic: "大型語言模型" },
    { keys: ["attention", "注意力"], topic: "Attention 機制" },
    { keys: ["transformer"], topic: "Transformer" },
    { keys: ["typescript"], topic: "TypeScript" },
    { keys: ["api"], topic: "API" },
    { keys: ["prompt"], topic: "Prompt" },
  ];

  const matchedTopic = topicRules.find((rule) =>
    rule.keys.some((key) => lowerPrompt.includes(key.toLowerCase()) || prompt.includes(key)),
  );
  items.push({ label: "主題", value: matchedTopic?.topic ?? "由 prompt 內容推斷" });

  return items;
}

function buildSimulatedAnswer(prompt, intentItems) {
  const get = (label) => intentItems.find((item) => item.label === label)?.value;
  const task = get("任務");
  const topic = get("主題");
  const audience = get("受眾");
  const tone = get("語氣");
  const lang = get("語言");

  if (!prompt.trim()) return "請先輸入一段 prompt，模型才有上下文可以推論。";

  if (topic === "黑洞" && audience === "小學生") {
    return "黑洞就像宇宙中吸力非常非常強的大洞，連光靠近了都很難逃出去。";
  }

  if (topic === "大型語言模型") {
    if (tone === "簡單易懂")
      return "LLM可以想成很會接話的文字模型。它會讀懂你的問題重點，然後一步一步猜出最合適的下一個字。";
    return "LLM會根據prompt建立上下文狀態，計算下一個token的機率分布，並反覆選取與接回token來產生完整回答。";
  }

  if (topic === "Attention 機制") {
    return "Attention讓模型在處理某個token時，能參考上下文中更重要的其他token，因此比較能抓住句子裡的關聯。";
  }

  if (topic === "Transformer") {
    return "Transformer是一種使用attention處理序列資料的模型架構，能同時觀察上下文中不同位置的關聯。";
  }

  if (task === "比較差異") {
    return `這個prompt比較像是在要求模型比較「${topic}」相關概念，因此輸出通常會整理成相同點、不同點與適用情境。`;
  }

  if (task === "產生程式 / 範例") {
    return `這個prompt帶有實作需求，模型會傾向輸出「${topic}」相關的程式碼、步驟或API範例。`;
  }

  if (task === "摘要整理") {
    return `這個prompt帶有整理需求，模型會把輸入內容壓縮成重點、條列或摘要。`;
  }

  if (lang === "英文") {
    return `This simulated answer is generated from your prompt. The model would use the prompt context to decide the task, topic, tone, and next tokens.`;
  }

  return `根據你的prompt，模型會先形成上下文，判斷任務大致是「${task}」，主題大致是「${topic}」，再逐步預測下一個最合理的token。`;
}

function InferenceDemo() {
  const [prompt, setPrompt] = useState("請用小學生能懂的方式解釋黑洞");
  const [temp, setTemp] = useState(0.45);
  const [generatedTokens, setGeneratedTokens] = useState([]);
  const [candidateTokens, setCandidateTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [autoRunning, setAutoRunning] = useState(false);
  const [inferenceMode, setInferenceMode] = useState("simulated");
  const [chromeStatus, setChromeStatus] = useState("checking");
  const [chromeAvailability, setChromeAvailability] = useState("unknown");
  const [chromeProgress, setChromeProgress] = useState(0);
  const [chromeOutput, setChromeOutput] = useState("");
  const [chromeError, setChromeError] = useState("");
  const [chromeRunning, setChromeRunning] = useState(false);
  const [runtimeInfo, setRuntimeInfo] = useState({
    isIframe: false,
    isSecureContext: false,
    origin: "unknown",
  });

  const promptTokens = useMemo(() => naiveTokenize(prompt), [prompt]);
  const promptUnderstanding = useMemo(() => inferPromptIntent(prompt), [prompt]);

  const targetAnswer = useMemo(() => {
    return naiveTokenize(buildSimulatedAnswer(prompt, promptUnderstanding));
  }, [prompt, promptUnderstanding]);

  const hasChromePromptApi = () => typeof window !== "undefined" && "LanguageModel" in window;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRuntimeInfo({
        isIframe: window.self !== window.top,
        isSecureContext: window.isSecureContext,
        origin: window.location?.origin ?? "unknown",
      });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const checkChromePromptApi = async () => {
      if (!hasChromePromptApi()) {
        if (!cancelled) {
          setChromeStatus("unsupported");
          setChromeAvailability("unavailable");
        }
        return;
      }

      try {
        const availability = await window.LanguageModel.availability();
        if (cancelled) return;
        setChromeAvailability(availability);
        setChromeStatus(availability === "unavailable" ? "unavailable" : "ready");
      } catch (error) {
        if (cancelled) return;
        setChromeStatus("error");
        setChromeError(error?.message ?? "檢查 Chrome Prompt API 時發生錯誤");
      }
    };

    checkChromePromptApi();

    return () => {
      cancelled = true;
    };
  }, []);

  const buildCandidates = (nextToken) => {
    const noisePool = [
      "它",
      "模型",
      "因為",
      "所以",
      "這",
      "一個",
      "非常",
      "可以",
      "就是",
      "如果",
      "資料",
      "答案",
    ];
    const pickedNoise = noisePool
      .filter((t) => t !== nextToken)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    const base = [
      { token: nextToken, score: Math.max(0.42, 0.72 - temp * 0.3) },
      ...pickedNoise.map((t, i) => ({
        token: t,
        score: Math.max(0.04, 0.18 - i * 0.03 + temp * 0.06),
      })),
    ];

    const total = base.reduce((sum, x) => sum + x.score, 0);

    return base
      .map((x) => ({ ...x, p: Math.round((x.score / total) * 100) }))
      .sort((a, b) => b.p - a.p);
  };

  const resetDemo = () => {
    setGeneratedTokens([]);
    setCandidateTokens([]);
    setSelectedToken(null);
    setPhase("idle");
    setStepIndex(0);
    setAutoRunning(false);
    setChromeOutput("");
    setChromeError("");
    setChromeRunning(false);
  };

  const nextStep = () => {
    if (inferenceMode !== "simulated") return;

    if (phase === "done") {
      setAutoRunning(false);
      return;
    }

    if (stepIndex >= targetAnswer.length && phase === "append") {
      setPhase("done");
      setAutoRunning(false);
      return;
    }

    if (phase === "idle") {
      setPhase("tokenize");
      return;
    }

    if (phase === "tokenize") {
      setPhase("understand");
      return;
    }

    if (phase === "understand") {
      const nextToken = targetAnswer[stepIndex];
      const candidates = buildCandidates(nextToken);
      setCandidateTokens(candidates);
      setSelectedToken(null);
      setPhase("predict");
      return;
    }

    if (phase === "predict") {
      const winner = candidateTokens[0]?.token ?? targetAnswer[stepIndex];
      setSelectedToken(winner);
      setPhase("sample");
      return;
    }

    if (phase === "sample") {
      setGeneratedTokens((prev) => [...prev, selectedToken]);
      setPhase("append");
      return;
    }

    if (phase === "append") {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);

      if (nextIndex >= targetAnswer.length) {
        setPhase("done");
        setAutoRunning(false);
      } else {
        setPhase("understand");
      }
    }
  };

  const runChromeGemini = async () => {
    setChromeError("");
    setChromeOutput("");
    setChromeProgress(0);
    setChromeRunning(true);
    setPhase("chrome-checking");

    if (!hasChromePromptApi()) {
      setChromeStatus("unsupported");
      setChromeError("此瀏覽器沒有提供 Chrome Prompt API，已保留教學模擬模式可用。");
      setChromeRunning(false);
      setInferenceMode("simulated");
      setPhase("idle");
      return;
    }

    try {
      const availability = await window.LanguageModel.availability();
      setChromeAvailability(availability);

      if (availability === "unavailable") {
        setChromeStatus("unavailable");
        setChromeError(
          "此裝置、Chrome 版本或目前環境不支援 Gemini Nano，本頁仍可使用教學模擬模式。",
        );
        setChromeRunning(false);
        setInferenceMode("simulated");
        setPhase("idle");
        return;
      }

      if (availability === "downloadable" || availability === "downloading") {
        setChromeStatus("downloading");
        setPhase("chrome-downloading");
      } else {
        setChromeStatus("available");
        setPhase("chrome-creating");
      }

      const session = await window.LanguageModel.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (event) => {
            const loaded = typeof event.loaded === "number" ? event.loaded : 0;
            setChromeProgress(Math.round(loaded * 100));
          });
        },
      });

      setChromeStatus("running");
      setPhase("chrome-streaming");

      const stream = session.promptStreaming(prompt);
      let output = "";

      for await (const chunk of stream) {
        output += chunk;
        setChromeOutput(output);
      }

      setChromeStatus("done");
      setPhase("done");
    } catch (error) {
      setChromeStatus("error");
      setChromeError(error?.message ?? "Chrome Gemini Nano 推論失敗，已保留教學模擬模式可用。");
    } finally {
      setChromeRunning(false);
    }
  };

  useEffect(() => {
    if (!autoRunning || phase === "done" || inferenceMode !== "simulated") return undefined;

    const timer = setTimeout(() => {
      nextStep();
    }, 900);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRunning, phase, stepIndex, candidateTokens, selectedToken, inferenceMode]);

  const generatedText = generatedTokens.join("");
  const displayOutput = inferenceMode === "chrome" ? chromeOutput : generatedText;
  const chromeDiagnosticMessage = () => {
    if (chromeStatus === "unsupported") {
      return "目前頁面無法存取 window.LanguageModel。可能原因：Chrome 版本尚未支援、Built-in AI 功能未啟用，或目前不是支援的桌面 Chrome 環境。";
    }

    if (chromeStatus === "unavailable") {
      return "Chrome Prompt API 存在，但 LanguageModel.availability() 回傳 unavailable。可能原因：裝置條件不符合、Gemini Nano 尚不可用、儲存空間不足，或此平台尚未支援。";
    }

    if (chromeStatus === "error") {
      return chromeError || "檢查 Chrome Prompt API 時發生錯誤。";
    }

    if (chromeStatus === "checking") {
      return "正在檢查此頁面是否能存取 Chrome Prompt API。";
    }

    if (chromeAvailability === "downloadable") {
      return "LanguageModel.availability() 回傳 downloadable，這是可嘗試狀態：代表 API 可用，但本機模型尚未下載。請按「開始本機推論」，LanguageModel.create() 會在使用者操作後嘗試下載並建立 session。";
    }

    if (chromeAvailability === "downloading") {
      return "LanguageModel.availability() 回傳 downloading，代表模型正在下載。下載完成後就可以建立 session。";
    }

    return "此環境看起來可嘗試使用 Chrome Prompt API。若推論失敗，仍可回到教學模擬模式。";
  };

  return (
    <Card className="rounded-3xl bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-slate-950 p-5 text-white">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
              <SlidersHorizontal size={16} />
              推論模擬器
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-white/10 p-1">
              <button
                onClick={() => {
                  setInferenceMode("simulated");
                  resetDemo();
                }}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  inferenceMode === "simulated"
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                教學模擬
              </button>
              <button
                onClick={() => {
                  setInferenceMode("chrome");
                  resetDemo();
                }}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  inferenceMode === "chrome"
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                Chrome Gemini Nano
              </button>
            </div>

            <label className="mb-2 block text-sm text-slate-300">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                resetDemo();
              }}
              className="min-h-28 w-full rounded-2xl bg-white/10 p-4 text-white outline-none placeholder:text-slate-400"
              placeholder="輸入 prompt..."
            />

            {inferenceMode === "simulated" && (
              <div className="mt-5">
                <label className="text-sm text-slate-300">Temperature：{temp.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="mt-3 w-full"
                />
                <div className="mt-2 text-xs text-slate-400">
                  越低越穩定，越高越發散；這裡會影響候選 token 的機率差距。
                </div>
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-white/10 p-4 text-xs leading-5 text-slate-300">
              <div className="font-semibold text-white">Chrome Prompt API 狀態</div>
              <div className="mt-1">
                {chromeStatus === "checking" && "檢查中..."}
                {chromeStatus === "unsupported" && "不支援：此瀏覽器沒有 LanguageModel API。"}
                {chromeStatus === "unavailable" && "不可用：此平台或裝置條件不支援。"}
                {chromeStatus === "ready" &&
                  `可嘗試使用，availability：${chromeAvailability}${
                    chromeAvailability === "downloadable"
                      ? "（尚未下載，按下開始後會嘗試下載）"
                      : ""
                  }`}
                {chromeStatus === "available" && "模型可用，正在建立 session。"}
                {chromeStatus === "downloading" && `模型下載中：${chromeProgress}%`}
                {chromeStatus === "running" && "正在使用本機 Gemini Nano 產生回答。"}
                {chromeStatus === "done" && "Chrome Gemini Nano 推論完成。"}
                {chromeStatus === "error" && "發生錯誤，請改用教學模擬模式。"}
              </div>
              {inferenceMode === "chrome" && (
                <div className="mt-2 space-y-2">
                  <div className="rounded-xl bg-white/10 p-2 text-slate-100">
                    {chromeDiagnosticMessage()}
                  </div>
                  <div className="rounded-xl bg-white/10 p-2 text-slate-300">
                    執行環境：
                    {runtimeInfo.isIframe ? "iframe / embedded preview" : "top-level window"}
                    ；Secure Context：{runtimeInfo.isSecureContext ? "yes" : "no"}；Origin：
                    {runtimeInfo.origin}
                  </div>
                </div>
              )}
              {chromeError && (
                <div className="mt-2 rounded-xl bg-red-500/15 p-2 text-red-100">{chromeError}</div>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {inferenceMode === "simulated" ? (
                <>
                  <Button
                    onClick={nextStep}
                    className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200"
                    disabled={phase === "done"}
                  >
                    單步執行
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAutoRunning(true)}
                    className="rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10"
                    disabled={autoRunning || phase === "done"}
                  >
                    自動播放
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetDemo}
                    className="rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10"
                  >
                    重設
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={runChromeGemini}
                    className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200 sm:col-span-2"
                    disabled={chromeRunning || !prompt.trim()}
                  >
                    開始本機推論
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetDemo}
                    className="rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10"
                  >
                    重設
                  </Button>
                </>
              )}
            </div>

            <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-200">
              <div className="font-semibold">目前階段</div>
              <div className="mt-2">
                {phase === "idle" && "尚未開始"}
                {phase === "tokenize" && "1. 將 prompt 切成 tokens"}
                {phase === "understand" && "2. 從 prompt 抽取任務、主題、語氣等條件"}
                {phase === "predict" && "3. 計算下一個 token 的候選機率"}
                {phase === "sample" && "4. 從候選機率中選出一個 token"}
                {phase === "append" && "5. 把 token 接回上下文，準備下一輪"}
                {phase === "chrome-checking" && "1. 檢查 Chrome Prompt API 可用性"}
                {phase === "chrome-downloading" && "2. 下載或載入 Gemini Nano 本機模型"}
                {phase === "chrome-creating" && "2. 建立本機 LanguageModel session"}
                {phase === "chrome-streaming" && "3. 使用 promptStreaming() 接收真實輸出"}
                {phase === "done" && "完成生成"}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border bg-slate-50 p-5">
              <div className="mb-3 text-sm font-medium text-slate-500">1. Prompt Tokens</div>
              <div className="flex flex-wrap gap-2">
                {promptTokens.map((t, i) => (
                  <motion.span
                    key={`${t}-${i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-white px-3 py-2 text-sm shadow-sm"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border bg-slate-50 p-5">
              <div className="mb-3 text-sm font-medium text-slate-500">
                2. 模型從 Prompt 抽到的條件
              </div>
              <div className="flex flex-wrap gap-3">
                {promptUnderstanding.map((item, i) => (
                  <div
                    key={`${item.label}-${i}`}
                    className="rounded-2xl bg-white px-4 py-3 shadow-sm"
                  >
                    <div className="text-xs text-slate-500">{item.label}</div>
                    <div className="font-semibold text-slate-900">{item.value}</div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                這裡會即時根據 prompt 做教學用的意圖推斷；真實模型不是用規則抽欄位，而是透過
                embedding、attention 與多層 Transformer 形成上下文狀態。
              </p>
            </div>

            <div className="rounded-3xl border bg-slate-50 p-5">
              <div className="mb-3 text-sm font-medium text-slate-500">
                3. 下一個 Token 候選機率
              </div>
              {inferenceMode === "chrome" ? (
                <div className="rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
                  Chrome Prompt API 會回傳 streaming output，但目前不提供 logits、候選 token 機率或
                  attention 權重；因此這一區只在教學模擬模式中顯示。
                </div>
              ) : (
                <div className="space-y-3">
                  {candidateTokens.length === 0 ? (
                    <div className="text-sm text-slate-400">進入 predict 階段後會顯示。</div>
                  ) : (
                    candidateTokens.map((c) => (
                      <div
                        key={c.token}
                        className={`rounded-2xl p-3 shadow-sm ${
                          selectedToken === c.token ? "bg-slate-950 text-white" : "bg-white"
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium">{c.token}</span>
                          <span
                            className={`text-sm ${
                              selectedToken === c.token ? "text-slate-200" : "text-slate-500"
                            }`}
                          >
                            {c.p}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${c.p}%` }}
                            className="h-full rounded-full bg-slate-900"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="rounded-3xl border bg-slate-50 p-5">
              <div className="mb-3 text-sm font-medium text-slate-500">4. 這一輪選中的 Token</div>
              <div className="rounded-2xl bg-white p-4 text-lg shadow-sm">
                {inferenceMode === "chrome" ? (
                  <span className="text-slate-500">
                    真實模式只顯示 streaming output，不顯示內部選 token。
                  </span>
                ) : selectedToken ? (
                  selectedToken
                ) : (
                  <span className="text-slate-400">尚未選出</span>
                )}
              </div>
            </div>

            <div className="rounded-3xl border bg-slate-50 p-5">
              <div className="mb-3 text-sm font-medium text-slate-500">5. 目前上下文</div>
              <div className="rounded-2xl bg-white p-4 text-base leading-7 shadow-sm">
                <span>{prompt}</span>
                <span className="text-slate-400"> → </span>
                {displayOutput || <span className="text-slate-400">尚未接上任何輸出</span>}
              </div>
            </div>

            <div className="rounded-3xl border bg-slate-50 p-5">
              <div className="mb-3 text-sm font-medium text-slate-500">6. 目前已生成的 Output</div>
              <div className="min-h-24 whitespace-pre-wrap rounded-2xl bg-white p-4 text-lg leading-8 shadow-sm">
                {displayOutput || <span className="text-slate-400">尚未生成</span>}
              </div>
              {phase === "done" && (
                <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-white">
                  {inferenceMode === "chrome"
                    ? "這是由 Chrome 內建 Prompt API / Gemini Nano 產生的真實 streaming output；但內部候選 token 機率仍不會被瀏覽器 API 暴露。"
                    : "這就是簡化版的 LLM 推論流程：prompt 改變時，上下文、候選 token 與最後 output 都會跟著改變。模型會根據 prompt 建立上下文，計算下一個 token 的機率，選出 token，接回上下文，再繼續預測，直到形成完整回答。"}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LLMJourney({ onBack }) {
  return (
    <div
      id="top"
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e2e8f0,transparent_35%),linear-gradient(to_bottom,#ffffff,#f8fafc)] text-slate-950"
    >
      <ProgressNav onBack={onBack} />
      <main className="mx-auto max-w-6xl px-4 pb-20">
        <header className="py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-8 md:grid-cols-[1.05fr_.95fr] md:items-center"
          >
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
                <Sparkles size={16} />
                互動式科普
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                從訓練到推論：
                <br />
                看懂 LLM 如何產生答案
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                可操作的教學頁面：放入資料、切 token、玩下一個 token 預測、理解
                attention、選擇偏好答案，最後調整 temperature 看模型如何逐步生成回答。
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#data">
                  <Button className="rounded-2xl px-5">
                    開始體驗 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="#infer">
                  <Button variant="outline" className="rounded-2xl px-5">
                    直接看推論
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-slate-950 opacity-10 blur-2xl" />
              <Card className="relative overflow-hidden rounded-[2rem] border-slate-200 bg-white/80 shadow-xl backdrop-blur">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <Brain size={16} />
                    LLM Pipeline
                  </div>
                  {sections.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.id} className="flex items-center gap-3 py-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100">
                          <Icon size={18} />
                        </div>
                        <div className="font-semibold">{s.label}</div>
                        <div className="ml-auto text-sm text-slate-400">0{i + 1}</div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </header>

        <Section
          id="data"
          eyebrow="Step 1"
          title="資料進入模型之前：先形成訓練語料"
          desc="LLM 的能力來自大量文字資料。點擊不同資料來源，觀察它們如何進入資料池。"
        >
          <DataPool />
        </Section>

        <Section
          id="token"
          eyebrow="Step 2"
          title="文字不是直接進模型，而是先切成 token"
          desc="模型看到的是 token 序列，不是人類眼中的完整句子。這也是理解 LLM 生成文字的第一個關鍵。"
        >
          <TokenizerDemo />
        </Section>

        <Section
          id="train"
          eyebrow="Step 3"
          title="預訓練：反覆練習猜下一個 token"
          desc="給定前文，模型計算每個候選 token 的機率。訓練時透過大量例子調整參數，讓預測越來越準。"
        >
          <TrainingGame />
        </Section>

        <Section
          id="attention"
          eyebrow="Step 4"
          title="Transformer 的 attention：判斷要參考哪些字"
          desc="Attention 不是讓模型真正『理解』，而是讓每個 token 在計算時，可以動態參考其他重要 token。"
        >
          <AttentionDemo />
        </Section>

        <Section
          id="align"
          eyebrow="Step 5"
          title="微調與對齊：讓模型更像助手"
          desc="模型學會補文字之後，還需要透過示範答案、偏好選擇與安全調整，學會怎麼回答比較有幫助。"
        >
          <AlignmentDemo />
        </Section>

        <Section
          id="infer"
          eyebrow="Step 6"
          title="推論：從 prompt 開始，一次生成一個 token"
          desc="輸入 prompt 後，模型會計算下一個 token，接回上下文，再繼續計算下一個 token，直到完成回答。"
        >
          <InferenceDemo />
        </Section>

        <footer className="mt-12 rounded-[2rem] bg-slate-950 p-8 text-white">
          <div className="text-2xl font-bold">這只是入門，可以再深入</div>
          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            這個 MVP 已包含五個最關鍵的互動：tokenizer、next-token game、attention demo、preference
            alignment、temperature inference。下一步可以加入旁白腳本、章節進度、測驗題，或更真實的
            attention heatmap。
          </p>
        </footer>
      </main>
    </div>
  );
}

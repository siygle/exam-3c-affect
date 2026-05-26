import React, { useState } from "react";
import Home from "./pages/Home.jsx";
import TimePlannerGame from "./pages/TimePlannerGame.jsx";
import InfiniteScrollTrap from "./pages/InfiniteScrollTrap.jsx";
import AttentionGame from "./pages/AttentionGame.jsx";
import LLMJourney from "./pages/LLMJourney.jsx";

export default function App() {
  const [view, setView] = useState("home");
  const goHome = () => setView("home");

  if (view === "time-planner") return <TimePlannerGame onBack={goHome} />;
  if (view === "scroll-trap") return <InfiniteScrollTrap onBack={goHome} />;
  if (view === "attention-game") return <AttentionGame onBack={goHome} />;
  if (view === "llm-journey") return <LLMJourney onBack={goHome} />;

  return <Home onSelectGame={(id) => setView(id)} />;
}

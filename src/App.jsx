import React from "react";
import Home from "./pages/Home.jsx";
import TimePlannerGame from "./pages/TimePlannerGame.jsx";
import InfiniteScrollTrap from "./pages/InfiniteScrollTrap.jsx";
import AttentionGame from "./pages/AttentionGame.jsx";
import LLMJourney from "./pages/LLMJourney.jsx";
import TraceMe from "./pages/TraceMe.jsx";
import { useHashRoute } from "./lib/useHashRoute.js";

const ROUTES = {
  "time-planner": TimePlannerGame,
  "scroll-trap": InfiniteScrollTrap,
  "attention-game": AttentionGame,
  "llm-journey": LLMJourney,
  "trace-me": TraceMe,
};

export default function App() {
  const { route, navigate } = useHashRoute();
  const goHome = () => navigate("");

  const Game = ROUTES[route];
  if (Game) return <Game onBack={goHome} />;

  return <Home />;
}

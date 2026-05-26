import React, { useState } from "react";
import Home from "./pages/Home.jsx";
import TimePlannerGame from "./pages/TimePlannerGame.jsx";
import InfiniteScrollTrap from "./pages/InfiniteScrollTrap.jsx";

export default function App() {
  const [view, setView] = useState("home");
  const goHome = () => setView("home");

  if (view === "time-planner") return <TimePlannerGame onBack={goHome} />;
  if (view === "scroll-trap") return <InfiniteScrollTrap onBack={goHome} />;

  return <Home onSelectGame={(id) => setView(id)} />;
}

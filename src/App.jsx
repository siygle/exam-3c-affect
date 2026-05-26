import React, { useState } from "react";
import Home from "./pages/Home.jsx";
import TimePlannerGame from "./pages/TimePlannerGame.jsx";

export default function App() {
  const [view, setView] = useState("home");

  if (view === "time-planner") {
    return <TimePlannerGame onBack={() => setView("home")} />;
  }

  return <Home onSelectGame={(id) => setView(id)} />;
}

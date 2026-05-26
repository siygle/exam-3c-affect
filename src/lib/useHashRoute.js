import { useEffect, useState } from "react";

// 把 location.hash 正規化成 game id（去掉開頭的 # 與可選的 /）。
function readHash() {
  if (typeof window === "undefined") return "";
  return window.location.hash.replace(/^#\/?/, "");
}

// 監聽 hashchange，回傳目前 route 字串與一個 navigate(id) 函式。
// navigate("") 或 navigate("/") 會回到首頁。
export function useHashRoute() {
  const [route, setRoute] = useState(readHash);

  useEffect(() => {
    const onHashChange = () => setRoute(readHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (id) => {
    const target = id ? `#/${id}` : "#/";
    if (window.location.hash !== target) {
      window.location.hash = target;
    }
  };

  return { route, navigate };
}

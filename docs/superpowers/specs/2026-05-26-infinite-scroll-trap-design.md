# 無限滑動陷阱（Infinite Scroll Trap）設計

## 目的

讓玩家在 3 分鐘小任務裡，被旁邊的假動態牆 + 通知偷走注意力，最後揭曉「你瞄了 X 次、共 Y 秒、佔總時間 Z%」，反思 3C 干擾。

## 三段流程

1. **Pre-game**：設定面板
   - 任務類型：隨機 / 找錯字 / 找不同 / 邏輯推理 / 拼圖
   - 通知：隨機（預設） / 開 / 關
   - Start 按鈕
2. **In-game**（180 秒倒數）：
   - 左大區：TaskRunner 根據選定 task 載入子元件
   - 右側欄：FakeFeed，每 4–8 秒（亂數）冒新貼文
   - 右下角：通知 toast（隨機 30–60 秒一次，3 秒自動消失）
3. **Post-game**：結果頁

## 瞄看偵測

- `mouseenter` / `mouseleave` 監聽 FakeFeed 容器
- 每次 enter 開始計時、leave 累計秒數 + 次數
- Toast 被 hover / click 也算一次
- UI 文案誠實：「滑鼠在動態牆上停留」而非「眼睛偷瞄」

## 四個 Task

| Task       | 玩法                                        | 完成判定        |
| ---------- | ------------------------------------------- | --------------- |
| TypoTask   | 約 400 字文章內藏 8 個錯字，點字標記        | 找到數 / 8      |
| DiffTask   | 兩個 5×5 emoji 網格，5 處不同，點 cell 標記 | 找到數 / 5      |
| LogicTask  | 4 題情境單選                                | 答對數 / 4      |
| PuzzleTask | 3×3 滑動數字拼圖                            | 是否復原 + 步數 |

每個 task 對外回報 `{ progress, score, completed }`。

## 結果頁

- 主要：**瞄了 X 次，平均每次 Y 秒，總計 Z 秒（佔 Z/180 = N%）**
- 次要：任務完成度、通知被點次數
- 結語依瞄看比例分三段：低 / 中 / 高，淡淡反思「我們以為自己在專心，但身體誠實」，不說教

## 檔案

- `src/pages/InfiniteScrollTrap.jsx`（orchestrator）
- `src/pages/scroll-trap/`
  - `TypoTask.jsx`、`DiffTask.jsx`、`LogicTask.jsx`、`PuzzleTask.jsx`
  - `FakeFeed.jsx`、`NotificationToast.jsx`
  - `useGlanceTracker.js`、`useCountdown.js`、`useNotifications.js`
  - `data.js`（文章、題目、假貼文、假通知內容）
- 更新 `src/pages/Home.jsx`：第一張 Coming soon 換成此遊戲
- 更新 `src/App.jsx`：加入 `scroll-trap` view

## 不做

- 不接 Web Notification API（in-app toast 即可）
- 不存進度、不接後端
- 任務內容固定一組

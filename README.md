# 24 格人生｜互動式時間安排測試

這是一個 React + Vite 製作的互動式小遊戲 prototype。玩家可以選擇角色、安排 24 小時任務、建立自定義任務卡、抽突發事件，最後得到完成度、健康度、信仰值、滿意度、壓力值與時間管理人格分析。

## 使用方式

```bash
npm install
npm run dev
```

啟動後，Vite 會顯示本機網址，通常是：

```bash
http://localhost:5173
```

## 建置靜態檔案

```bash
npm run build
```

建置完成後，靜態檔案會輸出到 `dist/`。

## 專案結構

```txt
index.html
package.json
vite.config.js
src/
  App.jsx
  main.jsx
  index.css
  components/ui/
    button.jsx
    card.jsx
```

## 主要功能

- 角色選擇：學生、上班族、自由工作者
- 任務安排：將任務加入 24 小時時間盤
- 自定義任務卡：可設定名稱、時間、類型、重要度、壓力值、描述、是否可重複
- 突發事件：抽 3 張事件卡後計算結果
- 結果分析：完成度、健康度、信仰值、滿意度、壓力值
- 人格結果：平衡生活型、安靜尋求型、滿檔燃燒型、享樂優先型等

## 備註

目前這版是可玩的 prototype，尚未加入後端、登入、資料儲存或多人模式。自定義任務卡只會存在於當前瀏覽器狀態，重新整理後會消失。

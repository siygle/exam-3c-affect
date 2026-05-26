// 文章中 [錯字|正確字] 標記，由 parseArticle 解析成字元陣列
const RAW_ARTICLE =
  "在這個[姿|資]訊爆炸的時代，我們[京|經]常被各種通[治|知]打斷。手機螢[慕|幕]一亮起，注意力就被偷走。即使坐下來想安靜讀經，內心也充滿了焦[操|躁]，很難真正進入神話語的深[初|處]。其實這不是新的問題。馬大忙著為主預備飯食，反而錯[郭|過]了坐在主腳前的時刻。我們有時候會像馬大一樣，被許多事務煩擾，卻忘了選擇那上好的[浮|福]分。願我們學習在每天的忙碌中，刻意停下來，把心安靜在主面前，讓祂的話語成為腳前的燈、路上的光。";

function parseArticle(raw) {
  const chars = [];
  let i = 0;
  while (i < raw.length) {
    if (raw[i] === "[") {
      const close = raw.indexOf("]", i);
      const inner = raw.slice(i + 1, close);
      const [wrong, correct] = inner.split("|");
      chars.push({ c: wrong, typo: true, correct });
      i = close + 1;
    } else {
      chars.push({ c: raw[i] });
      i += 1;
    }
  }
  return chars;
}

export const TYPO_ARTICLE = parseArticle(RAW_ARTICLE);

// 5x5 emoji 網格找不同。indices 是不同的位置 (0-24)。
const DIFF_GRID_A = [
  "🐶",
  "🐱",
  "🐰",
  "🌸",
  "🌟",
  "🍔",
  "🐰",
  "🐱",
  "🍔",
  "🐶",
  "🌸",
  "🌟",
  "🐰",
  "🌟",
  "🍔",
  "🐱",
  "🐶",
  "🌟",
  "🌸",
  "🐰",
  "🐰",
  "🍔",
  "🐱",
  "🐶",
  "🌸",
];

const DIFF_GRID_B = [
  "🐶",
  "🐱",
  "🐰",
  "🌸",
  "🌟",
  "🍔",
  "🐱",
  "🐱",
  "🍔",
  "🐶",
  "🌸",
  "🌟",
  "🌸",
  "🌟",
  "🍔",
  "🐱",
  "🐶",
  "🌟",
  "🌸",
  "🐶",
  "🐰",
  "🍔",
  "🐱",
  "🌟",
  "🌸",
];

export const DIFF_PUZZLE = {
  gridA: DIFF_GRID_A,
  gridB: DIFF_GRID_B,
  diffIndices: DIFF_GRID_A.reduce((acc, cell, idx) => {
    if (cell !== DIFF_GRID_B[idx]) acc.push(idx);
    return acc;
  }, []),
};

export const LOGIC_QUESTIONS = [
  {
    question: "ABCD 四個人排隊買飲料。A 在 B 前面，C 在 D 前面，D 在 A 前面。誰排第一？",
    options: ["A", "B", "C", "D"],
    answerIndex: 2,
    explain: "由條件：C<D<A<B，所以 C 排第一。",
  },
  {
    question: "甲說「乙說謊」，乙說「丙說謊」，丙說「甲乙都說謊」。只有一個人說真話，是誰？",
    options: ["甲", "乙", "丙", "三個都說謊"],
    answerIndex: 1,
    explain: "假設乙說真話：丙說謊→甲乙至少一人沒說謊；甲說「乙說謊」為假，甲也說謊。一致。",
  },
  {
    question: "數列 1, 1, 2, 3, 5, 8, ?, 21 中問號是？",
    options: ["11", "12", "13", "14"],
    answerIndex: 2,
    explain: "費氏數列：前兩項相加。5+8=13。",
  },
  {
    question:
      "三個杯子分別裝水、果汁、牛奶。第一杯不是水，第二杯不是牛奶。若第三杯是水，第一杯是什麼？",
    options: ["水", "果汁", "牛奶", "無法判斷"],
    answerIndex: 2,
    explain: "第三杯是水→剩果汁與牛奶分給杯一杯二。第二杯不是牛奶→第二杯是果汁，第一杯是牛奶。",
  },
];

const POST_TEMPLATES = [
  { avatar: "🐶", name: "阿光", text: "我家狗狗今天又翻肚討摸了，誰能抵抗", image: "🐶💕" },
  { avatar: "🐱", name: "雅琪", text: "貓主子又把我的耳機線咬斷了第三次⋯", image: "🐱🎧" },
  { avatar: "🍣", name: "小宇", text: "新開的壽司吃到飽真的太狂", image: "🍣🍱🍤" },
  { avatar: "🐰", name: "靖雯", text: "兔兔吃菜的樣子好療癒", image: "🐰🥬" },
  { avatar: "✨", name: "Joy", text: "今天的夕陽美到不行，附近的人快來看", image: "🌅" },
  { avatar: "☕", name: "Daniel", text: "新買的手沖咖啡器材抵達，週末來開箱" },
  { avatar: "🎤", name: "Hannah", text: "下週敬拜團練習有新詩歌，要練到爆 💪" },
  { avatar: "🐼", name: "阿凱", text: "熊貓滾來滾去看一百次都不會膩", image: "🐼🎋" },
  { avatar: "📚", name: "小芸", text: "進度落後，今晚決定不睡了" },
  { avatar: "🌮", name: "Mike", text: "墨西哥捲餅是宇宙級美食，沒有之一", image: "🌮🔥" },
  { avatar: "🐧", name: "Iris", text: "企鵝走路的影片可以治癒一切" },
  { avatar: "🎮", name: "阿哲", text: "新買的遊戲玩到天亮，明天怎麼辦" },
  { avatar: "🍵", name: "Sara", text: "找到一家超讚的茶館，下次來組團" },
  { avatar: "💭", name: "Ellie", text: "突然想到，禱告好久沒有真的安靜了" },
  { avatar: "🐢", name: "阿傑", text: "烏龜界的時尚 icon，請欣賞", image: "🐢🕶️" },
  { avatar: "📸", name: "小璇", text: "新買的相機第一張照片，給我滿分嗎？", image: "📸🌸" },
  { avatar: "🍰", name: "Maggie", text: "戚風蛋糕第七次失敗，但我不會放棄" },
  { avatar: "🐦", name: "Yuki", text: "陽台來了小鳥築巢，請大家安靜不要嚇牠", image: "🐦🏠" },
  { avatar: "🏃", name: "凱文", text: "晨跑打卡 day 47，膝蓋有點抗議" },
  { avatar: "🎬", name: "Vivian", text: "重看了一部老電影，眼淚還是停不下來" },
  { avatar: "🍜", name: "阿樺", text: "深夜泡麵宣告今天結束" },
  { avatar: "🦊", name: "Tony", text: "看到一個迷因笑了半小時，沒救", image: "🦊😂" },
  { avatar: "🌈", name: "Joanna", text: "下完雨的彩虹，神的恩典從不遲到", image: "🌈" },
  { avatar: "🐠", name: "阿德", text: "新買的水族箱開缸成功，魚開始游了" },
  { avatar: "🎨", name: "Stella", text: "今天畫了一張小卡送給朋友，被誇到不要不要" },
  { avatar: "🐻", name: "Ken", text: "熊熊抱抱大會徵集中（在腦中）" },
  { avatar: "📖", name: "Ruth", text: "靈修進度：詩篇 23 篇還是讓我哭" },
  { avatar: "🍦", name: "Amy", text: "冰淇淋融化的速度超過我吃的速度，數學爛" },
  { avatar: "🦦", name: "阿翔", text: "水獺手牽手睡覺，世界因此可愛", image: "🦦💕" },
  { avatar: "🎵", name: "Grace", text: "循環播放這首歌一整天，腦中清空" },
];

export const FEED_POSTS = POST_TEMPLATES;

export const NOTIFICATIONS = [
  "🐶 阿光 發了一張照片",
  "💬 雅琪 在你的限動留言",
  "❤️ Joy 喜歡你的貼文",
  "🔔 小宇 開始了限時動態",
  "📸 小璇 標記了你",
  "🎬 Vivian 分享了一部影片",
  "🍰 Maggie 留言：「下次教我！」",
  "🌈 Joanna 直播中",
  "🐱 雅琪 邀請你加入群組",
  "🎮 阿哲 開始了一場直播",
  "📖 Ruth 分享了一段話",
  "🦊 Tony 在限動標記你",
  "✨ 你的限時動態有 12 個新讚",
  "💭 Ellie 傳了訊息給你",
  "🐰 靖雯 開始追蹤你",
];

export const TASK_OPTIONS = [
  { id: "random", label: "隨機" },
  { id: "typo", label: "找錯字" },
  { id: "diff", label: "找不同" },
  { id: "logic", label: "邏輯推理" },
  { id: "puzzle", label: "拼圖" },
];

export const NOTIFICATION_OPTIONS = [
  { id: "random", label: "隨機" },
  { id: "on", label: "開啟" },
  { id: "off", label: "關閉" },
];

export const GAME_DURATION_SECONDS = 180;

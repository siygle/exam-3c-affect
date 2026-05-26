// 文章中以 [錯字|正確字] 標記錯字，由 parseArticle 解析成字元陣列。
const RAW_ARTICLES = [
  "在這個[姿|資]訊爆炸的時代，我們[京|經]常被各種通[治|知]打斷。手機螢[慕|幕]一亮起，注意力就被偷走。即使坐下來想安靜讀經，內心也充滿了焦[操|躁]，很難真正進入神話語的深[初|處]。其實這不是新的問題。馬大忙著為主預備飯食，反而錯[郭|過]了坐在主腳前的時刻。我們有時候會像馬大一樣，被許多事務煩擾，卻忘了選擇那上好的[浮|福]分。",
  "週六的清晨，城市還沒完全甦[醒|醒]，我習慣把手機放在客廳，自己走進房間禱告。剛開始很不[慣|慣]，總會想拿手機看一眼，怕錯[郭|過]什麼訊息。可是日子久了發[線|現]，那些訊息其實沒有一個是非要立刻[會|回]覆不可的。安靜的時間像一[扇|扇]窗，讓我看見自己內心的[忙|忙]亂與[飢|飢]渴。我[漸|漸]漸學會在一天的開始，先把自己交給神，再去面對[宣|喧]鬧的世界。",
  "小組[聚|聚]會時，姐妹分享她最近[戒|戒]掉了睡前滑短影片的[習|習]慣。她說剛開始幾天，手會[忍|忍]不住伸向床頭，整個人像[戒|戒]斷一樣[煩|煩]躁。但她把聖經放在枕頭旁，[逼|逼]自己睡前讀一段。一個月後，她[竟|竟]然開始期待那段安靜的時間。她說：「我以前以為短影片是[獎|獎]勵自己，後來才[發|發]現那是把我的[平|平]安偷走的小偷。」",
  "下班的捷運上，[整|整]節車廂的人都低頭滑[著|著]手機。我也是其中一個。直到那天我[抬|抬]頭，看見對面[座|座]位上一位阿嬤，正在輕[聲|聲]哼著詩歌。她[手|手]上沒有手機，只有一本翻[皺|皺]的小詩本。我突然[覺|覺]得羞愧，這個世代不缺[資|資]訊，缺的是像那位阿嬤一[樣|樣]，把生命的根扎在另一處的人。願我們也學[會|會]把目光從螢幕上[抬|抬]起來，看見更[真|真]實的事。",
  // 為保留多樣性的第 5 篇純練習版（一般時事）
  "現代生活的[節|節]奏越來越快，許多人發[線|現]自己在做什麼事都[像|像]在多工。一邊吃飯一邊滑手機，一邊開[會|會]一邊回 email，一邊[陪|陪]孩子一邊看影片。研究指出，這種[斷|斷]斷續續的注意力，會讓大[腦|腦]更容易疲勞，效率反而更低。真正能讓我們休息的，是把注意力放在一件事上的那[種|種]專注。",
];

// 把這幾個字當作「故意做誠意的」常見錯字訓練樣本（部分重複位置不影響功能）
// 用 [a|b] 標記時 a 是錯、b 是正。第二三四五篇的標記比較少，這裡再做一次解析示範。
// 為了讓示範更明顯，重新撰寫前幾篇較豐富的錯字版本：
const ARTICLE_VARIANTS = [
  "在這個[姿|資]訊爆炸的時代，我們[京|經]常被各種通[治|知]打斷。手機螢[慕|幕]一亮起，注意力就被偷走。即使坐下來想安靜讀經，內心也充滿了焦[操|躁]，很難真正進入神話語的深[初|處]。其實這不是新的問題。馬大忙著為主預備飯食，反而錯[郭|過]了坐在主腳前的時刻。我們有時候會像馬大一樣，被許多事務煩擾，卻忘了選擇那上好的[浮|福]分。",
  "週六清晨城市還沒醒，我習[管|慣]把手機放在客廳。剛開始很不適應，總想拿起來看一眼，怕[措|錯]過什麼。可是日子久了發[線|現]，那些訊息其實沒有一個是非要立刻回[復|覆]的。安靜的時間像一[膳|扇]窗，讓我看見自己內心的[忘|忙]亂與飢渴。我漸漸學會在一天的開始，先把自己交給神，再去面對[宣|喧]鬧的世界。試著放下手機，你會發現另一個[層|層]次的自由。",
  "姐妹分享她最近戒掉睡前滑短影片的[西|習]慣。剛開始幾天，手會忍不住伸向床頭，像[借|戒]斷一樣煩躁。她把聖經放在枕頭旁，[偪|逼]自己睡前讀一段。一個月後竟然開始期[特|待]那段安靜的時間。她說：我以前以為短影片是[講|獎]勵自己，後來才發現那是把我的平安偷走的小[偷|偷]。對許多人來說，這場戰[爭|爭]每晚都在進行，只是常常輸而不[知|知]。",
  "下班捷運上，整節車[相|廂]的人都低頭滑手機。我也是其中一個。直到那天我抬頭，看見對面座位一位阿嬤，正在輕[省|聲]哼著詩歌。她手上沒有手機，只有一本翻[縐|皺]的小詩本。我突然覺得[羞|羞]愧，這個世代不缺資訊，缺的是像那位阿嬤一樣，把生命的根扎在另一[處|處]的人。願我們也學會把目光從螢幕上抬起來，看見更真實的[實|事]。",
  "現代生活節奏越來越快，許多人發[現|現]自己在做什麼事都像在[夛|多]工。一邊吃飯一邊滑手機，一邊開會一邊[回|回] email，一邊陪孩子一邊看影[片|片]。研究指出，這種斷斷續續的注[一|意]力會讓大腦更容易疲勞，效率反而更[底|低]。真正能讓我們休息的，是把注意力放在一件事上的那種[豐|專]注。",
];

function parseArticle(raw) {
  const chars = [];
  let i = 0;
  while (i < raw.length) {
    if (raw[i] === "[") {
      const close = raw.indexOf("]", i);
      const inner = raw.slice(i + 1, close);
      const [wrong, correct] = inner.split("|");
      // 同字標記（a|a）視為非錯字，作為作者標出「容易被誤標」的點。
      if (wrong === correct) {
        chars.push({ c: wrong });
      } else {
        chars.push({ c: wrong, typo: true, correct });
      }
      i = close + 1;
    } else {
      chars.push({ c: raw[i] });
      i += 1;
    }
  }
  return chars;
}

export const TYPO_ARTICLE_POOL = ARTICLE_VARIANTS.map(parseArticle);
// keep backward export name (some callers may still use single article)
export const TYPO_ARTICLE = TYPO_ARTICLE_POOL[0];
// silence unused warning for the unused raw articles
void RAW_ARTICLES;

// 找不同：emoji 池 + 程序化生成函式。
export const DIFF_EMOJI_POOL = [
  "🐶",
  "🐱",
  "🐰",
  "🐼",
  "🦊",
  "🐧",
  "🐢",
  "🌸",
  "🌟",
  "🍔",
  "🍰",
  "🍣",
  "🍵",
  "🌈",
  "🎵",
];

// 邏輯推理題庫（每次抽 LOGIC_PICK 題）
export const LOGIC_PICK = 4;
export const LOGIC_POOL = [
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
  {
    question: "若所有的 A 都是 B，所有的 B 都是 C，下列何者一定為真？",
    options: ["所有 C 都是 A", "所有 A 都是 C", "所有 C 都是 B", "所有 B 都是 A"],
    answerIndex: 1,
    explain: "三段論。A⊆B 且 B⊆C → A⊆C，所以所有 A 都是 C。",
  },
  {
    question: "一條繩子燒完恰好一小時，但燒得不均勻。如何用兩條同款繩量出 45 分鐘？",
    options: [
      "兩條同時點燃兩端",
      "一條點兩端、另一條點一端，等第一條燒完再點另一端",
      "把繩子折半燒",
      "拿尺量繩長",
    ],
    answerIndex: 1,
    explain:
      "繩 A 兩端同時點燒 30 分鐘燒完，這時點燃繩 B 剩下的另一端，B 從一端燒了 30 分後再雙端燒，再 15 分燒完。30+15=45。",
  },
  {
    question:
      "小明、小華、小芸三人住三樓不同層（一、二、三）。小明不住一樓，小芸不住三樓，小華住偶數樓。誰住一樓？",
    options: ["小明", "小華", "小芸", "無法判斷"],
    answerIndex: 2,
    explain: "小華住二樓（偶數）。小明不住一樓→小明住三樓。剩下小芸住一樓。",
  },
  {
    question: "從 1 到 100 的整數中，有多少個數含有數字 7？",
    options: ["10", "15", "19", "20"],
    answerIndex: 2,
    explain:
      "個位含 7：7,17,27,...,97 共 10 個。十位含 7：70-79 共 10 個。77 重複算一次，10+10-1=19。",
  },
  {
    question:
      "一場比賽四隊（甲乙丙丁）排名互不相同。已知：甲不是第一，乙不是第二，丙是第三。丁第幾名？",
    options: ["第一", "第二", "第三", "第四"],
    answerIndex: 1,
    explain:
      "丙第三 → 第一是甲乙丁之一。甲不是第一，乙不是第二。第二只能是甲或丁；甲不是第一，可能第二或第四；乙可能第一或第四。試：乙第一、甲第四、丁第二，符合所有條件。",
  },
  {
    question: "下列哪個是『不存在的反例』？命題：「所有偶數都不是質數」",
    options: ["4", "6", "2", "8"],
    answerIndex: 2,
    explain: "2 是偶數但也是質數，所以是命題的反例（命題不成立）。",
  },
  {
    question: "時鐘 3 點 15 分時，時針與分針的夾角是多少度？",
    options: ["0 度", "7.5 度", "15 度", "22.5 度"],
    answerIndex: 1,
    explain:
      "分針在 3（90 度）；時針從 3 走了 15/60=1/4 小時，每小時 30 度，所以時針位置 90+7.5=97.5 度。差 7.5 度。",
  },
  {
    question: "你有 9 顆球外觀完全相同，其中一顆比較重。用一台天平最少幾次可以找出最重的那顆？",
    options: ["1 次", "2 次", "3 次", "4 次"],
    answerIndex: 1,
    explain: "分三堆各三顆，先秤兩堆找出較重的那堆（一次）；再從三顆裡秤兩顆（一次）。共 2 次。",
  },
];

// 動態牆貼文：
//   image: { kind: 'photo', tag: 'cat,kitten' } 透過 Loremflickr 取對應主題照片
//   image: { kind: 'emoji', value: '🐱🎧' }       emoji 漸層底
//   未提供 image                                   純文字貼文（笑話 / 廢文 / 信仰反思）
const photo = (tag) => ({ kind: "photo", tag });
const emoji = (value) => ({ kind: "emoji", value });

const ANIMAL_POSTS = [
  {
    avatar: "🐶",
    name: "阿光",
    text: "我家狗狗今天又翻肚討摸了，誰能抵抗",
    image: photo("dog,puppy"),
  },
  {
    avatar: "🐱",
    name: "雅琪",
    text: "貓主子又把我的耳機線咬斷了第三次⋯",
    image: photo("cat,kitten"),
  },
  { avatar: "🐰", name: "靖雯", text: "兔兔吃菜的樣子好療癒", image: photo("rabbit,bunny") },
  {
    avatar: "🐼",
    name: "阿凱",
    text: "熊貓滾來滾去看一百次都不會膩",
    image: photo("panda,bamboo"),
  },
  {
    avatar: "🐢",
    name: "阿傑",
    text: "烏龜界的時尚 icon，請欣賞",
    image: photo("turtle,tortoise"),
  },
  {
    avatar: "🐦",
    name: "Yuki",
    text: "陽台來了小鳥築巢，請大家安靜不要嚇牠",
    image: photo("bird,nest"),
  },
  { avatar: "🦦", name: "阿翔", text: "水獺手牽手睡覺，世界因此可愛", image: photo("otter,sea") },
  { avatar: "🐧", name: "Iris", text: "企鵝走路的影片可以治癒一切", image: photo("penguin,ice") },
  {
    avatar: "🐠",
    name: "阿德",
    text: "新買的水族箱開缸成功，魚開始游了",
    image: photo("aquarium,fish"),
  },
  {
    avatar: "🦊",
    name: "Tony",
    text: "看到一隻狐狸頭歪歪望著我，融化",
    image: photo("fox,wildlife"),
  },
  { avatar: "🐻", name: "Ken", text: "熊熊抱抱大會徵集中（在腦中）", image: photo("bear,forest") },
  {
    avatar: "🐹",
    name: "小雪",
    text: "倉鼠塞滿臉頰的瞬間，被治癒了 365 天",
    image: photo("hamster,pet"),
  },
];

const FOOD_LIFESTYLE_POSTS = [
  { avatar: "🍣", name: "小宇", text: "新開的壽司吃到飽真的太狂", image: photo("sushi,japanese") },
  {
    avatar: "🌮",
    name: "Mike",
    text: "墨西哥捲餅是宇宙級美食，沒有之一",
    image: photo("taco,mexican"),
  },
  {
    avatar: "🍰",
    name: "Maggie",
    text: "戚風蛋糕第七次失敗，但我不會放棄",
    image: photo("cake,bakery"),
  },
  { avatar: "🍜", name: "阿樺", text: "深夜泡麵宣告今天結束", image: photo("ramen,noodle") },
  {
    avatar: "🍦",
    name: "Amy",
    text: "冰淇淋融化的速度超過我吃的速度，數學爛",
    image: photo("icecream,dessert"),
  },
  {
    avatar: "☕",
    name: "Daniel",
    text: "新買的手沖咖啡器材抵達，週末來開箱",
    image: photo("coffee,pourover"),
  },
  {
    avatar: "🍵",
    name: "Sara",
    text: "找到一家超讚的茶館，下次來組團",
    image: photo("tea,matcha"),
  },
  {
    avatar: "✨",
    name: "Joy",
    text: "今天的夕陽美到不行，附近的人快來看",
    image: photo("sunset,sky"),
  },
  {
    avatar: "🌈",
    name: "Joanna",
    text: "下完雨的彩虹，神的恩典從不遲到",
    image: photo("rainbow,sky"),
  },
  {
    avatar: "📸",
    name: "小璇",
    text: "新買的相機第一張照片，給我滿分嗎？",
    image: photo("flowers,bloom"),
  },
  {
    avatar: "🏃",
    name: "凱文",
    text: "晨跑打卡 day 47，膝蓋有點抗議",
    image: photo("running,park"),
  },
  {
    avatar: "🎬",
    name: "Vivian",
    text: "重看了一部老電影，眼淚還是停不下來",
    image: photo("cinema,film"),
  },
  { avatar: "📚", name: "小芸", text: "進度落後，今晚決定不睡了", image: photo("study,books") },
  {
    avatar: "🎨",
    name: "Stella",
    text: "今天畫了一張小卡送給朋友，被誇到不要不要",
    image: photo("watercolor,art"),
  },
  {
    avatar: "📖",
    name: "Ruth",
    text: "靈修進度：詩篇 23 篇還是讓我哭",
    image: photo("bible,morning"),
  },
  {
    avatar: "🎵",
    name: "Grace",
    text: "循環播放這首歌一整天，腦中清空",
    image: photo("vinyl,music"),
  },
];

// 笑話 / 廢文：純文字最有梗，少數搭一個 emoji 圖示
const JOKE_POSTS = [
  {
    avatar: "🦊",
    name: "Tony",
    text: "為什麼程式設計師喜歡黑暗？因為光線會產生 bug 🪲",
    image: emoji("💻🌚"),
  },
  { avatar: "🐱", name: "雅琪", text: "我跟我家貓說我要減肥，牠回我：『先處理一下你眼袋』" },
  { avatar: "📚", name: "小芸", text: "凌晨三點的我：明天絕對不熬夜。明天的我：呵" },
  { avatar: "🧦", name: "阿哲", text: "人生最大的謎：為什麼襪子永遠只剩一隻" },
  { avatar: "🤖", name: "Mike", text: "AI 取代不了我，因為連我自己都搞不懂我每天在幹嘛" },
  {
    avatar: "🍞",
    name: "Maggie",
    text: "我和我的鬆餅機之間有個祕密：它知道我把它買來只是為了拍照",
  },
  {
    avatar: "📱",
    name: "Daniel",
    text: "螢幕使用時間警告：『你今天滑了 5 小時』。我：『多謝你的鼓勵』",
  },
  { avatar: "🛏️", name: "Ellie", text: "床的引力不是物理現象，是道德問題" },
  {
    avatar: "🎤",
    name: "Hannah",
    text: "主日學考題：『耶穌行了什麼神蹟？』小朋友答：『讓我媽不再生氣』。教會集體爆笑",
  },
  { avatar: "🙏", name: "Ruth", text: "禱告會時打瞌睡被點到，我說：『阿們在心中』，全場安靜三秒" },
  { avatar: "📅", name: "Joy", text: "我列了今年的目標，已成功完成『列目標』這項" },
  { avatar: "🍕", name: "Ken", text: "減肥菜單第一條：先吃完冰箱剩下的所有東西" },
];

const FAITH_VOID_POSTS = [
  { avatar: "💭", name: "Ellie", text: "突然想到，禱告好久沒有真的安靜了" },
  { avatar: "🎤", name: "Hannah", text: "下週敬拜團練習有新詩歌，要練到爆 💪" },
  { avatar: "🐱", name: "Sara", text: "今天小組分享，發現我們都被同一件事卡住，卻沒人先說" },
];

const POST_TEMPLATES = [
  ...ANIMAL_POSTS,
  ...FOOD_LIFESTYLE_POSTS,
  ...JOKE_POSTS,
  ...FAITH_VOID_POSTS,
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
  "🤖 Mike 發了一則笑話",
  "🐹 小雪 發了一張倉鼠照",
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

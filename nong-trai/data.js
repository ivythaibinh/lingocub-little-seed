/* Nông trại Lingo Cub — danh mục vật phẩm (giá, cấp, tên 3 thứ tiếng).
   Giá đặt để: mỗi món 1 cái ≈ 610 sao (bé đúng khoảng 60% một lượt cả web); mua tối đa mọi thứ ≈ 940 sao (một lượt đúng 100% ≈ 975 sao).
   Sửa giá / cấp ở đây. id cũng là tên file âm thanh: audio/<id>_en.mp3, audio/<id>_zh.mp3 */
window.FARM_DATA = {
  CAP_DAY: 40,          // sao học tối đa mỗi ngày
  SALE_CAP_DAY: 10,     // sao bán nông sản tối đa mỗi ngày
  SAT_STARS: 5,         // mỗi video Show and Tell (1 lần / Unit)
  GRACE: 2,             // bỏ học quá số ngày này thì cây ngừng lớn (có giếng: 4)
  LEVELS: [
    { n: 1, name: "Mầm non", at: 0 },
    { n: 2, name: "Cây non", at: 50 },
    { n: 3, name: "Ra hoa", at: 120 },
    { n: 4, name: "Kết trái", at: 220 },
    { n: 5, name: "Nông trại vàng", at: 340 },
    { n: 6, name: "Nông trại kim cương", at: 460 },
    { n: 7, name: "Nông trại cầu vồng", at: 600 }
  ],
  /* rau: plot S = ô nhỏ, M = ô vừa; days = số ngày lớn; sell = giá bán 1 phần thu hoạch */
  CROPS: [
    { id: "carrot", vi: "Cà rốt", en: "Carrot", zh: "胡萝卜", py: "húluóbo", plot: "S", price: 1, days: 2, lv: 1, sell: 3 },
    { id: "potato", vi: "Khoai tây", en: "Potato", zh: "土豆", py: "tǔdòu", plot: "S", price: 1, days: 2, lv: 1, sell: 3 },
    { id: "cabbage", vi: "Bắp cải", en: "Cabbage", zh: "白菜", py: "báicài", plot: "S", price: 1, days: 2, lv: 1, sell: 3 },
    { id: "tomato", vi: "Cà chua", en: "Tomato", zh: "西红柿", py: "xīhóngshì", plot: "S", price: 1, days: 3, lv: 1, sell: 5 },
    { id: "sweetpotato", vi: "Khoai lang", en: "Sweet potato", zh: "红薯", py: "hóngshǔ", plot: "S", price: 2, days: 3, lv: 2, sell: 5 },
    { id: "strawberry", vi: "Dâu tây", en: "Strawberry", zh: "草莓", py: "cǎoméi", plot: "S", price: 2, days: 4, lv: 2, sell: 8 },
    { id: "sunflower", vi: "Hướng dương", en: "Sunflower", zh: "向日葵", py: "xiàngrìkuí", plot: "S", price: 2, days: 3, lv: 2, sell: 6 },
    { id: "cucumber", vi: "Dưa chuột", en: "Cucumber", zh: "黄瓜", py: "huángguā", plot: "M", price: 1, days: 2, lv: 2, sell: 5 },
    { id: "corn", vi: "Ngô", en: "Corn", zh: "玉米", py: "yùmǐ", plot: "M", price: 1, days: 3, lv: 2, sell: 5 },
    { id: "rice", vi: "Lúa", en: "Rice", zh: "水稻", py: "shuǐdào", plot: "M", price: 2, days: 4, lv: 3, sell: 7 },
    { id: "pumpkin", vi: "Bí ngô", en: "Pumpkin", zh: "南瓜", py: "nánguā", plot: "M", price: 2, days: 4, lv: 3, sell: 8 },
    { id: "watermelon", vi: "Dưa hấu", en: "Watermelon", zh: "西瓜", py: "xīguā", plot: "M", price: 3, days: 5, lv: 3, sell: 9 }
  ],
  /* hạt giống của tuần (thưởng học 5 ngày/tuần, không bán trong cửa hàng) */
  SPECIAL: [
    { id: "tulip", vi: "Hoa tulip", en: "Tulip", zh: "郁金香", py: "yùjīnxiāng", plot: "S", days: 3, sell: 10, special: true },
    { id: "goldpumpkin", vi: "Bí ngô vàng", en: "Golden pumpkin", zh: "金南瓜", py: "jīn nánguā", plot: "M", days: 4, sell: 12, special: true },
    { id: "whitestrawberry", vi: "Dâu tây trắng", en: "White strawberry", zh: "白草莓", py: "bái cǎoméi", plot: "S", days: 4, sell: 12, special: true }
  ],
  /* cây ăn quả: ô lớn; lớn sau 4 ngày, rồi cứ 3 ngày ra quả */
  TREES: [
    { id: "bananatree", vi: "Cây chuối", en: "Banana tree", zh: "香蕉树", py: "xiāngjiāoshù", price: 8, lv: 3, fruit: "banana" },
    { id: "appletree", vi: "Cây táo", en: "Apple tree", zh: "苹果树", py: "píngguǒshù", price: 10, lv: 3, fruit: "apple" },
    { id: "orangetree", vi: "Cây cam", en: "Orange tree", zh: "橙子树", py: "chéngzishù", price: 10, lv: 3, fruit: "orange" },
    { id: "mangotree", vi: "Cây xoài", en: "Mango tree", zh: "芒果树", py: "mángguǒshù", price: 12, lv: 4, fruit: "mango" },
    { id: "peachtree", vi: "Cây đào", en: "Peach tree", zh: "桃树", py: "táoshù", price: 12, lv: 4, fruit: "peach" },
    { id: "coconuttree", vi: "Cây dừa", en: "Coconut tree", zh: "椰子树", py: "yēzishù", price: 14, lv: 5, fruit: "coconut" },
    { id: "lycheetree", vi: "Cây vải", en: "Lychee tree", zh: "荔枝树", py: "lìzhīshù", price: 14, lv: 5, fruit: "lychee" },
    { id: "cherrytree", vi: "Cây anh đào", en: "Cherry tree", zh: "樱桃树", py: "yīngtáoshù", price: 18, lv: 6, fruit: "cherry" }
  ],
  TREE_GROW: 4, TREE_EVERY: 3,
  FRUITS: [
    { id: "banana", vi: "Chuối", en: "Banana", zh: "香蕉", py: "xiāngjiāo", sell: 3 },
    { id: "apple", vi: "Táo", en: "Apple", zh: "苹果", py: "píngguǒ", sell: 3 },
    { id: "orange", vi: "Cam", en: "Orange", zh: "橙子", py: "chéngzi", sell: 3 },
    { id: "mango", vi: "Xoài", en: "Mango", zh: "芒果", py: "mángguǒ", sell: 4 },
    { id: "peach", vi: "Đào", en: "Peach", zh: "桃子", py: "táozi", sell: 4 },
    { id: "coconut", vi: "Dừa", en: "Coconut", zh: "椰子", py: "yēzi", sell: 5 },
    { id: "lychee", vi: "Vải", en: "Lychee", zh: "荔枝", py: "lìzhī", sell: 5 },
    { id: "cherry", vi: "Anh đào", en: "Cherry", zh: "樱桃", py: "yīngtáo", sell: 6 }
  ],
  /* con vật: tối đa 3 con mỗi loài; con thứ 2 mở ở cấp 5, con thứ 3 ở cấp 6 */
  ANIMALS: [
    { id: "chicken", vi: "Gà", en: "Chicken", zh: "鸡", py: "jī", price: 6, lv: 1, product: "egg", food: "corn", home: "Sân" },
    { id: "duck", vi: "Vịt", en: "Duck", zh: "鸭子", py: "yāzi", price: 6, lv: 1, product: "duckegg", food: "rice", home: "Ao/sân" },
    { id: "rabbit", vi: "Thỏ", en: "Rabbit", zh: "兔子", py: "tùzi", price: 6, lv: 1, food: "carrot", home: "Chuồng" },
    { id: "cat", vi: "Mèo", en: "Cat", zh: "猫", py: "māo", price: 8, lv: 2, home: "Nhà" },
    { id: "dog", vi: "Chó", en: "Dog", zh: "狗", py: "gǒu", price: 10, lv: 2, home: "Nhà" },
    { id: "pig", vi: "Lợn", en: "Pig", zh: "猪", py: "zhū", price: 12, lv: 3, food: "sweetpotato", home: "Chuồng" },
    { id: "cow", vi: "Bò sữa", en: "Cow", zh: "奶牛", py: "nǎiniú", price: 20, lv: 4, product: "milk", food: "cabbage", home: "Đồng cỏ" },
    { id: "buffalo", vi: "Trâu", en: "Buffalo", zh: "水牛", py: "shuǐniú", price: 24, lv: 4, food: "corn", home: "Đồng cỏ", note: "Có trâu cày ruộng: lúa lớn nhanh hơn 1 ngày" }
  ],
  MORE_LV: [0, 5, 6],   // cấp cần để nuôi con thứ 1, 2, 3
  PRODUCTS: [
    { id: "egg", vi: "Trứng gà", en: "Egg", zh: "鸡蛋", py: "jīdàn", sell: 2 },
    { id: "duckegg", vi: "Trứng vịt", en: "Duck egg", zh: "鸭蛋", py: "yādàn", sell: 2 },
    { id: "milk", vi: "Sữa", en: "Milk", zh: "牛奶", py: "niúnǎi", sell: 3 }
  ],
  /* dụng cụ: mua 1 lần dùng mãi (trừ phân bón) */
  TOOLS: [
    { id: "wateringcan", vi: "Bình tưới", en: "Watering can", zh: "喷壶", py: "pēnhú", price: 0, lv: 1, starter: true, use: "Bé chơi 1 trò mỗi ngày là nông trại được tưới" },
    { id: "shovel", vi: "Xẻng", en: "Shovel", zh: "铲子", py: "chǎnzi", price: 0, lv: 1, starter: true, use: "Dùng để trồng cây" },
    { id: "basket", vi: "Giỏ", en: "Basket", zh: "篮子", py: "lánzi", price: 5, lv: 1, use: "Thu hoạch cả ruộng một lần" },
    { id: "raincoat", vi: "Áo mưa cho thú", en: "Raincoat", zh: "雨衣", py: "yǔyī", price: 5, lv: 1, use: "Che mưa, giông bão" },
    { id: "fertilizer", vi: "Phân bón", en: "Fertilizer", zh: "肥料", py: "féiliào", price: 2, lv: 1, consumable: true, use: "Cây lớn nhanh thêm 1 ngày" },
    { id: "blanket", vi: "Chăn ấm", en: "Blanket", zh: "毯子", py: "tǎnzi", price: 5, lv: 2, use: "Che lạnh, tuyết" },
    { id: "sunshade", vi: "Lưới che nắng", en: "Sun shade", zh: "遮阳网", py: "zhēyángwǎng", price: 6, lv: 2, use: "Che nóng" },
    { id: "fence", vi: "Hàng rào", en: "Fence", zh: "篱笆", py: "líba", price: 6, lv: 2, use: "Chắn gió, giông bão" },
    { id: "lantern", vi: "Đèn lồng", en: "Lantern", zh: "灯笼", py: "dēnglong", price: 6, lv: 2, use: "Sương mù: thú không bị lạc" },
    { id: "shelter", vi: "Mái che ruộng", en: "Rain shelter", zh: "雨棚", py: "yǔpéng", price: 8, lv: 3, use: "Che mưa, giông bão cho ruộng" },
    { id: "scarecrow", vi: "Bù nhìn", en: "Scarecrow", zh: "稻草人", py: "dàocǎorén", price: 8, lv: 3, use: "Chim không mổ hạt mới gieo" }
  ],
  /* công trình (mua 1 lần) và trang trí (mua bao nhiêu cũng được) */
  BUILDINGS: [
    { id: "pond", vi: "Ao", en: "Pond", zh: "池塘", py: "chítáng", price: 15, lv: 2, use: "Vịt bơi và đẻ trứng" },
    { id: "well", vi: "Giếng", en: "Well", zh: "水井", py: "shuǐjǐng", price: 12, lv: 4, use: "Bé nghỉ tới 4 ngày cây vẫn lớn" },
    { id: "wheelbarrow", vi: "Xe cút kít", en: "Wheelbarrow", zh: "手推车", py: "shǒutuīchē", price: 15, lv: 5, use: "Sản phẩm của thú +1" },
    { id: "bigbarn", vi: "Chuồng lớn", en: "Barn", zh: "谷仓", py: "gǔcāng", price: 40, lv: 5, use: "Trứng, sữa bán thêm +1 sao" },
    { id: "windmill", vi: "Cối xay gió", en: "Windmill", zh: "风车", py: "fēngchē", price: 45, lv: 6, use: "Lúa, ngô bán thêm +2 sao" },
    { id: "greenhouse", vi: "Nhà kính", en: "Greenhouse", zh: "温室", py: "wēnshì", price: 55, lv: 6, use: "Ô nhỏ không sợ thời tiết xấu" },
    { id: "tractor", vi: "Máy kéo", en: "Tractor", zh: "拖拉机", py: "tuōlājī", price: 70, lv: 7, use: "Gieo hạt cho mọi ô trống một lần" }
  ],
  DECOR: [
    { id: "flower", vi: "Hoa", en: "Flower", zh: "花", py: "huā", price: 2, lv: 2 },
    { id: "sign", vi: "Biển tên nông trại", en: "Farm sign", zh: "牌子", py: "páizi", price: 6, lv: 2 },
    { id: "bench", vi: "Ghế đá", en: "Bench", zh: "长椅", py: "chángyǐ", price: 6, lv: 3 },
    { id: "swing", vi: "Xích đu", en: "Swing", zh: "秋千", py: "qiūqiān", price: 10, lv: 4 },
    { id: "bridge", vi: "Cầu nhỏ", en: "Little bridge", zh: "小桥", py: "xiǎoqiáo", price: 12, lv: 4 },
    { id: "rainbowarch", vi: "Cổng cầu vồng", en: "Rainbow arch", zh: "彩虹门", py: "cǎihóngmén", price: 25, lv: 7 }
  ],
  /* quà hiếm từ mục tiêu lớp (không mua được) */
  RARE: [
    { id: "rainbowflower", vi: "Hoa cầu vồng", en: "Rainbow flower", zh: "彩虹花", py: "cǎihónghuā" },
    { id: "giantpumpkin", vi: "Bí ngô khổng lồ", en: "Giant pumpkin", zh: "大南瓜", py: "dà nánguā" },
    { id: "goldlantern", vi: "Đèn lồng vàng", en: "Golden lantern", zh: "金灯笼", py: "jīn dēnglong" },
    { id: "trophy", vi: "Cúp nông trại", en: "Farm trophy", zh: "奖杯", py: "jiǎngbēi" }
  ],
  /* ô đất */
  PLOTS: [
    { id: "smallplot", size: "S", vi: "Ô nhỏ", en: "Small plot", zh: "小块地", py: "xiǎo kuài dì", start: 4, max: 8, price: 5, lv: 1, use: "Trồng rau nhỏ, hoa" },
    { id: "mediumplot", size: "M", vi: "Ô vừa", en: "Medium plot", zh: "中块地", py: "zhōng kuài dì", start: 0, max: 4, price: 10, lv: 2, use: "Trồng rau to; rau nhỏ thu ×2" },
    { id: "largeplot", size: "L", vi: "Ô lớn", en: "Large plot", zh: "大块地", py: "dà kuài dì", start: 0, max: 6, price: 20, lv: 3, use: "Trồng cây ăn quả; rau thu ×4" }
  ],
  /* thời tiết. need = đồ phải dựng; câu tiếng Anh/Trung có file audio/w-<id>_en|zh.mp3 */
  WEATHER: {
    sunny:   { icon: "sun", good: true, en: "It's sunny today.", zh: "今天晴天。", py: "jīntiān qíngtiān", vi: "Trời nắng đẹp, cây lớn nhanh lắm!" },
    cloudy:  { icon: "cloud", good: true, en: "It's cloudy today.", zh: "今天阴天。", py: "jīntiān yīntiān", vi: "Trời nhiều mây, mát mẻ dễ chịu." },
    rainbow: { icon: "rainbow", good: true, en: "There's a rainbow today.", zh: "今天有彩虹。", py: "jīntiān yǒu cǎihóng", vi: "Có cầu vồng! Thu hoạch hôm nay được gấp đôi." },
    rainy:   { icon: "cloud_with_rain", need: ["shelter", "raincoat"], en: "It's rainy today.", zh: "今天下雨。", py: "jīntiān xià yǔ", vi: "Mưa to! Dựng mái che ruộng và mặc áo mưa cho các bạn thú nhé." },
    windy:   { icon: "wind_face", need: ["fence"], en: "It's windy today.", zh: "今天刮风。", py: "jīntiān guā fēng", vi: "Gió mạnh! Dựng hàng rào chắn gió nhé." },
    stormy:  { icon: "cloud_with_lightning_and_rain", need: ["shelter", "raincoat", "fence"], en: "It's stormy today.", zh: "今天有雷雨。", py: "jīntiān yǒu léiyǔ", vi: "Giông bão! Cần mái che, áo mưa và hàng rào." },
    hot:     { icon: "hot_face", need: ["sunshade"], en: "It's hot today.", zh: "今天很热。", py: "jīntiān hěn rè", vi: "Nóng quá! Dựng lưới che nắng cho cây nhé." },
    cold:    { icon: "cold_face", need: ["blanket"], en: "It's cold today.", zh: "今天很冷。", py: "jīntiān hěn lěng", vi: "Lạnh quá! Đắp chăn ấm cho các bạn thú nhé." },
    snowy:   { icon: "snowflake", need: ["blanket"], en: "It's snowy today.", zh: "今天下雪。", py: "jīntiān xià xuě", vi: "Tuyết rơi! Đắp chăn ấm cho các bạn thú nhé." },
    foggy:   { icon: "fog", need: ["lantern"], en: "It's foggy today.", zh: "今天有雾。", py: "jīntiān yǒu wù", vi: "Sương mù dày! Treo đèn lồng để các bạn thú không bị lạc." }
  },
  BAD: ["rainy", "windy", "stormy", "hot", "cold", "snowy", "foggy"],
  WEEK_REWARD: { days3: { fertilizer: 3 }, days5: "special" }
};

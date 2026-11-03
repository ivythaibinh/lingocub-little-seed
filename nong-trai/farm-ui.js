/* Nông trại Lingo Cub — giao diện: cảnh nông trại, lịch tuần, bản tin thời tiết, khu đổi sao, kho. */
(function () {
  "use strict";
  var F = window.FarmCore, D = F.D, BY = F.BY;
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var WVI = { sunny: "Nắng", cloudy: "Nhiều mây", rainbow: "Cầu vồng", rainy: "Mưa", windy: "Gió", stormy: "Giông bão", hot: "Nóng", cold: "Lạnh", snowy: "Tuyết", foggy: "Sương mù" };
  var DOW = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  /* ---------- hình ---------- */
  var treeCache = {};
  function treeImg(t, size) {
    var k = t.id + size; if (treeCache[k]) return treeCache[k];
    var cv = document.createElement("canvas"), c = PX.canvas(cv, 36, 36);
    PX.spr(c, t.id === "coconuttree" ? "palm" : "tree", 32, 1, 1);
    if (t.id !== "coconuttree") { PX.spr(c, t.fruit, 14, 4, 8); PX.spr(c, t.fruit, 14, 18, 4); }
    else PX.spr(c, "coconut", 14, 10, 10);
    return (treeCache[k] = cv.toDataURL());
  }
  function ICON(id, size, k) {
    var x = BY[id];
    if (x && x.cat === "tree") { var px = Math.round(36 * (size / 32) * k); return '<img class="px" src="' + treeImg(x) + '" width="' + px + '" height="' + px + '" alt="">'; }
    return PX.icon(id, size, k);
  }
  function STAR(k) { return PX.icon("star", 14, k || 1, "ic"); }

  /* ---------- âm thanh ---------- */
  var cur = null;
  function say(file, btn) {
    try { if (cur) { cur.pause(); } cur = new Audio("audio/" + file + ".mp3"); cur.play().catch(function () {}); } catch (e) {}
    if (btn) { btn.classList.add("on"); setTimeout(function () { btn.classList.remove("on"); }, 900); }
  }
  var AC = null;
  function beep(ok) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var t = AC.currentTime, notes = ok ? [660, 880, 1320] : [300, 220];
      notes.forEach(function (f, i) {
        var o = AC.createOscillator(), g = AC.createGain(); o.type = "square"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * 0.09); g.gain.exponentialRampToValueAtTime(0.06, t + i * 0.09 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.12);
        o.connect(g); g.connect(AC.destination); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.14);
      });
    } catch (e) {}
  }
  function spk(file) { return '<button class="spk" type="button" data-say="' + file + '" aria-label="Nghe">' + PX.icon("speaker", 18, 1) + "</button>"; }
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-say]"); if (b) { e.stopPropagation(); say(b.getAttribute("data-say"), b); } }, true);

  var toastT = 0;
  function toast(msg, bad) {
    if (!msg) return;
    var t = $("toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.className = "toast" + (bad ? " bad" : ""); t.style.opacity = 1;
    clearTimeout(toastT); toastT = setTimeout(function () { t.style.opacity = 0; }, 2600);
  }
  function act(r) { if (!r) return r; beep(r.ok); toast(r.msg, !r.ok); return r; }

  /* ---------- thẻ thông tin ---------- */
  function names(x) {
    return '<div class="l"><span class="lb">EN</span>' + esc(x.en) + " " + spk(x.id + "_en") + "</div>" +
      '<div class="l z"><span class="lb">中</span><span class="zh">' + esc(x.zh) + '</span><span class="py">' + esc(x.py) + "</span>" + spk(x.id + "_zh") + "</div>" +
      '<div class="l v"><span class="lb">VI</span>' + esc(x.vi) + "</div>";
  }
  function closeCard() { var o = $("ov"); if (o) o.remove(); }
  function card(o) {
    closeCard();
    var ov = document.createElement("div"); ov.className = "ov"; ov.id = "ov";
    var h = '<div class="card pxf" role="dialog" aria-modal="true"><div class="hd">' + (o.pic || "") + '<span class="st">' + (o.status || "") + '</span><button class="x" type="button" data-close>✕</button></div>' +
      (o.item ? names(o.item) : "") + (o.title ? '<div class="l">' + o.title + "</div>" : "") + (o.note ? '<p class="note">' + o.note + "</p>" : "") + (o.html || "");
    if (o.opts && o.opts.length) h += '<div class="opts">' + o.opts.map(function (p, i) { return '<button class="opt" type="button" data-opt="' + i + '">' + p.label + "</button>"; }).join("") + "</div>";
    if (o.acts && o.acts.length) h += '<div class="acts">' + o.acts.map(function (a, i) { return '<button class="btn' + (a.off ? " off" : "") + '" type="button" data-act="' + i + '" style="background:' + (a.bg || "var(--green)") + '">' + a.label + "</button>"; }).join("") + "</div>";
    ov.innerHTML = h + "</div>";
    ov.addEventListener("click", function (e) {
      if (e.target === ov || e.target.closest("[data-close]")) { closeCard(); return; }
      var a = e.target.closest("[data-act]"), p = e.target.closest("[data-opt]");
      var fn = a ? o.acts[+a.dataset.act].fn : p ? o.opts[+p.dataset.opt].fn : null;
      if (fn) { var r = fn(); if (r !== false) closeCard(); }
    });
    document.body.appendChild(ov);
  }

  /* ---------- đầu trang ---------- */
  function header() {
    var u = LC.user(), L = F.level(), S = F.stars();
    $("title").textContent = "Nông trại của " + (u ? u.name : "bé");
    var nx = L.next, pct = nx ? Math.min(100, Math.round((L.learn - L.at) / (nx.at - L.at) * 100)) : 100;
    $("lvl").innerHTML = "<b>Cấp " + L.n + " · " + esc(L.name) + '</b><div class="bar"><i style="width:' + pct + '%"></i></div><span style="font-size:18px">' +
      (nx ? L.learn + " / " + nx.at + " sao học → Cấp " + nx.n : "Cấp cao nhất rồi!") + "</span>";
    $("stars").innerHTML = PX.icon("star", 24, 2) + S.balance;
    $("shopStars").innerHTML = STAR(2) + S.balance;
    var st = F.state(); if ((st.lvSeen || 1) < L.n) { if (st.lvSeen) boom("Lên Cấp " + L.n + "!", L.name + " — mở thêm đồ mới ở Khu đổi sao."); st.lvSeen = L.n; }
  }
  function boom(big, small) {
    var b = document.createElement("div"); b.className = "boom";
    b.innerHTML = '<div class="pxf">' + PX.icon("glowing_star", 32, 3) + "<b>" + esc(big) + "</b>" + esc(small) + "</div>";
    b.onclick = function () { b.remove(); }; document.body.appendChild(b); beep(true); setTimeout(function () { b.remove(); }, 4200);
  }

  /* ---------- lịch tuần ---------- */
  function calendar() {
    var t = F.today(), mon = F.monday(t), days = F.weekDays(mon), cls = F.cls(), drops = cls && cls.weeks[0] && cls.weeks[0].start === mon ? cls.weeks[0].drops : [];
    $("calIc").innerHTML = PX.icon("seedling", 18, 1);
    $("calRange").textContent = days[0].slice(8) + "/" + +days[0].slice(5, 7) + " – " + days[6].slice(8) + "/" + +days[6].slice(5, 7);
    var S = F.stars(), K = innerWidth < 560 ? 1 : 2;
    $("days").innerHTML = days.map(function (d, i) {
      var w = F.weatherOf(d), known = d <= F.addDays(t, 2), cls2 = d === t ? "today" : d > t ? (known ? "fut" : "unk") : "", s;
      if (d === t) s = F.played(d) ? PX.icon("seedling", 14, 1) + (S.by[d] || 0) + STAR() : "chưa học";
      else if (d < t) s = F.played(d) ? PX.icon("seedling", 14, 1) + (S.by[d] || 0) + STAR() : PX.icon("zzz", 14, 1) + "nghỉ";
      else s = known ? '<span style="color:var(--blue-d)">dự báo</span>' : "?";
      return '<div class="d ' + cls2 + '" data-day="' + d + '">' + (d === t ? '<span class="tag">HÔM NAY</span>' : "") +
        (drops.indexOf(d) >= 0 ? '<span class="drop">' + PX.icon("droplet", 14, 1) + "</span>" : "") +
        '<div class="n">' + DOW[i] + " <small>" + +d.slice(8) + "/" + +d.slice(5, 7) + '</small></div><div class="w">' +
        (known ? PX.icon(D.WEATHER[w].icon, 24, K) : '<span style="opacity:.45;filter:grayscale(1)">' + PX.icon("cloud", 24, K) + "</span>") + '</div><div class="s">' + s + "</div></div>";
    }).join("");
    var W = F.weekInfo(), pips = ""; for (var i = 0; i < 5; i++) pips += '<i class="' + (i < W.played ? "on" : "") + '"></i>';
    $("wk").innerHTML = "Tuần này: <b style='font-weight:400'>" + W.played + "/5 ngày</b><div class='pips'>" + pips + "</div>" +
      '<button type="button" class="rw ' + (W.c3 ? "got" : W.d3 ? "can" : "") + '" data-claim="3">3 ngày →' + PX.icon("fertilizer", 14, 1) + (W.c3 ? " Đã nhận" : " 3 phân bón") + "</button>" +
      '<button type="button" class="rw ' + (W.c5 ? "got" : W.d5 ? "can" : "") + '" data-claim="5">5 ngày →' + PX.icon(W.special.id, 14, 1) + (W.c5 ? " Đã nhận" : " " + esc(W.special.vi)) + "</button>";
  }
  document.addEventListener("click", function (e) {
    var c = e.target.closest("[data-claim]");
    if (c) { var W = F.weekInfo(), n = +c.dataset.claim; if ((n === 3 ? W.c3 : W.c5)) return toast("Tuần này bé đã nhận rồi"); if (!(n === 3 ? W.d3 : W.d5)) return toast("Bé học đủ " + n + " ngày trong tuần để nhận quà nhé!", true); act(F.claimWeek(n)); return; }
    var d = e.target.closest("[data-day]");
    if (d) { var day = d.dataset.day, t = F.today(), w = F.weatherOf(day); if (day > F.addDays(t, 2)) return toast("Chưa biết thời tiết ngày này. Dự báo chỉ xem trước 2 ngày."); toast(DOW[(new Date(day + "T12:00").getDay() + 6) % 7] + ": " + WVI[w] + (D.WEATHER[w].need ? " — cần " + D.WEATHER[w].need.map(function (i) { return BY[i].vi; }).join(", ") : "")); }
  });

  /* ---------- cây lớp ---------- */
  function classTree() {
    var c = F.cls(), st = F.state(), el = $("cls");
    if (!c) { el.innerHTML = "<h2>" + PX.icon("tree", 18, 1) + "Cây Đại Thụ lớp</h2><p class='ft' style='font-size:21px'>Khi bé được xếp lớp, cây của cả lớp sẽ hiện ở đây. Cả lớp cùng học đủ sao và đủ ngày thì cây nở hoa, mỗi bạn nhận một món quà hiếm.</p>"; return; }
    var w = c.weeks[0], pct = Math.min(100, Math.round(w.stars / c.goal * 100)), dr = "";
    for (var i = 0; i < 4; i++) dr += '<span style="' + (i < w.drops.length ? "" : "opacity:.3;filter:grayscale(1)") + '">' + PX.icon("droplet", 18, 1) + "</span>";
    var claim = c.weeks.filter(function (x) { return x.ok && !st.cc[x.start]; })[0];
    el.innerHTML = "<h2>" + PX.icon("tree", 18, 1) + "Cây Đại Thụ lớp</h2><div style='font-size:20px;color:var(--mute)'>Lớp " + esc(c.lop) + " · " + c.n + " bé</div>" +
      "<div class='tree'>" + PX.icon(w.ok ? "cherry_blossom" : "tree", 32, 3) + "<div style='flex:1;min-width:0'>" +
      "<div class='row'>" + STAR() + " Sao chung " + w.stars + "/" + c.goal + "<div class='bar'><i style='width:" + pct + "%'></i></div></div>" +
      "<div class='row'>Giọt nước " + w.drops.length + " / 4<div style='display:flex;gap:3px'>" + dr + "</div></div></div></div>" +
      "<div class='ft'>" + (w.ok ? "Tuần này cây đã nở hoa! Cả lớp giỏi quá!" : "Đạt cả hai → cây nở hoa, cả lớp nhận quà hiếm") + "</div>" +
      (claim ? '<button class="btn claim" type="button" id="clsClaim">' + PX.icon("gift", 18, 1) + " Nhận quà của lớp</button>" : "");
    if (claim) $("clsClaim").onclick = function () { var r = act(F.claimClass(claim.start)); if (r.ok) boom("Quà của lớp!", r.item.vi + " đã về nông trại của bé."); };
  }

  /* ---------- bản tin thời tiết ---------- */
  function news() {
    var t = F.today(), w = F.weatherOf(t), W = D.WEATHER[w], st = F.state(), tm = F.addDays(t, 1), wt = F.weatherOf(tm), played = F.played(t);
    var h = '<img class="mc" src="../assets/pixel/lion-mc.webp" alt="Leo">' +
      '<div class="bub"><div class="en">' + esc(W.en) + " " + spk("w-" + w + "_en") + "</div>" +
      '<div class="zhl"><span class="zh">' + esc(W.zh) + '</span><span class="py">' + esc(W.py) + "</span>" + spk("w-" + w + "_zh") + "</div>" +
      '<div class="vi">' + (W.good ? esc(W.vi) : F.protectedOn(t) ? "Nông trại đã được che chắn. Giỏi lắm!" : esc(W.vi)) +
      (played ? "" : " <b style='font-weight:400;color:#b0442f'>Bé chưa học hôm nay, cây đang héo. Chơi 1 trò để tưới cây nhé!</b>") + "</div></div>";
    var a = '<div class="act">';
    if (!W.good) {
      a += '<div class="need">' + W.need.map(function (id) { var ok = st.tools[id]; return '<span class="' + (ok ? "ok" : "no") + '">' + ICON(id, 14, 1) + esc(BY[id].vi) + (ok ? "" : " ✗") + "</span>"; }).join("") + "</div>";
      a += F.protectedOn(t) ? '<button class="btn" type="button" disabled style="background:var(--green)">✓ Đã dựng đồ che</button>' : '<button class="btn" type="button" data-deploy="' + t + '">' + ICON(W.need[0], 18, 1) + " Dựng đồ che</button>";
    }
    if (!D.WEATHER[wt].good) {
      a += '<div class="tmr">Ngày mai: ' + PX.icon(D.WEATHER[wt].icon, 18, 1) + WVI[wt] + " — cần " + D.WEATHER[wt].need.map(function (i) { return BY[i].vi; }).join(", ") +
        (F.protectedOn(tm) ? " ✓" : ' <button class="btn" type="button" data-deploy="' + tm + '" style="font-size:19px;padding:0 8px;--b:2px;background:var(--orange)">Dựng trước</button>') + "</div>";
    }
    if (!played) a += '<a class="btn" href="../hoc/" style="background:var(--orange)">' + PX.icon("books", 18, 1) + " Vào học</a>";
    $("news").innerHTML = h + a + "</div>";
  }
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-deploy]"); if (b) act(F.deploy(b.dataset.deploy)); });

  /* ---------- cảnh nông trại ---------- */
  var W = 360, H = 252, cv = $("fc"), ctx = PX.canvas(cv, W, H), hits = [], tags = [];
  var SLOT = {
    S: function (i) { return { x: 70 + (i % 4) * 26, y: 6 + Math.floor(i / 4) * 26, w: 22, h: 22 }; },
    M: function (i) { return { x: 70 + (i % 2) * 52, y: 60 + Math.floor(i / 2) * 28, w: 48, h: 22 }; },
    L: function (i) { return { x: 178 + (i % 3) * 54, y: 6 + Math.floor(i / 3) * 56, w: 50, h: 52 }; }
  };
  var SPOTS = {
    dog: [[2, 42], [20, 50], [38, 42]], cat: [[4, 66], [24, 72], [40, 64]],
    chicken: [[72, 138], [92, 146], [80, 162]], rabbit: [[120, 138], [140, 148], [124, 164]],
    pig: [[72, 190], [98, 204], [70, 212]], duck: [[144, 190], [162, 200], [176, 188]],
    cow: [[208, 138], [250, 148], [210, 186]], buffalo: [[292, 138], [300, 186], [256, 194]]
  };
  var ASIZE = { pig: 24, cow: 32, buffalo: 32 };
  var wiltCache = {};
  function wiltSpr(c, name, size, x, y) {
    var k = name + size, w = wiltCache[k];
    if (!w) {
      var d = PX.dims(name, size), cv2 = document.createElement("canvas"), c2 = PX.canvas(cv2, d[0], d[1]); PX.spr(c2, name, size, 0, 0);
      var im = c2.getImageData(0, 0, d[0], d[1]), p = im.data;
      for (var i = 0; i < p.length; i += 4) { var l = p[i] * .3 + p[i + 1] * .59 + p[i + 2] * .11; p[i] = l * .9 + 40; p[i + 1] = l * .78 + 22; p[i + 2] = l * .45; }
      c2.putImageData(im, 0, 0); w = wiltCache[k] = cv2;
    }
    c.drawImage(w, Math.round(x), Math.round(y + 1));
  }
  function crop(c, name, size, x, y, wilt) { if (wilt) wiltSpr(c, name, size, x, y); else PX.spr(c, name, size, x, y); }
  function hit(x, y, w, h, o) { o.x = x; o.y = y; o.w = w; o.h = h; hits.push(o); }
  function tag(x, y, html, cls) { tags.push({ x: x, y: y, html: html, cls: cls || "" }); }

  function drawPlot(slot) {
    var z = slot[0], i = +slot.slice(1), r = SLOT[z](i), ps = F.plotState(slot), wilt = F.wilted();
    PX.plot(ctx, r.x, r.y, r.w, r.h, { wet: ["rainy", "stormy"].indexOf(F.weatherOf(F.today())) >= 0 });
    hit(r.x, r.y, r.w, r.h, { kind: "plot", slot: slot });
    if (ps.empty) return;
    if (ps.tree) {
      var tr = ps.item;
      if (ps.stage === 1) crop(ctx, "seedling", 18, r.x + 15, r.y + 26, wilt);
      else if (ps.stage === 2) crop(ctx, "herb", 24, r.x + 12, r.y + 18, wilt);
      else {
        crop(ctx, tr.id === "coconuttree" ? "palm" : "tree", 32, r.x + 8, r.y + 10, wilt);
        if (ps.ready) { PX.spr(ctx, tr.fruit, 14, r.x + 10, r.y + 18); PX.spr(ctx, tr.fruit, 14, r.x + 24, r.y + 14); PX.sparkle(ctx, r.x + 40, r.y + 6); }
      }
      return;
    }
    var x = ps.item, n = z === "S" ? 1 : z === "M" ? 2 : 4, pos = n === 1 ? [[2, 1]] : n === 2 ? [[2, 1], [26, 1]] : [[2, 2], [26, 2], [2, 28], [26, 28]];
    pos.forEach(function (p) {
      var px = r.x + p[0], py = r.y + p[1];
      if (ps.stage === 0) { PX.R(ctx, px + 6, py + 12, 2, 2, "#e9d08f"); PX.R(ctx, px + 11, py + 9, 2, 2, "#e9d08f"); PX.R(ctx, px + 9, py + 15, 2, 2, "#e9d08f"); }
      else if (ps.stage === 1) crop(ctx, "seedling", 14, px + 3, py + 4, wilt);
      else if (ps.stage === 2) crop(ctx, "herb", 18, px + 1, py + 1, wilt);
      else crop(ctx, x.id, 18, px, py, wilt && !ps.ready);
    });
    if (ps.ready) PX.sparkle(ctx, r.x + r.w - 7, r.y + 1);
  }

  function drawAnimals() {
    var st = F.state(), mood = F.animalMood();
    D.ANIMALS.forEach(function (a) {
      var n = st.animals[a.id] || 0, s = ASIZE[a.id] || 18, prod = F.productToday(a.id);
      for (var i = 0; i < n; i++) {
        var p = SPOTS[a.id][i], x = p[0], y = p[1];
        if (a.id === "duck" && !st.builds.pond) { x = 150 + i * 14; y = 164 + (i % 2) * 8; }
        PX.spr(ctx, a.id, s, x, y, { flip: i % 2 === 1 });
        if (mood === "sleep") PX.spr(ctx, "zzz", 14, x + s - 4, y - 8);
        else if (mood === "sad" || mood === "cold") { PX.R(ctx, x + s - 2, y - 4, 7, 7, "#2e2238"); PX.R(ctx, x + s - 1, y - 3, 5, 5, "#fff"); PX.R(ctx, x + s + 1, y - 2, 1, 2, "#2e2238"); PX.R(ctx, x + s + 1, y + 1, 1, 1, "#2e2238"); }
        hit(x, y, s + 2, s + 2, { kind: "animal", id: a.id });
      }
      if (n && prod) { var q = SPOTS[a.id][0]; PX.spr(ctx, a.product, 14, q[0] + s, q[1] + s - 10); PX.sparkle(ctx, q[0] + s + 10, q[1] + s - 14); hit(q[0] + s, q[1] + s - 12, 16, 16, { kind: "animal", id: a.id }); }
    });
  }

  function draw() {
    var st = F.state(), t = F.today(), w = F.weatherOf(t), lv = F.level().n, dep = F.protectedOn(t);
    hits = []; tags = [];
    var c = ctx;
    PX.grass(c, 0, 0, W, H, 11, w === "snowy" ? "#9fcf8f" : "#5ba84b", w === "snowy" ? "#87b979" : "#47903b", w === "snowy" ? "#e8f4ff" : "#70bd5c");
    PX.path(c, 58, 40, 8, H - 40, 3); PX.path(c, 0, 120, W, 8, 5);
    PX.barn(c, 6, 2); hit(6, 2, 44, 36, { kind: "barn" });
    if (st.builds.well) { PX.spr(c, "well", 24, 32, 90); hit(32, 90, 26, 26, { kind: "item", id: "well" }); }
    if (st.builds.wheelbarrow) { PX.spr(c, "wheelbarrow", 24, 2, 92); hit(2, 92, 26, 26, { kind: "item", id: "wheelbarrow" }); }
    if (st.builds.windmill) { PX.spr(c, "windmill", 40, 6, 132); hit(6, 132, 42, 42, { kind: "item", id: "windmill" }); }
    if (st.builds.bigbarn) { PX.spr(c, "bigbarn", 32, 12, 176); hit(12, 176, 34, 34, { kind: "item", id: "bigbarn" }); }
    if (st.builds.tractor) { PX.spr(c, "tractor", 24, 18, 212); hit(18, 212, 26, 26, { kind: "item", id: "tractor" }); }
    /* ô đất */
    F.slots().forEach(drawPlot);
    D.PLOTS.forEach(function (p) {
      var n = st.plots[p.size]; if (n >= p.max) return;
      var r = SLOT[p.size](n), lock = F.lockReason(p);
      PX.plot(c, r.x, r.y, r.w, r.h, { locked: true }); PX.R(c, r.x + r.w / 2 - 1, r.y + r.h / 2 - 3, 3, 7, "#fff4d8"); PX.R(c, r.x + r.w / 2 - 3, r.y + r.h / 2 - 1, 7, 3, "#fff4d8");
      hit(r.x, r.y, r.w, r.h, { kind: "buyplot", id: p.id });
      if (p.size !== "S" || n === st.plots.S) tag(r.x + r.w / 2, r.y + r.h + 3, lock ? PX.icon("locked", 14, 1) + esc(lock) : "＋ " + p.price + STAR(), "");
    });
    /* che chắn đang dựng */
    if (st.builds.greenhouse) { c.fillStyle = "rgba(190,235,250,.22)"; c.fillRect(66, 2, 110, 56); PX.R(c, 66, 2, 110, 1, "#cfefff"); PX.R(c, 66, 57, 110, 1, "#cfefff"); for (var gx = 66; gx <= 176; gx += 22) PX.R(c, gx, 2, 1, 56, "rgba(120,190,220,.8)"); }
    var need = D.WEATHER[w].need || [];
    if (dep && need.indexOf("shelter") >= 0) { PX.shelter(c, 66, 0, 110); PX.shelter(c, 174, 0, 166); tag(121, 4, PX.icon("check", 14, 1) + "Mái che", "good"); }
    if (dep && need.indexOf("sunshade") >= 0) { PX.shade(c, 66, 2, 274, 112); tag(200, 4, PX.icon("check", 14, 1) + "Lưới che nắng", "good"); }
    if (dep && need.indexOf("fence") >= 0) { PX.fence(c, 66, 356, 112); }
    if (st.tools.scarecrow) { PX.spr(c, "scarecrow", 24, 336, 30); hit(336, 30, 24, 26, { kind: "item", id: "scarecrow" }); }
    /* sân và đồng cỏ */
    PX.fence(c, 66, 198, 130); PX.vfence(c, 66, 140, 232); PX.vfence(c, 195, 140, 232); PX.fence(c, 66, 198, 228);
    if (st.builds.pond) { PX.pond(c, 160, 200, 26, 14); hit(134, 186, 52, 28, { kind: "item", id: "pond" }); }
    PX.fence(c, 202, 358, 130); PX.vfence(c, 202, 140, 232); PX.vfence(c, 355, 140, 232); PX.fence(c, 202, 358, 228);
    if (lv < 4) { c.fillStyle = "rgba(0,0,0,.14)"; c.fillRect(205, 141, 150, 87); PX.spr(c, "locked", 24, 268, 168); tag(280, 205, PX.icon("locked", 14, 1) + "Đồng cỏ · Cấp 4", ""); hit(205, 141, 150, 87, { kind: "pasture" }); }
    drawAnimals();
    /* hàng trang trí */
    st.decor.forEach(function (id, i) {
      var x = i < 18 ? 70 + i * 16 : 4 + ((i - 18) % 3) * 17, y = i < 18 ? 234 : 236 - Math.floor((i - 18) / 3) * 18;
      if (i >= 30) return;
      PX.spr(c, id, PX.has(id, 18) ? 18 : 18, x, y - 2);
      hit(x, y - 2, 18, 18, { kind: "item", id: id });
    });
    if (dep && need.indexOf("lantern") >= 0) [[60, 100], [60, 160], [60, 220], [120, 116], [240, 116]].forEach(function (p) { PX.spr(c, "lantern", 14, p[0], p[1]); });
    if (dep && need.indexOf("blanket") >= 0) tag(130, 136, PX.icon("check", 14, 1) + "Chăn ấm", "good");
    if (dep && need.indexOf("raincoat") >= 0) tag(130, 136, PX.icon("check", 14, 1) + "Áo mưa", "good");
    /* hiệu ứng thời tiết */
    var seed = Math.floor(Date.now() / 700);
    if (w === "rainy") { PX.tint(c, W, H, "rgba(40,60,120,.10)"); PX.rain(c, W, H, seed, 320); }
    if (w === "stormy") { PX.tint(c, W, H, "rgba(30,30,80,.22)"); PX.rain(c, W, H, seed, 480); if (seed % 7 === 0) PX.tint(c, W, H, "rgba(255,255,220,.25)"); }
    if (w === "snowy") { PX.tint(c, W, H, "rgba(230,240,255,.18)"); PX.snow(c, W, H, seed, 260); }
    if (w === "foggy") PX.tint(c, W, H, "rgba(235,240,245," + (dep ? ".28" : ".5") + ")");
    if (w === "hot") PX.tint(c, W, H, "rgba(255,150,40,.12)");
    if (w === "cold") PX.tint(c, W, H, "rgba(120,170,255,.14)");
    if (w === "windy") PX.wind(c, W, H, seed, 26);
    if (w === "cloudy") PX.tint(c, W, H, "rgba(80,90,110,.06)");
    if (w === "rainbow") PX.spr(c, "rainbow", 32, 320, 84);
    if (F.sleepy()) PX.tint(c, W, H, "rgba(20,20,60,.18)");
    $("stage").querySelectorAll(".tagc").forEach(function (e) { e.remove(); });
    tags.forEach(function (tg) {
      var e = document.createElement("span"); e.className = "tagc " + tg.cls; e.innerHTML = tg.html;
      e.style.left = (tg.x / W * 100) + "%"; e.style.top = (tg.y / H * 100) + "%"; $("stage").appendChild(e);
    });
  }
  var animT = 0;
  function animate() { clearInterval(animT); var w = F.weatherOf(F.today()); if (["rainy", "stormy", "snowy", "windy"].indexOf(w) >= 0) animT = setInterval(draw, 700); }

  cv.addEventListener("click", function (e) {
    var r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H;
    for (var i = hits.length - 1; i >= 0; i--) { var h = hits[i]; if (x >= h.x && x < h.x + h.w && y >= h.y && y < h.y + h.h) { tap(h); return; } }
  });

  function tap(h) {
    if (h.kind === "plot") return plotCard(h.slot);
    if (h.kind === "animal") return animalCard(h.id);
    if (h.kind === "barn") return khoCard();
    if (h.kind === "buyplot") return shopCard(BY[h.id]);
    if (h.kind === "pasture") return toast("Đồng cỏ mở ở Cấp 4: nuôi bò sữa và trâu.");
    if (h.kind === "item") return infoCard(BY[h.id]);
  }
  function plotCard(slot) {
    var ps = F.plotState(slot), st = F.state(), z = slot[0], P = D.PLOTS.filter(function (p) { return p.size === z; })[0];
    if (ps.empty) {
      var opts = [];
      Object.keys(st.seeds).forEach(function (id) { if (st.seeds[id] > 0 && F.fits(slot, id)) opts.push({ label: ICON(id, 18, 1) + esc(BY[id].vi) + " ×" + st.seeds[id], fn: function () { act(F.plant(slot, id)); } }); });
      Object.keys(st.nursery).forEach(function (id) { if (st.nursery[id] > 0 && F.fits(slot, id)) opts.push({ label: ICON(id, 18, 1) + esc(BY[id].vi) + " ×" + st.nursery[id], fn: function () { act(F.plant(slot, id)); } }); });
      return card({ pic: PX.icon(P.id, 24, 3), status: "Ô trống", item: P, note: opts.length ? "Chọn hạt để trồng:" : "Bé chưa có hạt hợp với ô này. Mở Khu đổi sao → " + (z === "L" ? "Cây ăn quả hoặc Hạt giống" : "Hạt giống") + " nhé!", opts: opts });
    }
    var x = ps.item, acts = [], note;
    if (ps.tree) {
      var fr = BY[x.fruit];
      note = !ps.grown ? "Cây đang lớn: còn " + Math.max(0, D.TREE_GROW - ps.g) + " ngày nữa thành cây." : ps.ready ? "Có " + fr.vi + " chín rồi! Hái được 2 quả." : "Còn " + ps.left + " ngày nữa ra " + fr.vi + ".";
      if (ps.ready) acts.push({ label: PX.icon("basket", 18, 1) + " Hái " + esc(fr.vi), fn: function () { act(F.harvest(slot)); } });
    } else {
      note = ps.ready ? "Đã lớn! Thu hoạch được " + (F.yieldOf(slot, x)) + " phần." : ps.stage === 0 ? "Hạt vừa gieo. Còn " + ps.left + " ngày nữa." : "Đang lớn: còn " + ps.left + " ngày nữa.";
      if (ps.harmed) note += " Bị thời tiết xấu " + ps.harmed + " ngày nên sẽ thu được một nửa.";
      if (ps.ready) acts.push({ label: PX.icon("basket", 18, 1) + " Thu hoạch", fn: function () { act(F.harvest(slot)); } });
    }
    if (F.wilted()) note += " Hôm nay bé chưa học nên cây hơi héo.";
    if (!ps.ready && st.fert > 0) acts.push({ label: PX.icon("fertilizer", 18, 1) + " Bón phân (còn " + st.fert + ")", bg: "var(--orange)", fn: function () { act(F.fertilize(slot)); } });
    card({ pic: ICON(ps.tree ? x.id : x.id, ps.tree ? 32 : 24, ps.tree ? 2 : 3), status: ps.ready ? "Thu hoạch được!" : "Đang lớn", item: x, note: note, acts: acts });
  }
  function animalCard(id) {
    var a = BY[id], st = F.state(), mood = F.animalMood(), acts = [], prod = F.productToday(id);
    var moodTxt = { happy: "Đang vui", sad: "Hơi buồn vì bé chưa học hôm nay", sleep: "Đang ngủ vì bé nghỉ lâu quá", cold: "Đang sợ thời tiết xấu, bé dựng đồ che nhé!" }[mood];
    var note = (a.food ? "Món thích: " + BY[a.food].vi + ". " : "") + (a.product ? "Cho " + BY[a.product].vi + " mỗi ngày bé học." : "") + (a.note ? " " + a.note + "." : "") + " Có " + (st.animals[id] || 0) + "/3 con.";
    if (a.product) acts.push({ label: PX.icon(a.product, 18, 1) + " Lấy " + esc(BY[a.product].vi) + (prod ? " (" + prod + ")" : ""), off: !prod, fn: function () { act(F.collect(id)); } });
    if (a.food) acts.push({ label: ICON(a.food, 18, 1) + " Cho ăn " + esc(BY[a.food].vi) + " (kho: " + (st.kho[a.food] || 0) + ")", bg: "var(--orange)", fn: function () { act(F.feed(id)); } });
    card({ pic: PX.icon(id, 32, 2), status: moodTxt, item: a, note: note, acts: acts });
  }
  function infoCard(x) {
    if (!x) return;
    var st = F.state();
    card({ pic: ICON(x.id, 24, 3), status: x.cat === "rare" ? "Quà hiếm của lớp" : "", item: x, note: x.use || (x.cat === "decor" || x.cat === "rare" ? "Trang trí cho nông trại thêm đẹp." : "") });
  }
  function khoCard() {
    var st = F.state(), S = F.stars(), rows = function (list) {
      return list.map(function (id) {
        var p = F.unitPrice(id);
        return '<div class="kr">' + ICON(id, 18, 1) + esc(BY[id].vi) + ' <span class="zh" style="font-size:16px;color:var(--mute)">' + esc(BY[id].zh) + '</span><span class="q">×' + st.kho[id] + "</span>" +
          '<button class="btn" type="button" data-sell="' + id + '" data-n="1">Bán 1 · ' + p + STAR() + "</button>" + (st.kho[id] > 1 ? '<button class="btn" type="button" data-sell="' + id + '" data-n="99" style="background:var(--orange)">Bán hết</button>' : "") + "</div>";
      }).join("");
    };
    var goods = Object.keys(st.kho).filter(function (k) { return st.kho[k] > 0; });
    var seeds = Object.keys(st.seeds).filter(function (k) { return st.seeds[k] > 0; }), trees = Object.keys(st.nursery).filter(function (k) { return st.nursery[k] > 0; });
    var html = '<p class="note">Hôm nay chợ đã mua ' + S.saleToday + "/" + D.SALE_CAP_DAY + " sao. Nông sản cũng dùng để cho các bạn thú ăn món yêu thích.</p>" +
      "<h3>Nông sản</h3><div class='kho'>" + (goods.length ? rows(goods) : "<p class='note'>Kho đang trống. Thu hoạch rau, quả, trứng, sữa sẽ vào đây.</p>") + "</div>" +
      "<h3>Hạt giống</h3><div class='kho'>" + (seeds.length ? seeds.map(function (id) { return '<div class="kr">' + ICON(id, 18, 1) + esc(BY[id].vi) + '<span class="q">×' + st.seeds[id] + "</span></div>"; }).join("") : "<p class='note'>Chưa có hạt.</p>") + "</div>" +
      (trees.length ? "<h3>Nhà ươm cây</h3><div class='kho'>" + trees.map(function (id) { return '<div class="kr">' + ICON(id, 24, 1) + esc(BY[id].vi) + '<span class="q">×' + st.nursery[id] + "</span></div>"; }).join("") + "</div>" : "") +
      "<h3>Phân bón</h3><div class='kr'>" + PX.icon("fertilizer", 18, 1) + "Phân bón <span class='q'>×" + st.fert + "</span></div>";
    card({ pic: PX.icon("package", 24, 2), status: "", title: "Kho của bé", html: html });
    $("ov").addEventListener("click", function (e) { var b = e.target.closest("[data-sell]"); if (b) { e.stopPropagation(); act(F.sell(b.dataset.sell, +b.dataset.n)); khoCard(); } });
  }

  /* ---------- thanh công cụ ---------- */
  function tools() {
    var st = F.state(), S = F.stars(), h = '<button class="btn" type="button" id="tKho" style="background:var(--blue)">' + PX.icon("package", 18, 1) + " Kho</button>";
    if (st.tools.basket) h += '<button class="btn" type="button" id="tAll">' + PX.icon("basket", 18, 1) + " Thu hoạch tất cả</button>";
    if (D.ANIMALS.some(function (a) { return a.product && st.animals[a.id]; })) h += '<button class="btn" type="button" id="tCol" style="background:var(--orange)">' + PX.icon("egg", 18, 1) + " Lấy trứng, sữa</button>";
    if (st.builds.tractor) h += '<button class="btn" type="button" id="tTr" style="background:#8b5cf6">' + PX.icon("tractor", 18, 1) + " Gieo hạt</button>";
    h += '<span class="info">Hôm nay: ' + S.today + "/" + D.CAP_DAY + " sao học · chợ " + S.saleToday + "/" + D.SALE_CAP_DAY + "</span>";
    $("tools").innerHTML = h;
    $("tKho").onclick = khoCard;
    if ($("tAll")) $("tAll").onclick = function () { act(F.harvestAll()); };
    if ($("tCol")) $("tCol").onclick = function () { act(F.collectAll()); };
    if ($("tTr")) $("tTr").onclick = function () {
      var opts = Object.keys(st.seeds).filter(function (id) { return st.seeds[id] > 0; }).map(function (id) { return { label: ICON(id, 18, 1) + esc(BY[id].vi) + " ×" + st.seeds[id], fn: function () { act(F.plantAll(id)); } }; });
      card({ pic: PX.icon("tractor", 24, 2), item: BY.tractor, note: opts.length ? "Chọn hạt để máy kéo gieo cho mọi ô trống hợp:" : "Bé chưa có hạt.", opts: opts });
    };
  }

  /* ---------- khu đổi sao ---------- */
  var TABS = [["seed", "Hạt giống", "seedling"], ["animal", "Con vật", "chicken"], ["tree", "Cây ăn quả", "apple"], ["tool", "Dụng cụ", "basket"], ["decor", "Trang trí", "flower"], ["plot", "Ô đất", "smallplot"]];
  var HINT = { seed: "Hạt mua về nằm trong kho. Chạm vào ô đất trống để trồng.", animal: "Mỗi loài nuôi tối đa 3 con. Con thứ 2 mở ở Cấp 5, con thứ 3 ở Cấp 6.", tree: "Cây ăn quả trồng ở ô lớn, lớn sau 4 ngày rồi cứ 3 ngày ra quả.", tool: "Đồ che thời tiết mua 1 lần dùng mãi. Ngày xấu nhớ bấm Dựng đồ che nhé.", decor: "Trang trí mua bao nhiêu cũng được.", plot: "Ô nhỏ trồng rau nhỏ; ô vừa trồng rau to; ô lớn trồng cây ăn quả." };
  var tabNow = "seed";
  function listFor(t) {
    if (t === "seed") return D.CROPS; if (t === "animal") return D.ANIMALS; if (t === "tree") return D.TREES;
    if (t === "tool") return D.TOOLS; if (t === "decor") return D.BUILDINGS.concat(D.DECOR); return D.PLOTS;
  }
  function owned(x) {
    var st = F.state();
    if (x.cat === "crop") return st.seeds[x.id] ? "Có " + st.seeds[x.id] + " hạt" : "";
    if (x.cat === "animal") return st.animals[x.id] ? "✓ Có " + st.animals[x.id] + "/3" : "";
    if (x.cat === "tree") { var n = st.nursery[x.id] || 0, f = 0; Object.keys(st.field).forEach(function (k) { if (st.field[k].c === x.id) f++; }); return (n + f) ? "Có " + (n + f) + " cây" : ""; }
    if (x.cat === "tool") return x.starter ? "✓ Có sẵn" : x.consumable ? (st.fert ? "Có " + st.fert + " túi" : "") : st.tools[x.id] ? "✓ Đã có" : "";
    if (x.cat === "build") return st.builds[x.id] ? "✓ Đã có" : "";
    if (x.cat === "decor") { var c = st.decor.filter(function (d) { return d === x.id; }).length; return c ? "Có " + c : ""; }
    if (x.cat === "plot") return "Có " + st.plots[x.size] + "/" + x.max;
    return "";
  }
  function shop() {
    $("shopIc").innerHTML = PX.icon("cart", 24, 1);
    $("tabs").innerHTML = TABS.map(function (t) { return '<button class="tab' + (t[0] === tabNow ? " on" : "") + '" type="button" data-tab="' + t[0] + '">' + PX.icon(t[2], 14, 1) + t[1] + "</button>"; }).join("");
    var bal = F.stars().balance;
    $("grid").innerHTML = listFor(tabNow).map(function (x) {
      var lock = F.lockReason(x), own = owned(x), done = x.starter || lock === "Đã có" || lock.indexOf("Đã đủ") === 0, locked = lock && !done;
      var right = done ? '<span class="own">' + esc(own || lock) + "</span>" : locked ? '<span class="lk">' + PX.icon("locked", 14, 1) + esc(lock) + "</span>" :
        '<button class="btn buy' + (bal < x.price ? " off" : "") + '" type="button" data-buy="' + x.id + '">Đổi</button>';
      return '<div class="it' + (locked ? " lock" : "") + '" data-info="' + x.id + '"><div class="pic">' + ICON(x.id, 24, 2) + '</div><div class="nm">' + esc(x.vi) + '</div><div class="sub">' + esc(x.en) + ' · <span class="zh">' + esc(x.zh) + "</span>" + (own && !done ? " · " + esc(own) : "") + "</div>" +
        '<div class="pr"><span class="price">' + (x.price || 0) + STAR() + "</span>" + right + "</div></div>";
    }).join("");
    $("hint").textContent = HINT[tabNow];
  }
  function shopCard(x) {
    var lock = F.lockReason(x), bal = F.stars().balance, done = x.starter || lock === "Đã có" || lock.indexOf("Đã đủ") === 0;
    var acts = done || lock ? [] : [{ label: "Đổi " + x.price + " sao", off: bal < x.price, fn: function () { act(F.buy(x.id)); } }];
    var extra = x.cat === "crop" ? "Trồng ở " + (x.plot === "S" ? "ô nhỏ (hoặc ô vừa, ô lớn để thu nhiều hơn)" : "ô vừa hoặc ô lớn") + ". Lớn sau " + x.days + " ngày bé học." :
      x.cat === "animal" ? (x.food ? "Món thích: " + BY[x.food].vi + ". " : "") + (x.product ? "Cho " + BY[x.product].vi + " mỗi ngày." : "") + (x.note ? " " + x.note + "." : "") :
      x.cat === "tree" ? "Cho " + BY[x.fruit].vi + ". Cần ô lớn." : (x.use || "");
    card({ pic: ICON(x.id, 24, 3), status: lock ? (done ? "✓ " + lock : PX.icon("locked", 14, 1) + " " + esc(lock)) : x.price + " sao", item: x, note: extra, acts: acts });
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-tab]"); if (t) { tabNow = t.dataset.tab; shop(); return; }
    var b = e.target.closest("[data-buy]"); if (b) { e.stopPropagation(); act(F.buy(b.dataset.buy)); return; }
    var i = e.target.closest("[data-info]"); if (i && !e.target.closest("[data-say]")) shopCard(BY[i.dataset.info]);
  });

  /* ---------- vẽ lại ---------- */
  function all() { header(); calendar(); classTree(); news(); draw(); tools(); shop(); }
  var u = LC.user();
  if (!u) return;            // màn đăng nhập của lc-track sẽ hiện
  F.init(u);
  F.on(all);
  document.body.style.backgroundImage = "url(" + PX.tile(64, 64, 4, "#6fbf5b", "#62b04f", "#7dcc68") + ")";
  document.body.style.backgroundSize = "256px 256px";
  PX.loadAtlas().then(function () { all(); animate(); F.sync(); });
  var rzT = 0; addEventListener("resize", function () { clearTimeout(rzT); rzT = setTimeout(calendar, 200); });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") { F.refresh(); F.sync(); } });
  setInterval(function () { var d = F.today(); if (d !== window.__day) { window.__day = d; F.refresh(); animate(); } }, 60000); window.__day = F.today();
})();

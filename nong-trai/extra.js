/* Nông trại Lingo Cub — nhạc nền (nút bật/tắt) và hướng dẫn chơi từng bước. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var u = window.LC && LC.user();
  if (!u) return;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- nhạc nền ----------
     File nhạc đã hạ âm lượng còn 1/4 bản gốc (iPhone, iPad không cho trang web chỉnh âm lượng). */
  var MKEY = "lc-farm-music", music = new Audio("music/nhac-nen.mp3"), started = false;
  music.loop = true; music.preload = "auto";
  function on() { return get(MKEY) !== "off"; }
  function paint() {
    var b = $("musicBtn"); if (!b) return;
    b.innerHTML = PX.icon("speaker", 18, 1) + "<span>" + (on() ? "Nhạc" : "Tắt nhạc") + "</span>";
    b.classList.toggle("mute", !on());
    b.setAttribute("aria-pressed", on() ? "true" : "false");
    b.title = on() ? "Bấm để tắt nhạc" : "Bấm để bật nhạc";
  }
  function play() { if (!on()) return; var p = music.play(); if (p && p.then) p.then(function () { started = true; }).catch(function () {}); else started = true; }
  function kick() { if (!started) play(); }
  ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { document.addEventListener(ev, kick, { passive: true }); });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") music.pause(); else if (started && on()) play();
  });
  window.addEventListener("pagehide", function () { music.pause(); });

  /* ---------- hướng dẫn ---------- */
  var GKEY = "lc-farm-guide-off:" + u.id;
  function I(n, s, k) { return PX.icon(n, s || 14, k || 1, "ic"); }
  var STEPS = [
    { center: true, first: true, html: function () { return "<b>Chào mừng bé đến Nông trại!</b><br>Bé bấm <b>Vào học</b> ở trang chủ, mỗi câu đúng được 1 sao " + I("star") + ". Dùng sao để trồng rau, nuôi thú, làm nông trại thật đẹp. Mỗi ngày kiếm tối đa 40 sao học."; } },
    { sel: ["stars", "lvl"], html: function () { return I("star") + " <b>Số sao</b> bé đang có, dùng để đổi đồ.<br><b>Cấp nông trại</b>: học càng nhiều càng lên cấp, mở thêm con vật, cây và đồ mới. Tiêu sao không bị tụt cấp."; } },
    { sel: ["news"], html: function () { return "<b>Bản tin thời tiết.</b> Bấm " + I("speaker") + " để nghe Leo đọc tiếng Anh, tiếng Trung.<br>Ngày mưa, gió, nóng, lạnh, tuyết, sương mù: bấm <b>Dựng đồ che</b> để bảo vệ nông trại. Ngày mai trời xấu thì bấm <b>Dựng trước</b>."; } },
    { sel: ["stage"], html: function () { return "<b>Đây là nông trại của bé.</b><br>Chạm vào <b>ô đất trống</b> để gieo hạt. Cây lớn dần mỗi ngày bé học. Thấy " + I("sparkles") + " lấp lánh là <b>thu hoạch</b> được.<br>Chạm vào bất cứ thứ gì để nghe tên tiếng Anh, tiếng Trung."; } },
    { sel: ["stage"], html: function () { return "Chạm vào <b>con vật</b> để cho ăn món yêu thích (được gấp đôi trứng, sữa) và lấy " + I("egg") + " trứng, " + I("milk") + " sữa.<br>Ô có dấu <b>＋</b> là ô đất mua thêm. Ô có " + I("locked") + " sẽ mở khi lên cấp.<br>Bé nghỉ học thì cây héo, thú buồn " + I("zzz") + ". Chơi 1 trò là tươi lại ngay!"; } },
    { sel: ["tools"], html: function () { return I("package") + " <b>Kho</b>: xem nông sản, bán ở chợ lấy thêm sao (tối đa 10 sao mỗi ngày). Chạm vào chuồng đỏ cũng mở kho.<br>Có " + I("basket") + " giỏ thì bấm <b>Thu hoạch tất cả</b> một lần."; } },
    { sel: ["shop"], html: function () { return I("cart") + " <b>Khu đổi sao</b>: chọn mục ở trên (Hạt giống, Con vật, Cây ăn quả…), bấm <b>Đổi</b> để lấy đồ. Chạm vào món để nghe tên.<br>Hạt mua về nằm trong kho, chạm ô đất trống để trồng."; } },
    { sel: ["cal"], html: function () { return "<b>Lịch tuần.</b> Ngày bé học có " + I("seedling") + ", ngày nghỉ có " + I("zzz") + ". Ô viền vàng là hôm nay, 2 ô xanh là dự báo.<br>Học <b>3 ngày</b> được 3 túi phân bón, học <b>5 ngày</b> được hạt giống đặc biệt. Bấm vào ô quà để nhận."; } },
    { sel: ["cls"], html: function () { return I("tree") + " <b>Cây Đại Thụ của lớp.</b> Cả lớp cùng học đủ sao và đủ ngày trong tuần thì cây nở hoa, mỗi bạn nhận một món quà hiếm."; } },
    { sel: ["musicBtn", "helpBtn", "demoBtn"], last: true, html: function () { return "Bấm nút " + I("speaker") + " <b>Nhạc</b> để tắt hoặc bật nhạc. Bấm <b>?</b> để xem lại hướng dẫn.<br>Bấm <b>Chơi thử</b> để tập gieo hạt, thu hoạch, chăm thú trên <b>nông trại mẫu</b> (không mất sao thật)."; } }
  ];
  var order = [], idx = 0, ov, hole, cardEl, raf = 0, until = 0;

  function els(st) { return (st.sel || []).map($).filter(function (e) { return e && e.offsetParent !== null; }); }
  function rectOf(st) {
    var es = els(st); if (!es.length) return null;
    var r = { top: 1e9, left: 1e9, right: -1e9, bottom: -1e9 };
    es.forEach(function (e) { var b = e.getBoundingClientRect(); r.top = Math.min(r.top, b.top); r.left = Math.min(r.left, b.left); r.right = Math.max(r.right, b.right); r.bottom = Math.max(r.bottom, b.bottom); });
    return r;
  }
  function build() {
    /* sắp các bước theo vị trí trên trang (điện thoại và máy tính xếp khác nhau) */
    var mid = STEPS.filter(function (s) { return !s.first && !s.last && els(s).length; });
    mid.forEach(function (s, i) { var e = els(s)[0]; s._y = e.getBoundingClientRect().top + scrollY; s._i = i; });
    mid.sort(function (a, b) { return Math.round(a._y) - Math.round(b._y) || a._i - b._i; });
    order = [STEPS[0]].concat(mid, [STEPS[STEPS.length - 1]]);
  }
  function place() {
    if (!ov) return;
    var st = order[idx], r = st.center ? null : rectOf(st), vw = innerWidth, vh = innerHeight, pad = 6;
    if (r) {
      var t = Math.max(4, r.top - pad), b = Math.min(vh - 4, r.bottom + pad), l = Math.max(4, r.left - pad), rr = Math.min(vw - 4, r.right + pad);
      if (b < t + 10) { t = vh / 2 - 20; b = vh / 2 + 20; }
      hole.style.cssText = "top:" + t + "px;left:" + l + "px;width:" + (rr - l) + "px;height:" + (b - t) + "px";
      hole.hidden = false;
      var ch = cardEl.offsetHeight, cw = cardEl.offsetWidth, top;
      if (vh - b >= ch + 14) top = b + 10; else if (t >= ch + 14) top = t - ch - 10; else top = vh - ch - 10;
      var left = Math.min(Math.max(8, (l + rr) / 2 - cw / 2), vw - cw - 8);
      cardEl.style.top = Math.max(8, top) + "px"; cardEl.style.left = left + "px"; cardEl.style.transform = "none";
    } else {
      hole.hidden = true; hole.style.cssText = "";
      cardEl.style.top = "50%"; cardEl.style.left = "50%"; cardEl.style.transform = "translate(-50%,-50%)";
    }
    ov.classList.toggle("dim", !r);
  }
  function loop() { place(); if (Date.now() < until) raf = requestAnimationFrame(loop); }
  function settle() { cancelAnimationFrame(raf); until = Date.now() + 900; loop(); }
  function show(i) {
    idx = Math.max(0, Math.min(order.length - 1, i));
    var st = order[idx], last = idx === order.length - 1;
    cardEl.innerHTML =
      '<div class="gd-hd"><img src="../assets/pixel/lion-mc.webp" alt=""><span>Hướng dẫn · ' + (idx + 1) + "/" + order.length + '</span><button type="button" class="gd-x" data-g="x" aria-label="Đóng">✕</button></div>' +
      '<div class="gd-tx">' + st.html() + "</div>" +
      '<div class="gd-ft">' + (idx ? '<button type="button" class="btn gd-b" data-g="prev" style="background:var(--blue)">◀ Quay lại</button>' : "<span></span>") +
      (last ? '<button type="button" class="btn gd-b" data-g="demo" style="background:var(--orange)">Chơi thử ▶</button>' : "") +
      '<button type="button" class="btn gd-b" data-g="' + (last ? "end" : "next") + '">' + (last ? "Vào nông trại" : "Tiếp ▶") + "</button></div>" +
      '<button type="button" class="gd-off" data-g="off">Không hiện lại lần sau</button>';
    if (!st.center) {
      var es = els(st);
      if (es.length) {
        var e0 = es[0], tall = (rectOf(st).bottom - rectOf(st).top) > innerHeight * 0.55;
        try { e0.scrollIntoView({ block: tall ? "start" : "center", behavior: "smooth" }); } catch (x) { e0.scrollIntoView(); }
      }
    }
    settle();
  }
  function close(off) {
    if (off) set(GKEY, "1");
    if (!ov) return;
    ov.remove(); ov = null; cancelAnimationFrame(raf);
    removeEventListener("scroll", place); removeEventListener("resize", place);
  }
  function open(i) {
    close(false);
    build();
    ov = document.createElement("div"); ov.className = "gd"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Hướng dẫn chơi nông trại");
    ov.innerHTML = '<div class="gd-block"></div><div class="gd-hole" hidden></div><div class="gd-card pxf"></div>';
    document.body.appendChild(ov);
    hole = ov.querySelector(".gd-hole"); cardEl = ov.querySelector(".gd-card");
    ov.addEventListener("click", function (e) {
      var b = e.target.closest("[data-g]"); if (!b) return;
      var g = b.getAttribute("data-g");
      if (g === "x" || g === "end") close(false);
      else if (g === "off") close(true);
      else if (g === "demo") startPractice();
      else if (g === "next") show(idx + 1);
      else if (g === "prev") show(idx - 1);
    });
    addEventListener("scroll", place, { passive: true }); addEventListener("resize", place);
    document.addEventListener("keydown", function esc(e) { if (!ov) { document.removeEventListener("keydown", esc); return; } if (e.key === "Escape") close(false); if (e.key === "ArrowRight") show(idx + 1); if (e.key === "ArrowLeft") show(idx - 1); });
    show(i || 0);
  }

  /* ---------- gắn nút, mở hướng dẫn lần đầu ---------- */
  PX.loadAtlas().then(function () {
    paint();
    var mb = $("musicBtn"), hb = $("helpBtn");
    if (mb) mb.onclick = function () {
      if (on()) { set(MKEY, "off"); music.pause(); } else { set(MKEY, "on"); started = false; play(); }
      paint();
    };
    if (hb) hb.onclick = function () { open(0); };
    var db = $("demoBtn"); if (db) { db.innerHTML = PX.icon("seedling", 18, 1) + "<span>Chơi thử</span>"; db.onclick = function () { if (co) endPractice(); else startPractice(); }; }
    play();
    if (get(GKEY) !== "1") setTimeout(function () { open(0); }, 500);
  });
  /* ---------- Chơi thử: tập trồng cây, thu hoạch, chăm thú trên nông trại mẫu ---------- */
  var F = window.FarmCore;
  function plotHit(slot) { return function () { return window.FarmUI && FarmUI.rect(function (h) { return h.kind === "plot" && h.slot === slot; }); }; }
  function animalHit(id) { return function () { return window.FarmUI && FarmUI.rect(function (h) { return h.kind === "animal" && h.id === id; }); }; }
  function domHit(sel) { return function () { var e = document.querySelector(sel); return e && e.offsetParent !== null ? e.getBoundingClientRect() : null; }; }
  function btnWith(txt) { return function () { var bs = document.querySelectorAll("#ov [data-act], #ov [data-opt]"); for (var i = 0; i < bs.length; i++) if (bs[i].textContent.indexOf(txt) >= 0) return bs[i].getBoundingClientRect(); return null; }; }
  function T() { return F.today(); }
  var LESSON = [
    { intro: true, html: "<b>Cùng chơi thử nhé!</b><br>Đây là <b>nông trại mẫu</b>, bé có 100 sao để tập. Làm theo mũi tên chỉ nhé.<br>Chơi thử không làm thay đổi nông trại thật của bé.", btn: "Bắt đầu ▶" },
    { html: "<b>Gieo hạt:</b> chạm vào <b>ô đất trống</b> có mũi tên.", card: "Chọn hạt <b>Cà rốt</b> để gieo nhé!", at: plotHit("S0"), inCard: btnWith("Cà rốt"), done: function (st) { return !!st.field.S0; } },
    { html: "<b>Thu hoạch:</b> cà rốt này đã lớn, có " + "✨" + " lấp lánh. Chạm vào cà rốt.", card: "Bấm nút <b>Thu hoạch</b>.", at: plotHit("S1"), inCard: btnWith("Thu hoạch"), done: function (st) { return !st.field.S1; } },
    { html: "<b>Bón phân:</b> khoai tây vừa gieo hôm nay. Chạm vào ô khoai tây.", card: "Bấm <b>Bón phân</b> cho cây lớn nhanh hơn.", at: plotHit("S2"), inCard: btnWith("Bón phân"), done: function (st) { return st.field.S2 && st.field.S2.f >= 1; } },
    { html: "<b>Hái quả:</b> cây táo có quả chín rồi. Chạm vào cây táo.", card: "Bấm <b>Hái Táo</b>.", at: plotHit("L0"), inCard: btnWith("Hái"), done: function (st) { return (st.kho.apple || 0) > 0; } },
    { html: "<b>Lấy trứng:</b> chạm vào <b>bạn gà</b>.", card: "Bấm <b>Lấy Trứng gà</b>.", at: animalHit("chicken"), inCard: btnWith("Lấy"), done: function (st) { return !!(st.got[T()] && st.got[T()].chicken); } },
    { html: "<b>Cho thú ăn:</b> bạn thỏ thích cà rốt. Chạm vào <b>bạn thỏ</b>.", card: "Bấm <b>Cho ăn Cà rốt</b>.", at: animalHit("rabbit"), inCard: btnWith("Cho ăn"), done: function (st) { return !!(st.fed[T()] && st.fed[T()].rabbit); } },
    { html: "<b>Bán ở chợ:</b> bấm nút <b>Kho</b>.", card: "Bấm <b>Bán 1</b> ở dòng Trứng gà để lấy thêm sao.", at: domHit("#tKho"), inCard: domHit('#ov [data-sell="egg"][data-n="1"]'), done: function (st) { return (st.sale[T()] || 0) > 0; } },
    { html: "<b>Đổi sao:</b> ở Khu đổi sao, bấm <b>Đổi</b> để lấy hạt Cà chua.", at: domHit('[data-buy="tomato"]'), start: function () { var t = document.querySelector('[data-tab="seed"]'); if (t && !t.classList.contains("on")) t.click(); }, done: function (st) { return (st.seeds.tomato || 0) > 0; } },
    { html: "<b>Trời mưa rồi!</b> Bấm <b>Dựng đồ che</b> để che ruộng và mặc áo mưa cho các bạn thú.", at: domHit("[data-deploy]"), start: function () { F.setDemoWeather("rainy"); }, done: function (st) { return !!st.deploy[T()]; } },
    { end: true, html: "<b>Bé giỏi quá!</b> Bé đã biết gieo hạt, thu hoạch, bón phân, hái quả, lấy trứng, cho thú ăn, bán hàng và che mưa.<br>Giờ về nông trại thật, học bài để kiếm sao nhé!", btn: "Về nông trại của bé" }
  ];
  var co = null, li = 0, coT = 0, praised = false;
  function coDraw() {
    if (!co) return;
    var stp = LESSON[li], cardOpen = !!document.getElementById("ov"), r = null;
    if (!stp.intro && !stp.end) r = cardOpen ? (stp.inCard ? stp.inCard() : null) : (stp.at ? stp.at() : null);
    var tx = co.querySelector(".co-tx"), want = cardOpen && stp.card ? stp.card : stp.html;
    if (tx.getAttribute("data-h") !== want && !praised) { tx.innerHTML = want; tx.setAttribute("data-h", want); }
    var ring = co.querySelector(".co-ring"), arr = co.querySelector(".co-arrow");
    if (r && r.width) {
      ring.hidden = arr.hidden = false;
      ring.style.cssText = "left:" + (r.left - 6) + "px;top:" + (r.top - 6) + "px;width:" + (r.width + 12) + "px;height:" + (r.height + 12) + "px";
      var below = r.top < 150;
      arr.className = "co-arrow" + (below ? " up" : "");
      arr.style.left = (r.left + r.width / 2 - 18) + "px"; arr.style.top = (below ? r.bottom + 8 : r.top - 46) + "px";
    } else { ring.hidden = arr.hidden = true; }
  }
  function coCheck() {
    if (!co || praised) return;
    var stp = LESSON[li];
    if (stp.done && stp.done(F.state())) {
      praised = true;
      var tx = co.querySelector(".co-tx"); tx.innerHTML = "<b>Giỏi lắm!</b> ✓"; tx.removeAttribute("data-h");
      setTimeout(function () { praised = false; coShow(li + 1); }, 1300);
    }
    coDraw();
  }
  function coShow(i) {
    li = Math.min(i, LESSON.length - 1);
    var stp = LESSON[li], n = LESSON.length - 2, k = li;
    co.querySelector(".co-hd span").textContent = stp.intro ? "CHƠI THỬ" : stp.end ? "CHƠI THỬ · Hoàn thành!" : "CHƠI THỬ · bước " + k + "/" + n;
    var tx = co.querySelector(".co-tx"); tx.innerHTML = stp.html; tx.setAttribute("data-h", stp.html);
    co.querySelector(".co-ft").innerHTML = stp.btn ? '<button type="button" class="btn co-go" data-c="' + (stp.end ? "exit" : "next") + '">' + stp.btn + "</button>" :
      '<button type="button" class="co-skip" data-c="next">Bỏ qua bước này ▸</button>';
    if (li > 0 && window.FarmUI) FarmUI.closeCard();
    if (stp.start) stp.start();
    setTimeout(function () {
      var r = stp.at && stp.at();
      if (r) { var y = r.top + scrollY - innerHeight / 2 + r.height / 2; try { scrollTo({ top: Math.max(0, y), behavior: "smooth" }); } catch (e) { scrollTo(0, y); } }
    }, 60);
    coDraw();
  }
  function startPractice() {
    close(false);
    if (co) return;
    if (window.FarmUI) FarmUI.closeCard();
    F.startDemo(); document.body.classList.add("demo");
    co = document.createElement("div"); co.className = "co";
    co.innerHTML = '<div class="co-ring" hidden></div><div class="co-arrow" hidden></div>' +
      '<div class="co-card pxf" role="dialog" aria-label="Chơi thử"><div class="co-hd">' + PX.icon("seedling", 18, 1) + '<span></span><button type="button" class="co-x" data-c="exit">Thoát ✕</button></div><div class="co-tx"></div><div class="co-ft"></div></div>';
    document.body.appendChild(co);
    co.addEventListener("click", function (e) {
      var b = e.target.closest("[data-c]"); if (!b) return;
      if (b.getAttribute("data-c") === "exit") endPractice(); else coShow(li + 1);
    });
    coT = setInterval(coCheck, 250);
    addEventListener("scroll", coDraw, { passive: true }); addEventListener("resize", coDraw);
    coShow(0);
  }
  function endPractice() {
    if (!co) return;
    clearInterval(coT); co.remove(); co = null;
    removeEventListener("scroll", coDraw); removeEventListener("resize", coDraw);
    if (window.FarmUI) FarmUI.closeCard();
    document.body.classList.remove("demo");
    F.endDemo();
    scrollTo({ top: 0, behavior: "smooth" });
  }

  window.FarmGuide = { open: open, close: close, music: music, practice: startPractice, endPractice: endPractice };
})();

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
    { sel: ["musicBtn", "helpBtn"], last: true, html: function () { return "Bấm nút " + I("speaker") + " <b>Nhạc</b> để tắt hoặc bật nhạc.<br>Muốn xem lại hướng dẫn, bấm nút <b>?</b>.<br><b>Chúc bé chơi vui!</b>"; } }
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
      '<button type="button" class="btn gd-b" data-g="' + (last ? "end" : "next") + '">' + (last ? "Bắt đầu chơi!" : "Tiếp ▶") + "</button></div>" +
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
    play();
    if (get(GKEY) !== "1") setTimeout(function () { open(0); }, 500);
  });
  window.FarmGuide = { open: open, close: close, music: music };
})();

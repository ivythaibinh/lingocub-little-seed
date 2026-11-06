/* Lingo Cub · Little Seed — đăng nhập của bé + ghi tiến độ, điểm về Google Sheet.
   Trang nào cũng nạp tệp này. Chỉ cần sửa một dòng API bên dưới. */
(function () {
  "use strict";

  // ▼▼▼ Dán link Ứng dụng web của Apps Script (kết thúc bằng /exec) vào giữa hai dấu ngoặc kép ▼▼▼
  var API = "https://script.google.com/macros/s/AKfycbxnqnHIlzs4Zn_4ig0H7-mxu9sNGDTZh6udiFyM2TqONA5tyDwDEDwOu5p61N2cLn-g/exec";
  // ▲▲▲

  if (window.LC) return;
  var me = document.currentScript;
  var ROOT = me && me.src ? new URL("../", me.src).href : location.origin + "/";
  var MODE = (me && me.getAttribute("data-mode")) || "kid";
  var NOCHIP = !!(me && me.getAttribute("data-chip") === "off");

  try { var sx = document.createElement("script"); sx.src = ROOT + "assets/lc-sfx.js"; (document.head || document.documentElement).appendChild(sx); } catch (e) {}

  var href = location.href.split(/[?#]/)[0];
  var rel = href.indexOf(ROOT) === 0 ? href.slice(ROOT.length) : location.pathname.replace(/^\//, "");
  var m = rel.match(/^unit-(\d+)\/(?:([a-z0-9-]+)\/)?/);
  var UNIT = m ? +m[1] : 0, SEC = m && m[2] ? m[2] : "";
  var PAGE = m ? (SEC ? "lesson" : "hub") : (/^((hoc\/)?(index\.html?)?)$/.test(rel) ? "home" : /^nong-trai\//.test(rel) ? "farm" : "other");
  var TOP = true;
  try { TOP = window.top === window; } catch (e) { TOP = false; }
  var SESSION = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  var HUBKEY = { "warm-up": "warm-up", "vocab-bai-1": "vocab-1", "vocab-bai-2": "vocab-2", "story": "story", "practice": "practice", "show-and-tell": "sat" };

  /* ---------- lưu trên máy ---------- */
  function get(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  /* Hệ đăng nhập mới (đăng ký qua Google Form): xóa đăng nhập cũ còn lưu trên máy, một lần */
  (function () {
    try {
      if (localStorage.getItem("lc-auth") === "2") return;
      ["lc-user", "lc-kids", "lc-queue"].forEach(function (k) { localStorage.removeItem(k); });
      localStorage.setItem("lc-auth", "2");
    } catch (e) {}
  })();
  function user() { return get("lc-user", null); }
  function doneKey(n) { var u = user(); return "lingocub-unit" + n + "-done" + (u ? ":" + u.id : ""); }

  var VF = "àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ";
  var VT = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";
  function slug(s) {
    s = String(s || "").toLowerCase(); var o = "";
    for (var i = 0; i < s.length; i++) { var k = VF.indexOf(s[i]); o += k >= 0 ? VT[k] : s[i]; }
    return o.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function phone(p) {
    var d = String(p || "").replace(/\D/g, "");
    if (d.indexOf("84") === 0 && d.length === 11) d = "0" + d.slice(2);
    return d;
  }

  /* ---------- gửi về máy chủ ---------- */
  function post(body, ms) {
    if (!API) return Promise.reject(new Error("no-api"));
    var s = JSON.stringify(body), ctl = window.AbortController ? new AbortController() : null;
    var to = ctl && ms ? setTimeout(function () { ctl.abort(); }, ms) : 0;
    return fetch(API, { method: "POST", body: s, keepalive: s.length < 60000, signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json(); })
      .finally(function () { clearTimeout(to); });
  }
  var pending = [], flushT = 0;
  function takeAll() { var b = get("lc-queue", []).concat(pending); pending = []; set("lc-queue", []); return b; }
  function requeue(b) { set("lc-queue", get("lc-queue", []).concat(b).slice(-600)); }
  function flush() {
    clearTimeout(flushT);
    var b = takeAll(); if (!b.length) return;
    if (!API) { requeue(b); return; }
    post({ action: "log", events: b }, 20000)
      .then(function (j) { if (!j || !j.ok) throw new Error((j && j.error) || "fail"); })
      .catch(function () { requeue(b); });
  }
  function beaconFlush() {
    var b = takeAll(); if (!b.length) return;
    var ok = false;
    if (API && navigator.sendBeacon) {
      try { ok = navigator.sendBeacon(API, new Blob([JSON.stringify({ action: "log", events: b })], { type: "text/plain;charset=UTF-8" })); } catch (e) {}
    }
    if (!ok) requeue(b);
  }
  function ev(type, extra) {
    if (MODE !== "kid") return;
    var u = user(); if (!u) return;
    var e = { t: Date.now(), id: u.id, name: u.name, unit: UNIT, sec: SEC, type: type, session: SESSION };
    for (var k in extra) if (extra[k] !== undefined && extra[k] !== null) e[k] = extra[k];
    pending.push(e);
    clearTimeout(flushT); flushT = setTimeout(flush, 900);
  }

  /* ---------- tên trò đang chơi (trang Practice) ---------- */
  function gameName() {
    try {
      /* global CUR, GAMES */
      if (typeof CUR !== "undefined" && CUR && CUR !== "home" && typeof GAMES !== "undefined") {
        for (var i = 0; i < GAMES.length; i++) if (GAMES[i].id === CUR) return GAMES[i].name;
        return String(CUR);
      }
    } catch (e) {}
    return "";
  }

  /* ---------- sổ sao của bé (cho Nông trại) ----------
     Mỗi trò chỉ tính lượt cao nhất trong ngày: d[ngày][unit|mục|trò] = điểm.
     Video Show and Tell: sat[unit] = ngày đầu tiên nộp (5 sao, 1 lần / Unit). */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function day(t) { var d = t ? new Date(t) : new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function starKey(u) { return "lc-stars:" + (u ? u.id : ""); }
  function ledger() { var u = user(); var L = u ? get(starKey(u), null) : null; return L && L.d ? L : { d: {}, sat: {} }; }
  function addScore(game, score) {
    var u = user(); if (!u || MODE !== "kid") return;
    var L = ledger(), k = UNIT + "|" + SEC + "|" + String(game).slice(0, 80), dd = day();
    var t = L.d[dd] || (L.d[dd] = {});
    if (!(t[k] >= score)) t[k] = score;
    set(starKey(u), L);
  }
  function addSat() {
    var u = user(); if (!u || MODE !== "kid" || !UNIT) return;
    if (SEC !== "show-and-tell" && SEC !== "practice") return;
    var L = ledger(); if (!L.sat[UNIT]) { L.sat[UNIT] = day(); set(starKey(u), L); }
  }


  /* ---------- vỗ tay + pháo hoa 2 giây khi bé chơi xong một trò ---------- */
  var cheering = false, actx = null;
  function applause(ms) {
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      actx = actx || new AC(); if (actx.state === "suspended") actx.resume();
      var sr = actx.sampleRate, len = Math.floor(sr * 0.09), buf = actx.createBuffer(1, len, sr), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      var t0 = actx.currentTime + 0.02, n = Math.floor(ms / 1000 * 38);
      for (var c = 0; c < n; c++) {
        var at = t0 + Math.random() * (ms / 1000 - 0.15), src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
        src.buffer = buf; src.playbackRate.value = 0.8 + Math.random() * 0.7;
        f.type = "bandpass"; f.frequency.value = 1200 + Math.random() * 2400; f.Q.value = 0.7;
        var fade = Math.min(1, Math.min(at - t0 + 0.25, t0 + ms / 1000 - at) / 0.4);
        g.gain.value = (0.35 + Math.random() * 0.5) * Math.max(0.15, fade);
        src.connect(f); f.connect(g); g.connect(actx.destination); src.start(at);
      }
    } catch (e) {}
  }
  function fireworks(ms) {
    var cv = document.createElement("canvas");
    cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2147483000";
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = window.innerWidth, H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; document.body.appendChild(cv);
    var x = cv.getContext("2d"); x.scale(dpr, dpr);
    var COL = ["#FFD84D", "#FF6B6B", "#4DD6A5", "#5AB8FF", "#FF9F43", "#C58BFF", "#FFFFFF"], parts = [], bursts = 0, start = performance.now();
    function burst() {
      var cx = W * (0.15 + Math.random() * 0.7), cy = H * (0.15 + Math.random() * 0.4), col = COL[Math.floor(Math.random() * COL.length)], n = 44;
      for (var i = 0; i < n; i++) {
        var a = Math.PI * 2 * i / n + Math.random() * 0.2, v = 90 + Math.random() * 150;
        parts.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: Math.random() < 0.25 ? "#fff" : col, life: 0.9 + Math.random() * 0.4, age: 0 });
      }
    }
    var times = [0, 250, 550, 850, 1150], prev = start;
    (function frame(now) {
      var dt = Math.min(0.05, (now - prev) / 1000); prev = now;
      var el = now - start;
      while (bursts < times.length && el >= times[bursts]) { burst(); bursts++; }
      x.clearRect(0, 0, W, H);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i]; p.age += dt;
        if (p.age >= p.life) { parts.splice(i, 1); continue; }
        p.vy += 160 * dt; p.vx *= 0.985; p.x += p.vx * dt; p.y += p.vy * dt;
        x.globalAlpha = Math.max(0, 1 - p.age / p.life); x.fillStyle = p.c;
        x.fillRect(Math.round(p.x) - 3, Math.round(p.y) - 3, 6, 6);
      }
      x.globalAlpha = 1;
      if (el < ms) requestAnimationFrame(frame); else cv.remove();
    })(start);
  }
  function cheer() {
    if (cheering || !document.body) return;
    cheering = true; setTimeout(function () { cheering = false; }, 2100);
    applause(2000); fireworks(2000);
  }

  var last = {};
  var LC = window.LC = {
    api: API, root: ROOT, unit: UNIT, section: SEC, page: PAGE,
    user: user, doneKey: doneKey, gameName: gameName, post: post, slug: slug, phone: phone,
    /* gọi khi bé chơi xong một trò */
    score: function (game, score, total, note) {
      game = String(game || gameName() || "Trò chơi");
      var k = game + "|" + score + "|" + total, now = Date.now();
      if (last[k] && now - last[k] < 3000) return;
      last[k] = now;
      ev("score", { game: game, score: Number(score) || 0, total: Number(total) || 0, note: note || undefined });
      addScore(game, Number(score) || 0);
      cheer();
    },
    record: function (kind, secs, game) { ev(kind === "audio" ? "audio" : "video", { secs: secs, game: game }); if (kind !== "audio") addSat(); },
    cheer: cheer, log: ev, flush: flush, day: day, ledger: ledger, starKey: starKey, get: get, set: set,
    login: function () { showLogin(true); }
  };
  if (MODE !== "kid") return;

  /* ---------- thời gian học ---------- */
  var shown = document.visibilityState === "visible" ? Date.now() : 0, acc = 0;
  function hide() {
    if (shown) { acc += Date.now() - shown; shown = 0; }
    var s = Math.round(acc / 1000);
    if (s >= 3 && PAGE === "lesson") { acc = 0; ev("time", { secs: Math.min(s, 7200) }); }
    beaconFlush();
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") { if (!shown) shown = Date.now(); flush(); }
    else hide();
  });
  window.addEventListener("pagehide", function () { hide(); shown = Date.now(); });
  window.addEventListener("online", flush);

  /* ---------- quay video / ghi âm ---------- */
  if (window.MediaRecorder && window.Reflect && PAGE === "lesson") {
    try {
      var Base = window.MediaRecorder;
      var Wrap = function (stream, opts) {
        var r = Reflect.construct(Base, arguments, new.target || Wrap), t0 = 0;
        r.addEventListener("start", function () { t0 = Date.now(); });
        r.addEventListener("stop", function () {
          if (!t0) return;
          var s = Math.round((Date.now() - t0) / 1000); t0 = 0;
          if (s < 2) return;
          var vid = false; try { vid = stream.getVideoTracks().length > 0; } catch (e) {}
          var g = gameName() || (SEC === "story" ? (vid ? "Lồng tiếng" : "Ghi âm đọc truyện") : SEC === "show-and-tell" ? "Show and Tell" : (vid ? "Quay video" : "Ghi âm"));
          LC.record(vid ? "video" : "audio", s, g);
        });
        return r;
      };
      Wrap.prototype = Base.prototype;
      Object.setPrototypeOf(Wrap, Base);
      window.MediaRecorder = Wrap;
    } catch (e) {}
  }

  /* Show and Tell nằm trong Practice (Unit 2, 9–12): ghi lại khi bé vào mục này */
  document.addEventListener("DOMContentLoaded", function () {
    if (PAGE !== "lesson" || typeof window.newGame !== "function") return;
    var orig = window.newGame;
    window.newGame = function (name) {
      var r = orig.apply(this, arguments);
      if (name === "p1" || name === "names") setTimeout(function () { ev("game", { game: gameName() || name }); }, 0);
      return r;
    };
  });

  /* ---------- đồng bộ dấu "đã học" của bé từ máy chủ ---------- */
  function syncProgress() {
    var u = user(); if (!API || !u) return;
    fetch(API + "?action=progress&id=" + encodeURIComponent(u.id))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.ok || !j.progress) return;
        Object.keys(j.progress).forEach(function (n) {
          var key = doneKey(n), d = get(key, {}) || {};
          j.progress[n].forEach(function (s) { if (HUBKEY[s]) d[HUBKEY[s]] = true; });
          set(key, d);
        });
        window.dispatchEvent(new CustomEvent("lc-progress"));
      }).catch(function () {});
  }

  /* ---------- màn đăng nhập ---------- */
  var CSS = "" +
    ".lc-ov{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:16px;overflow:auto;" +
    "background:rgba(255,247,232,.97);font-family:'Nunito',system-ui,-apple-system,'Segoe UI',sans-serif;color:#3D2F24;-webkit-tap-highlight-color:transparent}" +
    "@media (prefers-color-scheme:dark){.lc-ov{background:rgba(35,29,24,.97)}}" +
    ".lc-card{width:min(440px,100%);background:#fff;border:3px solid #EAD7B8;border-radius:28px;box-shadow:0 8px 0 #EAD7B8;padding:22px 20px 20px;display:grid;gap:14px;text-align:center}" +
    ".lc-card img{width:92px;height:auto;justify-self:center;margin-top:-4px}" +
    ".lc-card h2{margin:0;font-family:'Baloo 2','Nunito',system-ui,sans-serif;font-weight:800;font-size:28px;line-height:1.05}" +
    ".lc-card p{margin:0;color:#7A6553;font-weight:700;font-size:14px}" +
    ".lc-card label{display:grid;gap:6px;text-align:left;font-weight:800;font-size:15px}" +
    ".lc-card input{font:inherit;font-size:20px;font-weight:700;padding:12px 14px;border:3px solid #EAD7B8;border-radius:16px;background:#FFFDF8;color:#3D2F24;width:100%;box-sizing:border-box}" +
    ".lc-card input:focus{outline:none;border-color:#4F9A55}" +
    ".lc-go{font:inherit;font-family:'Baloo 2','Nunito',system-ui,sans-serif;font-weight:800;font-size:22px;min-height:56px;border:0;border-radius:999px;background:#4F9A55;color:#fff;box-shadow:0 5px 0 #356b3a;cursor:pointer}" +
    ".lc-go:active{transform:translateY(3px);box-shadow:0 2px 0 #356b3a}.lc-go[disabled]{opacity:.6}" +
    ".lc-err{color:#C2412D;font-weight:800;font-size:14px;min-height:1em}" +
    ".lc-kids{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}" +
    ".lc-kid{font:inherit;font-weight:800;font-size:17px;padding:8px 16px;border-radius:999px;border:3px solid #FFC94A;background:#FFF6DA;color:#3A2A00;cursor:pointer}" +
    ".lc-kid.on{background:#FFC94A}" +
    ".lc-sep{font-size:13px;font-weight:800;color:#7A6553;text-transform:uppercase;letter-spacing:.06em}" +
    ".lc-x{justify-self:end;margin:-8px -6px -18px 0;font:inherit;font-weight:800;font-size:15px;border:2px solid #EAD7B8;background:#fff;border-radius:999px;padding:4px 12px;cursor:pointer;color:#7A6553}" +
    ".lc-out{font:inherit;font-weight:800;font-size:13px;border:0;background:none;color:#7A6553;text-decoration:underline;cursor:pointer}" +
    ".lc-reg{margin:0;font-weight:800;font-size:15px;color:#3D2F24}.lc-reg a{color:#2a78d6;text-decoration:underline;text-underline-offset:3px}" +
    ".lc-pw{position:relative}.lc-pw input{padding-right:84px}" +
    ".lc-eye{position:absolute;right:8px;top:50%;transform:translateY(-50%);font:inherit;font-weight:800;font-size:13px;border:2px solid #EAD7B8;background:#fff;color:#7A6553;border-radius:999px;padding:6px 10px;cursor:pointer;min-height:36px}" +
    ".lc-chip{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 14px 0 8px;border-radius:999px;background:#FFF6DA;border:2px solid #FFC94A;" +
    "font:inherit;font-weight:800;font-size:15px;color:#3A2A00;cursor:pointer;max-width:60vw}" +
    ".lc-chip b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lc-chip small{font-size:12px;opacity:.75;white-space:nowrap}" +
    ".lc-chip i{width:30px;height:30px;border-radius:50%;background:#4F9A55;color:#fff;display:grid;place-items:center;font-style:normal;font-size:15px}" +
    ".lc-chip{box-shadow:0 3px 0 #EAD7B8}" +
    "[hidden]{display:none!important}";

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var styled = false;
  function style() { if (styled) return; styled = true; var s = el("style"); s.textContent = CSS; document.head.appendChild(s); }

  function saveKid(u) {
    var kids = get("lc-kids", []).filter(function (k) { return k.id !== u.id; });
    kids.unshift(u); set("lc-kids", kids.slice(0, 8)); set("lc-user", u);
  }
  function afterLogin(prev) {
    var u = user();
    if (PAGE === "home" || PAGE === "hub" || PAGE === "farm" || (prev && prev.id !== u.id)) { location.reload(); return; }
    ev("open", { game: document.title.slice(0, 80) });
    flush();
  }

  function showLogin(canClose) {
    style();
    var prev = user(), kids = get("lc-kids", []), formUrl = get("lc-form", "");
    var ov = el("div", "lc-ov");
    ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Đăng nhập");
    var c = el("form", "lc-card");
    c.innerHTML =
      (canClose ? '<button type="button" class="lc-x" data-x>Đóng ✕</button>' : "") +
      '<img src="' + ROOT + 'assets/bunny.webp" alt="">' +
      "<h2>Chào con! 你好！Hello!</h2>" +
      (kids.length ? '<span class="lc-sep">Bé nào đang học?</span><div class="lc-kids">' +
        kids.map(function (k, i) { return '<button type="button" class="lc-kid' + (prev && prev.id === k.id ? " on" : "") + '" data-i="' + i + '">' + esc(k.name) + "</button>"; }).join("") +
        '</div><span class="lc-sep">Hoặc đăng nhập bé khác</span>' : "<p>Bố mẹ đăng nhập giúp con nhé. Máy sẽ nhớ cho lần sau.</p>") +
      '<label>Tên đăng nhập<input name="n" autocomplete="username" autocapitalize="words" maxlength="40" placeholder="Tên của bé, ví dụ: Minh An"></label>' +
      '<label>Mật khẩu (số điện thoại bố hoặc mẹ)<span class="lc-pw"><input name="p" type="password" inputmode="numeric" autocomplete="current-password" maxlength="15" placeholder="09xx xxx xxx"><button type="button" class="lc-eye" data-eye>Hiện</button></span></label>' +
      '<div class="lc-err" aria-live="polite"></div>' +
      '<button class="lc-go" type="submit">Vào học ▶</button>' +
      '<p class="lc-reg" data-reg' + (formUrl ? "" : " hidden") + '>Chưa có tài khoản? <a href="' + esc(formUrl) + '" target="_blank" rel="noopener">Đăng ký tại đây</a></p>' +
      (prev ? '<button type="button" class="lc-out" data-out>Đăng xuất bé ' + esc(prev.name) + "</button>" : "");
    ov.appendChild(c);
    document.body.appendChild(ov);
    var err = c.querySelector(".lc-err"), btn = c.querySelector(".lc-go"), reg = c.querySelector("[data-reg]");
    function showReg(u) {
      if (!u) return;
      set("lc-form", u); formUrl = u;
      reg.querySelector("a").href = u; reg.hidden = false;
    }
    if (API) fetch(API + "?action=config").then(function (r) { return r.json(); }).then(function (j) { if (j && j.form) showReg(j.form); }).catch(function () {});
    function close() { ov.remove(); }
    c.addEventListener("click", function (e) {
      var k = e.target.closest("[data-i]");
      if (k) { saveKid(kids[+k.dataset.i]); close(); afterLogin(prev); return; }
      if (e.target.closest("[data-x]")) { close(); return; }
      if (e.target.closest("[data-eye]")) {
        var b = e.target.closest("[data-eye]"), show = c.p.type === "password";
        c.p.type = show ? "text" : "password"; b.textContent = show ? "Ẩn" : "Hiện"; return;
      }
      if (e.target.closest("[data-out]")) { try { localStorage.removeItem("lc-user"); } catch (x) {} location.reload(); }
    });
    c.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = c.n.value.replace(/\s+/g, " ").trim(), p = phone(c.p.value);
      if (!n) { err.textContent = "Bố mẹ nhập tên đăng nhập của bé nhé."; c.n.focus(); return; }
      if (p.length < 9 || p.length > 11) { err.textContent = "Mật khẩu là số điện thoại, bố mẹ kiểm tra lại nhé."; c.p.focus(); return; }
      if (!API) { err.textContent = "Web chưa nối với Google Sheet nên chưa đăng nhập được."; return; }
      err.textContent = ""; btn.disabled = true; btn.textContent = "Đang vào…";
      post({ action: "login", name: n, phone: p }, 12000)
        .then(function (j) {
          if (j && j.ok && j.student) return j.student;
          if (j && j.form) showReg(j.form);
          throw { show: (j && j.error) || "Chưa đăng nhập được, bố mẹ thử lại nhé." };
        })
        .catch(function (x) { if (x && x.show) throw x; throw { show: "Chưa kết nối được mạng, bố mẹ kiểm tra rồi thử lại nhé." }; })
        .then(function (u) { saveKid(u); close(); afterLogin(prev); })
        .catch(function (x) { err.textContent = x.show; btn.disabled = false; btn.textContent = "Vào học ▶"; });
    });
    setTimeout(function () { if (!kids.length) c.n.focus(); }, 50);
  }

  function chip() {
    var u = user(); if (!u) return;
    style();
    var b = el("button", "lc-chip", "<i>🌱</i><b>" + esc(u.name) + "</b><small>Đổi bé</small>");
    b.type = "button"; b.title = "Đổi bé đang học";
    b.addEventListener("click", function () { showLogin(true); });
    var a = el("a", "lc-chip", "<i>⭐</i><b>Tiến độ của bé</b>");
    a.href = ROOT + "tien-do/"; a.style.textDecoration = "none";
    var nav = document.querySelector(".topnav");
    if (nav && PAGE === "hub") { var pn = nav.querySelector(".pn"); var w = el("div"); w.style.cssText = "display:flex;gap:8px;flex-wrap:wrap"; w.appendChild(b); w.appendChild(a); nav.insertBefore(w, pn || null); }
    else { var w2 = el("div"); w2.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;max-width:1040px;margin:0 auto;padding:12px 16px 0"; w2.appendChild(a); w2.appendChild(b); var mw = document.querySelector("main"); if (mw) mw.parentNode.insertBefore(w2, mw); else document.body.insertBefore(w2, document.body.firstChild); }
  }

  function boot() {
    if (!TOP) { if (PAGE === "lesson" && user()) ev("open", { game: document.title.slice(0, 80) }); return; }
    if (!user()) { showLogin(false); return; }
    if (PAGE === "home" || PAGE === "hub") { if (!NOCHIP) chip(); syncProgress(); }
    if (PAGE === "lesson") ev("open", { game: document.title.slice(0, 80) });
    flush();
  }
  if (document.body) boot(); else document.addEventListener("DOMContentLoaded", boot);
})();

/* Lingo Cub · Little Seed — luật mở khóa theo chặng (kiểu Duolingo).
   Dùng chung cho bản đồ (hoc/) và trang từng Unit (unit-N/).

   Mỗi Unit có 5 chặng:
     Khởi động (hát): mở ngay khi sang Unit mới, không bắt buộc
     Bài 1 · Từ vựng: mở ngay khi sang Unit mới
     Bài 2 · Từ vựng → Bài 3 · Truyện → Bài 4 · Thực hành: mở lần lượt
   Một mục tính là "xong" khi bé chơi hết ít nhất 1 trò trong mục đó
   (trò gửi điểm về LC.score); bài hát khởi động cần ít nhất 1 sao.
   Xong Bài 4 của Unit trước thì mở Unit sau.

   Giáo viên xem thử, mở hết: thêm ?giaovien=1 vào địa chỉ (tắt: ?giaovien=0). */
(function () {
  "use strict";
  if (window.LCPATH) return;

  // ▼ Lớp đã học xong đến Unit này: mọi Unit từ 1 đến số này mở sẵn để ôn tập ▼
  var OPEN_UPTO = 8;
  var LAST = 12;
  // ▲

  var FOLDER = { "warm-up": "warm-up", "vocab-1": "vocab-bai-1", "vocab-2": "vocab-bai-2", "story": "story", "practice": "practice", "sat": "show-and-tell" };
  /* n = số bài (0 = Khởi động). Chặng optional không chặn chặng sau. */
  var STAGES = [
    { n: 0, need: ["warm-up"], optional: true },
    { n: 1, need: ["vocab-1"] },
    { n: 2, need: ["vocab-2"] },
    { n: 3, need: ["story"] },
    { n: 4, need: ["practice", "sat"], all: false }
  ];

  var me = document.currentScript;
  var ROOT = me && me.src ? new URL("../", me.src).href : location.origin + "/";

  function get(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function user() { return window.LC ? LC.user() : get("lc-user", null); }

  /* chế độ giáo viên */
  try {
    var q = new URLSearchParams(location.search).get("giaovien");
    if (q === "1") localStorage.setItem("lc-giaovien", "1");
    if (q === "0") localStorage.removeItem("lc-giaovien");
  } catch (e) {}
  function teacher() { try { return localStorage.getItem("lc-giaovien") === "1"; } catch (e) { return false; } }

  /* sổ điểm: trên máy + bản sao từ máy chủ */
  function srvKey() { var u = user(); return "lc-path-srv:" + (u ? u.id : ""); }
  function ledgers() {
    var a = window.LC && LC.ledger ? LC.ledger() : { d: {}, sat: {} };
    return [a, get(srvKey(), null) || { d: {}, sat: {} }];
  }
  function finished(Ls, unit, key) {
    var pre = unit + "|" + FOLDER[key] + "|";
    for (var i = 0; i < Ls.length; i++) {
      var L = Ls[i] || {}, d = L.d || {};
      if ((key === "practice" || key === "sat") && L.sat && L.sat[unit]) return true;
      for (var day in d) {
        var t = d[day];
        for (var k in t) if (k.indexOf(pre) === 0 && (key !== "warm-up" || Number(t[k]) >= 1)) return true;
      }
    }
    return false;
  }

  /* trạng thái cả hành trình */
  function status() {
    var Ls = ledgers(), T = teacher(), units = [], prevDone = true, cur = null;
    for (var u = 1; u <= LAST; u++) {
      var free = u <= OPEN_UPTO || T, items = {}, stages = [], open = free || prevDone;
      Object.keys(FOLDER).forEach(function (k) { items[k] = finished(Ls, u, k); });
      for (var s = 0; s < STAGES.length; s++) {
        var st = STAGES[s];
        var done = st.all !== false ? st.need.every(function (k) { return items[k]; }) : st.need.some(function (k) { return items[k]; });
        stages.push({ n: st.n, open: open, done: done, optional: !!st.optional });
        if (!free && !st.optional) open = open && done;
      }
      var last = stages[stages.length - 1], udone = last.done && last.open;
      units.push({ n: u, free: u <= OPEN_UPTO, open: stages[0].open, done: udone, stages: stages, items: items });
      if (u > OPEN_UPTO) {
        /* chặng đang học: Khởi động chỉ là chặng đang học khi bé chưa làm Bài 1 */
        if (!cur) for (var j = 0; j < stages.length; j++) {
          if (stages[j].optional && stages[1].done) continue;
          if (stages[j].open && !stages[j].done) { cur = { u: u, s: j }; break; }
        }
        prevDone = udone;
      }
    }
    if (!cur) cur = { u: LAST, s: STAGES.length - 1, all: true };
    return { units: units, cur: cur, teacher: T, openUpto: OPEN_UPTO, last: LAST };
  }

  /* lấy sổ điểm trên máy chủ (bé đổi máy vẫn giữ tiến độ) */
  function sync(cb) {
    var u = user();
    if (!u || !window.LC || !LC.api) { if (cb) cb(false); return; }
    fetch(LC.api + "?action=farm&id=" + encodeURIComponent(u.id))
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j && j.ok && j.ledger) { set(srvKey(), j.ledger); if (cb) cb(true); } else if (cb) cb(false); })
      .catch(function () { if (cb) cb(false); });
  }

  function stageOf(key) { for (var i = 0; i < STAGES.length; i++) if (STAGES[i].need.indexOf(key) >= 0) return i; return 0; }

  /* ---------- trên trang Unit: khóa mục chưa mở ---------- */
  function hub() {
    var m = location.pathname.match(/unit-(\d+)\/?(index\.html?)?$/);
    if (!m) return;
    var n = +m[1];
    var css = document.createElement("style");
    css.textContent = ".go.lc-lock{filter:grayscale(1);opacity:.5;cursor:not-allowed;position:relative}" +
      ".go.lc-lock::after{content:'🔒';position:absolute;right:-6px;top:-10px;font-size:20px}" +
      ".lc-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99;background:#3D2F24;color:#fff;font-weight:800;padding:12px 18px;border-radius:16px;max-width:90vw;text-align:center;box-shadow:0 6px 0 rgba(0,0,0,.25)}";
    document.head.appendChild(css);
    var toastT = 0;
    function toast(t) {
      var e = document.querySelector(".lc-toast") || document.body.appendChild(document.createElement("div"));
      e.className = "lc-toast"; e.textContent = t; e.hidden = false;
      clearTimeout(toastT); toastT = setTimeout(function () { e.hidden = true; }, 2600);
    }
    function apply() {
      var S = status(), U = S.units[n - 1];
      if (!U) return;
      if (!U.open) { location.replace(ROOT + "hoc/"); return; }
      document.querySelectorAll("a.go[data-key]").forEach(function (a) {
        var st = U.stages[stageOf(a.dataset.key)];
        a.classList.toggle("lc-lock", !st.open);
        a.dataset.lcMsg = st.open ? "" : "Con học xong Bài " + (st.n - 1) + " trước nhé! 🔒";
      });
    }
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a.go.lc-lock");
      if (!a) return;
      e.preventDefault(); e.stopPropagation(); toast(a.dataset.lcMsg);
    }, true);
    apply();
    window.addEventListener("storage", apply);
    window.addEventListener("pageshow", apply);
    sync(function (ok) { if (ok) apply(); });
  }

  window.LCPATH = { status: status, sync: sync, teacher: teacher, OPEN_UPTO: OPEN_UPTO, LAST: LAST, FOLDER: FOLDER, STAGES: STAGES, hub: hub };
  if (me && me.getAttribute("data-hub") === "1") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hub); else hub();
  }
})();

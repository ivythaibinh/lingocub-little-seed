/* Lingo Cub · Little Seed — nhạc nền (cùng bản nhạc với Nông trại) cho trang chủ và trang Vào học.
   Không phát khi bé đang mở một bài học: gọi LCMUSIC.hold(true) lúc mở bài, hold(false) lúc đóng.
   Bé bấm nút ♪ để tắt/bật; lựa chọn dùng chung với Nông trại (khóa lc-farm-music). */
(function () {
  "use strict";
  if (window.LCMUSIC) return;
  var me = document.currentScript;
  var SRC = new URL("../nong-trai/music/nhac-nen.mp3", me.src).href;
  var KEY = "lc-farm-music", PKEY = "lc-music-pos";
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var audio = new Audio(SRC), started = false, held = false, restored = false, btn = null;
  audio.loop = true; audio.preload = "auto"; audio.volume = 0.3;

  function on() { return get(KEY) !== "off"; }
  function restore() {
    if (restored) return; restored = true;
    var t = parseFloat(get(PKEY)); if (t > 0) { try { audio.currentTime = t; } catch (e) {} }
  }
  function play() {
    if (!on() || held || document.hidden) return;
    restore();
    var p = audio.play();
    if (p && p.then) p.then(function () { started = true; }).catch(function () {}); else started = true;
  }
  function pause() { audio.pause(); }
  function save() { if (audio.currentTime > 0) set(PKEY, String(audio.currentTime)); }
  function paint() {
    if (!btn) return;
    var o = on();
    btn.setAttribute("aria-pressed", o ? "true" : "false");
    btn.title = o ? "Tắt nhạc" : "Bật nhạc";
    btn.firstChild.style.opacity = o ? "1" : ".45";
    btn.lastChild.style.display = o ? "none" : "block";
    btn.style.display = held ? "none" : "";
  }
  function button() {
    btn = document.createElement("button");
    btn.type = "button"; btn.id = "lcMusicBtn"; btn.setAttribute("aria-label", "Nhạc nền");
    var side = me.getAttribute("data-side") === "right" ? "right" : "left", up = parseInt(me.getAttribute("data-bottom"), 10) || 10;
    btn.style.cssText = "position:fixed;" + side + ":10px;bottom:calc(" + up + "px + env(safe-area-inset-bottom,0px));z-index:40;width:44px;height:44px;" +
      "border:3px solid #5a3b22;border-radius:12px;background:#fff7dd;box-shadow:0 3px 0 #5a3b22;padding:0;cursor:pointer;font:0/0 sans-serif";
    btn.innerHTML = '<svg viewBox="0 0 16 16" width="26" height="26" shape-rendering="crispEdges" style="display:block;margin:auto"><path fill="#5a3b22" d="M6 2h8v2H8v7H6zM3 10h3v1h1v2H6v1H3v-1H2v-2h1z"/></svg>' +
      '<svg viewBox="0 0 44 44" width="44" height="44" style="position:absolute;inset:0;display:none"><path d="M8 36L36 8" stroke="#d6453d" stroke-width="4" stroke-linecap="round"/></svg>';
    btn.addEventListener("click", function () {
      if (on()) { set(KEY, "off"); pause(); } else { set(KEY, "on"); play(); }
      paint();
    });
    document.body.appendChild(btn); paint();
  }
  /* trình duyệt chỉ cho phát sau khi bé chạm lần đầu */
  function gesture() { if (!started) play(); }
  ["pointerdown", "click", "keydown", "touchend"].forEach(function (ev) { document.addEventListener(ev, gesture, { passive: true }); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) { save(); pause(); } else if (started || on()) play(); });
  window.addEventListener("pagehide", function () { save(); pause(); });
  setInterval(save, 3000);
  window.addEventListener("storage", function (e) { if (e.key === KEY) { if (on()) play(); else pause(); paint(); } });

  window.LCMUSIC = {
    hold: function (h) { held = !!h; if (held) { save(); pause(); } else play(); paint(); },
    play: play, pause: pause
  };
  if (document.readyState !== "loading") { button(); play(); } else document.addEventListener("DOMContentLoaded", function () { button(); play(); });
})();

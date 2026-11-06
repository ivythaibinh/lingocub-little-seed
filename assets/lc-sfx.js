/* Lingo Cub · Little Seed — tiếng "tách" mỗi khi bé chạm vào bất cứ chỗ nào trên trang.
   lc-track.js tự nạp tệp này nên trang nào cũng có. */
(function () {
  "use strict";
  if (window.LCSFX) return;
  var me = document.currentScript;
  var SRC = (me && me.src ? new URL("./sfx/tap.mp3", me.src).href : "/assets/sfx/tap.mp3");
  var pool = [], i = 0, N = 4, lastT = 0;
  function make() { var a = new Audio(SRC); a.preload = "auto"; a.volume = 0.7; return a; }
  function init() { if (pool.length) return; for (var k = 0; k < N; k++) pool.push(make()); }
  function play() {
    var now = Date.now(); if (now - lastT < 50) return; lastT = now;
    init();
    try { var a = pool[i++ % N]; a.currentTime = 0; var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.closest && t.closest("audio,video")) return;
    play();
  }, true);
  if (document.readyState !== "loading") init(); else document.addEventListener("DOMContentLoaded", init);
  window.LCSFX = { play: play };
})();

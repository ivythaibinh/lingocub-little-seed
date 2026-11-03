/* Lingo Cub — vẽ pixel: cảnh nông trại, hình trong bộ sprite (nong-trai/img/atlas-*.png), hình tự vẽ. */
(function () {
  "use strict";
  var me = document.currentScript;
  var ROOT = me && me.src ? new URL("../../", me.src).href : "/";
  var IMG = ROOT + "nong-trai/img/";

  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function canvas(el, w, h, scale) { el.width = w; el.height = h; if (scale) { el.style.width = w * scale + "px"; el.style.height = h * scale + "px"; } var c = el.getContext("2d"); c.imageSmoothingEnabled = false; return c; }
  function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(x | 0, y | 0, w | 0, h | 0); }

  /* ---------- bộ sprite ---------- */
  var A = window.FARM_ATLAS, sheets = {};
  function loadAtlas(sizes) {
    sizes = sizes || [14, 18, 24, 32];
    return Promise.all(sizes.map(function (s) {
      return new Promise(function (res) { var i = new Image(); i.onload = function () { sheets[s] = i; res(); }; i.onerror = function () { res(); }; i.src = IMG + "atlas-" + s + ".png"; });
    }));
  }
  function has(name, size) { return !!(A && A.sizes[size] && A.sizes[size][name]); }
  function spr(c, name, size, x, y, opt) {
    var m = A && A.sizes[size] && A.sizes[size][name], im = sheets[size];
    if (!m || !im) { var d = DRAWN[name]; if (d) { c.save(); c.translate(Math.round(x), Math.round(y)); d(c, size); c.restore(); } return; }
    if (opt && opt.flip) { c.save(); c.translate(Math.round(x) + m[2], Math.round(y)); c.scale(-1, 1); c.drawImage(im, m[0], m[1], m[2], m[3], 0, 0, m[2], m[3]); c.restore(); return; }
    c.drawImage(im, m[0], m[1], m[2], m[3], Math.round(x), Math.round(y), m[2], m[3]);
  }
  function dims(name, size) { var m = A && A.sizes[size] && A.sizes[size][name]; return m ? [m[2], m[3]] : [size, size]; }
  /* hình nhỏ dùng trong chữ: <i class="pxi"> lấy từ bộ sprite, phóng to k lần */
  var iconCache = {};
  function icon(name, size, k, extra) {
    size = size || 24; k = k || 1;
    var m = A && A.sizes[size] && A.sizes[size][name];
    if (!m) {
      if (DRAWN[name]) {
        var key = name + size; if (!iconCache[key]) { var cv = document.createElement("canvas"); var c = canvas(cv, size + 2, size + 2); DRAWN[name](c, size); iconCache[key] = cv.toDataURL(); }
        return '<img class="px ' + (extra || "") + '" src="' + iconCache[key] + '" width="' + (size + 2) * k + '" height="' + (size + 2) * k + '" alt="">';
      }
      return "";
    }
    var at = sheets[size], W = at ? at.width : 0, H = at ? at.height : 0;
    return '<i class="pxi ' + (extra || "") + '" style="width:' + m[2] * k + 'px;height:' + m[3] * k + 'px;background-image:url(' + IMG + 'atlas-' + size + '.png);background-position:-' + m[0] * k + 'px -' + m[1] * k + 'px;background-size:' + W * k + 'px ' + H * k + 'px"></i>';
  }

  /* ---------- hình tự vẽ (cỡ ~size×size) ---------- */
  var INK = "#2e2238";
  function box(c, x, y, w, h, fill, ink) { R(c, x, y, w, h, ink || INK); R(c, x + 1, y + 1, w - 2, h - 2, fill); }
  var DRAWN = {
    wateringcan: function (c, s) { var k = s / 24; box(c, 5 * k, 9 * k, 12 * k, 11 * k, "#4aa8ff"); R(c, 6 * k, 10 * k, 10 * k, 2 * k, "#8fd0ff"); R(c, 16 * k, 11 * k, 6 * k, 2 * k, INK); R(c, 20 * k, 9 * k, 3 * k, 3 * k, "#2b6fd6"); R(c, 7 * k, 5 * k, 8 * k, 2 * k, INK); R(c, 7 * k, 5 * k, 2 * k, 5 * k, INK); R(c, 13 * k, 5 * k, 2 * k, 5 * k, INK); },
    shovel: function (c, s) { var k = s / 24; R(c, 11 * k, 2 * k, 2 * k, 13 * k, "#a8652f"); R(c, 9 * k, 2 * k, 6 * k, 2 * k, "#7a4520"); box(c, 7 * k, 14 * k, 10 * k, 8 * k, "#b9c3cf"); R(c, 8 * k, 15 * k, 3 * k, 5 * k, "#e8eef5"); },
    fertilizer: function (c, s) { var k = s / 24; box(c, 5 * k, 6 * k, 14 * k, 16 * k, "#c9a46b"); R(c, 6 * k, 7 * k, 12 * k, 2 * k, "#e3c58f"); R(c, 8 * k, 12 * k, 8 * k, 6 * k, "#5aa84b"); R(c, 11 * k, 10 * k, 2 * k, 3 * k, "#3f8f3a"); R(c, 7 * k, 3 * k, 10 * k, 3 * k, INK); },
    blanket: function (c, s) { var k = s / 24; box(c, 3 * k, 5 * k, 18 * k, 15 * k, "#ef5b5b"); for (var i = 0; i < 4; i++) { R(c, (5 + i * 4) * k, 6 * k, 1 * k, 13 * k, "#ffd43b"); R(c, 4 * k, (8 + i * 3) * k, 16 * k, 1 * k, "#ffb3b3"); } },
    sunshade: function (c, s) { var k = s / 24; R(c, 4 * k, 6 * k, 1 * k, 15 * k, "#7a4520"); R(c, 19 * k, 6 * k, 1 * k, 15 * k, "#7a4520"); box(c, 2 * k, 4 * k, 20 * k, 7 * k, "#3f8f3a"); for (var i = 3; i < 21; i += 2) R(c, i * k, 5 * k, 1 * k, 5 * k, "#7fd062"); },
    fence: function (c, s) { var k = s / 24; R(c, 1 * k, 9 * k, 22 * k, 3 * k, "#c58a4a"); R(c, 1 * k, 15 * k, 22 * k, 3 * k, "#c58a4a"); for (var i = 0; i < 4; i++) box(c, (2 + i * 6) * k, 5 * k, 4 * k, 16 * k, "#a8652f"); },
    shelter: function (c, s) { var k = s / 24; R(c, 4 * k, 9 * k, 2 * k, 13 * k, "#7a4520"); R(c, 18 * k, 9 * k, 2 * k, 13 * k, "#7a4520"); R(c, 1 * k, 4 * k, 22 * k, 7 * k, INK); for (var i = 2; i < 22; i++) R(c, i * k, 5 * k, 1 * k, 5 * k, (Math.floor(i / 3) % 2) ? "#ffffff" : "#3f86d8"); },
    scarecrow: function (c, s) { var k = s / 24; R(c, 11 * k, 9 * k, 2 * k, 14 * k, "#8a5426"); R(c, 3 * k, 12 * k, 18 * k, 2 * k, "#8a5426"); box(c, 7 * k, 11 * k, 10 * k, 8 * k, "#4aa8ff"); box(c, 8 * k, 4 * k, 8 * k, 7 * k, "#f2d29b"); R(c, 10 * k, 6 * k, 1 * k, 1 * k, INK); R(c, 13 * k, 6 * k, 1 * k, 1 * k, INK); R(c, 5 * k, 3 * k, 14 * k, 2 * k, "#e3b548"); R(c, 8 * k, 0, 8 * k, 4 * k, "#e3b548"); R(c, 8 * k, 3 * k, 8 * k, 1 * k, "#c0392b"); },
    pond: function (c, s) { var k = s / 24; for (var y = -8; y <= 8; y++) for (var x = -11; x <= 11; x++) { var d = x * x / 121 + y * y / 64; if (d <= 1) R(c, (12 + x) * k, (13 + y) * k, k, k, d > .7 ? "#2a5ea8" : "#5aa8f0"); } R(c, 6 * k, 11 * k, 4 * k, 1 * k, "#bfe4ff"); R(c, 13 * k, 15 * k, 4 * k, 1 * k, "#bfe4ff"); },
    well: function (c, s) { var k = s / 24; box(c, 4 * k, 12 * k, 16 * k, 10 * k, "#9aa3ad"); R(c, 5 * k, 15 * k, 14 * k, 1 * k, "#6e7780"); R(c, 5 * k, 19 * k, 14 * k, 1 * k, "#6e7780"); R(c, 5 * k, 4 * k, 2 * k, 9 * k, "#8a5426"); R(c, 17 * k, 4 * k, 2 * k, 9 * k, "#8a5426"); R(c, 3 * k, 2 * k, 18 * k, 3 * k, "#c0392b"); R(c, 11 * k, 5 * k, 1 * k, 6 * k, INK); box(c, 9 * k, 9 * k, 5 * k, 4 * k, "#a8652f"); },
    wheelbarrow: function (c, s) { var k = s / 24; R(c, 2 * k, 9 * k, 15 * k, 7 * k, INK); R(c, 3 * k, 10 * k, 13 * k, 5 * k, "#4dbb5a"); R(c, 16 * k, 12 * k, 7 * k, 2 * k, "#8a5426"); box(c, 5 * k, 16 * k, 6 * k, 6 * k, "#555"); R(c, 7 * k, 18 * k, 2 * k, 2 * k, "#bbb"); },
    bigbarn: function (c, s) { var k = s / 24; for (var i = 0; i < 8; i++) R(c, (12 - i * 1.4) * k, (2 + i) * k, (2.8 * i + 1) * k, 1 * k, "#7d2a2a"); box(c, 2 * k, 10 * k, 20 * k, 13 * k, "#d94a3f"); R(c, 8 * k, 14 * k, 8 * k, 9 * k, "#fff3de"); R(c, 9 * k, 15 * k, 6 * k, 8 * k, "#c0392b"); },
    windmill: function (c, s) { var k = s / 24; box(c, 8 * k, 9 * k, 8 * k, 14 * k, "#e8d2a8"); R(c, 11 * k, 17 * k, 3 * k, 6 * k, "#8a5426"); R(c, 11 * k, 3 * k, 2 * k, 12 * k, "#fff"); R(c, 6 * k, 8 * k, 12 * k, 2 * k, "#fff"); R(c, 11 * k, 8 * k, 2 * k, 2 * k, "#c0392b"); },
    greenhouse: function (c, s) { var k = s / 24; for (var i = 0; i < 6; i++) R(c, (12 - i * 2) * k, (4 + i) * k, (i * 4 + 1) * k, 1 * k, "#7fc7e8"); box(c, 2 * k, 10 * k, 20 * k, 12 * k, "#bfe8f5"); R(c, 7 * k, 11 * k, 1 * k, 10 * k, "#6aa"); R(c, 12 * k, 11 * k, 1 * k, 10 * k, "#6aa"); R(c, 17 * k, 11 * k, 1 * k, 10 * k, "#6aa"); R(c, 4 * k, 17 * k, 3 * k, 3 * k, "#4dbb5a"); R(c, 14 * k, 16 * k, 3 * k, 4 * k, "#4dbb5a"); },
    sign: function (c, s) { var k = s / 24; R(c, 11 * k, 12 * k, 2 * k, 11 * k, "#8a5426"); box(c, 2 * k, 4 * k, 20 * k, 10 * k, "#e0b46e"); R(c, 5 * k, 7 * k, 14 * k, 1 * k, "#7a4520"); R(c, 5 * k, 10 * k, 10 * k, 1 * k, "#7a4520"); },
    bench: function (c, s) { var k = s / 24; box(c, 2 * k, 8 * k, 20 * k, 4 * k, "#a8652f"); box(c, 2 * k, 13 * k, 20 * k, 4 * k, "#c58a4a"); R(c, 4 * k, 17 * k, 2 * k, 5 * k, "#7a8088"); R(c, 18 * k, 17 * k, 2 * k, 5 * k, "#7a8088"); },
    swing: function (c, s) { var k = s / 24; R(c, 2 * k, 2 * k, 20 * k, 2 * k, "#8a5426"); R(c, 2 * k, 2 * k, 2 * k, 20 * k, "#8a5426"); R(c, 20 * k, 2 * k, 2 * k, 20 * k, "#8a5426"); R(c, 8 * k, 4 * k, 1 * k, 11 * k, "#555"); R(c, 15 * k, 4 * k, 1 * k, 11 * k, "#555"); box(c, 6 * k, 15 * k, 12 * k, 3 * k, "#ef5b5b"); },
    bridge: function (c, s) { var k = s / 24; for (var x = 0; x < 22; x++) { var y = Math.round(8 + Math.pow((x - 11) / 11, 2) * 4); R(c, (1 + x) * k, y * k, 1 * k, 4 * k, "#c58a4a"); R(c, (1 + x) * k, (y - 4) * k, 1 * k, 1 * k, "#8a5426"); } for (var i = 2; i < 22; i += 5) R(c, i * k, 6 * k, 1 * k, 6 * k, "#8a5426"); },
    rainbowarch: function (c, s) { var k = s / 24, cols = ["#ef5b5b", "#ff9f3a", "#ffd43b", "#4dbb5a", "#4aa8ff", "#8b5cf6"]; cols.forEach(function (col, j) { for (var a = 0; a <= 180; a += 4) { var r = 10 - j * 1.2, rad = a * Math.PI / 180; R(c, (12 + Math.cos(rad) * r) * k, (18 - Math.sin(rad) * r) * k, 1.4 * k, 1.4 * k, col); } }); },
    smallplot: function (c, s) { var k = s / 24; box(c, 5 * k, 5 * k, 14 * k, 14 * k, "#9a5f35", "#3b2416"); R(c, 7 * k, 9 * k, 10 * k, 1 * k, "#7d4826"); R(c, 7 * k, 13 * k, 10 * k, 1 * k, "#7d4826"); },
    mediumplot: function (c, s) { var k = s / 24; box(c, 1 * k, 7 * k, 22 * k, 11 * k, "#9a5f35", "#3b2416"); R(c, 3 * k, 10 * k, 18 * k, 1 * k, "#7d4826"); R(c, 3 * k, 14 * k, 18 * k, 1 * k, "#7d4826"); },
    largeplot: function (c, s) { var k = s / 24; box(c, 1 * k, 1 * k, 22 * k, 22 * k, "#9a5f35", "#3b2416"); for (var j = 5; j < 22; j += 4) R(c, 3 * k, j * k, 18 * k, 1 * k, "#7d4826"); }
  };

  /* ---------- cảnh ---------- */
  function sky(c, w, y0, y1, cols) {
    var n = cols.length, band = (y1 - y0) / n;
    for (var i = 0; i < n; i++) {
      var ya = Math.round(y0 + i * band), yb = Math.round(y0 + (i + 1) * band);
      R(c, 0, ya, w, yb - ya, cols[i]);
      if (i < n - 1) { c.fillStyle = cols[i + 1]; for (var x = (i % 2); x < w; x += 2) c.fillRect(x, yb - 2, 1, 1); for (x = ((i + 1) % 2); x < w; x += 2) c.fillRect(x, yb - 1, 1, 1); }
    }
  }
  function cloud(c, x, y, s, col, sh) {
    col = col || "#ffffff"; sh = sh || "#d6ecff";
    var rows = s === "big" ? [[6, 10], [3, 16], [1, 22], [0, 26], [0, 26], [2, 22]] : s === "mid" ? [[4, 8], [2, 13], [0, 18], [1, 16]] : [[3, 5], [1, 10], [0, 12]];
    rows.forEach(function (r, i) { R(c, x + r[0], y + i, r[1], 1, i === rows.length - 1 ? sh : col); });
  }
  function hills(c, w, base, amp, per, ph, col, top) { for (var x = 0; x < w; x++) { var y = Math.round(base + amp * Math.sin(x / per + ph)); R(c, x, y, 1, 400, col); if (top) R(c, x, y, 1, 1, top); } }
  function grass(c, x0, y0, w, h, seed, base, dark, light) {
    base = base || "#64b84f"; dark = dark || "#4fa041"; light = light || "#7fd062";
    R(c, x0, y0, w, h, base); var r = rng(seed);
    for (var i = 0; i < w * h / 22; i++) { var x = x0 + Math.floor(r() * w), y = y0 + Math.floor(r() * h); if (r() < .6) R(c, x, y, 1, 2, dark); else R(c, x, y, 1, 1, light); }
  }
  function fence(c, x0, x1, y) {
    var post = "#8a5426", rail = "#c58a4a", ink = "#3b2416";
    R(c, x0, y + 2, x1 - x0, 2, rail); R(c, x0, y + 6, x1 - x0, 2, rail); R(c, x0, y + 4, x1 - x0, 1, ink); R(c, x0, y + 8, x1 - x0, 1, ink);
    for (var x = x0; x < x1; x += 7) { R(c, x, y, 3, 11, post); R(c, x, y, 3, 1, "#d9a066"); R(c, x + 2, y, 1, 11, ink); R(c, x, y + 10, 3, 1, ink); }
  }
  function vfence(c, x, y0, y1) { R(c, x + 1, y0, 1, y1 - y0, "#c58a4a"); for (var y = y0; y < y1; y += 6) { R(c, x, y, 3, 5, "#8a5426"); R(c, x + 2, y, 1, 5, "#3b2416"); } }
  function barn(c, x, y) {
    var ink = "#3a1f24";
    for (var i = 0; i < 12; i++) { R(c, x + 12 - i, y + i, 20 + 2 * i, 1, i === 0 ? ink : "#7d2a2a"); R(c, x + 12 - i, y + i, 1, 1, ink); R(c, x + 31 + i, y + i, 1, 1, ink); }
    R(c, x, y + 12, 44, 1, ink); R(c, x + 2, y + 13, 40, 22, "#d94a3f"); R(c, x + 2, y + 13, 40, 1, "#f07064");
    for (i = 0; i < 40; i += 5) R(c, x + 2 + i, y + 14, 1, 21, "#b8382f");
    R(c, x + 1, y + 13, 1, 23, ink); R(c, x + 42, y + 13, 1, 23, ink); R(c, x + 1, y + 35, 42, 1, ink);
    R(c, x + 14, y + 20, 16, 15, "#fff3de"); R(c, x + 15, y + 21, 14, 14, "#c0392b");
    for (i = 0; i < 14; i++) { R(c, x + 15 + i, y + 21 + i, 1, 1, "#fff3de"); R(c, x + 28 - i, y + 21 + i, 1, 1, "#fff3de"); }
    R(c, x + 18, y + 5, 8, 6, "#fff3de"); R(c, x + 19, y + 6, 6, 4, "#5a2a2a");
  }
  function plot(c, x, y, w, h, o) {
    o = o || {}; var ink = "#3b2416";
    if (o.locked) { var col = o.col || "#fff4d8"; for (var i = 0; i < w; i += 2) { R(c, x + i, y, 1, 1, col); R(c, x + i, y + h - 1, 1, 1, col); } for (var j = 0; j < h; j += 2) { R(c, x, y + j, 1, 1, col); R(c, x + w - 1, y + j, 1, 1, col); } return; }
    R(c, x, y, w, h, ink); R(c, x + 1, y + 1, w - 2, h - 2, o.wet ? "#6e4022" : "#9a5f35");
    for (j = y + 3; j < y + h - 2; j += 4) R(c, x + 2, j, w - 4, 1, o.wet ? "#55311a" : "#7d4826");
    R(c, x + 1, y + 1, w - 2, 1, o.wet ? "#8a5530" : "#b87a48");
  }
  function pond(c, cx, cy, rx, ry) {
    for (var y = -ry; y <= ry; y++) for (var x = -rx; x <= rx; x++) {
      var d = (x * x) / (rx * rx) + (y * y) / (ry * ry);
      if (d <= 1) { c.fillStyle = d > .78 ? "#2a5ea8" : (d > .55 ? "#3f86d8" : "#5aa8f0"); c.fillRect(cx + x, cy + y, 1, 1); }
      else if (d <= 1.18) { c.fillStyle = "#d9c48c"; c.fillRect(cx + x, cy + y, 1, 1); }
    }
    [[-8, -3], [4, 2], [-2, 5]].forEach(function (p) { R(c, cx + p[0], cy + p[1], 4, 1, "#bfe4ff"); });
  }
  function path(c, x, y, w, h, seed) { R(c, x, y, w, h, "#e0c48c"); var r = rng(seed); for (var i = 0; i < w * h / 10; i++) R(c, x + Math.floor(r() * w), y + Math.floor(r() * h), 1, 1, r() < .5 ? "#c9a86b" : "#f0dcaa"); }
  function shelter(c, x, y, w) {
    R(c, x + 1, y + 4, 1, 22, "#8a5426"); R(c, x + w - 2, y + 4, 1, 22, "#8a5426");
    R(c, x, y, w, 6, INK); for (var i = 1; i < w - 1; i++) R(c, x + i, y + 1, 1, 4, (Math.floor(i / 4) % 2) ? "#ffffff" : "#3f86d8");
    for (i = 0; i < w; i += 4) R(c, x + i, y + 6, 2, 1, "#3f86d8");
  }
  function shade(c, x, y, w, h) { c.fillStyle = "rgba(30,90,40,.28)"; c.fillRect(x, y, w, h); for (var i = x; i < x + w; i += 3) R(c, i, y, 1, h, "rgba(20,70,30,.25)"); R(c, x, y, w, 2, "#3f8f3a"); }
  function rain(c, w, h, seed, n, col) { var r = rng(seed); c.fillStyle = col || "rgba(205,232,255,.85)"; for (var i = 0; i < n; i++) { var x = Math.floor(r() * w), y = Math.floor(r() * h); c.fillRect(x, y, 1, 1); c.fillRect(x - 1, y + 1, 1, 1); c.fillRect(x - 2, y + 2, 1, 1); } }
  function snow(c, w, h, seed, n) { var r = rng(seed); for (var i = 0; i < n; i++) { var x = Math.floor(r() * w), y = Math.floor(r() * h); R(c, x, y, 1, 1, "#ffffff"); if (r() < .3) { R(c, x - 1, y, 1, 1, "#e8f4ff"); R(c, x + 1, y, 1, 1, "#e8f4ff"); } } }
  function wind(c, w, h, seed, n) { var r = rng(seed); for (var i = 0; i < n; i++) { var x = Math.floor(r() * w), y = Math.floor(r() * h), L = 6 + Math.floor(r() * 10); R(c, x, y, L, 1, "rgba(255,255,255,.55)"); R(c, x + L, y - 1, 2, 1, "rgba(255,255,255,.55)"); } }
  function tint(c, w, h, col) { c.fillStyle = col; c.fillRect(0, 0, w, h); }
  function sparkle(c, x, y, col) { col = col || "#fff6a8"; R(c, x + 2, y, 1, 5, col); R(c, x, y + 2, 5, 1, col); R(c, x + 2, y + 2, 1, 1, "#ffffff"); }
  function tile(w, h, seed, base, dark, light) { var cv = document.createElement("canvas"); var c = canvas(cv, w, h); grass(c, 0, 0, w, h, seed, base, dark, light); return cv.toDataURL(); }

  window.PX = { root: ROOT, img: IMG, rng: rng, canvas: canvas, R: R, loadAtlas: loadAtlas, has: has, spr: spr, dims: dims, icon: icon, DRAWN: DRAWN,
    sky: sky, cloud: cloud, hills: hills, grass: grass, fence: fence, vfence: vfence, barn: barn, plot: plot, pond: pond, path: path,
    shelter: shelter, shade: shade, rain: rain, snow: snow, wind: wind, tint: tint, sparkle: sparkle, tile: tile, box: box };
})();

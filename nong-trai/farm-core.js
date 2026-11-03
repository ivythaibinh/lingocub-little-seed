/* Nông trại Lingo Cub — phần tính toán (sao, cây lớn, thời tiết, mua bán, lưu).
   Cần: assets/lc-track.js (window.LC) và nong-trai/data.js (window.FARM_DATA). */
(function () {
  "use strict";
  var D = window.FARM_DATA;
  var BY = {};
  [["crop", D.CROPS], ["special", D.SPECIAL], ["tree", D.TREES], ["fruit", D.FRUITS], ["animal", D.ANIMALS],
   ["product", D.PRODUCTS], ["tool", D.TOOLS], ["build", D.BUILDINGS], ["decor", D.DECOR], ["rare", D.RARE], ["plot", D.PLOTS]
  ].forEach(function (g) { g[1].forEach(function (x) { x.cat = g[0]; BY[x.id] = x; }); });

  /* ---------- ngày tháng ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fmt(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function today() { return fmt(new Date()); }
  function parse(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function addDays(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return fmt(d); }
  function monday(s) { var d = parse(s), w = (d.getDay() + 6) % 7; d.setDate(d.getDate() - w); return fmt(d); }
  function diff(a, b) { return Math.round((parse(b) - parse(a)) / 86400000); }
  function weekDays(mon) { var o = []; for (var i = 0; i < 7; i++) o.push(addDays(mon, i)); return o; }

  /* ---------- thời tiết: tính từ ngày, cả trung tâm cùng một thời tiết ---------- */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var s = seed >>> 0; return function () { s = (s + 0x6D2B79F5) >>> 0; var t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  var wkCache = {};
  function weekWeather(mon) {
    if (wkCache[mon]) return wkCache[mon];
    var r = rng(hash("lingocub-weather-" + mon)), days = [];
    for (var i = 0; i < 7; i++) days.push(r() < 0.62 ? "sunny" : "cloudy");
    var nBad = r() < 0.5 ? 1 : 2, used = {};
    while (Object.keys(used).length < nBad) {
      var p = Math.floor(r() * 7); if (used[p]) continue; used[p] = 1;
      days[p] = D.BAD[Math.floor(r() * D.BAD.length)];
    }
    for (var j = 1; j < 7; j++) if ((days[j - 1] === "rainy" || days[j - 1] === "stormy") && D.WEATHER[days[j]].good && r() < 0.65) days[j] = "rainbow";
    if (days.indexOf("rainbow") < 0 && r() < 0.15) { var q = Math.floor(r() * 7); if (D.WEATHER[days[q]].good) days[q] = "rainbow"; }
    return (wkCache[mon] = days);
  }
  /* xem thử một kiểu thời tiết cho hôm nay: thêm ?thoitiet=rainy (sunny, cloudy, rainbow, rainy, windy, stormy, hot, cold, snowy, foggy) vào địa chỉ */
  var TRY = (function () { try { var m = location.search.match(/[?&]thoitiet=([a-z]+)/); return m && D.WEATHER[m[1]] ? m[1] : ""; } catch (e) { return ""; } })();
  function weatherOf(day) { if (TRY && day === today()) return TRY; return weekWeather(monday(day))[diff(monday(day), day)]; }
  function isBad(day) { return !D.WEATHER[weatherOf(day)].good; }

  /* ---------- trạng thái ---------- */
  var uid = null, uname = "", st = null, server = null, cls = null, listeners = [];
  function fresh() {
    /* quà chào mừng: 2 ô đã gieo sẵn cà rốt, khoai tây + 1 túi hạt mỗi loại + 1 túi phân bón */
    return { v: 1, t: 0, spent: 0, sale: {}, seeds: { carrot: 1, potato: 1 }, nursery: {}, kho: {}, fert: 1,
      plots: { S: 4, M: 0, L: 0 }, field: { S0: { c: "carrot", p: today() }, S1: { c: "potato", p: today() } }, animals: {}, fed: {}, got: {}, tools: { wateringcan: 1, shovel: 1 }, builds: {},
      decor: [], deploy: {}, wk: {}, cc: {}, welcome: today() };
  }
  function key() { return "lc-farm:" + uid; }
  function loadLocal() { try { var s = JSON.parse(localStorage.getItem(key()) || "null"); return s && s.v ? s : null; } catch (e) { return null; } }
  function prune() {
    var t = today(), keep = function (o, days) { Object.keys(o).forEach(function (k) { if (diff(k, t) > days) delete o[k]; }); };
    keep(st.sale, 3); keep(st.fed, 1); keep(st.got, 1); keep(st.deploy, 40);
    Object.keys(st.wk).forEach(function (k) { if (diff(k, t) > 70) delete st.wk[k]; });
  }
  var saveT = 0;
  function save() {
    st.t = Date.now(); prune();
    try { localStorage.setItem(key(), JSON.stringify(st)); } catch (e) {}
    clearTimeout(saveT); saveT = setTimeout(push, 1500);
    emit();
  }
  function push() {
    clearTimeout(saveT);
    if (!window.LC || !LC.api || !uid) return;
    LC.post({ action: "farmSave", id: uid, name: uname, state: st }, 15000).then(function (j) {
      if (j && j.stale && j.state && Number(j.state.t) > st.t) { st = j.state; localStorage.setItem(key(), JSON.stringify(st)); emit(); }
    }).catch(function () {});
  }
  function emit() { listeners.forEach(function (f) { try { f(); } catch (e) { console.error(e); } }); }

  /* ---------- sao ---------- */
  function ledger() {
    var a = (window.LC && LC.ledger) ? LC.ledger() : { d: {}, sat: {} }, b = (server && server.ledger) || { d: {}, sat: {} };
    var out = { d: {}, sat: {} };
    [a, b].forEach(function (L) {
      Object.keys(L.d || {}).forEach(function (dd) {
        var o = out.d[dd] || (out.d[dd] = {});
        Object.keys(L.d[dd]).forEach(function (k) { var v = Number(L.d[dd][k]) || 0; if (!(o[k] >= v)) o[k] = v; });
      });
      Object.keys(L.sat || {}).forEach(function (u) { var dd = L.sat[u]; if (!out.sat[u] || out.sat[u] > dd) out.sat[u] = dd; });
    });
    return out;
  }
  var SC = null;
  function stars() {
    if (SC) return SC;
    var L = ledger(), by = {}, total = 0;
    Object.keys(L.d).forEach(function (dd) {
      var s = 0; Object.keys(L.d[dd]).forEach(function (k) { s += L.d[dd][k]; });
      by[dd] = Math.min(D.CAP_DAY, s);
    });
    Object.keys(L.sat).forEach(function (u) { by[L.sat[u]] = (by[L.sat[u]] || 0) + D.SAT_STARS; });
    Object.keys(by).forEach(function (dd) { total += by[dd]; });
    var sale = 0; Object.keys(st ? st.sale : {}).forEach(function (k) { sale += st.sale[k]; });
    var saleAll = st ? (st.saleAll || 0) : 0;
    var t = today(), raw = 0; Object.keys(L.d[t] || {}).forEach(function (k) { raw += L.d[t][k]; });
    SC = { learn: total, by: by, today: by[t] || 0, rawToday: raw, sale: saleAll, saleToday: st ? (st.sale[t] || 0) : 0,
      balance: total + saleAll - (st ? st.spent : 0) };
    return SC;
  }
  function invalidate() { SC = null; }
  function level() {
    var L = stars().learn, cur = D.LEVELS[0], next = null;
    D.LEVELS.forEach(function (x, i) { if (L >= x.at) { cur = x; next = D.LEVELS[i + 1] || null; } });
    return { n: cur.n, name: cur.name, at: cur.at, next: next, learn: L };
  }
  function played(day) { return (stars().by[day] || 0) > 0; }
  function grace() { return st.builds.well ? 4 : D.GRACE; }
  function active(day) { for (var i = 0; i <= grace(); i++) if (played(addDays(day, -i))) return true; return false; }
  function growth(from, to) { var n = 0; for (var d = addDays(from, 1); d <= to; d = addDays(d, 1)) if (active(d)) n++; return n; }
  function sleepy() { return !active(today()); }               // quá lâu không học: cây ngừng lớn, thú ngủ
  function wilted() { return !played(today()); }               // hôm nay chưa học: cây héo, thú buồn

  /* ---------- ô đất ---------- */
  function slots() {
    var o = [];
    ["S", "M", "L"].forEach(function (z) { for (var i = 0; i < st.plots[z]; i++) o.push(z + i); });
    return o;
  }
  function sizeOf(slot) { return slot[0]; }
  function fits(slot, id) {
    var z = sizeOf(slot), x = BY[id]; if (!x) return false;
    if (x.cat === "tree") return z === "L";
    if (x.cat === "crop" || x.cat === "special") return x.plot === "S" || z !== "S";
    return false;
  }
  function yieldOf(slot, crop) {
    var z = sizeOf(slot), c = crop.plot;
    if (z === "S") return 2; if (z === "M") return c === "S" ? 4 : 2; return c === "S" ? 8 : 4;
  }
  function plotState(slot) {
    var f = st.field[slot]; if (!f) return { empty: true };
    var x = BY[f.c], t = today(), g = growth(f.p, t) + (f.f || 0) - (f.k || 0);
    if (x.cat === "tree") {
      var next = f.n || D.TREE_GROW;
      return { tree: true, item: x, g: g, grown: g >= D.TREE_GROW, ready: g >= next, left: Math.max(0, next - g), stage: g >= D.TREE_GROW ? 3 : (g >= 2 ? 2 : 1) };
    }
    var need = x.days - (x.id === "rice" && st.animals.buffalo ? 1 : 0);
    var harmed = harmedDays(slot, f.p, t);
    return { item: x, g: g, need: need, ready: g >= need, left: Math.max(0, need - g), harmed: harmed,
      stage: g >= need ? 3 : (g === 0 ? 0 : (g / need < 0.5 ? 1 : 2)) };
  }
  function protectedOn(day) { return !!st.deploy[day]; }
  function harmedDays(slot, from, to) {
    var n = 0;
    for (var d = addDays(from, 1); d <= to; d = addDays(d, 1)) {
      if (!isBad(d) || protectedOn(d)) continue;
      if (st.builds.greenhouse && sizeOf(slot) === "S") continue;
      n++;
    }
    return n;
  }

  /* ---------- hành động (trả về thông báo cho bé) ---------- */
  function fail(msg) { return { ok: false, msg: msg }; }
  function done(msg, extra) { invalidate(); save(); var r = { ok: true, msg: msg }; for (var k in extra) r[k] = extra[k]; return r; }
  function canAfford(p) { return stars().balance >= p; }
  function priceOf(x) { return x.price || 0; }
  function lockReason(x) {
    var lv = level().n;
    if (x.cat === "animal") {
      var have = st.animals[x.id] || 0;
      if (have >= 3) return "Đã đủ 3 con";
      var need = Math.max(x.lv, D.MORE_LV[have] || 0);
      if (lv < need) return "Cấp " + need;
      return "";
    }
    if (x.cat === "plot") { if ((st.plots[x.size] || 0) >= x.max) return "Đã đủ " + x.max + " ô"; }
    if ((x.cat === "tool" && !x.consumable && st.tools[x.id]) || (x.cat === "build" && st.builds[x.id])) return "Đã có";
    if (x.lv && lv < x.lv) return "Cấp " + x.lv;
    return "";
  }
  function buy(id) {
    var x = BY[id]; if (!x) return fail("Không có món này");
    var why = lockReason(x); if (why) return fail(why === "Đã có" ? "Bé đã có rồi" : why.indexOf("Cấp") === 0 ? "Lên " + why + " để mở món này nhé" : why);
    var p = priceOf(x); if (!canAfford(p)) return fail("Chưa đủ sao. Bé học thêm để kiếm sao nhé!");
    st.spent += p;
    if (x.cat === "crop") st.seeds[id] = (st.seeds[id] || 0) + 1;
    else if (x.cat === "tree") st.nursery[id] = (st.nursery[id] || 0) + 1;
    else if (x.cat === "animal") st.animals[id] = (st.animals[id] || 0) + 1;
    else if (x.cat === "tool") { if (x.consumable) st.fert++; else st.tools[id] = 1; }
    else if (x.cat === "build") st.builds[id] = 1;
    else if (x.cat === "decor") st.decor.push(id);
    else if (x.cat === "plot") st.plots[x.size]++;
    return done("Đã đổi " + x.vi + "!", { item: x });
  }
  function plant(slot, id) {
    if (st.field[slot]) return fail("Ô này đang có cây");
    var x = BY[id]; if (!fits(slot, id)) return fail("Ô này không trồng được " + (x ? x.vi : ""));
    if (x.cat === "tree") { if (!st.nursery[id]) return fail("Bé chưa có cây này"); st.nursery[id]--; }
    else { if (!st.seeds[id]) return fail("Bé chưa có hạt này"); st.seeds[id]--; }
    var f = { c: id, p: today() };
    var pecked = x.cat !== "tree" && !st.tools.scarecrow && Math.random() < 0.25;
    if (pecked) f.k = 1;
    st.field[slot] = f;
    return done(pecked ? "Chim mổ mất vài hạt, cây chậm 1 ngày. Có bù nhìn thì không sợ!" : "Đã trồng " + x.vi + "!", { item: x });
  }
  function rainbowToday() { return weatherOf(today()) === "rainbow"; }
  function harvest(slot, quiet) {
    var f = st.field[slot], ps = plotState(slot); if (!f || !ps.ready) return fail("Chưa thu hoạch được");
    var x = ps.item, n, give;
    if (ps.tree) {
      var fr = BY[x.fruit]; n = 2 * (rainbowToday() ? 2 : 1); give = fr;
      st.kho[fr.id] = (st.kho[fr.id] || 0) + n; f.n = ps.g + D.TREE_EVERY;
    } else {
      n = yieldOf(slot, x); if (ps.harmed) n = Math.max(1, Math.floor(n / 2)); if (rainbowToday()) n *= 2;
      give = x; st.kho[x.id] = (st.kho[x.id] || 0) + n; delete st.field[slot];
    }
    if (quiet) return { ok: true, n: n, item: give };
    return done("Thu hoạch " + n + " " + give.vi + (ps.harmed && !ps.tree ? " (bị thời tiết làm dập một nửa)" : "") + (rainbowToday() ? " — cầu vồng ×2!" : ""), { n: n, item: give });
  }
  function harvestAll() {
    if (!st.tools.basket) return fail("Cần giỏ để thu hoạch cả ruộng");
    var total = 0; slots().forEach(function (s) { var r = plotState(s); if (r.ready) { var h = harvest(s, true); if (h.ok) total += h.n; } });
    if (!total) return fail("Chưa có ô nào thu hoạch được");
    return done("Thu hoạch tất cả: " + total + " phần nông sản vào kho!");
  }
  function plantAll(id) {
    if (!st.builds.tractor) return fail("Cần máy kéo");
    var n = 0; slots().forEach(function (s) { if (!st.field[s] && fits(s, id) && st.seeds[id] > 0) { st.seeds[id]--; st.field[s] = { c: id, p: today() }; n++; } });
    if (!n) return fail("Không còn ô trống hợp hoặc hết hạt");
    return done("Máy kéo đã gieo " + n + " ô " + BY[id].vi + "!");
  }
  function fertilize(slot) {
    var f = st.field[slot]; if (!f) return fail("Ô trống");
    if (st.fert < 1) return fail("Bé hết phân bón rồi");
    st.fert--; f.f = (f.f || 0) + 1;
    return done("Đã bón phân, cây lớn thêm 1 ngày!");
  }
  function unitPrice(id) {
    var x = BY[id]; if (!x) return 0;
    if (x.cat === "crop" || x.cat === "special") return Math.ceil(x.sell / 2) + (st.builds.windmill && (id === "rice" || id === "corn") ? 2 : 0);
    if (x.cat === "product") return x.sell + (st.builds.bigbarn ? 1 : 0);
    return x.sell || 0;
  }
  function sell(id, n) {
    var have = st.kho[id] || 0; n = Math.min(n || 1, have); if (!n) return fail("Kho hết món này");
    var p = unitPrice(id), t = today(), room = D.SALE_CAP_DAY - (st.sale[t] || 0);
    var can = Math.min(n, Math.floor(room / p));
    if (can < 1) return fail("Hôm nay chợ đã mua đủ " + D.SALE_CAP_DAY + " sao rồi, mai bán tiếp nhé!");
    st.kho[id] -= can; st.sale[t] = (st.sale[t] || 0) + can * p; st.saleAll = (st.saleAll || 0) + can * p;
    return done("Bán " + can + " " + BY[id].vi + ": +" + can * p + " sao");
  }
  /* con vật */
  function animalMood() { if (sleepy()) return "sleep"; if (wilted()) return "sad"; if (isBad(today()) && !protectedOn(today())) return "cold"; return "happy"; }
  function productToday(aid) {
    var a = BY[aid], n = st.animals[aid] || 0; if (!a.product || !n) return 0;
    if (aid === "duck" && !st.builds.pond) return 0;
    if (!played(today())) return 0;
    var t = today(), per = 1 + (st.builds.wheelbarrow ? 1 : 0), k = n * per;
    if ((st.fed[t] || {})[aid]) k *= 2;
    if (isBad(t) && !protectedOn(t)) k = Math.floor(k / 2);
    if ((st.got[t] || {})[aid]) return 0;
    return k;
  }
  function collect(aid, quiet) {
    var k = productToday(aid), a = BY[aid];
    if (!k) {
      if (quiet) return { ok: false };
      if (!played(today())) return fail("Bé chơi 1 trò hôm nay thì các bạn thú mới có sức nhé!");
      if (aid === "duck" && !st.builds.pond) return fail("Vịt cần có ao mới đẻ trứng");
      return fail("Hôm nay đã lấy rồi, mai quay lại nhé!");
    }
    var p = BY[a.product]; st.kho[p.id] = (st.kho[p.id] || 0) + k;
    var t = today(); (st.got[t] = st.got[t] || {})[aid] = 1;
    if (quiet) return { ok: true, n: k, item: p };
    return done("Lấy được " + k + " " + p.vi + "!", { n: k, item: p });
  }
  function collectAll() {
    var n = 0; D.ANIMALS.forEach(function (a) { var r = collect(a.id, true); if (r.ok) n += r.n; });
    if (!n) return fail(played(today()) ? "Chưa có sản phẩm mới" : "Bé chơi 1 trò hôm nay thì các bạn thú mới có sức nhé!");
    return done("Lấy được " + n + " sản phẩm từ các bạn thú!");
  }
  function feed(aid) {
    var a = BY[aid], t = today(); if (!a.food) return fail(a.vi + " được bé vuốt ve là vui rồi!");
    if ((st.fed[t] || {})[aid]) return fail("Hôm nay " + a.vi + " ăn no rồi");
    if (!st.kho[a.food]) return fail(a.vi + " thích " + BY[a.food].vi + ". Bé trồng " + BY[a.food].vi + " nhé!");
    st.kho[a.food]--; (st.fed[t] = st.fed[t] || {})[aid] = 1;
    return done(a.vi + " ăn " + BY[a.food].vi + " ngon lành! Hôm nay sản phẩm gấp đôi.");
  }
  /* thời tiết */
  function needFor(day) { return D.WEATHER[weatherOf(day)].need || []; }
  function missing(day) { return needFor(day).filter(function (id) { return !st.tools[id]; }); }
  function deploy(day) {
    if (!isBad(day)) return fail("Ngày này trời đẹp, không cần che");
    if (protectedOn(day)) return fail("Đã dựng rồi");
    if (day !== today() && day !== addDays(today(), 1)) return fail("Chỉ dựng được cho hôm nay hoặc ngày mai");
    var m = missing(day); if (m.length) return fail("Bé còn thiếu: " + m.map(function (i) { return BY[i].vi; }).join(", ") + ". Đổi ở Khu đổi sao nhé!");
    if (!played(today())) return fail("Bé chơi 1 trò để có sức dựng đồ che nhé!");
    st.deploy[day] = 1;
    return done("Đã dựng xong! Nông trại an toàn rồi.");
  }
  /* điểm danh tuần */
  function weekInfo(mon) {
    mon = mon || monday(today());
    var days = weekDays(mon), n = days.filter(played).length, c = st.wk[mon] || {};
    return { mon: mon, days: days, played: n, d3: n >= 3, d5: n >= 5, c3: !!c.d3, c5: !!c.d5, special: D.SPECIAL[Math.floor(diff("2026-01-05", mon) / 7) % D.SPECIAL.length] };
  }
  function claimWeek(which) {
    var w = weekInfo(), c = st.wk[w.mon] || (st.wk[w.mon] = {});
    if (which === 3) { if (!w.d3 || c.d3) return fail("Chưa nhận được"); c.d3 = 1; st.fert += D.WEEK_REWARD.days3.fertilizer; return done("Nhận 3 túi phân bón!"); }
    if (!w.d5 || c.d5) return fail("Chưa nhận được"); c.d5 = 1; st.seeds[w.special.id] = (st.seeds[w.special.id] || 0) + 1;
    return done("Nhận hạt giống của tuần: " + w.special.vi + "!");
  }
  /* mục tiêu lớp */
  function claimClass(start) {
    if (!cls) return fail("");
    var wk = null; cls.weeks.forEach(function (w) { if (w.start === start) wk = w; });
    if (!wk || !wk.ok || st.cc[start]) return fail("Chưa nhận được");
    var r = D.RARE[Math.floor(diff("2026-01-05", start) / 7) % D.RARE.length];
    st.cc[start] = r.id; st.decor.push(r.id);
    return done("Cả lớp giỏi quá! Bé nhận " + r.vi + "!", { item: r });
  }

  /* ---------- nạp và đồng bộ ---------- */
  function init(user) {
    uid = user.id; uname = user.name;
    st = loadLocal() || fresh(); invalidate();
    try { var c = JSON.parse(localStorage.getItem(key() + ":srv") || "null"); if (c) { server = c; cls = c.cls || null; } } catch (e) {}
    return st;
  }
  function sync() {
    if (!window.LC || !LC.api || !uid) return Promise.resolve(false);
    return fetch(LC.api + "?action=farm&id=" + encodeURIComponent(uid)).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) return false;
      server = { ledger: j.ledger, cls: j.cls || null }; cls = j.cls || null;
      try { localStorage.setItem(key() + ":srv", JSON.stringify(server)); } catch (e) {}
      if (j.state && Number(j.state.t) > Number(st.t)) { st = j.state; try { localStorage.setItem(key(), JSON.stringify(st)); } catch (e) {} }
      else if (Number(st.t) > Number(j.state ? j.state.t : 0)) push();
      invalidate(); emit(); return true;
    }).catch(function () { return false; });
  }
  window.addEventListener("pagehide", function () { if (saveT) push(); });
  window.addEventListener("storage", function (e) { if (e.key && e.key.indexOf("lc-stars:") === 0) { invalidate(); emit(); } });

  window.FarmCore = {
    D: D, BY: BY, today: today, addDays: addDays, monday: monday, diff: diff, weekDays: weekDays,
    weatherOf: weatherOf, isBad: isBad, init: init, sync: sync, on: function (f) { listeners.push(f); },
    state: function () { return st; }, cls: function () { return cls; }, stars: stars, level: level, played: played,
    active: active, sleepy: sleepy, wilted: wilted, slots: slots, fits: fits, plotState: plotState, yieldOf: yieldOf,
    lockReason: lockReason, buy: buy, plant: plant, harvest: harvest, harvestAll: harvestAll, plantAll: plantAll,
    fertilize: fertilize, sell: sell, unitPrice: unitPrice, feed: feed, collect: collect, collectAll: collectAll,
    productToday: productToday, animalMood: animalMood, needFor: needFor, missing: missing, deploy: deploy,
    protectedOn: protectedOn, weekInfo: weekInfo, claimWeek: claimWeek, claimClass: claimClass, refresh: function () { invalidate(); emit(); }
  };
})();

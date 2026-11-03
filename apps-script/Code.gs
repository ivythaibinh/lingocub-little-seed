/**
 * Lingo Cub · Little Seed — máy chủ ghi tiến độ học (Google Apps Script)
 *
 * Cách cài (làm một lần):
 *  1. Mở Google Sheet dùng để theo dõi → Tiện ích mở rộng → Apps Script.
 *  2. Xoá hết mã có sẵn, dán toàn bộ tệp này vào, bấm Lưu.
 *  3. Chọn hàm "caiDat" ở thanh trên cùng → Chạy → cho phép quyền truy cập.
 *     Hàm này tạo các trang tính "Sự kiện", "Học sinh", "Cài đặt", "Bảng điểm"
 *     và một mật khẩu giáo viên ngẫu nhiên (xem ở trang "Cài đặt").
 *  4. Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web
 *     · Thực thi với tư cách: Tôi   · Người có quyền truy cập: Bất kỳ ai
 *     → Triển khai → sao chép đường link kết thúc bằng /exec.
 *  5. Dán link đó vào dòng API ở đầu tệp assets/lc-track.js trên GitHub.
 *
 * Khi sửa mã này về sau: Triển khai → Quản lý các bản triển khai → bút chì →
 * Phiên bản: Phiên bản mới → Triển khai (link /exec giữ nguyên).
 */

var SH_EV = 'Sự kiện', SH_HS = 'Học sinh', SH_CD = 'Cài đặt', SH_BD = 'Bảng điểm';
var EV_HEAD = ['Thời gian', 'Mã bé', 'Tên bé', 'Unit', 'Mục', 'Loại', 'Trò', 'Điểm', 'Tổng', '%', 'Giây', 'Ghi chú', 'Phiên'];
var HS_HEAD = ['Mã bé', 'Tên bé', 'SĐT phụ huynh', 'Lớp', 'Ngày đăng ký', 'Lần học gần nhất', 'Ghi chú'];
var TYPE = { open: 'Mở bài', time: 'Thời gian', score: 'Điểm', video: 'Video', audio: 'Ghi âm', game: 'Vào trò' };
var SEC = { 'warm-up': 'Warm-up', 'vocab-bai-1': 'Vocab Bài 1', 'vocab-bai-2': 'Vocab Bài 2', 'story': 'Story', 'practice': 'Practice', 'show-and-tell': 'Show and Tell' };

/* ---------- Cài đặt lần đầu ---------- */
function caiDat() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('Asia/Ho_Chi_Minh');
  var ev = sheet_(SH_EV, EV_HEAD);
  ev.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
  var hs = sheet_(SH_HS, HS_HEAD);
  hs.getRange('C:C').setNumberFormat('@');
  hs.getRange('E:F').setNumberFormat('dd/MM/yyyy HH:mm');
  var cd = ss.getSheetByName(SH_CD);
  if (!cd) {
    cd = ss.insertSheet(SH_CD);
    var pass = String(Math.floor(100000 + Math.random() * 900000));
    cd.getRange('A1:B3').setValues([
      ['Mật khẩu giáo viên', pass],
      ['Danh sách lớp (cách nhau bằng dấu phẩy)', 'Seed A, Seed B'],
      ['Ghi chú', 'Mật khẩu dùng để mở trang dashboard giáo viên. Đổi số ở ô B1 nếu muốn. Lớp của từng bé điền ở cột "Lớp" trang "Học sinh" hoặc ngay trên dashboard.']
    ]);
    cd.getRange('A1:A3').setFontWeight('bold');
    cd.getRange('B1').setNumberFormat('@');
    cd.setColumnWidth(1, 300); cd.setColumnWidth(2, 420);
  }
  var bd = ss.getSheetByName(SH_BD);
  if (!bd) {
    bd = ss.insertSheet(SH_BD);
    bd.getRange('A1').setFormula(
      "=QUERY('" + SH_EV + "'!A:M,\"select B, C, D, E, G, max(J), avg(J), count(J), max(A) where F = 'Điểm' group by B, C, D, E, G " +
      "label max(J) 'Cao nhất (%)', avg(J) 'Trung bình (%)', count(J) 'Số lần chơi', max(A) 'Lần gần nhất'\",1)");
  }
  var s1 = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (s1 && s1.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s1);
  Logger.log('Xong. Mật khẩu giáo viên: ' + cd.getRange('B1').getDisplayValue());
}

function sheet_(name, head) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold').setBackground('#FFF1D6');
    sh.setFrozenRows(1);
  }
  return sh;
}

/* ---------- Tiện ích ---------- */
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
var VI_FROM = 'àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ';
var VI_TO   = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
function slug_(s) {
  s = String(s || '').toLowerCase();
  var out = '';
  for (var i = 0; i < s.length; i++) {
    var k = VI_FROM.indexOf(s[i]);
    out += k >= 0 ? VI_TO[k] : s[i];
  }
  return out.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function phone_(p) {
  var d = String(p || '').replace(/\D/g, '');
  if (d.indexOf('84') === 0 && d.length === 11) d = '0' + d.slice(2);
  return d;
}
function cleanName_(n) { return String(n || '').replace(/\s+/g, ' ').trim().slice(0, 60); }
function str_(v, n) { return v == null ? '' : String(v).slice(0, n || 120); }
function num_(v) { var x = Number(v); return isFinite(x) ? x : ''; }
function sameKid_(a, b) {
  return a === b || a.slice(-(b.length + 1)) === '-' + b || b.slice(-(a.length + 1)) === '-' + a;
}
function settings_() {
  var cd = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SH_CD);
  if (!cd) return { pass: '', classes: [] };
  var v = cd.getRange('B1:B2').getDisplayValues();
  return {
    pass: String(v[0][0]).trim(),
    classes: String(v[1][0]).split(',').map(function (x) { return x.trim(); }).filter(String)
  };
}
function checkKey_(key) {
  var p = settings_().pass;
  if (!p || String(key || '').trim() !== p) throw new Error('Sai mật khẩu giáo viên');
}

/* Đọc danh sách học sinh; dòng nào giáo viên tự thêm mà chưa có mã thì điền mã */
function students_() {
  var sh = sheet_(SH_HS, HS_HEAD);
  var n = sh.getLastRow() - 1;
  if (n < 1) return { sh: sh, list: [] };
  var vals = sh.getRange(2, 1, n, HS_HEAD.length).getValues();
  var fixed = false;
  var list = vals.map(function (r, i) {
    var ph = phone_(r[2]);
    if (!r[0] && r[1] && ph) { r[0] = ph + '-' + slug_(r[1]); fixed = true; }
    return { row: i + 2, id: String(r[0]), name: String(r[1]), phone: ph, lop: String(r[3]), first: r[4], last: r[5], note: String(r[6]) };
  });
  if (fixed) sh.getRange(2, 1, n, 1).setValues(vals.map(function (r) { return [r[0]]; }));
  return { sh: sh, list: list };
}

/* ---------- Web app ---------- */
function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.action === 'progress') return json_({ ok: true, progress: progress_(p.id) });
    if (p.action === 'kid') return json_(kid_(p.id));
    if (p.action === 'data') { checkKey_(p.key); return json_(data_(p.days)); }
    return json_({ ok: true, app: 'lingocub-little-seed', time: new Date().toISOString() });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

function doPost(e) {
  var b;
  try { b = JSON.parse(e.postData.contents); } catch (x) { return json_({ ok: false, error: 'Dữ liệu không đọc được' }); }
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    if (b.action === 'login') return json_({ ok: true, student: login_(b.name, b.phone) });
    if (b.action === 'log') return json_({ ok: true, n: log_(b.events || []) });
    if (b.action === 'setClass') { checkKey_(b.key); return json_({ ok: true, student: setClass_(b.id, b.lop) }); }
    return json_({ ok: false, error: 'Không rõ yêu cầu' });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/* ---------- Đăng nhập ---------- */
function login_(name, phone) {
  name = cleanName_(name); phone = phone_(phone);
  if (!name) throw new Error('Thiếu tên bé');
  if (phone.length < 9 || phone.length > 11) throw new Error('Số điện thoại chưa đúng');
  var s = slug_(name), id = phone + '-' + s, now = new Date();
  var st = students_();
  var hit = null;
  st.list.forEach(function (k) { if (!hit && k.id === id) hit = k; });
  if (!hit) st.list.forEach(function (k) { if (!hit && k.phone === phone && sameKid_(slug_(k.name), s)) hit = k; });
  if (hit) {
    st.sh.getRange(hit.row, 6).setValue(now);
    return { id: hit.id, name: hit.name, phone: phone, lop: hit.lop };
  }
  st.sh.appendRow([id, name, "'" + phone, '', now, now, '']);
  return { id: id, name: name, phone: phone, lop: '' };
}

function setClass_(id, lop) {
  var st = students_();
  for (var i = 0; i < st.list.length; i++) {
    if (st.list[i].id === id) {
      st.sh.getRange(st.list[i].row, 4).setValue(str_(lop, 40));
      return { id: id, lop: str_(lop, 40) };
    }
  }
  throw new Error('Không tìm thấy bé');
}

/* ---------- Ghi sự kiện ---------- */
function log_(events) {
  if (!events.length) return 0;
  events = events.slice(0, 300);
  var sh = sheet_(SH_EV, EV_HEAD);
  var cache = CacheService.getScriptCache();
  var now = new Date(), nowMs = now.getTime();
  var base = sh.getLastRow();
  var rows = [], local = {}, bump = [], seen = {};
  events.forEach(function (ev) {
    if (!ev || !ev.id) return;
    var secs = Math.max(0, Math.min(7200, Math.round(num_(ev.secs) || 0)));
    var sess = str_(ev.session, 40);
    if (ev.type === 'time') {
      if (!secs) return;
      if (sess && local[sess] != null) { rows[local[sess]][10] = (Number(rows[local[sess]][10]) || 0) + secs; return; }
      var r = sess ? Number(cache.get('s:' + sess)) : 0;
      if (r) { bump.push([r, sess, secs]); return; }
    }
    var t = Number(ev.t);
    var when = (t && t < nowMs + 5 * 60000 && t > nowMs - 60 * 86400000) ? new Date(t) : now;
    var sc = num_(ev.score), tot = num_(ev.total);
    var pct = (ev.type === 'score' && tot) ? Math.round(sc / tot * 100) : '';
    rows.push([
      when, str_(ev.id, 60), cleanName_(ev.name), num_(ev.unit), SEC[ev.sec] || str_(ev.sec, 40),
      TYPE[ev.type] || str_(ev.type, 20), str_(ev.game, 80),
      ev.type === 'score' ? sc : '', ev.type === 'score' ? tot : '', pct,
      secs || '', str_(ev.note, 120), sess
    ]);
    if (ev.type === 'open' && sess) local[sess] = rows.length - 1;
    seen[ev.id] = cleanName_(ev.name) || seen[ev.id] || true;
  });
  if (rows.length) sh.getRange(base + 1, 1, rows.length, EV_HEAD.length).setValues(rows);
  Object.keys(local).forEach(function (sess) { cache.put('s:' + sess, String(base + 1 + local[sess]), 21600); });
  bump.forEach(function (b) {
    var row = sh.getRange(b[0], 11, 1, 3).getValues()[0];
    if (String(row[2]) === b[1]) sh.getRange(b[0], 11).setValue((Number(row[0]) || 0) + b[2]);
  });
  var ids = Object.keys(seen);
  if (ids.length) {
    var st = students_(), known = {};
    st.list.forEach(function (k) {
      if (seen[k.id]) { known[k.id] = true; st.sh.getRange(k.row, 6).setValue(now); }
    });
    /* bé đăng nhập lúc mất mạng: thêm vào danh sách học sinh */
    ids.forEach(function (id) {
      if (known[id]) return;
      var nm = typeof seen[id] === 'string' ? seen[id] : id;
      st.sh.appendRow([id, nm, "'" + id.split('-')[0], '', now, now, '']);
    });
  }
  return rows.length + bump.length;
}

/* ---------- Đọc dữ liệu ---------- */
function events_() {
  var sh = sheet_(SH_EV, EV_HEAD);
  var n = sh.getLastRow() - 1;
  return n < 1 ? [] : sh.getRange(2, 1, n, EV_HEAD.length).getValues();
}

function progress_(id) {
  var out = {}, back = {};
  Object.keys(SEC).forEach(function (k) { back[SEC[k]] = k; });
  if (!id) return out;
  events_().forEach(function (r) {
    if (String(r[1]) !== String(id) || !r[3]) return;
    var sec = back[r[4]];
    if (!sec) return;
    var u = String(r[3]);
    (out[u] = out[u] || []);
    if (out[u].indexOf(sec) < 0) out[u].push(sec);
  });
  return out;
}

function data_(days) {
  var since = Number(days) > 0 ? Date.now() - Number(days) * 86400000 : 0;
  var ev = events_().filter(function (r) { return r[0] instanceof Date && r[0].getTime() >= since; })
    .map(function (r) { return [r[0].toISOString()].concat(r.slice(1, 12)); });
  var st = students_().list.map(function (k) {
    return {
      id: k.id, name: k.name, phone: k.phone, lop: k.lop, note: k.note,
      first: k.first instanceof Date ? k.first.toISOString() : '',
      last: k.last instanceof Date ? k.last.toISOString() : ''
    };
  });
  return { ok: true, students: st, classes: settings_().classes, events: ev, cols: EV_HEAD.slice(0, 12), time: new Date().toISOString() };
}

/* Trang "Tiến độ của bé" cho phụ huynh: chỉ trả dữ liệu của đúng một bé (biết SĐT + tên bé) */
function kid_(id) {
  id = String(id || '');
  if (!id) return { ok: false, error: 'Thiếu mã bé' };
  var ev = events_().filter(function (r) { return String(r[1]) === id && r[0] instanceof Date; })
    .map(function (r) { return [r[0].toISOString()].concat(r.slice(1, 12)); });
  var k = null;
  students_().list.forEach(function (s) { if (s.id === id) k = s; });
  return { ok: true, name: k ? k.name : '', lop: k ? k.lop : '', events: ev, time: new Date().toISOString() };
}

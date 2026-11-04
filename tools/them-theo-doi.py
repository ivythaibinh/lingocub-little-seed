#!/usr/bin/env python3
"""Gắn đăng nhập + ghi điểm (assets/lc-track.js) vào các trang của web Little Seed.

Chạy lại được nhiều lần (trang nào đã gắn thì bỏ qua). Dùng khi thêm hoặc thay
trang bài học mới:   python3 tools/them-theo-doi.py
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
MARK = "/*LC*/"

# Tên trò trong trang Vocabulary: (tiêu đề khối mã, tên hiển thị, điểm, tổng, ghi chú)
VOCAB = [
    ("FLYING FRUITS", "Flying Fruits", "got", "ROUNDS", None),
    ("MATCHING TILES", "Matching Tiles", "Math.round(N*right/Math.max(1,tries))", "N", "'Chọn đúng '+right+'/'+tries+' lần'"),
    ("HEAD-TILT QUIZ", "Head-tilt Quiz", "score", "6", None),
    ("WHACK-A-MOLE", "Whack-a-mole", "got", "ROUNDS", None),
    ("TUG OF WAR", "Kéo co", "(win?lives:0)", "LIVES", "win?'Thắng, còn '+lives+' tim':'Thua'"),
    ("MAZE CHASE", "Maze Chase", "score", "QN", "done?'':'Hết tim'"),
    ("FEELINGS FACE", "Feelings Face", "score", "N", None),
    ("DUCK RACE", "Duck Race", "right", "NQ", "won?'':'Vịt bị choáng'"),
    ("THIS OR THAT", "This or That?", "score", "N", None),
    ("LANE RUNNER", "Picture Dash", "score", "QN", "done?'':'Hết tim'"),
    ("WEATHER FRIEND", "Weather Friend", "score", "QN", None),
    ("UNJUMBLE", "Unjumble", "got", "N", None),
    ("OPEN THE BOX", "Open the Box", "got", "N", None),
]

def call(name, sc, tot, note=None):
    n = "," + note if note else ""
    return "window.LC&&LC.score(%s,%s,%s%s);%s" % (name, sc, tot, n, MARK)

def add_tag(t, src):
    if "lc-track.js" in t:
        return t, False
    m = re.search(r"<head[^>]*>", t, re.I)
    if not m:
        raise ValueError("không thấy <head>")
    tag = '\n<script src="%s"></script>' % src
    return t[:m.end()] + tag + t[m.end():], True

def patch_vocab(t, report):
    out, pos, n = [], 0, 0
    for m in re.finditer(r"function finish\(([^)]*)\)\s*\{", t):
        if t[m.end():m.end() + 80].lstrip().startswith("window.LC&&"):
            continue
        heads = re.findall(r"/\*\s*-{2,}\s*(.*?)\s*-{2,}\s*\*/", t[:m.start()])
        head = heads[-1].upper() if heads else ""
        hit = next((v for v in VOCAB if head.startswith(v[0])), None)
        if not hit:
            report.append("  ! không rõ trò: " + head[:50])
            continue
        out.append(t[pos:m.end()])
        out.append(call(repr(hit[1]), hit[2], hit[3], hit[4]))
        pos = m.end(); n += 1
    out.append(t[pos:])
    return "".join(out), n

def patch_practice(t):
    pat = r"(async function finish\(g, score, total,[^)]*\)\{\s*if\(!alive\(g\)\) return;)"
    if MARK in t:
        return t, 0
    t2, n = re.subn(pat, r"\1" + call("LC.gameName()", "score", "total"), t, count=1)
    return t2, n

def patch_story(t):
    if MARK in t:
        return t, 0
    i = t.find("function viewQuiz(")
    j = t.find("function finish(){", i)
    if i < 0 or j < 0:
        return t, 0
    j += len("function finish(){")
    return t[:j] + call("'Quiz: '+story.title_en", "score", "qs.length") + t[j:], 1

def patch_warm(t):
    if MARK in t:
        return t, 0
    s = "const n = done.size, total = VIDEOS.length, miss = missing();"
    if s not in t:
        return t, 0
    return t.replace(s, s + call("'Hát khởi động'", "n", "total", "'sao'"), 1), 1

def patch_hub(t, unit):
    if MARK in t:
        return t, 0
    k = 'const KEY = "lingocub-unit%d-done";' % unit
    if k not in t:
        raise ValueError("không thấy KEY")
    t = t.replace(k, 'const KEY = window.LC ? LC.doneKey(%d) : "lingocub-unit%d-done";%s' % (unit, unit, MARK))
    t = t.replace("paint(); route();\n</script>",
                  'window.addEventListener("lc-progress", () => { done = loadDone(); paint(); });\npaint(); route();\n</script>', 1)
    return t, 1

def patch_home(t):
    if MARK in t:
        return t, 0
    old = 'document.querySelectorAll(".unit").forEach(a => {\n  let d = {};\n  try{ d = JSON.parse(localStorage.getItem("lingocub-unit" + a.dataset.u + "-done")) || {}; }catch(e){}'
    new = ('function paintUnits(){ ' + MARK + '\ndocument.querySelectorAll(".unit").forEach(a => {\n  let d = {};\n'
           '  const key = window.LC ? LC.doneKey(a.dataset.u) : "lingocub-unit" + a.dataset.u + "-done";\n'
           '  try{ d = JSON.parse(localStorage.getItem(key)) || {}; }catch(e){}')
    if old not in t:
        raise ValueError("không thấy đoạn tô màu Unit ở trang chủ")
    t = t.replace(old, new)
    t = t.replace("  });\n});\n</script>", '  });\n});\n}\npaintUnits();\nwindow.addEventListener("lc-progress", paintUnits);\n</script>', 1)
    t = t.replace("Mục đã mở có màu (lưu trên máy này)</span>",
                  'Mục đã học có màu (theo từng bé)</span><a class="lc-teacher" href="giao-vien/">Trang giáo viên</a>')
    t = t.replace("</style>", ".lc-teacher{font-size:12px;font-weight:800;color:inherit;opacity:.7;margin-left:10px}\n</style>", 1)
    return t, 1

def main():
    report, changed = [], 0
    for f in sorted(ROOT.glob("unit-*/*/index.html"), key=lambda p: (int(p.parts[-3][5:]), p.parts[-2])):
        sec, unit = f.parts[-2], int(f.parts[-3][5:])
        t0 = f.read_text(encoding="utf-8")
        t, added = add_tag(t0, "../../assets/lc-track.js")
        if sec.startswith("vocab-bai"):
            t, n = patch_vocab(t, report)
        elif sec == "practice":
            t, n = patch_practice(t)
        elif sec == "story":
            t, n = patch_story(t)
        elif sec == "warm-up":
            t, n = patch_warm(t)
        else:
            n = 0
        if t != t0:
            f.write_text(t, encoding="utf-8"); changed += 1
        report.append("unit-%d/%s: thẻ %s, %d chỗ ghi điểm" % (unit, sec, "mới" if added else "có sẵn", n))
    for f in sorted(ROOT.glob("unit-*/index.html"), key=lambda p: int(p.parts[-2][5:])):
        unit = int(f.parts[-2][5:])
        t0 = f.read_text(encoding="utf-8")
        t, _ = add_tag(t0, "../assets/lc-track.js")
        t, n = patch_hub(t, unit)
        if t != t0:
            f.write_text(t, encoding="utf-8"); changed += 1
        report.append("unit-%d (trang Unit): %s" % (unit, "đã gắn" if n else "có sẵn"))
    f = ROOT / "hoc" / "index.html"   # trang chọn Unit (trang chủ gốc giờ là trang pixel)
    t0 = f.read_text(encoding="utf-8")
    t, _ = add_tag(t0, "../assets/lc-track.js")
    t, n = patch_home(t)
    if t != t0:
        f.write_text(t, encoding="utf-8"); changed += 1
    report.append("trang chọn Unit (hoc/): %s" % ("đã gắn" if n else "có sẵn"))
    print("\n".join(report))
    print("Đã sửa %d tệp." % changed)

if __name__ == "__main__":
    main()

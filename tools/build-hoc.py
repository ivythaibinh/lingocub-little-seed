#!/usr/bin/env python3
"""Dựng hoc/units.js (dữ liệu bản đồ hành trình) từ các trang unit-N/index.html.
Chạy lại mỗi khi thêm Unit mới hoặc sửa mô tả trong trang Unit:
    python3 tools/build-hoc.py
"""
import html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Tên Unit: English · tiếng Việt · 中文 · hình trang trí trên bản đồ (tên trong nong-trai/img/atlas.js)
TITLES = {
    1: ("Greetings", "Chào hỏi", "问候", ["house", "flower"]),
    2: ("Name & Age", "Tên và tuổi", "名字和年龄", ["gift", "sparkles"]),
    3: ("My Family", "Gia đình", "家庭", ["house", "rose"]),
    4: ("My Body", "Cơ thể", "身体", ["sunflower", "tulip"]),
    5: ("Feelings", "Cảm xúc", "情绪", ["cherry_blossom", "rainbowflower"]),
    6: ("My School", "Trường học", "学校", ["books", "basket"]),
    7: ("My Home", "Đồ đạc trong nhà", "家具", ["house", "lantern"]),
    8: ("Animals & Actions", "Động vật & hành động", "动物和动作", ["dog", "rabbit"]),
    9: ("Food & Drink", "Đồ ăn & đồ uống", "食物和饮料", ["apple", "banana"]),
    10: ("Weather", "Thời tiết", "天气", ["sun", "umbrella"]),
    11: ("Colors", "Màu sắc", "颜色", ["rainbow", "tulip"]),
    12: ("Counting", "Số đếm", "数一数", ["egg", "chicken"]),
}
LABEL = {"warm-up": "Hát khởi động", "vocab-1": "Học từ vựng", "vocab-2": "Học từ vựng",
         "story": "Nghe truyện", "practice": "Chơi luyện tập", "sat": "Show and Tell"}


def text(s):
    s = re.sub(r"<span class=\"sat-note\">.*?</span>", "", s, flags=re.S)
    s = re.sub(r"<br\s*/?>", "\n", s)
    s = re.sub(r"<[^>]+>", "", s)
    return [html.unescape(re.sub(r"\s+", " ", x)).strip() for x in s.split("\n") if x.strip()]


units = []
for n in sorted(TITLES):
    page = open(os.path.join(ROOT, f"unit-{n}", "index.html"), encoding="utf-8").read()
    links = dict(re.findall(r'"([a-z0-9-]+)": \{ url: "([^"]+)"', page))
    arts = dict(re.findall(r'<article class="step (s\d)">(.*?)</article>', page, re.S))
    desc = {k: text(re.search(r"<p>(.*?)</p>", a, re.S).group(1)) for k, a in arts.items()}
    sat_note = re.search(r'<span class="sat-note"><b>SHOW AND TELL</b>\s*([^<]*)', arts["s4"])
    keys4 = re.findall(r'data-key="([^"]+)"', arts["s4"])
    voc = desc["s2"]
    v1 = next((x[len("Bài 1:"):].strip() for x in voc if x.startswith("Bài 1")), "")
    v2 = next((x[len("Bài 2:"):].strip() for x in voc if x.startswith("Bài 2")), "")
    en, vi, zh, deco = TITLES[n]
    item = lambda k: {"k": k, "label": LABEL[k], "url": f"../unit-{n}/{links[k]}"}
    units.append({
        "n": n, "en": en, "vi": vi, "zh": zh, "deco": deco,
        "stages": [
            {"items": [item("warm-up")], "lines": desc["s1"]},
            {"items": [item("vocab-1")], "lines": [v1]},
            {"items": [item("vocab-2")], "lines": [v2]},
            {"items": [item("story")], "lines": desc["s3"]},
            {"items": [item(k) for k in keys4],
             "lines": desc["s4"] + ([("Show and Tell: " + sat_note.group(1).strip())] if sat_note else [])},
        ],
    })

out = "/* Tạo tự động bằng tools/build-hoc.py — đừng sửa tay. */\nwindow.LC_UNITS = " + \
      json.dumps(units, ensure_ascii=False, indent=1) + ";\n"
open(os.path.join(ROOT, "hoc", "units.js"), "w", encoding="utf-8").write(out)

# Số trò (không tính flashcard) của từng bài từ vựng -> assets/lc-path.js (đoạn /*REQ*/ ... /*END*/)
req = {}
for n in sorted(TITLES):
    for folder in ("vocab-bai-1", "vocab-bai-2"):
        pg = open(os.path.join(ROOT, f"unit-{n}", folder, "index.html"), encoding="utf-8").read()
        tabs = re.findall(r'<button class="tab" role="tab" id="t-([a-z0-9-]+)"', pg)
        req[f"{n}|{folder}"] = len([t for t in tabs if t not in ("flashcards", "dub")])   # Lồng tiếng (quay video) là tuỳ chọn, không bắt buộc
pp = os.path.join(ROOT, "assets", "lc-path.js")
src = open(pp, encoding="utf-8").read()
src = re.sub(r"/\*REQ\*/.*?/\*END\*/", lambda m: "/*REQ*/" + json.dumps(req, ensure_ascii=False) + "/*END*/", src, flags=re.S)
open(pp, "w", encoding="utf-8").write(src)
print("REQ:", req)
print("hoc/units.js:", len(units), "unit")

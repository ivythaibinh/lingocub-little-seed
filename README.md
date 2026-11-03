# Lingo Cub · Little Seed (Unit 1–12)

Web tổng hợp học liệu Little Seed. Trang chủ có 12 Unit; mỗi Unit có 4 mục:

1. **Warm-up**: Khám phá chủ đề
2. **Vocabulary**: Bài tập buổi 1 & 2 (Bài 1, Bài 2)
3. **Story**: Bài tập buổi 3
4. **Practice**: Bài tập buổi 4 (gồm Show and Tell nếu Unit có)

Bài học mở ngay trong trang Unit; nút **Unit N** ở góc trên trái đưa bé về trang Unit, nút **Tất cả Unit** về trang chủ. Mục đã mở được đánh dấu trên máy đang dùng.

## Danh sách học liệu

| Unit | Chủ đề | Warm-up | Vocabulary (Bài 1 / Bài 2) | Story | Practice | Show and Tell |
|---|---|---|---|---|---|---|
| 1 | Greetings · Chào hỏi | ✓ | Chào thầy cô & bạn bè / Chào người thân | Hello! · Goodbye, Kitten! | Cánh cửa bí mật · Một ngày của bé · Tìm bạn sinh đôi · Lễ phép hay chưa? | — |
| 2 | Name & Age · Tên và tuổi | ✓ | Hỏi tên / Hỏi tuổi | What's your name? · How old are you? | Xe tuần lộc chở quà · Tiệm bánh của Bunny · Phiên dịch viên nhí | ✓ trong Practice (Khám phá tên) |
| 3 | My Family · Gia đình | ✓ | Bố mẹ, ông bà / Anh chị em | I Love My Family · This Is My Family | Chụp ảnh nhà Leo · Mời cơm nhà Buffy · Tết đoàn viên nhà Xiaobao | ✓ trang riêng |
| 4 | My Body · Cơ thể | ✓ | Tay, chân, đầu, to, nhỏ / Mắt, mũi, miệng, tai | Whose Mouth Is Big? · I Love My Daddy | Ai là Impostor? · Tắm cho gấu bông · Họa sĩ nhí | ✓ trang riêng |
| 5 | Feelings · Cảm xúc | ✓ | Vui, buồn, giận, buồn ngủ / Mệt, sợ, đói, khát | Teddy's Day | Hôm nay con thế nào? · Teddy sao thế? · Giúp bạn vui lên | — |
| 6 | My School · Trường học | ✓ | Sách, cặp, this / that / these / those / Bút, bút chì, tẩy, thước | What is this? · Surprise, Teacher! | Ai là Impostor? · Soạn cặp giúp Buffy · Bạn mới trong lớp | ✓ trang riêng |
| 7 | My Home · Đồ đạc trong nhà | ✓ | Bàn, ghế, trên, dưới / Sofa, tivi, giường | Where's the school bag? | Dọn nhà mới · Giấu đồ cùng Bunny · Tìm đồ giúp bạn | ✓ trang riêng |
| 8 | Animals & Actions · Động vật & hành động | ✓ | Chó, mèo, cá, chim, thỏ, chuột / Chạy, nhảy, bơi, bay | Who can? · My dog can run | Bóng đen bí ẩn · Đây là ai? · Vượt chướng ngại | ✓ trang riêng |
| 9 | Food & Drink · Đồ ăn & đồ uống | ✓ | Pizza, cơm, táo, chuối / Sữa, nước · ăn, uống | I Like Fish · What do you like? | Hộp cơm bí mật · Nhà hàng phiên dịch | ✓ trong Practice |
| 10 | Weather · Thời tiết | ✓ | Nắng, mưa, gió, âm u, tuyết / Nóng, lạnh và miêu tả thời tiết | How's the Weather? · Weather Forecast | Cửa sổ thời tiết · Hôm nay trời thế nào? · Bản tin thời tiết | ✓ trong Practice |
| 11 | Colors · Màu sắc | ✓ | Đỏ, xanh dương, vàng, xanh lá / Đen, trắng, cam, hồng, tím | What Color Is This? · What Do You Have? | Hộp sơn bí mật · Hộp quà nhiều màu · Xưởng sơn của Bunny | ✓ trong Practice |
| 12 | Counting · Số đếm | ✓ | Đếm người và con vật: 个, 只, 两 / Đếm đồ vật: 个 | My Family · On the Hill | Rương báu đếm số · Cửa hàng của Bunny | ✓ trong Practice |

Ở Unit 9–12, mục "Thực hành" trong web Practice đổi thành **Show and Tell**; ở Unit 2, mục "Khám phá" (tên tiếng Trung, tiếng Anh của bé) cũng đổi thành **Show and Tell**.

## Cấu trúc thư mục

```
index.html              ← trang chủ 12 Unit
assets/                 ← hình Leo, Bunny, Buffy, Xiaobao
unit-N/
  index.html            ← trang Unit N (4 mục)
  warm-up/              ← index.html + videos/
  vocab-bai-1/index.html
  vocab-bai-2/index.html
  story/index.html
  practice/index.html
  show-and-tell/index.html   (Unit 3, 4, 6, 7, 8)
```

## Thêm Warm-up cho một Unit

Đặt thư mục warm-up (gồm `index.html` và `videos/`) vào `unit-N/warm-up/`. Trong `unit-N/index.html`, thẻ Warm-up đang hiện "Sắp có": thay bằng nút `<a class="go" href="#warm-up" data-key="warm-up"><i></i>Vào hát</a>` và thêm dòng `"warm-up": { url: "warm-up/", title: "1 · Warm-up: Khám phá chủ đề" },` vào khối `LINKS`. (Gửi gói warm-up cho Claude để làm hộ.)

## Đăng nhập và theo dõi tiến độ (Google Sheet)

- Lần đầu vào web, bố mẹ nhập **tên bé + số điện thoại bố/mẹ**. Máy nhớ các bé đã đăng nhập; nút **Đổi bé** ở trang chủ và trang Unit để đổi bé trên máy dùng chung.
- Mỗi khi bé mở một mục, chơi xong một trò (điểm, ví dụ Duck Race 5/6), quay video Show and Tell / lồng tiếng, web gửi một dòng về Google Sheet. Mất mạng thì dữ liệu được giữ trên máy và gửi lại sau.
- Dấu "đã học" trên trang chủ và trang Unit theo từng bé, và tự đồng bộ từ Google Sheet (bé học trên máy khác vẫn có dấu).
- **Trang giáo viên:** `giao-vien/` (link nhỏ "Trang giáo viên" ở cuối trang chủ). Cần mật khẩu ở ô B1 trang "Cài đặt" của Google Sheet. Có lọc theo lớp, bé, Unit, thời gian; 5 thẻ: Tổng quan lớp, Chi tiết từng bé, Điểm theo trò, Nhật ký, Học sinh & lớp (xếp lớp cho bé). Chưa nối Sheet thì bấm "Xem dữ liệu mẫu".

### Cài Google Sheet (một lần)

1. Tạo một Google Sheet mới → **Tiện ích mở rộng → Apps Script**.
2. Xoá mã có sẵn, dán toàn bộ `apps-script/Code.gs`, bấm Lưu.
3. Chọn hàm **caiDat** → **Chạy** → cho phép quyền. Sheet có 4 trang: Sự kiện, Học sinh, Cài đặt (mật khẩu giáo viên ở B1), Bảng điểm.
4. **Triển khai → Tùy chọn triển khai mới → Ứng dụng web**; Thực thi với tư cách: *Tôi*; Người có quyền truy cập: *Bất kỳ ai* → Triển khai → sao chép link `/exec`.
5. Mở `assets/lc-track.js` trên GitHub, bấm bút chì, dán link vào dòng `var API = "";` (giữa hai dấu ngoặc kép) → Commit.

### Khi thêm hoặc thay trang bài học

Trang mới cần gắn dòng ghi điểm. Chạy `python3 tools/them-theo-doi.py` (hoặc gửi trang cho Claude làm hộ). Trò mới (không có trong danh sách của tệp này) cần thêm tên vào bảng `VOCAB` của tệp.

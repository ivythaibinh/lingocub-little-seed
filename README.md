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
| 1 | Greetings · Chào hỏi | chờ gói | Chào thầy cô & bạn bè / Chào người thân | Hello! · Goodbye, Kitten! | Cánh cửa bí mật · Một ngày của bé · Tìm bạn sinh đôi · Lễ phép hay chưa? | — |
| 2 | Name & Age · Tên và tuổi | chờ gói | Hỏi tên / Hỏi tuổi | What's your name? · How old are you? | Xe tuần lộc chở quà · Tiệm bánh của Bunny · Phiên dịch viên nhí | — |
| 3 | My Family · Gia đình | chờ gói | Bố mẹ, ông bà / Anh chị em | I Love My Family · This Is My Family | Chụp ảnh nhà Leo · Mời cơm nhà Buffy · Tết đoàn viên nhà Xiaobao | ✓ trang riêng |
| 4 | My Body · Cơ thể | chờ gói | Tay, chân, đầu, to, nhỏ / Mắt, mũi, miệng, tai | Whose Mouth Is Big? · I Love My Daddy | Ai là Impostor? · Tắm cho gấu bông · Họa sĩ nhí | ✓ trang riêng |
| 5 | Feelings · Cảm xúc | chờ gói | Vui, buồn, giận, buồn ngủ / Mệt, sợ, đói, khát | Teddy's Day | Hôm nay con thế nào? · Teddy sao thế? · Giúp bạn vui lên | — |
| 6 | My School · Trường học | chờ gói | Sách, cặp, this / that / these / those / Bút, bút chì, tẩy, thước | What is this? · Surprise, Teacher! | Ai là Impostor? · Soạn cặp giúp Buffy · Bạn mới trong lớp | ✓ trang riêng |
| 7 | My Home · Đồ đạc trong nhà | chờ gói | Bàn, ghế, trên, dưới / Sofa, tivi, giường | Where's the school bag? | Dọn nhà mới · Giấu đồ cùng Bunny · Tìm đồ giúp bạn | ✓ trang riêng |
| 8 | Animals & Actions · Động vật & hành động | ✓ | Chó, mèo, cá, chim, thỏ, chuột / Chạy, nhảy, bơi, bay | Who can? · My dog can run | Bóng đen bí ẩn · Đây là ai? · Vượt chướng ngại | ✓ trang riêng |
| 9 | Food & Drink · Đồ ăn & đồ uống | chờ gói | Pizza, cơm, táo, chuối / Sữa, nước · ăn, uống | I Like Fish · What do you like? | Hộp cơm bí mật · Nhà hàng phiên dịch | ✓ trong Practice |
| 10 | Weather · Thời tiết | chờ gói | Nắng, mưa, gió, âm u, tuyết / Nóng, lạnh và miêu tả thời tiết | How's the Weather? · Weather Forecast | Cửa sổ thời tiết · Hôm nay trời thế nào? · Bản tin thời tiết | ✓ trong Practice |
| 11 | Colors · Màu sắc | chờ gói | Đỏ, xanh dương, vàng, xanh lá / Đen, trắng, cam, hồng, tím | What Color Is This? · What Do You Have? | Hộp sơn bí mật · Hộp quà nhiều màu · Xưởng sơn của Bunny | ✓ trong Practice |
| 12 | Counting · Số đếm | chờ gói | Đếm người và con vật: 个, 只, 两 / Đếm đồ vật: 个 | My Family · On the Hill | Rương báu đếm số · Cửa hàng của Bunny | ✓ trong Practice |

Ở Unit 9–12, mục cuối trong web Practice trước đây ghi "Thực hành" nay đổi thành **Show and Tell**.

## Cấu trúc thư mục

```
index.html              ← trang chủ 12 Unit
assets/                 ← hình Leo, Bunny, Buffy, Xiaobao
unit-N/
  index.html            ← trang Unit N (4 mục)
  warm-up/              ← index.html + videos/ (khi có)
  vocab-bai-1/index.html
  vocab-bai-2/index.html
  story/index.html
  practice/index.html
  show-and-tell/index.html   (Unit 3, 4, 6, 7, 8)
```

## Thêm Warm-up cho một Unit

Đặt thư mục warm-up (gồm `index.html` và `videos/`) vào `unit-N/warm-up/`. Trong `unit-N/index.html`, thẻ Warm-up đang hiện "Sắp có": thay bằng nút `<a class="go" href="#warm-up" data-key="warm-up"><i></i>Vào hát</a>` và thêm dòng `"warm-up": { url: "warm-up/", title: "1 · Warm-up: Khám phá chủ đề" },` vào khối `LINKS`. (Gửi gói warm-up cho Claude để làm hộ.)

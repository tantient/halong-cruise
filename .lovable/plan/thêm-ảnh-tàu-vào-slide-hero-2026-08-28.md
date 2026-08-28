# Thêm ảnh tàu vào slide hero

Giữ nguyên 4 slide hiện tại và bổ sung các ảnh ngoại thất tàu vào cuối danh sách slide chạy trên trang chủ.

## Danh sách slide sau khi cập nhật

1. chronos-slide-1.webp (giữ)
2. chronos-slide-2.webp (giữ)
3. chronos-slide-3.webp (giữ)
4. chronos-slide-4.webp (giữ)
5. chronos-exterior-01-v2.webp — góc trên cao hoàng hôn, đã in CHRONOS CRUISE
6. chronos-exterior-02-v2.webp — toàn cảnh vịnh hoàng hôn, đã in CHRONOS CRUISE
7. chronos-exterior-07.webp — ảnh mũi tàu bạn gửi, đã in CHRONOS CRUISE
8. chronos-exterior-05.webp — chính diện đuôi tàu

Ba ảnh exterior-03, -04, -06 để lại cho gallery vì góc chụp không phù hợp làm ảnh nền toàn màn hình.

## Thay đổi kỹ thuật

- `src/components/landing/Hero.tsx`: thêm import 4 asset exterior nêu trên và nối vào mảng `SLIDES` với `alt` tiếng Anh mô tả từng góc chụp.
- Hai file `chronos-exterior-01-v2.webp` và `-02-v2.webp` hiện nặng ~1.8 MB mỗi file. Nén lại về WebP quality ~82, chiều rộng tối đa 1920px để hero không kéo chậm trang; các trang khác đang dùng chung file nên vẫn nhận bản nhẹ hơn.
- `src/components/landing/HeroMedia.tsx`: giữ nguyên logic; slide đầu vẫn eager + fetchPriority cao, các slide còn lại eager như hiện tại để tránh lỗi Safari đã gặp trước đó.
- Không đổi thời gian chuyển slide (7000ms) trừ khi bạn muốn khác.

## Kiểm tra

- Build sạch.
- Chụp màn hình trang chủ và chạy qua toàn bộ slide để xác nhận cả 8 ảnh hiển thị, không ảnh nào vỡ.

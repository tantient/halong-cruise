# Thêm ảnh du thuyền mới + in tên "CHRONOS CRUISE" lên mạn tàu

## Kết quả kiểm tra ảnh bạn gửi

Ảnh bạn upload (góc mũi tàu, chụp ngang mặt nước, trời xanh) **chưa có trong kho ảnh** của web. Sáu ảnh ngoại thất hiện tại là các góc khác hẳn:

- `chronos-exterior-01`: góc trên cao, hoàng hôn — chữ trên mạn đọc là "DENDRO GOLD"
- `chronos-exterior-02`: toàn cảnh vịnh lúc hoàng hôn — chữ mờ, sai tên
- `chronos-exterior-05`: chính diện đuôi tàu, hồ bơi — chữ "CHRONOS" (đúng)
- Ba ảnh còn lại: các góc ngoại thất khác

Ảnh mới cũng đang in sai tên: "DENDRO CHRONOS".

## Việc sẽ làm

1. Chỉnh sửa ảnh upload bằng AI: thay dòng chữ trên mạn tàu thành **CHRONOS CRUISE**, giữ nguyên phông chữ kiểu chữ in mảnh, màu và vị trí trên thân tàu, không đổi bố cục hay ánh sáng ảnh.
2. Lưu thành asset mới `chronos-exterior-07.webp` (1280×720) trong thư mục ảnh ngoại thất.
3. Thêm vào dữ liệu gallery ở nhóm "Cruise exterior" để ảnh xuất hiện trong trang Gallery.

## Đề xuất thêm (chờ bạn xác nhận)

Hai ảnh `chronos-exterior-01` và `chronos-exterior-02` đang in tên tàu khác ("DENDRO GOLD" / chữ sai) — nên sửa luôn thành CHRONOS CRUISE cho đồng bộ thương hiệu. Nếu bạn đồng ý, mình xử lý cả hai trong cùng lượt.

## Ghi chú kỹ thuật

- Dùng công cụ chỉnh sửa ảnh AI trên ảnh gốc (không tạo ảnh mới) để giữ nguyên con tàu.
- Ảnh lưu dạng file trong `src/assets/gallery/`, import ES6 như các ảnh hiện có trong `gallery-data.ts`.
- Không đụng tới logic, chỉ thêm asset và một dòng dữ liệu gallery.

# Chỉnh lại chữ trên thân tàu cho thẳng theo thân

## Vấn đề
Chữ CHRONOS CRUISE hiện đang nghiêng lệch so với đường thân tàu, nên nhìn như dán lên chứ không giống chữ sơn trên thân.

## Sẽ làm gì
1. Lấy lại ảnh gốc thân tàu sạch (không chữ) đã tạo trước đó.
2. Đo đúng đường thân tàu ở vùng đặt chữ (mép trên và mép dưới của dải thân trắng), rồi đặt chữ theo đúng góc nghiêng và độ thu xa của thân tàu — chữ nhỏ dần về phía mũi tàu, nằm song song với đường thân, giữ cỡ nhỏ như đã chọn.
3. Xuất 2–3 phương án căn chữ để bạn xem trước và chọn.
4. Sau khi bạn chọn: tạo lại bản buổi tối (tàu sáng đèn) từ đúng ảnh đó, để chữ hai bản khớp nhau.
5. Thay thế hai ảnh tàu đang dùng trên website bằng bản mới. Mọi vị trí đang dùng ảnh này (trang chủ, hải trình, trang giới thiệu tàu, thư viện ảnh) tự động cập nhật, không cần sửa gì thêm.
6. Kiểm tra lại trang chủ ở các trạng thái sáng/trưa/chiều/đêm, tiếng Anh và tiếng Việt, trên máy tính và điện thoại.

## Không thay đổi
- Bố cục, chữ tiêu đề, logo, menu, màu sắc, nội dung.
- Cấu trúc dữ liệu, đường dẫn trang, SEO.
- Ảnh ngoại thất cũ vẫn được giữ trong kho, chỉ không hiển thị.

## Ghi chú kỹ thuật
- Ghép chữ bằng logo chính thức `src/assets/logo/chronos-wordmark.svg` (tô màu vàng), biến đổi phối cảnh bằng PIL với quad đích lấy từ đường thân tàu thực tế thay vì ước lượng như lần trước.
- Xuất WebP 1376×768, upload ghi đè `chronos/exterior/chronos-exterior-hero-v3.webp` và `...-v3-night.webp` trong bucket `ship-media`, nên không phát sinh bản ghi ảnh mới và không cần đổi liên kết trong `entity_media`.

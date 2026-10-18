# Thiết kế lại Sales Presentation Chronos Cruise (bản 3)

Giữ nguyên nội dung 49 trang, làm lại toàn bộ bố cục cho hiện đại, sang trọng như file mẫu Grand Pioneers.

## Hướng thiết kế
- Khổ ngang 16:9 (như slide trình chiếu), không phải khổ dọc tài liệu.
- Ảnh tràn viền (full-bleed) là chủ đạo: mỗi trang có ít nhất một ảnh lớn chiếm 50–100% trang.
- Chữ ít, lớn, thoáng: tiêu đề serif thanh lịch cỡ lớn, nội dung sans gọn, nhiều khoảng trắng.
- Màu thương hiệu: nền ivory / xanh đêm đậm, điểm nhấn vàng đồng; logo Chronos vector ở góc mỗi trang.
- Số thứ tự phần lớn (01, 02...) làm điểm nhấn đồ hoạ.

## Các kiểu trang (luân phiên, tránh lặp nhàm)
1. Trang mở phần: ảnh tràn toàn trang, lớp phủ nhẹ, tên phần + số lớn.
2. Chia đôi: ảnh lớn một bên, chữ một bên (đổi trái/phải xen kẽ).
3. Lưới ảnh 3–4 ô kiểu tạp chí cho tiện ích, nhà hàng, bar.
4. Trang hạng phòng: ảnh lớn + thẻ thông số (diện tích, sức chứa, giường, view) dạng biểu tượng.
5. Bảng so sánh 5 hạng Suite trình bày dạng thẻ, không phải bảng kẻ ô.
6. Lịch trình dạng dòng thời gian (timeline) theo giờ, kèm ảnh.
7. Trang số liệu: con số lớn (44 suite, 5 hạng, 19 không gian...).
8. Trang kết: ảnh toàn cảnh tàu trên vịnh + liên hệ, WhatsApp/Zalo, website.

## Quy tắc
- Chỉ dùng ảnh thật của tàu đã có; ảnh toàn cảnh tàu giữ làm bìa.
- Không bịa số liệu; mục chưa có dữ liệu ghi "liên hệ để biết thêm".
- Kiểm tra từng trang: không chồng chữ, không cắt chữ, ảnh không vỡ.

## Kết quả
- File mới: Chronos_Cruise_Sales_Presentation_v3.pdf (giữ bản cũ).

## Kỹ thuật
- Dựng bằng HTML/CSS (khổ 1920×1080) render ra PDF qua Chromium để có bố cục linh hoạt, font Google (Cormorant + Manrope có hỗ trợ tiếng Việt).
- Ảnh lấy từ thư viện ảnh dự án, nén vừa đủ để file < 40MB.
- Render từng trang ra ảnh để QA trước khi giao.

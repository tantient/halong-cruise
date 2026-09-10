# Hero raw-image rendering correction

## Thay đổi
- Tắt hoàn toàn lớp phủ toàn khung trên Hero mở đầu.
- Tắt toàn bộ xử lý màu theo thời gian trên ảnh Hero: ảnh/video dùng `opacity: 1`, `filter: none`, không backdrop-filter hoặc blend mode.
- Giữ nguyên kích thước, bố cục, chữ, nội dung, chuyển động ảnh và dữ liệu hiện tại.
- Không thay đổi các chapter khác hoặc các trang khác.

## Chi tiết kỹ thuật
- Thêm chế độ render ảnh nguyên bản vào bộ hiển thị media dùng chung, nhưng chỉ bật cho Hero mở đầu.
- Hero không render scrim và không nhận biến lọc Morning / Day / Golden / Night.
- Không thêm gradient đọc chữ trong lần sửa này; kiểm tra ảnh gốc trước đúng theo yêu cầu.

## Kiểm tra
- Audit DOM/CSS sau render để xác nhận ảnh Hero có opacity 1, filter none, backdrop-filter none, mix-blend-mode normal.
- Xác nhận không còn overlay/gradient/pseudo-element phủ ảnh Hero ở cả bốn trạng thái thời gian.
- Kiểm tra desktop/mobile, EN/VI, ảnh tải đúng, không lỗi màn hình hoặc tràn ngang.

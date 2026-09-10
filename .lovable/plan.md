# Vì sao chân trang bạn thấy khác nhau

## Kết quả kiểm tra thực tế

Tôi vừa mở trực tiếp chronoscruise.com bằng trình duyệt sạch, cả chế độ sáng và chế độ tối:

- Logo chân trang có đầy đủ trong cả hai chế độ, màu mực đậm, hiện rõ.
- Nền trang là màu trắng ngà sáng, giống hệt khung xem thử.
- Nút chuyển chế độ hiển thị hình mặt trăng, đúng như bản xem thử.
- Chế độ tối của máy không làm trang đổi màu; trang luôn ở bảng màu sáng đã duyệt.

Nghĩa là bản đang chạy trên chronoscruise.com giống bản xem thử. Ảnh bạn gửi (nền kem, nút mặt trời, mất logo chân trang) là một **bản cũ còn lưu trong trình duyệt của bạn** — đúng vấn đề bộ đệm đã gặp trước đây. Đó cũng là lý do cửa sổ ẩn danh luôn hiện đúng.

Trang thật hiện đã trả về đúng thiết lập "không lưu bộ đệm trang", nên sau một lần tải mới là dứt điểm.

## Đề xuất

Không sửa gì về màu sắc hay logo — vì bản đang chạy đã đúng. Việc cần làm là ép bản cũ trong trình duyệt bạn nhả ra, và giảm khả năng lặp lại:

1. Bạn tải lại trang bằng cách nhấn giữ Ctrl (Windows) hoặc Cmd + Shift (Mac) rồi bấm tải lại một lần, để trình duyệt bỏ bản cũ.
2. Nếu vẫn còn, tôi sẽ xuất bản lại một lần để đẩy phiên bản mới nhất, buộc mọi trình duyệt tự nhận bản mới nhờ cơ chế kiểm tra phiên bản đã có sẵn.

## Nếu bạn muốn chắc chắn hơn nữa

Tôi có thể bổ sung một lớp bảo hiểm nhỏ, không đổi giao diện:

- Kiểm tra phiên bản ngay khi trang vừa mở, chứ không chỉ khi quay lại tab, để bản cũ tự làm mới trong vài giây.
- Logo chân trang dùng tông cố định cho nền sáng, để dù về sau có bật chế độ tối cũng không bao giờ bị chìm.

## Chi tiết kỹ thuật

- Đã xác nhận trên bản live: `cache-control: no-cache, must-revalidate, max-age=0` cho tài liệu HTML.
- DOM chân trang live có `[role=img]` với `color: oklch(0.18 0.018 85)`, 4 `svg`; `document.documentElement.className` rỗng ở cả hai `color_scheme`, nên `dark:` không kích hoạt.
- Lớp bảo hiểm (tùy chọn): trong `AutoRefreshOnNewDeployment` (`src/routes/__root.tsx`) gọi `checkVersion()` một lần lúc mount, cạnh các listener `pageshow`/`visibilitychange` hiện có.
- Lớp bảo hiểm (tùy chọn): `src/components/landing/Footer.tsx` đổi `tone="auto"` sang `tone="onLight"`.
- Không đổi bố cục, nội dung, dữ liệu, logo gốc, khoảng cách header hay Time-of-Day trang chủ.

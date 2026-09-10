# Chân trang khác nhau giữa xem thử và trang thật

## Chuyện gì đang xảy ra

Hai ảnh không phải hai phiên bản website khác nhau. Chúng là cùng một trang, nhưng đang ở hai chế độ hiển thị:

- Khung xem thử: chế độ sáng (nút ở đầu trang là hình mặt trăng).
- Trang thật của bạn: chế độ tối (nút ở đầu trang là hình mặt trời).

Ở chế độ tối, logo chân trang được đặt sang màu trắng ngà. Nhưng nền của trang đã được chỉnh sang bảng màu sáng sang trọng đã duyệt, nên logo trắng nằm trên nền kem gần như biến mất. Đó là lý do "logo đâu" và màu sắc trông lệch nhẹ.

## Đề xuất

Bỏ chế độ tối, để website luôn hiển thị đúng bảng màu sáng sang trọng đã duyệt:

- Bỏ nút chuyển sáng/tối ở đầu trang và trong menu điện thoại.
- Trang luôn chạy chế độ sáng, không phụ thuộc cài đặt máy của khách.
- Logo chân trang cố định màu mực đậm, luôn rõ.

Kết quả: mọi khách, mọi máy đều thấy giống hệt khung xem thử của bạn.

Nếu bạn muốn giữ nút sáng/tối thì cần một việc lớn hơn: làm lại toàn bộ bảng màu cho chế độ tối để nền thật sự tối. Nói mình biết nếu bạn muốn hướng đó.

## Việc sẽ làm

- Chân trang: logo dùng tông cố định trên nền sáng thay vì tự đổi theo chế độ.
- Bỏ nút chuyển chế độ khỏi đầu trang (cả bản máy tính và bản điện thoại).
- Ép giao diện luôn ở chế độ sáng trong phần khởi tạo chủ đề, không đọc cài đặt hệ thống.
- Kiểm tra lại chân trang, đầu trang và các trang chính bằng cả tiếng Anh và tiếng Việt, trên máy tính và điện thoại, ở cả hai cài đặt hệ thống sáng/tối.
- Không đổi bố cục, nội dung, dữ liệu, hình ảnh hay logo gốc.

Sau khi xong, bạn cần bấm xuất bản để trang thật cập nhật.

## Chi tiết kỹ thuật

- `src/components/landing/Footer.tsx`: `tone="auto"` → `tone="onLight"`.
- `src/components/theme-provider.tsx` + `themeInitScript`: khóa `light`, bỏ đọc `prefers-color-scheme` và giá trị `dark` đã lưu trong localStorage.
- `src/components/landing/Header.tsx`: bỏ `ThemeToggle` ở nav desktop và menu mobile.
- Giữ nguyên `src/assets/logo/*.svg`, khoảng cách header, và Time-of-Day của trang chủ.

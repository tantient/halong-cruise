# Kế hoạch: Đưa bộ logo chính thức của tàu Chronos vào website

## Bộ logo trong file CHRONOS.zip

- 3 dạng khóa logo (mỗi dạng 4 biến thể màu): **đầy đủ** (biểu tượng + CHRONOS CRUISE + dòng Ha Long Bay · Lan Ha Bay), **chỉ biểu tượng** (file `.1`), **chỉ chữ** (file `.2`).
- 4 biến thể màu: **1 = vàng**, **2 = trắng**, **3 = đen**, **4 = vàng** (gần giống bản 1, chênh màu không đáng kể).
- 2 nhóm file: `TÁCH NỀN` (nền trong suốt — dùng cho web) và `NỀN TRẮNG_ĐEN` (nền đặc — dùng cho in/trình bày), kèm 1 file gốc `.ai` cho in ấn.
- Website hiện đang dùng logo SVG vẽ lại (`src/assets/logo/`) cho header/footer; database đã có sẵn chỗ lưu logo theo tàu (logo sáng / logo tối / dạng dấu) nhưng chưa có ảnh thật.

## Việc sẽ làm

1. **Đưa bộ logo nền trong suốt vào thư viện media của tàu** (không copy file vào code): upload các PNG vàng/trắng/đen ở cả 3 dạng (đầy đủ, biểu tượng, chữ) vào kho lưu trữ của tàu, tạo bản ghi media trong database — sau này đổi logo từ CMS không cần sửa code.
2. **Gán logo chính thức cho tàu Chronos**: logo sáng = bản trắng, logo tối = bản đen (hoặc vàng), dấu biểu tượng = bản vàng. Các trường này đã tự chảy vào dữ liệu SEO (Organization logo).
3. **Favicon + biểu tượng cảm ứng**: tạo lại `favicon` và `apple-touch-icon` từ biểu tượng chính thức (bản vàng trên nền tối hoặc nền trong suốt, chọn bản đẹp nhất khi xem thực tế).
4. **Header/Footer**: giữ nguyên logo SVG hiện tại nếu kiểm tra thấy khớp với artwork chính thức (SVG nét hơn PNG ở mọi kích thước và đổi màu theo nền được). Nếu SVG lệch artwork, vẽ lại SVG theo file chính thức. Không đổi layout header/footer.
5. File `.ai` và nhóm nền trắng/đen: chỉ lưu bản PNG nền đặc vào thư viện media nếu bạn muốn; mặc định bỏ qua vì web không dùng.

## Kiểm tra sau khi làm

- Header (nền ảnh + nền sáng), footer, trang đăng nhập admin hiển thị logo đúng, nét.
- Tab trình duyệt hiện favicon mới; view-source có logo trong dữ liệu SEO.
- Test desktop + mobile, EN + VI; không ảnh vỡ, không lỗi console.

## Ngoài phạm vi

- Không redesign header/footer, không đổi màu sắc/token website, không đụng các trang nội dung.
- Không upload file `.ai` vào hệ thống (file in ấn, web không dùng).

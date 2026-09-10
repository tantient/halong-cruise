# Kế hoạch: Chuẩn hóa bộ logo chính thức của tàu Chronos

## Bộ logo trong file CHRONOS.zip

- 3 dạng khóa logo, mỗi dạng 4 biến thể màu: **full logo** (biểu tượng + CHRONOS CRUISE + dòng Ha Long Bay · Lan Ha Bay), **symbol/mark** (file `.1`), **wordmark** (file `.2`).
- 4 biến thể màu: bản 1 và bản 4 đều là **vàng** (chênh màu không đáng kể — chọn 1 bản làm chuẩn), bản 2 **trắng**, bản 3 **đen**.
- 2 nhóm file: `TÁCH NỀN` (nền trong suốt — dùng cho web) và `NỀN TRẮNG_ĐEN` (nền đặc — dùng cho in/trình bày), kèm file gốc `.ai` cho in ấn.
- Website hiện dùng logo SVG vector trong code cho header/footer; database đã có sẵn 3 chỗ lưu logo theo tàu (sáng / tối / dạng dấu) nhưng chưa có ảnh thật.

## Việc sẽ làm

1. **Chuẩn hóa 9 asset PNG nền trong suốt** vào thư viện media của tàu: full logo / symbol / wordmark × vàng / trắng / đen. Chỉ một bản vàng duy nhất (biến thể 1); không upload cả biến thể 4 gần giống. Đặt tên theo dạng + màu, gắn nhóm `brand` để lọc trong CMS. Không copy file vào code.
2. **Gán logo theo ngữ cảnh nền, cố định cho Chronos**:
   - nền sáng → logo đen,
   - nền tối / ảnh → logo trắng,
   - symbol/mark thương hiệu → vàng.
   Vàng chỉ dùng ở vị trí đã chỉ định; tuyệt đối không tự thay logo đen bằng vàng.
3. **SEO**: logo chính thức tự chảy vào dữ liệu Organization qua trường branding — không sửa thêm code SEO.
4. **Favicon + biểu tượng cảm ứng**: tạo lại từ symbol/mark chính thức, xem thực tế ở cỡ nhỏ rồi chọn bản vàng hoặc trắng cho dễ đọc nhất.
5. **Header/Footer**: so sánh SVG hiện tại với artwork chính thức trước. Nếu khớp thì giữ nguyên (vector nét hơn PNG, tự đổi màu theo nền). Nếu lệch, báo lại điểm lệch trước khi sửa — không tự thay.
6. **Không upload file `.ai`** và không upload nhóm nền trắng/đen (chỉ dùng cho in ấn).

## Kiểm tra sau khi làm

- 9 asset xuất hiện đúng trong thư viện media của tàu, tải được ảnh, không lỗi quyền.
- Header (nền ảnh + nền sáng), footer, trang đăng nhập quản trị hiển thị logo đúng và nét.
- Favicon mới hiện trên tab trình duyệt; dữ liệu SEO chứa logo chính thức.
- Test desktop + mobile, EN + VI; không ảnh vỡ, không lỗi console.

## Ngoài phạm vi

- Không redesign layout header/footer hay bất kỳ trang nào.
- Không đổi bộ màu / token màu của website.
- Không chỉnh sửa nội dung trang.

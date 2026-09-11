# Homepage vertical rhythm refinement

## Mục tiêu
Làm homepage gọn, liền mạch và có nhịp hơn bằng cách giảm mạnh khoảng trắng dọc, nhưng giữ nguyên typography, nội dung, kích thước ảnh chủ đạo, màu sắc, motion và art direction hiện tại.

## Phạm vi thực hiện
- Audit và chỉnh đồng bộ toàn chuỗi: Arrival → Journey → Suites → Life on Chronos → Offers → Signature → Final.
- Giảm padding section thường về khoảng 48–72px desktop và 40–56px mobile; chỉ giữ khoảng nghỉ lớn ở hai chương toàn màn hình.
- Giảm các margin/gap nội bộ đang quá rộng: eyebrow–heading, heading–body, body–CTA, heading block–visual, caption và khoảng cách giữa item.
- Loại bỏ hiện tượng double spacing do padding cuối section trước cộng padding đầu section sau.
- Giữ nguyên hero height, Signature/Final cinematic height, bố cục ảnh, nội dung, font, font size/weight/line-height/letter-spacing, màu và animation.
- Riêng Suites: xác nhận layout 4:3 desktop không còn min-height/fixed spacer cũ; không thu nhỏ ảnh.

## Điều chỉnh dự kiến
- Journey: giảm khoảng mở đầu, cuối section, khoảng hai cột và khoảng giữa voyage items.
- Suites: giảm padding ngoài, khoảng heading–content và padding từng cabin row.
- Life: giảm padding ngoài và khoảng heading–full-width image stage.
- Offers: giảm padding ngoài mạnh nhất, giảm khoảng heading–content và padding offer rows.
- Signature/Final: chỉ siết khoảng cách nội dung bên trong; không đổi chiều cao cinematic.
- Arrival: giữ nguyên hero và composition; chỉ giảm khoảng cách chuyển tiếp bằng spacing của Journey, không dịch headline/CTA.

## Kiểm thử và báo cáo
- Đo lại tổng chiều cao trang trước/sau tại desktop 1440px và mobile 390px.
- Đo khoảng cách thực tế giữa nội dung cuối và đầu của từng major section trước/sau.
- Kiểm tra EN/VI, desktop/mobile, overflow, ảnh lỗi và console errors.
- Xác nhận không thay đổi nội dung, typography, CLS/font/image-loading hoặc backend/database.

## Baseline đã đo
- Desktop 1440px: tổng chiều cao hiện tại 10,799px.
- Mobile 390px: tổng chiều cao hiện tại 11,581px.
- Padding section hiện cao nhất: Journey 128/112px và Offers 112/128px trên desktop; đây là hai điểm sẽ được siết rõ nhất.

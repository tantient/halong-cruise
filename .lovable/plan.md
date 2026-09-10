# Ảnh ngoại thất tàu mới — chỉnh lại chữ trên thân tàu

## Vấn đề
Ảnh bạn gửi rất đẹp về bố cục (tàu giữa vịnh Lan Hạ, ánh sáng hoàng hôn), nhưng dòng chữ vàng "CHRONOS CRUISE" trên thân tàu quá lớn, méo và không đúng phối cảnh, nên trông như ghép.

## Việc sẽ làm

1. **Chỉnh chữ trên thân tàu**
   - Dùng công cụ chỉnh ảnh có kiểm soát vùng (chỉ tác động đúng dải thân tàu, giữ nguyên trời, núi, nước, kiến trúc tàu).
   - Xoá dòng chữ hiện tại và dòng phản chiếu bị méo dưới nước.
   - Vẽ lại "CHRONOS CRUISE" nhỏ hơn nhiều, đúng độ nghiêng theo thân tàu, chữ vàng mảnh, sang trọng, kèm phản chiếu nhẹ tự nhiên.
   - Làm 2–3 phương án kích thước để bạn chọn trước khi dùng chính thức.

2. **Tạo bản buổi tối**
   - Từ ảnh đã chỉnh, tạo thêm phiên bản ánh sáng đêm/hoàng hôn muộn (đèn tàu sáng, nước tối hơn) cho trạng thái Đêm của trang chủ.

3. **Thay toàn bộ ảnh ngoại thất**
   - Đưa 2 ảnh mới vào kho ảnh của trang (bản ngày + bản đêm).
   - Chuyển mọi vị trí đang dùng ảnh ngoại thất tàu sang ảnh mới: banner trang chủ (các trạng thái thời gian), trang Con tàu, thẻ hành trình, thư viện ảnh, ảnh chia sẻ mạng xã hội.
   - Ảnh ngoại thất cũ giữ lại trong kho (không xoá) để có thể quay lại nếu cần.

4. **Kiểm tra**
   - Xem lại Tiếng Anh/Tiếng Việt, máy tính và điện thoại, các trạng thái thời gian của trang chủ; kiểm tra ảnh không bị cắt mất chữ trên thân tàu ở khung hẹp.

## Ghi chú kỹ thuật
- Chỉnh ảnh bằng `imagegen--edit_image` (mode `inpaint` với mask giới hạn dải thân tàu để giữ nguyên phần còn lại).
- Ảnh đầu ra chuyển sang WebP, upload vào bucket `ship-media` theo `chronos/exterior/`, tạo record `media` mới.
- Cập nhật liên kết `entity_media` cho các section/venue/itinerary/gallery đang trỏ tới ảnh ngoại thất cũ; giữ nguyên schema, route, SEO, layout và Time-of-Day engine.
- Không thay đổi logo, header, typography hay nội dung chữ.

## Lưu ý
Chỉnh chữ trên ảnh render bằng AI có thể không hoàn hảo ngay lần đầu — nếu 2–3 phương án vẫn chưa đạt, phương án chắc chắn là để thân tàu trắng trơn không chữ (thương hiệu đã có ở logo trên đầu trang).

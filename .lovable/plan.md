# Chronos — Global Bright Luxury Visual Correction

## Mục tiêu

Hiệu chỉnh hệ thống hình ảnh dùng chung để toàn bộ website công khai có baseline sáng, trong, giàu sức sống và cao cấp; giữ nguyên cấu trúc trang, nội dung, dữ liệu, CMS, logo SVG và breakpoint header vừa duyệt.

## Nguyên nhân đã xác định

- Theme toàn cục hiện tự chuyển sang dark theo cài đặt hệ điều hành, khiến mọi trang công khai đổi sang bảng màu tối dù đang là ban ngày.
- Homepage `AmbientSurface` dùng nền/wash toàn trang; trạng thái Night hiện thay đổi mạnh nền, chữ và ảnh thay vì chỉ tạo ambience nhẹ.
- `AmbientStage` áp filter ảnh theo giờ và scrim toàn khung ở nhiều chapter; Night còn giảm brightness.
- `hero-local-scrim` phủ hai gradient toàn ảnh với vùng tối tới 76%; nhiều hero dùng chung utility này.
- Nhiều body/meta text dùng opacity thấp; token nền warm/cream hiện gần nhau nên section dễ muddy và thiếu phân tách.
- Experiences/The Ship dùng shared `HeroMedia`, `PanoramaBand`, `SectionHeading`, nên cần sửa tại primitive chung thay vì patch từng trang.

## Thực hiện

### 1. Bright baseline toàn cục

- Giữ light theme là mặc định ổn định, không tự bật dark chỉ vì thiết bị đang dùng dark mode.
- Tinh chỉnh semantic light tokens thành warm white/luminous neutral, charcoal rõ và neutral body dễ đọc.
- Giữ cream/warm làm nhịp section có chủ đích, không phủ beige toàn trang.
- Tăng contrast hệ thống cho body, meta và heading; gold chỉ còn vai trò accent.

### 2. Shared photography treatment

- Giảm `hero-local-scrim` thành gradient cục bộ chủ yếu quanh vùng chữ, để sky/water/architecture giữ ánh sáng và màu tự nhiên.
- Không thêm desaturation; loại bỏ việc giảm brightness mặc định.
- Giữ text shadow nhẹ và scrim có kiểm soát cho chữ trắng trên ảnh.
- Recalibrate shared Experiences/The Ship primitives để Dining, Sundeck, Spa và kiến trúc sáng rõ; Entertainment chỉ giữ dark treatment cục bộ và giàu tương phản.

### 3. Homepage Time-of-Day

- Giữ Morning, Day, Golden, Night, múi giờ Asia/Ho_Chi_Minh và preview override.
- Giữ nguyên 5 chapters và media-slot architecture.
- Giới hạn khác biệt giữa các state ở mức ambience nhẹ: nền/wash, accent, localized scrim và media selection khi có.
- Morning airy, Day sáng/rõ nhất, Golden ấm nhưng không vàng/nâu, Night sáng bằng đèn nội thất và phản chiếu thay vì dim toàn trang.
- Cô lập hoàn toàn ambient variables/filter trong Homepage; các trang khác luôn dùng bright baseline ổn định.

### 4. Kiểm thử hình ảnh và kỹ thuật

- Homepage: 4 time states trên desktop, laptop và mobile; EN/VI.
- Public pages: Experiences, Dining, Sundeck & Pool, Spa, Entertainment, The Ship, Cabins, Cabin Detail, Voyage Detail, Gallery và Contact; EN/VI trên desktop/laptop/mobile.
- Kiểm tra computed styles cho opacity/filter/brightness/saturation/overlay, contrast chữ, header và CTA.
- Kiểm tra ảnh hỏng, console error, horizontal overflow, reduced motion và route regression.
- Không thay logo SVG, header spacing/breakpoints, layout, nội dung, dữ liệu hoặc chức năng.

## Chi tiết kỹ thuật

- Ưu tiên sửa `src/styles.css`, theme initialization và shared ambient/media primitives.
- Chỉ chỉnh page-level class khi đó là treatment riêng có chủ đích và không thể giải quyết an toàn ở shared layer.
- Không thay đổi database, routes, loaders, SEO, CMS hay component hierarchy.

## Báo cáo cuối

- Liệt kê nguyên nhân, tokens/classes, overlays/filters đã sửa.
- Nêu rõ cách cô lập Time-of-Day và thay đổi của từng state.
- Báo kết quả Experiences/The Ship, typography, EN/VI và desktop/laptop/mobile.

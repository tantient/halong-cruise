# Chronos Cabins Experience — Refinement

## Mục tiêu
Refine riêng `/cabins` và `/cabins/:slug` thành trải nghiệm **Explore → Compare → Choose**, giữ nguyên backend, dữ liệu, route, SEO, EN/VI và phong cách Heritage.

## Thực hiện
1. **Cabin Explorer trên `/cabins`**
   - Giữ hero hiện tại nhưng chỉnh hierarchy/spacing vừa đủ.
   - Thay catalogue card dài bằng một stage ảnh lớn và selector cabin data-driven.
   - Khi chọn cabin, cập nhật ảnh, tên, mô tả ngắn, specs có dữ liệu, tối đa 3 highlights và CTA xem chi tiết trong cùng stage.
   - Desktop dùng selector cạnh stage; mobile dùng selector ngang, nội dung gọn và không tràn.

2. **Compare Suites**
   - Giữ dialog comparison hiện có và nguồn dữ liệu thật.
   - Cho phép mở compare rõ ràng từ explorer và closing section.
   - Chỉ render các trường tồn tại; tối ưu bố cục mobile, không có bảng tràn ngang.

3. **Closing section `/cabins`**
   - Thay phần catalogue/ghi chú lặp bằng block ngắn “Find Your Suite”.
   - Hai CTA: Compare Suites và Request Recommendation.

4. **Cabin detail `/cabins/:slug`**
   - Sắp lại hierarchy: Hero → Why This Suite → The Space → Key Details → Gallery → Amenities → Compare/Other Suites → Voyages CTA → Final CTA.
   - Chỉ dùng description, highlights, specs, media, amenities và sibling cabins đang có trong database.
   - Không suy đoán cabin–voyage relationship; dùng CTA chung sang Voyages.
   - Gallery/editorial layout tự thích ứng với số lượng và loại ảnh hiện có.

5. **Tính ổn định và accessibility**
   - Không hardcode cabin names, số lượng cabin hay specs.
   - Giữ `prefers-reduced-motion`, keyboard/focus states và semantic controls.
   - Không sửa homepage, Voyages, Services, CMS hay dữ liệu cabin.

## Kiểm thử
- Desktop/mobile cho `/cabins` và mọi cabin detail, cả EN/VI.
- Selector, compare dialog, navigation, CTA, image loading, reduced motion.
- Không console error, không horizontal overflow, không layout shift rõ ràng.
- Smoke test các public routes hiện có để phát hiện regression.
- Xác nhận Zalo tuyển dụng hiển thị `0979 768 969` và link đúng sau thay đổi vừa hoàn tất.

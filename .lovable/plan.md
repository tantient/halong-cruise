# Chronos → nền tảng 8 website du thuyền

## Ý tưởng tổng thể

Một hệ thống duy nhất chạy 8 website. Mỗi tàu là một "hồ sơ tàu" trong hệ thống: tên, logo, màu sắc, phông chữ, mẫu bố cục, ảnh, phòng nghỉ, hải trình, ưu đãi, dịch vụ, tin tuyển dụng, liên hệ.

Khi mở một tên miền (ví dụ `chronoscruise.com`), hệ thống nhận ra đó là tàu nào và hiển thị đúng website của tàu đó — nội dung riêng, giao diện riêng, ảnh riêng, hồ sơ ứng viên gửi về riêng.

Thêm tàu thứ 9 chỉ là: tạo hồ sơ tàu trong trang quản trị → chọn mẫu bố cục + màu/phông → nhập nội dung và tải ảnh → gắn tên miền. Không cần lập trình thêm.

```text
chronoscruise.com   ─┐
tau-b.com           ─┤   một hệ thống    ┌─ hồ sơ tàu + nội dung + ảnh
tau-c.com           ─┼──────────────────►┤─ mẫu bố cục (1 trong 4)
...                 ─┤                   └─ màu / phông / logo
tau-h.com           ─┘
```

## Quyết định đã chốt

- Mỗi tàu có tên miền riêng, tất cả trỏ về cùng hệ thống này.
- Khác biệt giao diện: 4 mẫu bố cục để chọn + bộ màu, phông chữ, logo riêng từng tàu.
- Chỉ bạn (chủ nền tảng) tạo tàu và nhập nội dung; tài khoản riêng cho từng tàu là bước mở rộng sau.
- Nội dung nhập được từ trang quản trị: thông tin cơ bản + ảnh, phòng nghỉ & hải trình, ưu đãi & dịch vụ, tuyển dụng & hồ sơ ứng viên.

## Bốn mẫu bố cục

1. **Heritage** — chính là giao diện Chronos hiện tại: hero ảnh lớn chạy slide, chữ serif, tông ấm.
2. **Editorial** — kiểu tạp chí: ảnh bìa dọc, chữ lớn, chia cột, nhiều khoảng trắng.
3. **Panorama** — hero video/ảnh toàn màn hình, các mục cuộn ngang, tối giản, nền tối.
4. **Grid** — trang chủ dạng ô lưới, xem nhanh phòng và hải trình, phù hợp tàu thiên về đặt phòng.

Mỗi mẫu dùng chung dữ liệu, nên đổi mẫu cho một tàu không mất nội dung.

## Các giai đoạn triển khai

**Giai đoạn 1 — Nền tảng dữ liệu**
Tạo cấu trúc lưu trữ cho tàu và toàn bộ nội dung; chuyển dữ liệu Chronos hiện tại (phòng, hải trình, dịch vụ, ưu đãi, ảnh, tuyển dụng) vào đó. Kết thúc giai đoạn này website Chronos vẫn y như cũ nhưng đã đọc từ hệ thống.

**Giai đoạn 2 — Nhận diện tàu theo tên miền**
Website tự xác định tàu theo tên miền đang mở; trong lúc phát triển có thể xem thử bằng đường dẫn `/xem/<ma-tau>`. Chữ, ảnh, logo, màu, thẻ SEO, sitemap đều theo tàu.

**Giai đoạn 3 — Trang quản trị**
Khu vực đăng nhập cho bạn: danh sách tàu, tạo tàu mới, sửa mọi nội dung, tải ảnh, chọn mẫu bố cục và bộ màu/phông, xem hồ sơ ứng viên của từng tàu.

**Giai đoạn 4 — Ba mẫu bố cục còn lại**
Xây Editorial, Panorama, Grid và cho phép chuyển mẫu bằng một lựa chọn.

**Giai đoạn 5 — Tàu thứ hai thật**
Tạo tàu số 2 từ đầu bằng trang quản trị để kiểm chứng luồng, rồi gắn tên miền. Sau đó lặp cho các tàu còn lại.

## Điều cần chuẩn bị từ bạn

- Danh sách 8 tàu: tên, tên miền dự định.
- Với mỗi tàu: logo, ảnh, nội dung giới thiệu, phòng, hải trình, số điện thoại/email, kênh mạng xã hội.
- Tên miền phải được trỏ về hệ thống này (mình sẽ hướng dẫn từng bước khi tới bước đó).

## Chi tiết kỹ thuật

- **Multi-tenant theo hostname.** Bảng `ships` (slug, domains[], name, contact, socials, theme jsonb, layout enum, logo, seo). Server fn `resolveShip` đọc `getRequestHeader("host")` trong `beforeLoad` của `__root`, cache theo host; fallback `/preview/$shipSlug` cho dev. Tất cả custom domain của 8 tàu connect vào chính project này.
- **Bảng nội dung** khoá theo `ship_id`: `cabins`, `cabin_details`, `itineraries`, `itinerary_days`, `services`, `offers`, `gallery_images`, `job_positions`, và `job_applications` (thêm cột `ship_id`). Mỗi bảng: GRANT `SELECT` cho `anon` (nội dung công khai), full cho `authenticated` admin qua `has_role`, `ALL` cho `service_role`; RLS bật, policy public chỉ đọc hàng `published = true`, policy owner-read cho admin để thấy cả bản nháp.
- **Đọc dữ liệu công khai** bằng server publishable client trong `*.functions.ts` (không dùng admin), gọi từ loader public + `ensureQueryData`/`useSuspenseQuery`. Ghi/quản trị qua `requireSupabaseAuth` + kiểm `has_role(admin)`.
- **Theming.** Token màu/phông đặt trong `src/styles.css` dưới dạng CSS variables; theme của tàu inject bằng thẻ `<style>` trong `head()` của `__root` (ghi đè `--chronos-*`), font Google load động theo cấu hình tàu. Không hardcode màu trong component.
- **Layout templates.** `src/templates/{heritage,editorial,panorama,grid}/` mỗi mẫu export các section component cùng interface; route page chọn mẫu theo `ship.layout`. Refactor `LandingPage`/`CabinsPage`/... hiện tại thành template `heritage` nhận props từ dữ liệu thay vì import file `*-data.ts`.
- **Ảnh** chuyển sang Storage bucket public `ship-media` (đường dẫn `ship-slug/...`), asset Chronos hiện tại upload vào bucket trong bước migrate; component dùng URL thay vì ES import (mất preload asset hashing, bù bằng `loading`/`fetchpriority` và width/height cố định).
- **SEO.** `SITE_URL`/`SITE_NAME` trong `src/lib/seo.ts` trở thành tham số theo tàu; `sitemap[.]xml.ts` và `robots.txt` sinh theo host; canonical/og:url dùng domain của tàu.
- **Quản trị** dưới `src/routes/_authenticated/admin.*`: `ships`, `ships.$id` (tab: cơ bản, giao diện, phòng, hải trình, dịch vụ, ưu đãi, thư viện ảnh, tuyển dụng), `applications` lọc theo tàu.

# Cruise Web Platform — một nền tảng, nhiều thương hiệu du thuyền

Chronos không còn là "website chính rồi copy ra 7 bản". Chronos là **tàu số 1** của một nền tảng: 1 codebase + 1 database + 1 bản triển khai + 1 trang quản trị chung + nhiều tên miền + nhiều thương hiệu. Mục tiêu hiện tại là 8 tàu, nhưng kiến trúc không giới hạn ở con số 8 — thêm tàu thứ 9, 10 chỉ là tạo hồ sơ tàu mới.

```text
Domain
  │
  ▼
resolveShip(hostname)
  │
  ▼
Ship ──┬── Thương hiệu (màu / phông / logo)
       ├── Mẫu bố cục
       ├── Phòng · Hải trình · Dịch vụ · Ưu đãi
       ├── Thư viện ảnh · Trang nội dung · Thứ tự khối trang chủ
       ├── Tuyển dụng · Hồ sơ ứng viên · Khách hỏi giá
       └── SEO · Liên hệ · Mạng xã hội
```

## Quyết định đã chốt

- Mỗi tàu có tên miền riêng, tất cả trỏ về cùng hệ thống này.
- Khác biệt giao diện = mẫu bố cục + bộ thương hiệu riêng. Hai tàu **có thể dùng cùng mẫu** mà vẫn khác hẳn nhau nhờ màu, phông, thứ tự khối trang chủ, cách xử lý ảnh.
- Chỉ bạn (chủ nền tảng) tạo tàu và nhập nội dung. Cấu trúc phân quyền cho từng tàu được chuẩn bị sẵn từ đầu, giao diện phân quyền làm sau.
- Nội dung nhập được từ trang quản trị: thương hiệu + ảnh, phòng nghỉ, hải trình, dịch vụ, ưu đãi, trang nội dung tự do, tuyển dụng + hồ sơ ứng viên, khách hỏi giá.

## Sáu điều chỉnh so với bản thảo đầu

1. **Tên miền tách riêng** — một tàu có thể có domain chính, `www`, domain cũ, domain marketing; mỗi domain một dòng, có cờ "chính".
2. **Bỏ mọi tên gọi "chronos" khỏi phần lõi** — dùng token dùng chung (màu chính, màu nền, phông tiêu đề…); Chronos chỉ là một bộ giá trị nạp vào.
3. **Trang nội dung tự do + thứ tự khối trang chủ** — thêm trang mới (Nhà hàng, Spa, Chính sách…) và bật/tắt, sắp lại thứ tự các khối trang chủ ngay trong quản trị, không cần lập trình.
4. **Lưu khách hỏi giá (leads)** — mọi form liên hệ / hỏi giá / đặt phòng vào cơ sở dữ liệu theo tàu, không chỉ gửi email rồi mất dấu.
5. **Quyền giữ đơn giản** — v1 chỉ hai vai trò `owner` và `admin`, cả hai quản toàn bộ đội tàu (1 tài khoản chính, sau thêm 1–2 nhân sự). Mọi dữ liệu vẫn ghi rõ thuộc tàu nào, nên sau này muốn giao tàu riêng cho từng người thì chỉ thêm bảng phân quyền, không phải chuyển đổi dữ liệu.
6. **Chỉ hoàn thiện một mẫu trước** — Heritage chạy trọn vẹn, Chronos chuyển sang nền tảng, quản trị xong, tàu số 2 chạy được **không sửa code**; sau đó mới xây các mẫu còn lại.

## Nguyên tắc ranh giới

Nền tảng web **không phải PMS**. Web giữ: nội dung marketing, thông tin phòng/hải trình công khai, ưu đãi, khách hỏi giá, tuyển dụng, SEO, ảnh. PMS giữ: tồn phòng, đặt phòng, giá, khách, thanh toán, vận hành. Sau này web lấy tình trạng phòng/giá từ PMS qua API.

## AI: để sau, không chuẩn bị gì trong v1

v1 không có AI: không viết bài tự động, không dịch tự động, không chatbot, không automation. Cũng **không** thêm bảng giọng thương hiệu, không thêm cột "nội dung do máy tạo", không thêm trạng thái phục vụ AI. Khi nào cần AI sẽ bổ sung khi đó. Điều duy nhất giữ lại vì bản thân nó đã đúng: **thao tác nội dung nằm ở lớp service riêng, không nằm trong component giao diện** — quản trị gọi service, mọi service đều kiểm tra tàu và quyền.




## Bốn mẫu bố cục (làm dần)

1. **Heritage** — nền tảng của giao diện Chronos hiện tại: hero ảnh lớn chạy slide, chữ serif, tông ấm.
2. **Editorial** — kiểu tạp chí: ảnh bìa dọc, chữ lớn, chia cột, nhiều khoảng trắng.
3. **Panorama** — hero toàn màn hình, cuộn ngang, tối giản, nền tối.
4. **Grid** — trang chủ dạng ô lưới, xem nhanh phòng và hải trình.

Mẫu chỉ là cấu trúc; nội dung dùng chung nên đổi mẫu không mất dữ liệu.

Phông chữ chọn từ **danh sách cho phép** (đã kiểm tra hỗ trợ tiếng Việt và hiệu năng), không nhập tự do.

## Các giai đoạn

**Giai đoạn 1 — Nền tảng dữ liệu**
Tạo cấu trúc lưu trữ cho tàu, tên miền, thương hiệu, nội dung, ảnh, khách hỏi giá, phân quyền. Chuyển toàn bộ dữ liệu Chronos hiện tại vào đó. Kết thúc giai đoạn: website Chronos trông y như cũ nhưng đã đọc từ hệ thống.

**Giai đoạn 2 — Đổi phần lõi sang token dùng chung**
Thay mọi màu/phông mang tên "chronos" bằng token chung; giao diện Chronos giữ nguyên vì chỉ đổi cách gọi tên.

**Giai đoạn 3 — Nhận diện tàu theo tên miền**
Website xác định tàu theo tên miền; khi phát triển xem thử qua `/preview/<mã-tàu>` (chặn Google lập chỉ mục). Chữ, ảnh, logo, màu, thẻ SEO, sitemap, dữ liệu có cấu trúc đều theo tàu.

**Giai đoạn 4 — Trang quản trị**
Danh sách tàu → mở một tàu → các tab: Tổng quan, Thương hiệu, Trang chủ (thứ tự khối), Phòng, Hải trình, Dịch vụ, Ưu đãi, Thư viện, Trang nội dung, Tuyển dụng, Hồ sơ ứng viên, Khách hỏi giá, SEO, Tên miền, Cài đặt.

**Giai đoạn 5 — Tàu số 2 (kiểm chứng)**
Tạo tàu số 2 hoàn toàn bằng quản trị, dùng cùng mẫu Heritage nhưng bộ thương hiệu và thứ tự khối khác, rồi gắn tên miền. Chạy được mà không sửa một dòng code = kiến trúc đã được kiểm chứng.

**Giai đoạn 6 — Ba mẫu còn lại**
Xây Editorial, Panorama, Grid và cho chuyển mẫu bằng một lựa chọn.

**Giai đoạn 7 — Tàu 3 đến 8**
Chỉ còn nhập nội dung và gắn tên miền.

## Nghiệm thu v1 (12 tiêu chí)

v1 chỉ được coi là xong khi tất cả các điều sau đúng:


1. `chronoscruise.com` chạy hoàn toàn từ cơ sở dữ liệu, không còn import dữ liệu Chronos tĩnh.
2. Phần lõi không còn `--chronos-*`, hằng số Chronos, hay logic phụ thuộc tên thương hiệu.
3. Quản trị tạo được một tàu mới mà không đụng code.
4. Tàu mới cấu hình được: tên miền, logo, màu, phông, nội dung, phòng, hải trình, dịch vụ, ưu đãi, trang nội dung, thứ tự khối trang chủ, SEO, tuyển dụng, khách hỏi giá.
5. Hai tên miền cùng trỏ về một bản triển khai nhưng trả ra đúng hai thương hiệu khác nhau.
6. Dữ liệu mỗi tàu luôn ghi rõ thuộc tàu nào, và RLS chặn mọi truy cập công khai vào bản nháp, leads, hồ sơ ứng viên.
7. Form công khai không ghi trực tiếp vào cơ sở dữ liệu; máy chủ tự xác định tàu từ tên miền và client không gửi `ship_id`.
8. Trang xem thử không bị Google lập chỉ mục.
9. Chronos giữ nguyên giao diện sau khi chuyển đổi.
10. Tàu số 2 chạy production mà không cần thêm route hay component riêng.
11. Đổi mẫu bố cục của một tàu (Heritage → Panorama) không mất một dòng dữ liệu nào; nội dung và ảnh giữ nguyên.
12. Một trang quản trị duy nhất, một lần đăng nhập, thấy và quản được toàn bộ đội tàu; thêm tài khoản admin thứ hai không cần sửa code.


## Điều cần chuẩn bị từ bạn

- Danh sách 8 tàu: tên, tên miền dự định.
- Mỗi tàu: logo, ảnh, nội dung giới thiệu, phòng, hải trình, hotline/email, mạng xã hội.
- Tên miền trỏ về hệ thống này (mình hướng dẫn từng bước khi tới bước đó).

## Chi tiết kỹ thuật

### Schema (Lovable Cloud)

- `ships` — identity: `slug`, `name`, `status`, `layout` (enum), `default_language`, `currency`. `status` gồm đúng 4 giá trị: `draft` (đang nhập), `staging` (đã đủ nội dung, test domain/preview), `live` (mở công khai), `disabled` (tắt). Public chỉ đọc tàu `live`.
- `ship_domains` — `ship_id`, `domain` (unique), `is_primary`, `is_active`, `redirect_to`. Lookup hostname qua bảng này.
- `ship_branding` — `ship_id` UNIQUE (1–1), `primary_color`, `secondary_color`, `accent_color`, `background_color`, `surface_color`, `text_color`, `heading_font`, `body_font` (enum từ danh sách cho phép), `logo_light`, `logo_dark`, `favicon`, `theme_config jsonb` (chỉ tuỳ chọn phụ: borderRadius, heroOverlay, buttonStyle).
- `ship_settings` — `ship_id` UNIQUE (1–1): hotline, whatsapp, zalo, email, recruit_email, facebook, instagram, tiktok, tripadvisor, google_maps, booking_url, checkin_point, address.
- `ship_seo` — `ship_id` UNIQUE (1–1): `title_template`, `default_description`, `og_image`, `schema_type`, `schema_name`.
- `homepage_sections` — `ship_id`, `section_type` **text** (validate ở tầng ứng dụng, không dùng enum Postgres — thêm kiểu section mới như spa, activities, video, testimonial, destination, transport không cần migration), `position`, `enabled`, `configuration jsonb`.
- `ship_pages` — `ship_id`, `slug`, `title`, `content`, `seo_title`, `seo_description`, `status`, `sort_order`, UNIQUE(`ship_id`, `slug`).
- Nội dung: `cabins`, `cabin_details`, `itineraries`, `itinerary_days`, `services`, `offers`, `job_positions` — tất cả khoá `ship_id`, có `sort_order`.
- **Trạng thái nội dung** trên mọi bảng nội dung (`ship_pages`, `cabins`, `itineraries`, `services`, `offers`, `job_positions`, `homepage_sections`): cột `status` text với đúng 2 giá trị `draft` / `published` (validate ở tầng ứng dụng), thêm `published_at`, `created_by`, `updated_by`. Public chỉ đọc `status = 'published'`. Chưa có `review`/`archived` — thêm sau nếu cần, chỉ là thêm giá trị hợp lệ.
- `media` — `ship_id`, `storage_path`, `alt`, `caption`, `width`, `height`, `mime_type`, `category` (hero/exterior/cabin/restaurant/spa/activity/destination), `sort_order`, `is_featured`.
- `entity_media` — `ship_id`, `media_id`, `entity_type`, `entity_id`, `usage` (cover / gallery / floorplan / hero), `sort_order`. Đây là cách gắn ảnh vào nội dung, cho phép một nội dung có nhiều ảnh nhiều vai trò (ví dụ phòng: ảnh bìa + thư viện + sơ đồ mặt bằng) và một ảnh dùng lại ở nhiều chỗ.
- `leads` — `ship_id`, `type` (`quote` / `contact` / `booking_request` / `agent` / `group` — dùng `booking_request` vì web chỉ ghi nhận yêu cầu, booking thật thuộc PMS), `name`, `phone`, `email`, `nationality`, `message`, `source`, `utm_source`, `utm_campaign`, `status`.
- `job_applications` — thêm `ship_id` (NOT NULL, backfill Chronos).
- Quyền: dùng lại `user_roles` + `has_role` đã có, chỉ hai vai trò `owner` và `admin`, cả hai quản toàn bộ tàu. **v1 không tạo `user_ship_access`** — khi nào cần giao tàu riêng cho từng người mới thêm bảng đó và đổi điều kiện policy.


Mỗi `CREATE TABLE` kèm GRANT trong cùng migration: `SELECT` cho `anon` chỉ ở bảng nội dung công khai, full cho `authenticated`, `ALL` cho `service_role`; RLS bật.


### RLS (v1 giữ đơn giản)

Thực tế vận hành: 1 tài khoản admin quản cả 8 tàu, cùng lắm thêm 1–2 nhân viên cũng truy cập toàn bộ. Nên v1 làm gọn:

- Public: `SELECT TO anon` chỉ hàng `status = 'published'` của tàu `status = 'live'`. Bản nháp, `staging`, `disabled`, leads và hồ sơ ứng viên không lộ ra ngoài.
- Admin: mọi policy quản trị chỉ cần `has_role(auth.uid(), 'owner')` hoặc `has_role(auth.uid(), 'admin')` — cả hai đọc/ghi được toàn bộ tàu.
- **Không có `INSERT TO anon`.** Form khách hỏi giá và form ứng tuyển đi qua server function: trình duyệt gửi nội dung form → server đọc hostname → tìm tàu → validate (Zod) → tự gắn `ship_id` → ghi vào cơ sở dữ liệu bằng quyền server. Client không gửi và không quyết định `ship_id`. `leads` và `job_applications` chỉ cấp quyền cho `service_role` và cho admin đọc.
- Mọi bảng nội dung, `leads`, `job_applications` vẫn luôn có `ship_id` NOT NULL. Sau này muốn giới hạn người A chỉ quản vài tàu, chỉ cần đổi điều kiện policy — dữ liệu đã sẵn sàng, không phải chuyển đổi lại.

### Lớp service

Mọi thao tác nội dung nằm trong `src/lib/cms/*.functions.ts`, không nằm trong component: `createDraft`, `updateContent`, `setStatus` (draft/published), `updateSeo`, `attachMedia`, `reorderSections`, `submitLead`, `submitApplication`. Mỗi service nhận `shipId` (hoặc tự suy ra từ hostname với form công khai), kiểm quyền một chỗ duy nhất, và ghi `updated_by`. Quản trị chỉ là giao diện gọi các service này. `setStatus` là con đường duy nhất để xuất bản.




### Runtime

- `resolveShipByHost` (server fn, publishable client) đọc `getRequestHeader("host")` trong `beforeLoad` của `__root`, trả về ship + branding + settings + seo + sections; cache theo host. Domain có `redirect_to` → 301. Host không khớp → trang "chưa cấu hình". `/preview/$shipSlug` set `robots: noindex` và chỉ mở khi đăng nhập ở production.
- Đọc công khai: `*.functions.ts` + server publishable client, gọi từ loader public với `ensureQueryData` / `useSuspenseQuery`. Ghi/quản trị: `requireSupabaseAuth` + kiểm quyền theo `ship_id`.

### Theming

`src/styles.css` khai báo token semantic: `--color-primary`, `--color-secondary`, `--color-accent`, `--color-background`, `--color-surface`, `--color-text`, `--font-heading`, `--font-body`. Bỏ toàn bộ `--chronos-*` và class `bg-chronos-*` trong component (đổi sang utility Tailwind map vào token). Branding của tàu inject bằng `<style>` trong `head()` của `__root`; font Google load theo `heading_font`/`body_font` từ danh sách cho phép (preconnect + `display=swap`).

### Templates

`src/templates/heritage/**` export các section component cùng interface `{ ship, data, config }`; page component render theo `homepage_sections` đã sắp thứ tự. `LandingPage`, `CabinsPage`, `ItinerariesPage`, `ServicePage`, `OffersPage`, `GalleryPage`, `AboutPage`, `ContactPage`, `CareersPage` hiện tại refactor thành template Heritage nhận props, thay vì import `*-data.ts`. Các mẫu sau chỉ cần implement cùng interface.

### Media

Bucket public `ship-media`, đường dẫn `<ship-slug>/<category>/<file>`. Asset Chronos hiện tại upload vào bucket ở bước migrate; component dùng URL + `width`/`height` cố định + `loading`/`fetchpriority` để bù việc mất preload theo asset hash.

### SEO

`src/lib/seo.ts` nhận `ship` thay vì `SITE_URL`/`SITE_NAME` hằng số; canonical / `og:url` dùng domain chính của tàu; `sitemap[.]xml` và `robots.txt` sinh theo host; JSON-LD theo `schema_type` từng tàu (Organization / Hotel / TouristTrip tuỳ trang).

### Quản trị

`src/routes/_authenticated/admin/`: `ships` (danh sách + tạo), `ships.$shipId.<tab>` cho các tab đã nêu, `leads`, `applications` lọc theo tàu.

### Giai đoạn 1 chia thành task nhỏ

Làm lần lượt, mỗi task tự đứng được và website Chronos vẫn chạy sau từng task — không đập cả site cùng lúc.

1. **1a — Schema tàu**: `ships`, `ship_domains`, `ship_branding`, `ship_settings`, `ship_seo` + GRANT/RLS theo `has_role(owner/admin)`. Chèn tàu Chronos (`status = 'live'`) và domain của nó. Web chưa đổi gì.
2. **1b — Schema nội dung**: `cabins`, `cabin_details`, `itineraries`, `itinerary_days`, `services`, `offers`, `job_positions`, `ship_pages`, `homepage_sections`.
3. **1c — Schema media & leads**: bucket `ship-media`, `media`, `entity_media`, `leads`, thêm `ship_id` vào `job_applications`.
4. **1d — Chuyển ảnh**: upload asset Chronos vào bucket, tạo hàng `media` + `entity_media`. Web vẫn dùng import cũ.
5. **1e — Chuyển dữ liệu**: đổ nội dung từ các file `*-data.ts` vào bảng, đối chiếu từng bản ghi.
6. **1f — Lớp đọc dữ liệu**: server fn công khai + query options; chưa gắn vào trang.
7. **1g — Chuyển từng trang sang đọc database**, mỗi trang một bước: trang chủ → phòng → hải trình → dịch vụ → ưu đãi → thư viện → giới thiệu/liên hệ → tuyển dụng. Sau mỗi bước so ảnh chụp trước/sau để chắc giao diện không đổi.
8. **1h — Dọn dẹp**: xoá các file `*-data.ts` và import ảnh tĩnh không còn dùng.


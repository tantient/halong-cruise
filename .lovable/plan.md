# Cruise Web Platform — một nền tảng, nhiều thương hiệu du thuyền

Chronos không còn là "website chính rồi copy ra 7 bản". Chronos là **tàu số 1** của một nền tảng: 1 codebase + 1 database + 1 trang quản trị + nhiều tên miền + nhiều thương hiệu.

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
5. **Chuẩn bị phân quyền theo tàu** — có sẵn bảng gán người dùng ↔ tàu ↔ vai trò để sau này giao tàu cho từng đội.
6. **Chỉ hoàn thiện một mẫu trước** — Heritage chạy trọn vẹn, Chronos chuyển sang nền tảng, quản trị xong, tàu số 2 chạy được **không sửa code**; sau đó mới xây các mẫu còn lại.

## Nguyên tắc ranh giới

Nền tảng web **không phải PMS**. Web giữ: nội dung marketing, thông tin phòng/hải trình công khai, ưu đãi, khách hỏi giá, tuyển dụng, SEO, ảnh. PMS giữ: tồn phòng, đặt phòng, giá, khách, thanh toán, vận hành. Sau này web lấy tình trạng phòng/giá từ PMS qua API.

## Để ngỏ đường cho AI (v1 KHÔNG làm AI)

v1 không gọi bất kỳ dịch vụ AI nào, không chatbot, không automation, không prompt. Chỉ đảm bảo kiến trúc sau này gắn AI vào được mà không viết lại CMS hay cơ sở dữ liệu. Nếu bỏ AI vĩnh viễn, nền tảng vẫn hoạt động bình thường.

Bốn điều chuẩn bị sẵn trong v1:

1. **Trạng thái nội dung** `draft → review → published → archived` trên mọi bảng nội dung, thay cho cờ đúng/sai. Sau này AI chỉ tạo bản nháp; người quản trị xem, sửa rồi mới xuất bản — AI không tự xuất bản.
2. **Nguồn nội dung**: mỗi bản ghi ghi lại do người tạo, do máy tạo, hay người sửa từ bản máy tạo, cùng thời điểm và người thao tác. Đủ để sau này bổ sung lịch sử phiên bản mà không phải đổi cấu trúc.
3. **Giọng thương hiệu từng tàu**: bảng lưu sẵn giọng điệu, đối tượng khách, lối viết, từ nên dùng / tránh dùng, hướng dẫn SEO và dịch thuật. v1 chỉ lưu, chưa dùng.
4. **Mọi thao tác nội dung là một service riêng**, không nằm trong component giao diện: tạo bản nháp, cập nhật trang, tạo ưu đãi, cập nhật SEO, tạo bản dịch, gắn ảnh… Quản trị gọi service; sau này AI hoặc n8n gọi cùng service qua API đã xác thực. Mọi thao tác luôn kiểm tra tàu và quyền.

Nguyên tắc bất di bất dịch: **AI chỉ được đọc và ghi trong phạm vi một tàu** — thông tin tàu, giọng thương hiệu, phòng, hải trình, dịch vụ, ưu đãi, trang, ảnh, SEO, nội dung đã xuất bản của chính tàu đó. Không trộn dữ liệu giữa các tàu.


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
## Nghiệm thu v1 (10 tiêu chí)

v1 chỉ được coi là xong khi tất cả 10 điều sau đúng:

1. `chronoscruise.com` chạy hoàn toàn từ cơ sở dữ liệu, không còn import dữ liệu Chronos tĩnh.
2. Phần lõi không còn `--chronos-*`, hằng số Chronos, hay logic phụ thuộc tên thương hiệu.
3. Quản trị tạo được một tàu mới mà không đụng code.
4. Tàu mới cấu hình được: tên miền, logo, màu, phông, nội dung, phòng, hải trình, dịch vụ, ưu đãi, trang nội dung, thứ tự khối trang chủ, SEO, tuyển dụng, khách hỏi giá.
5. Hai tên miền cùng trỏ về một bản triển khai nhưng trả ra đúng hai thương hiệu khác nhau.
6. Dữ liệu từng tàu được cô lập bằng RLS.
7. Form công khai không nhận `ship_id` từ phía client.
8. Trang xem thử không bị Google lập chỉ mục.
9. Chronos giữ nguyên giao diện sau khi chuyển đổi.
10. Tàu số 2 chạy production mà không cần thêm route hay component riêng.


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
- **Workflow chung cho mọi bảng nội dung** (`ship_pages`, `cabins`, `itineraries`, `services`, `offers`, `job_positions`, `homepage_sections`): cột `status` text với 4 giá trị `draft` / `review` / `published` / `archived` (validate ở tầng ứng dụng), `published_at`. Không dùng cờ boolean `published`. Public chỉ đọc `status = 'published'`.
- **Nguồn nội dung** trên cùng các bảng đó: `origin` text (`human` / `machine` / `machine_edited`), `created_by`, `updated_by`, `origin_meta jsonb`. v1 luôn ghi `human`; đủ chỗ để sau này bổ sung bảng phiên bản/audit log mà không đổi cấu trúc.
- `media` — `ship_id`, `storage_path`, `alt`, `caption`, `width`, `height`, `mime_type`, `category` (hero/exterior/cabin/restaurant/spa/activity/destination), `sort_order`, `is_featured`, `origin`.
- `entity_media` — `ship_id`, `media_id`, `entity_type`, `entity_id`, `usage` (cover / gallery / floorplan / hero), `sort_order`. Đây là cách gắn ảnh vào nội dung, cho phép một nội dung có nhiều ảnh nhiều vai trò (ví dụ phòng: ảnh bìa + thư viện + sơ đồ mặt bằng) và một ảnh dùng lại ở nhiều chỗ.
- `leads` — `ship_id`, `type` (`quote` / `contact` / `booking_request` / `agent` / `group` — dùng `booking_request` vì web chỉ ghi nhận yêu cầu, booking thật thuộc PMS), `name`, `phone`, `email`, `nationality`, `message`, `source`, `utm_source`, `utm_campaign`, `status`.
- `job_applications` — thêm `ship_id` (NOT NULL, backfill Chronos).
- `user_ship_access` — `user_id`, `ship_id`, `role` (enum: platform_owner, ship_admin, editor, recruitment, sales), unique (user_id, ship_id, role). **v1 tạo bảng nhưng chưa dùng làm cơ chế quyền** — chỉ để mở rộng sau này.
- `ship_ai_profiles` — `ship_id` UNIQUE: `brand_voice`, `target_audience`, `writing_style`, `preferred_terms`, `forbidden_terms`, `seo_guidelines`, `translation_guidelines`, `additional_instructions`, `updated_at`. Chỉ lưu dữ liệu; v1 không có sinh nội dung tự động.

Mỗi `CREATE TABLE` kèm GRANT trong cùng migration: `SELECT` cho `anon` chỉ ở bảng nội dung công khai, full cho `authenticated`, `ALL` cho `service_role`; RLS bật.


### RLS (v1 giữ đơn giản)

Thực tế vận hành: 1 tài khoản admin quản cả 8 tàu, cùng lắm thêm 1–2 nhân viên cũng truy cập toàn bộ. Nên v1 làm gọn:

- Public: `SELECT TO anon` chỉ hàng `status = 'published'` của tàu `status = 'live'`. Bản nháp, `staging`, `disabled`, leads và hồ sơ ứng viên không lộ ra ngoài.
- Admin: mọi policy quản trị chỉ cần `has_role(auth.uid(), 'admin')` — admin đọc/ghi được toàn bộ tàu. Không bắt buộc lọc qua `user_ship_access` ở v1.
- `INSERT TO anon` cho `leads` và `job_applications` (form công khai), `ship_id` do server fn xác định từ hostname, **không** lấy từ payload client.
- Mọi bảng nội dung, `leads`, `job_applications` vẫn luôn có `ship_id` NOT NULL. Sau này muốn giới hạn người A chỉ quản vài tàu, chỉ cần đổi điều kiện policy sang `has_ship_access(...)` — dữ liệu đã sẵn sàng, không phải chuyển đổi lại.

### Lớp service (chuẩn bị cho AI/n8n sau này)

Mọi thao tác nội dung nằm trong `src/lib/cms/*.functions.ts`, không nằm trong component: `createDraft`, `updateContent`, `setStatus` (draft/review/published/archived), `updateSeo`, `attachMedia`, `createTranslation`, `reorderSections`. Mỗi service nhận `shipId`, kiểm quyền một chỗ duy nhất (v1: `has_role(admin)`; sau này đổi thành kiểm theo tàu mà không sửa call site), và ghi `origin` / `updated_by`. Quản trị chỉ là giao diện gọi các service này; sau này AI hoặc n8n gọi cùng service qua server route đã xác thực (`src/routes/api/`). `setStatus` là con đường duy nhất để xuất bản.



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

1. **1a — Schema tàu**: `ships`, `ship_domains`, `ship_branding`, `ship_settings`, `ship_seo`, `user_ship_access` + hàm `has_ship_access` + GRANT/RLS. Chèn tàu Chronos (`status = 'live'`) và domain của nó. Web chưa đổi gì.
2. **1b — Schema nội dung**: `cabins`, `cabin_details`, `itineraries`, `itinerary_days`, `services`, `offers`, `job_positions`, `ship_pages`, `homepage_sections`.
3. **1c — Schema media & leads**: bucket `ship-media`, `media`, `entity_media`, `leads`, thêm `ship_id` vào `job_applications`.
4. **1d — Chuyển ảnh**: upload asset Chronos vào bucket, tạo hàng `media` + `entity_media`. Web vẫn dùng import cũ.
5. **1e — Chuyển dữ liệu**: đổ nội dung từ các file `*-data.ts` vào bảng, đối chiếu từng bản ghi.
6. **1f — Lớp đọc dữ liệu**: server fn công khai + query options; chưa gắn vào trang.
7. **1g — Chuyển từng trang sang đọc database**, mỗi trang một bước: trang chủ → phòng → hải trình → dịch vụ → ưu đãi → thư viện → giới thiệu/liên hệ → tuyển dụng. Sau mỗi bước so ảnh chụp trước/sau để chắc giao diện không đổi.
8. **1h — Dọn dẹp**: xoá các file `*-data.ts` và import ảnh tĩnh không còn dùng.


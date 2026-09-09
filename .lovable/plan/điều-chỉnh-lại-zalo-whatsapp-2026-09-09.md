# Điều chỉnh lại Zalo / WhatsApp

## Mục tiêu
- Trang Liên hệ: giữ nguyên như hiện tại sau khi đã bỏ — không còn dòng Zalo riêng, không còn nút "Nhắn tin Zalo"; nút chính là WhatsApp.
- Nhãn gộp "Hotline / Zalo / WhatsApp" trên trang Liên hệ: KHÔI PHỤC lại như cũ (cả EN lẫn VI), vì đây là nhãn chung của số điện thoại, không phải nút Zalo riêng.
- Trang Tuyển dụng: KHÔI PHỤC nút "Liên hệ Zalo" / "Contact via Zalo" như cũ (link zalo.me), kèm các câu mô tả nhắc tới Zalo trong phần tuyển dụng.
- Các nút "Liên hệ với chúng tôi" / "Đặt ngay" ở menu, Cabins, Hải trình, Dịch vụ, Ưu đãi: giữ ưu tiên WhatsApp (đã sửa ở lượt trước, không đổi).
- Chân trang: hiện đã bỏ icon Zalo, chỉ còn Facebook / Instagram / WhatsApp — giữ nguyên, trừ khi bạn muốn thêm lại Zalo.

## Thay đổi kỹ thuật
1. `src/lib/translations.ts`
   - Khôi phục key `contactZalo` (thay cho `contactWhatsApp` vừa thêm) trong careers, giá trị VI "Liên hệ Zalo", EN "Contact via Zalo".
   - Khôi phục các câu careers có nhắc Zalo (subtitle, openingsSubtitle, ctaSubtitle, processText) cả EN/VI.
   - Khôi phục nhãn phone "Hotline / Zalo / WhatsApp" và câu subtitle liên hệ "…qua điện thoại, Zalo, WhatsApp hoặc email." (EN tương ứng).
   - Khôi phục key `zalo`/`chatZalo` trong phần contact (không còn dùng trên trang Liên hệ nhưng giữ nhãn sẵn).
2. `src/components/careers/CareersPage.tsx`: đổi nút WhatsApp vừa thay về lại nút Zalo (`settings.zalo`, icon MessageCircle, nhãn `tc.contactZalo`).
3. Không động vào: ContactPage (đã bỏ Zalo riêng), Footer, các CTA WhatsApp.

## Kiểm tra sau khi sửa
- Typecheck sạch.
- Trang /contact và /vi/contact: không còn mục Zalo riêng, nhãn hotline hiển thị "Hotline / Zalo / WhatsApp", nút WhatsApp hoạt động.
- Trang /careers và /vi/careers: nút Zalo hiện lại và mở đúng zalo.me/84902952356.
- Không còn chữ Zalo thừa ở các trang khác.

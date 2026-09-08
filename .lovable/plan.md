# Cập nhật mạng xã hội ở footer

## Mục tiêu
Thay các link mạng xã hội ở cuối trang thành link thật và bổ sung WhatsApp.

## Thay đổi
1. Sửa `src/components/landing/Footer.tsx`:
   - Facebook: `https://www.facebook.com/chronoscruise/`
   - Instagram: `https://www.instagram.com/chronos.cruise/`
   - Zalo: `https://zalo.me/84902952356`
   - Thêm WhatsApp: `https://wa.me/84902952356`
2. Giữ nguyên icon và kiểu dáng hiện tại; chỉ đổi `href` và thêm entry.

## Kiểm tra
- Chạy typecheck và build.
- Mở preview, cuộn xuống footer, xác nhận 4 icon social đều link đúng địa chỉ.

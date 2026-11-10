# Nimo TV Hotkeys

Userscript (Tampermonkey/Violentmonkey) thêm phím tắt cho trình phát video trên [nimo.tv](https://www.nimo.tv): fullscreen, tắt tiếng, đổi độ phân giải và focus ô chat.

## Cài đặt

1. Cài extension userscript như [Tampermonkey](https://www.tampermonkey.net/) hoặc Violentmonkey.
2. Tạo script mới, dán toàn bộ nội dung file [`nimotv-hotkeys.js`](./nimotv-hotkeys.js) rồi lưu.
3. Mở một trang `nimo.tv` bất kỳ và tải lại trang.

Script chạy trên `*://*.nimo.tv/*` và không yêu cầu quyền đặc biệt (`@grant none`).

## Phím tắt

| Phím | Chức năng |
|------|-----------|
| `F` | Bật/tắt toàn màn hình |
| `M` | Bật/tắt tiếng |
| `L` | Focus vào ô nhập chat |
| `1` – `9` | Chọn độ phân giải theo thứ tự trong menu (1 = mục đầu tiên) |
| `Esc` | Thoát khỏi ô chat (blur) khi đang nhập |
| `Enter` | Gửi tin nhắn rồi tự thoát khỏi ô chat (blur sau 50ms) |

Lưu ý:
- Phím `L` phân biệt chữ thường (không hoạt động khi bật Caps Lock/Shift).
- Phím tắt **không** hoạt động khi đang gõ trong `input`, `textarea` hoặc phần tử `contenteditable`, và khi giữ `Ctrl`, `Alt` hoặc `Meta`.
- Số `1-9` chỉ có tác dụng nếu menu độ phân giải có đủ số mục tương ứng.

## Cách hoạt động

- Lắng nghe `keydown` ở pha capture trên `window` và `preventDefault`/`stopPropagation` để tránh xung đột với phím tắt gốc của trang.
- Tìm và `click()` các phần tử của player Nimo bằng CSS selector:
  - Độ phân giải: `.rate-control_list .rate-control_item`
  - Fullscreen: `.fullscreen-control`
  - Tắt tiếng: `.volume-btn`
  - Ô chat: `.nimo-chat-box__input`
- Hàm `showControlsFeedback()`: sau khi đổi độ phân giải hoặc tắt tiếng, giả lập `mousemove` trên `#nimo-player` để thanh điều khiển hiện ra, rồi sau 1,4 giây giả lập `mouseleave` để ẩn lại (chỉ khi chuột không nằm trên video).

## Khắc phục sự cố

Nếu Nimo đổi giao diện khiến phím tắt ngừng hoạt động, hãy kiểm tra và cập nhật các CSS selector nêu trên trong file script.
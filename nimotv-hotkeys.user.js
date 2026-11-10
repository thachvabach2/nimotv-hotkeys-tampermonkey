// ==UserScript==
// @name         Nimo TV Hotkeys (Fullscreen, Chat, Mute, Resolution + Fast UI)
// @namespace    https://github.com/thachvabach2
// @version      1.2
// @description  Hotkeys: 'F' full, 'L' chat, 'Esc'/'Enter' blur, 'M' mute, '1-9' resolutions with safe UI flash
// @author       thachvabach2
// @match        *://*.nimo.tv/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/thachvabach2/nimotv-hotkeys-tampermonkey/main/nimotv-hotkeys.user.js
// @downloadURL  https://raw.githubusercontent.com/thachvabach2/nimotv-hotkeys-tampermonkey/main/nimotv-hotkeys.user.js
// ==/UserScript==

(function() {
    'use strict';

    let controlsHideTimeout = null;

    // Hàm đánh thức UI an toàn, không làm hỏng logic hover gốc của Nimo
    function showControlsFeedback() {
        const player = document.querySelector('#nimo-player');

        if (player) {
            // Giả lập sự kiện chuột di chuyển vào để Nimo tự hiện UI
            player.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                view: window
            }));

            if (controlsHideTimeout) {
                clearTimeout(controlsHideTimeout);
            }

            controlsHideTimeout = setTimeout(() => {
                // Lấy lại phần tử player (phòng trường hợp DOM bị reset khi đổi độ phân giải)
                const currentPlayer = document.querySelector('#nimo-player');

                // Nếu chuột KHÔNG nằm trong video thì mới giả lập chuột rời đi để ẩn UI
                if (currentPlayer && !currentPlayer.matches(':hover')) {
                    currentPlayer.dispatchEvent(new MouseEvent('mouseleave', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                }
            }, 1400);
        }
    }

    window.addEventListener('keydown', function(event) {
        const target = event.target;
        const isInputFocused = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;

        if (event.key === 'Escape' && isInputFocused) {
            target.blur();
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (event.key === 'Enter' && isInputFocused) {
            setTimeout(() => {
                target.blur();
            }, 50);
            return;
        }

        if (isInputFocused || event.ctrlKey || event.altKey || event.metaKey) {
            return;
        }

        const key = event.key.toLowerCase();

        // Tính năng: Thay đổi độ phân giải (1-9)
        if (key >= '1' && key <= '9') {
            const index = parseInt(key) - 1;
            const rateItems = document.querySelectorAll('.rate-control_list .rate-control_item');

            if (rateItems && rateItems.length > index) {
                rateItems[index].click();
                event.preventDefault();
                event.stopPropagation();
                showControlsFeedback();
            }
        }

        // Tính năng: Fullscreen
        if (key === 'f') {
            const fullscreenBtn = document.querySelector('.fullscreen-control');
            if (fullscreenBtn) {
                fullscreenBtn.click();
                event.preventDefault();
                event.stopPropagation();
            }
        }

        // Tính năng: Bật/Tắt tiếng
        if (key === 'm') {
            const muteBtn = document.querySelector('.volume-btn');
            if (muteBtn) {
                muteBtn.click();
                event.preventDefault();
                event.stopPropagation();
            }
            showControlsFeedback();
        }

        // Tính năng: Focus ô chat
        if (event.key === 'l') {
            event.preventDefault();
            event.stopPropagation();

            const chatInput = document.querySelector('.nimo-chat-box__input');
            if (chatInput) {
                setTimeout(() => {
                    chatInput.focus();
                }, 10);
            }
        }
    }, true);

})();
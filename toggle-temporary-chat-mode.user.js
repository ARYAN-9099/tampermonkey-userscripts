// ==UserScript==
// @name         Toggle Temporary Chat Mode (Alt+T)
// @namespace    https://github.com/ARYAN-9099/tampermonkey-userscripts
// @version      1.1
// @description  Press Alt+T to toggle the "Temporary Chat" mode on chatgpt.com
// @match        https://chatgpt.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/toggle-temporary-chat-mode.user.js
// @downloadURL  https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/toggle-temporary-chat-mode.user.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('keydown', function (e) {
        // Trigger only when Alt+T is pressed (no Ctrl/Shift)
        if (e.altKey && !e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 't') {
            const button = document.querySelector(
                'button[aria-label*="temporary chat"]'
            );

            if (button) {
                button.click();
                console.log(`✅ Clicked: ${button.getAttribute('aria-label')}`);
            } else {
                console.warn('⚠️ Could not find temporary chat toggle button.');
            }

            e.preventDefault();
        }
    });
})();

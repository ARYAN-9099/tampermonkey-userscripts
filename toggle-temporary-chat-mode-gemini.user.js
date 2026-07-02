// ==UserScript==
// @name         Toggle Gemini Temporary Chat (Alt+T) Gemini
// @namespace    https://github.com/ARYAN-9099/tampermonkey-userscripts
// @version      1.0
// @description  Press Alt+T to toggle Temporary Chat on Gemini
// @author       ARYAN-9099
// @match        https://gemini.google.com/app*
// @grant        none
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/toggle-temporary-chat-mode-gemini.user.js
// @downloadURL  https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/toggle-temporary-chat-mode-gemini.user.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('keydown', (e) => {
        // Alt+T (without Ctrl/Shift)
        if (!(e.altKey && !e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 't')) {
            return;
        }

        e.preventDefault();

        const button =
            document.querySelector('[data-test-id="temp-chat-button"] button') ||
            document.querySelector('button[aria-label="Temporary chat"]') ||
            document.querySelector('button[aria-label*="Temporary chat"]');

        if (!button) {
            console.warn("⚠️ Couldn't find Temporary Chat button.");
            return;
        }

        button.click();
        console.log("✅ Toggled Gemini Temporary Chat.");
    });
})();
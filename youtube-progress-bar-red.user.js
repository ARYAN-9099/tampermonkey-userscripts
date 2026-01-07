// ==UserScript==
// @name         YouTube Progress Bar Back to Red
// @namespace    https://github.com/ARYAN-9099/tampermonkey-userscripts
// @version      1.3
// @description  Forces YouTube and YouTube Music progress bars back to classic red
// @match        *://*.youtube.com/*
// @match        *://music.youtube.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/youtube-progress-bar-red.user.js
// @downloadURL  https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/youtube-progress-bar-red.user.js
// ==/UserScript==

(function () {
    'use strict';

    /* -----------------------------
       Global CSS (extension-style)
       - Required for YouTube Music
    ------------------------------ */
    GM_addStyle(`
        /* Regular YouTube */
        .ytp-play-progress,
        .ytp-play-progress.ytp-swatch-background-color {
            background: #ff0000 !important;
        }

        /* YouTube Music (all current variants) */
        ytmusic-player-bar,
        ytmusic-player-bar #progress-bar,
        paper-slider {
            --paper-slider-active-color: #ff0000 !important;
            --paper-slider-knob-color: #ff0000 !important;
            --paper-slider-knob-start-color: #ff0000 !important;
            --paper-slider-knob-start-border-color: #ff0000 !important;
        }
    `);

    /* -----------------------------
       JS fallback (YouTube only)
       - Extra safety for SPA resets
    ------------------------------ */
    function fixYouTubeProgressBar() {
        document
            .querySelectorAll('.ytp-play-progress')
            .forEach(bar => {
                bar.style.background = '#ff0000';
            });
    }

    const observer = new MutationObserver(() => {
        if (!location.hostname.includes('music')) {
            fixYouTubeProgressBar();
        }
    });

    function startObserver() {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            fixYouTubeProgressBar();
        } else {
            requestAnimationFrame(startObserver);
        }
    }

    startObserver();
})();

// ==UserScript==
// @name         YouTube Progress Bar Back to Red
// @namespace    https://github.com/ARYAN-9099/tampermonkey-userscripts
// @version      1.2
// @description  Forces YouTube video progress bar back to classic red
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/youtube-progress-bar-red.user.js
// @downloadURL  https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/youtube-progress-bar-red.user.js
// ==/UserScript==

(function () {
    'use strict';

    function changeSpecificProgressBarToRed() {
        const progressBars = document.querySelectorAll(
            '.ytp-play-progress.ytp-swatch-background-color'
        );

        progressBars.forEach(progressBar => {
            progressBar.style.background = '#FF0000';
        });
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                changeSpecificProgressBarToRed();
                break;
            }
        }
    });

    function startObserver() {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            changeSpecificProgressBarToRed();
        } else {
            requestAnimationFrame(startObserver);
        }
    }

    startObserver();
})();

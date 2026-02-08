// ==UserScript==
// @name         Copy LeetCode Problem + Code
// @namespace    https://github.com/ARYAN-9099/tampermonkey-userscripts
// @version      1.0
// @description  Add a toolbar button to copy LeetCode problem description and solution code
// @match        https://leetcode.com/problems/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/leetcode-copy-problem-code.user.js
// @downloadURL  https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/leetcode-copy-problem-code.user.js
// ==/UserScript==

(function () {
    'use strict';

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;

        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: '99999',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 6px 20px rgba(0,0,0,.3)',
            opacity: '0',
            transition: 'opacity 0.25s ease'
        });

        document.body.appendChild(toast);
        requestAnimationFrame(() => (toast.style.opacity = '1'));

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 1600);
    }

    function injectButton() {
        const container = document.querySelector(
            '#ide-top-btns > div:nth-child(2) > div'
        );

        if (!container) return;
        if (document.getElementById('lc-copy-btn')) return;

        const btn = document.createElement('div');
        btn.id = 'lc-copy-btn';
        btn.className =
            'group flex flex-none items-center justify-center hover:bg-fill-quaternary dark:hover:bg-fill-quaternary rounded';

        btn.innerHTML = `
            <div class="relative flex cursor-pointer p-2 text-gray-60 dark:text-gray-60"
                 role="button"
                 aria-label="Copy Problem + Code"
                 title="Copy Problem + Code">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4
                         a2 2 0 0 1 2-2h9
                         a2 2 0 0 1 2 2v1"></path>
              </svg>
            </div>
        `;

        btn.onclick = () => {
            const model = window.monaco?.editor?.getModels?.()[0];
            const code = model ? model.getValue() : '[Code not found]';

            const problem =
                document.querySelector('[data-track-load="description_content"]')
                    ?.innerText || '[Problem not found]';

            navigator.clipboard.writeText(
`===== PROBLEM =====
${problem}

===== SOLUTION =====
${code}`
            );

            showToast('📋 Problem + code copied');
        };

        container.appendChild(btn);
    }

    // LeetCode is an SPA — observe DOM changes
    const observer = new MutationObserver(injectButton);
    observer.observe(document.body, { childList: true, subtree: true });

    injectButton();
})();

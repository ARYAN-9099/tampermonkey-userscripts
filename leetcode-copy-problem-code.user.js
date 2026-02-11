// ==UserScript==
// @name         Copy LeetCode Problem + Code
// @namespace    https://github.com/ARYAN-9099/tampermonkey-userscripts
// @version      2.0
// @description  Add toolbar buttons to copy LeetCode problem, solution code, testcases, and results
// @match        https://leetcode.com/problems/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/leetcode-copy-problem-code.user.js
// @downloadURL  https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/leetcode-copy-problem-code.user.js
// ==/UserScript==

(function () {
    'use strict';

    /* -------------------- TOAST -------------------- */
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

    /* -------------------- HELPERS -------------------- */
    function getCode() {
        const model = window.monaco?.editor?.getModels?.()[0];
        return model ? model.getValue() : '[Code not found]';
    }

    function getProblem() {
        return (
            document.querySelector('[data-track-load="description_content"]')
                ?.innerText || '[Problem not found]'
        );
    }

    function getResultSummary() {
        const status =
            document.querySelector('[data-e2e-locator="console-result"]')
                ?.innerText || '[Result not found]';

        const runtime =
            document
                .querySelector('[data-e2e-locator="console-result"]')
                ?.parentElement?.querySelector('.ml-4')?.innerText || '';

        return `${status}${runtime ? ' | ' + runtime : ''}`;
    }

    function getSectionText(title) {
        const header = [...document.querySelectorAll('div')]
            .find(el => el.textContent.trim() === title);

        if (!header) return '';

        const blocks = header
            .parentElement
            .querySelectorAll('.font-menlo');

        let text = '';
        blocks.forEach(b => {
            text += b.innerText.trim() + '\n';
        });

        return text.trim();
    }

    function getTestCases() {
        const input = getSectionText('Input');
        const output = getSectionText('Output');
        const expected = getSectionText('Expected');

        let res = '';

        if (input) res += `\n===== INPUT =====\n${input}\n`;
        if (output) res += `\n===== OUTPUT =====\n${output}\n`;
        if (expected) res += `\n===== EXPECTED =====\n${expected}\n`;

        return res.trim() || '[Testcases not found]';
    }

    /* -------------------- BUTTON INJECTION -------------------- */
    function injectButtons() {
        const container = document.querySelector(
            '#ide-top-btns > div:nth-child(2) > div'
        );
        if (!container) return;

        /* ----- Button 1: Copy Problem + Code ----- */
        if (!document.getElementById('lc-copy-problem-btn')) {
            const btn1 = document.createElement('div');
            btn1.id = 'lc-copy-problem-btn';
            btn1.className =
                'group flex flex-none items-center justify-center hover:bg-fill-quaternary dark:hover:bg-fill-quaternary rounded';

            // Original V1 Icon (Copy/Paste style)
            btn1.innerHTML = `
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

            btn1.onclick = () => {
                navigator.clipboard.writeText(
`===== PROBLEM =====
${getProblem()}

===== SOLUTION =====
${getCode()}`
                );
                showToast('📋 Problem + code copied');
            };

            container.appendChild(btn1);
        }

        /* ----- Button 2: Copy Code + Testcases ----- */
        if (!document.getElementById('lc-copy-tests-btn')) {
            const btn2 = document.createElement('div');
            btn2.id = 'lc-copy-tests-btn';
            btn2.className =
                'group flex flex-none items-center justify-center hover:bg-fill-quaternary dark:hover:bg-fill-quaternary rounded';

            // New Icon: Flask/Test Tube (Matches style of V1 icon)
            btn2.innerHTML = `
              <div class="relative flex cursor-pointer p-2 text-gray-60 dark:text-gray-60"
                   role="button"
                   aria-label="Copy Code + Testcases"
                   title="Copy Code + Testcases">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                   <path d="M10 2v7.31L6 19c-.77 1.33.23 3 1.8 3h8.4c1.57 0 2.57-1.67 1.8-3l-4-9.69V2"></path>
                   <path d="M8.5 2h7"></path>
                   <path d="M6 16h12"></path>
                </svg>
              </div>
            `;

            btn2.onclick = () => {
                navigator.clipboard.writeText(
`===== RESULT =====
${getResultSummary()}

===== SOLUTION =====
${getCode()}

${getTestCases()}`
                );
                showToast('🧪 Code + testcases copied');
            };

            container.appendChild(btn2);
        }
    }

    /* -------------------- OBSERVER -------------------- */
    const observer = new MutationObserver(injectButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    injectButtons();
})();
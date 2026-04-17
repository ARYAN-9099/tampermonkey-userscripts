// ==UserScript==
// @name         LeetCode Difficulty Rating
// @namespace    https://github.com/ARYAN-9099/tampermonkey-userscripts
// @version      1.3
// @description  Replace LeetCode difficulty labels with contest-based rating values; keep original difficulty when no rating exists.
// @match        https://leetcode.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @updateURL    https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/leetcode-difficulty-rating.user.js
// @downloadURL  https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/leetcode-difficulty-rating.user.js
// ==/UserScript==

(function () {
    'use strict';

    const RATINGS_URL = 'https://raw.githubusercontent.com/zerotrac/leetcode_problem_rating/main/ratings.txt';
    const CACHE_EXPIRE_MS = 24 * 60 * 60 * 1000; // 1 day

    function parse(csv) {
        const lines = csv.split('\n');
        if (!lines.length) return {};

        const headers = lines[0].split(/\t+/);
        const out = {};

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const row = lines[i].split(/\t+/);
            if (row.length < 2 || !row[1]) continue;

            out[row[1]] = Object.fromEntries(headers.map((k, idx) => [k, row[idx]]));
        }

        return out;
    }

    function fetchRatingsText() {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: RATINGS_URL,
                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) {
                            resolve(res.responseText);
                        } else {
                            reject(new Error('Failed to fetch ratings: HTTP ' + res.status));
                        }
                    },
                    onerror: () => reject(new Error('Failed to fetch ratings via GM_xmlhttpRequest')),
                });
                return;
            }

            fetch(RATINGS_URL)
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch ratings: HTTP ' + res.status);
                    return res.text();
                })
                .then(resolve)
                .catch(reject);
        });
    }

    async function getRatings() {
        const cacheTime = Number(GM_getValue('cacheTime', 0));
        const cachedRatings = GM_getValue('ratings', null);

        if (cachedRatings && cacheTime && Date.now() < cacheTime + CACHE_EXPIRE_MS) {
            return cachedRatings;
        }

        const text = await fetchRatingsText();
        const ratings = parse(text);

        GM_setValue('ratings', ratings);
        GM_setValue('cacheTime', Date.now());

        return ratings;
    }

    function replace(ratings, title, difficulty) {
        if (!title || !difficulty) return;

        const id = (title.textContent || '').split('.')[0].trim();
        if (!id) return;

        if (!ratings[id] || !ratings[id].Rating) return;

        const nextValue = String(ratings[id].Rating).split('.')[0];

        difficulty.textContent = (difficulty.textContent || '').replace(
            /([Hh]ard|[Mm]ed\.|[Mm]edium|[Ee]asy|\d{3,4}|N\/A)/,
            nextValue
        );
    }

    function findDifficultyNode(container) {
        if (!container) return null;

        const direct = container.querySelector(
            'div[diff="easy"],div[diff="medium"],div[diff="hard"],p[class*="text-sd-"]'
        );
        if (direct) return direct;

        const nodes = container.querySelectorAll('span,div,p');
        for (const node of nodes) {
            const text = (node.textContent || '').trim();
            if (/^(Hard|Med\.|Medium|Easy|N\/A)$/i.test(text)) {
                return node;
            }
        }

        return null;
    }

    let observer;

    async function update() {
        observer.disconnect();

        try {
            const ratings = await getRatings();

            let title;
            let difficulty;

            // leetcode.com/problemset/*
            document.querySelectorAll('[role="row"]').forEach((ele) => {
                title = ele.querySelector('[role="cell"]:nth-child(2) a');
                difficulty = ele.querySelector('[role="cell"]:nth-child(5) span');
                replace(ratings, title, difficulty);
            });

            // new leetcode.com/problems/*/
            title = document.querySelector('div > a.text-lg.text-label-1.font-medium');
            difficulty = document.querySelector('div > div.text-sm.font-medium.capitalize');
            replace(ratings, title, difficulty);

            // old leetcode.com/problems/*/
            title = document.querySelector('div[data-cy="question-title"]');
            difficulty = document.querySelector('div[diff="easy"],div[diff="medium"],div[diff="hard"]');
            replace(ratings, title, difficulty);

            // leetcode.com/problem-list/*/
            document.querySelectorAll('div > a.group.flex-col, div > div.group.flex-col').forEach((ele) => {
                title = ele.querySelector('.ellipsis.line-clamp-1');
                difficulty = ele.querySelector('p[class*="text-sd-"]');
                replace(ratings, title, difficulty);
            });

            // leetcode.com/search/*
            document
                .querySelectorAll('a[href^="/problems/"], a[href*="leetcode.com/problems/"]')
                .forEach((anchor) => {
                    const text = (anchor.textContent || '').trim();
                    if (!/^\d+\./.test(text)) return;

                    const row =
                        anchor.closest('[role="row"]') ||
                        anchor.closest('li') ||
                        anchor.closest('a')?.parentElement ||
                        anchor.parentElement;

                    difficulty = findDifficultyNode(row);
                    replace(ratings, anchor, difficulty);
                });
        } catch (err) {
            console.warn('[LeetCode Difficulty Rating] update failed:', err);
        } finally {
            observer.observe(document.body, {
                subtree: true,
                childList: true,
            });
        }
    }

    let timer;
    function debounce(func, timeout) {
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(null, args), timeout);
        };
    }

    const debouncedUpdate = debounce(update, 300);

    observer = new MutationObserver(() => {
        debouncedUpdate();
    });

    function isSupportedPage() {
        return /^https?:\/\/(www\.)?leetcode\.com\/(problemset|problems|problem-list|search)/.test(location.href);
    }

    if (isSupportedPage()) {
        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
        debouncedUpdate();
    }
})();

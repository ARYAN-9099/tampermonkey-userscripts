# Tampermonkey Userscripts

A curated set of practical Tampermonkey userscripts.

## Prerequisites

- Install Tampermonkey:
	- Chrome/Edge: https://www.tampermonkey.net
	- Firefox: https://addons.mozilla.org/firefox/addon/tampermonkey/

## How To Install A Script

1. Open any install link from the table below.
2. Tampermonkey will open an install page automatically.
3. Click **Install**.
4. Refresh the target website tab if it is already open.

## Script Catalog

| Script | Site | Hotkey | What it does | Install |
|---|---|---|---|---|
| Toggle Temporary Chat Mode (ChatGPT) | https://chatgpt.com | Alt+T | Toggles ChatGPT temporary chat mode from keyboard. | https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/toggle-temporary-chat-mode-chatgpt.user.js |
| Toggle Temporary Chat Mode (Gemini) | https://gemini.google.com/app | Alt+T | Toggles Gemini temporary chat mode from keyboard. | https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/toggle-temporary-chat-mode-gemini.user.js |
| ChatGPT Thinking Toggle Button | https://chatgpt.com | None | Adds a button near composer controls to toggle Thinking mode.(not working in free tier as no more thinking in free tier) | https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/chatgpt-thinking-toggle-button.user.js |
| Focus Search Box (Slash Hotkey) | Most sites | / (or Ctrl+/) | Focuses search-like inputs quickly; includes menu options for enable/disable, hotkey mode, and hostname blacklist. | https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/focus-search-box.user.js |
| Copy LeetCode Problem + Code | https://leetcode.com/problems/* | None | Adds IDE toolbar buttons to copy problem text, code, testcases, and run result summary. | https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/leetcode-copy-problem-code.user.js |
| LeetCode Difficulty Rating | https://leetcode.com | None | Replaces difficulty labels with contest-style ratings; keeps original label when no rating exists. | https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/leetcode-difficulty-rating.user.js |
| Temp Mail Copy OTP Button | https://temp-mail.org | None | Adds a Copy OTP button and extracts likely OTP values from inbox preview text. | https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/tempmail-copy-otp.user.js |
| YouTube Progress Bar Back to Red | YouTube + YouTube Music | None | Forces progress bar accent back to classic red. | https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/youtube-progress-bar-red.user.js |

## Notes And Limitations

- Some sites (especially ChatGPT, Gemini, and LeetCode) change UI structure often. If a script stops working, selectors may need an update.
- ChatGPT Thinking mode availability depends on account tier and current product rollout.
- The LeetCode rating script depends on external rating data from:
	https://github.com/zerotrac/leetcode_problem_rating

## Repository Structure

- Root `.user.js` files are Tampermonkey userscripts.
- `temp extension files/` contains experimental browser extension files and is not required for Tampermonkey usage.

## License

MIT

// ==UserScript==
// @name         ChatGPT Thinking Toggle Button
// @namespace    https://github.com/ARYAN-9099/tampermonkey-userscripts
// @version      1.3
// @description  Adds a custom button to toggle "Thinking" mode next to the mic button on chatgpt.com
// @match        https://chatgpt.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/chatgpt-thinking-toggle-button.user.js
// @downloadURL  https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/chatgpt-thinking-toggle-button.user.js
// ==/UserScript==

(function () {
  "use strict";

  const BUTTON_ID = "custom-thinking-toggle-btn";
  const BUTTON_WRAP_ID = "custom-thinking-toggle-wrap";
  const STYLE_ID = "custom-thinking-toggle-style";

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
#${BUTTON_WRAP_ID} {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  transform: translateX(8px);
}

#${BUTTON_ID} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  min-width: 2.25rem;
  min-height: 2.25rem;
  padding: 0;
  flex: 0 0 auto;
  vertical-align: middle;
}

#${BUTTON_ID} .icon {
  width: 20px;
  height: 20px;
}
`;
    document.head.appendChild(style);
  }

  function runUserLogic() {
    const plusButton = document.querySelector("#composer-plus-btn");

    if (plusButton) {
      plusButton.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true }),
      );

      setTimeout(() => {
        const thinkingOption = [
          ...document.querySelectorAll('[role="menuitemradio"]'),
        ].find((el) => el.textContent.includes("Thinking"));

        if (thinkingOption) {
          thinkingOption.click();
          console.log("🧠 Toggled Thinking mode.");
        } else {
          console.warn("⚠️ Thinking option not found.");
        }
      }, 200);
    } else {
      console.warn("⚠️ Composer plus button not found.");
    }
  }

  function addThinkingButton() {
    if (document.getElementById(BUTTON_ID)) return;

    ensureStyles();

    const voiceButton = document.querySelector('button[aria-label="Start Voice"]');
    const micButton = document.querySelector(
      'button[aria-label="Start dictation"], button[aria-label="Dictate button"]',
    );
    const anchorButton = voiceButton || micButton;

    if (!anchorButton) return;

    const controlsRow =
      micButton?.parentElement ||
      voiceButton?.closest('div[class*="items-center"]') ||
      anchorButton.parentElement;

    if (!controlsRow) return;

    const voiceCluster = voiceButton
      ? voiceButton.closest("div.inline-flex")?.parentElement || voiceButton
      : null;

    const insertBeforeNode = voiceCluster || micButton?.nextElementSibling || anchorButton;
    const parentContainer = controlsRow;

    if (!parentContainer) return;

    const newBtn = document.createElement("button");
    newBtn.id = BUTTON_ID;
    newBtn.type = "button";
    newBtn.className = "composer-btn h-9 min-h-9 w-9 min-w-9";
    newBtn.setAttribute("aria-label", "Toggle Thinking");

    newBtn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="20"
     height="20"
     class="icon">
  <use href="/cdn/assets/sprites-core-o8lw6oto.svg#e717cc"
       fill="currentColor"></use>
</svg>
`;

    newBtn.addEventListener("click", (e) => {
      e.preventDefault();
      runUserLogic();
    });

    const wrap = document.createElement("div");
    wrap.id = BUTTON_WRAP_ID;
    wrap.appendChild(newBtn);

    parentContainer.insertBefore(wrap, insertBeforeNode);
  }

  const observer = new MutationObserver(() => {
    addThinkingButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Run once immediately so we do not rely on future mutations only.
  addThinkingButton();
})();

// ==UserScript==
// @name         ChatGPT Thinking Toggle Button
// @namespace    https://github.com/ARYAN-9099/tampermonkey-userscripts
// @version      1.2
// @description  Adds a custom button to toggle "Thinking" mode next to the mic button on chatgpt.com
// @match        https://chatgpt.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/chatgpt-thinking-toggle-button.user.js
// @downloadURL  https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/chatgpt-thinking-toggle-button.user.js
// ==/UserScript==

(function () {
  "use strict";

  const BUTTON_ID = "custom-thinking-toggle-btn";

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

    const micButton = document.querySelector(
      'button[aria-label="Start dictation"], button[aria-label="Dictate button"], button[aria-label="Start Voice"]',
    );

    if (!micButton) return;

    const micContainer = micButton.closest("span");
    const insertBeforeNode = micContainer || micButton;
    const parentContainer = insertBeforeNode.parentElement;

    if (!parentContainer) return;

    const newBtn = document.createElement("button");
    newBtn.id = BUTTON_ID;
    newBtn.type = "button";
    newBtn.className = "composer-btn";
    newBtn.setAttribute("aria-label", "Toggle Thinking");
    newBtn.style.marginRight = "-5px";

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

    parentContainer.insertBefore(newBtn, insertBeforeNode);
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

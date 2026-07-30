// ==UserScript==
// @name         Temp Mail Copy OTP Button
// @namespace    https://github.com/ARYAN-9099/tampermonkey-userscripts
// @version      1.0.1
// @description  Adds a Copy OTP button near the email copy button and extracts OTP from inbox preview text.
// @match        *://temp-mail.org/*
// @match        *://*.temp-mail.org/*
// @run-at       document-idle
// @grant        GM_setClipboard
// @updateURL    https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/tempmail-copy-otp.user.js
// @downloadURL  https://raw.githubusercontent.com/ARYAN-9099/tampermonkey-userscripts/main/tempmail-copy-otp.user.js
// ==/UserScript==

(function () {
  "use strict";

  const BUTTON_ID = "tm-copy-otp-btn";

  function toast(message, ok) {
    const root = document.createElement("div");
    root.textContent = message;
    root.style.position = "fixed";
    root.style.right = "16px";
    root.style.bottom = "16px";
    root.style.zIndex = "2147483647";
    root.style.padding = "10px 14px";
    root.style.borderRadius = "10px";
    root.style.fontSize = "13px";
    root.style.fontWeight = "600";
    root.style.color = "#fff";
    root.style.background = ok ? "#00b088" : "#f04438";
    root.style.boxShadow = "0 8px 24px rgba(0,0,0,0.22)";
    root.style.opacity = "0";
    root.style.transform = "translateY(8px)";
    root.style.transition = "opacity 140ms ease, transform 140ms ease";

    document.body.appendChild(root);
    requestAnimationFrame(() => {
      root.style.opacity = "1";
      root.style.transform = "translateY(0)";
    });

    window.setTimeout(() => {
      root.style.opacity = "0";
      root.style.transform = "translateY(8px)";
      window.setTimeout(() => root.remove(), 180);
    }, 1500);
  }

  function getVisibleMailItems() {
    return Array.from(document.querySelectorAll(".inbox-dataList ul > li"))
      .filter((li) => {
        if (li.classList.contains("hide")) {
          return false;
        }

        if (li.offsetParent === null) {
          return false;
        }

        return Boolean(li.querySelector("a.viewLink[data-mail-id]"));
      });
  }

  function pickPreviewText() {
    const items = getVisibleMailItems();
    if (!items.length) {
      return "";
    }

    const first = items[0];
    const subjectA = first.querySelector("a.title-subject");
    const subjectMobile = first.querySelector(".inboxSubject.small");
    const senderName = first.querySelector(".inboxSenderName");
    const senderEmail = first.querySelector(".inboxSenderEmail");

    return [
      subjectA?.textContent,
      subjectMobile?.textContent,
      senderName?.textContent,
      senderEmail?.textContent,
    ]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function extractOtp(text) {
    if (!text) {
      return null;
    }

    // Prioritize code-like numbers commonly used in OTP emails.
    const codePatterns = [
      /\b(?:otp|code|verification|passcode|pin)\D{0,20}(\d{4,8})\b/i,
      /\b(\d{6})\b/,
      /\b(\d{4,8})\b/,
    ];

    for (const pattern of codePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  async function copyText(value) {
    if (typeof GM_setClipboard === "function") {
      GM_setClipboard(value);
      return;
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(value);
      return;
    }

    const ta = document.createElement("textarea");
    ta.value = value;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }

  async function onCopyOtpClick() {
    const previewText = pickPreviewText();
    const otp = extractOtp(previewText);

    if (!otp) {
      toast("OTP not found in preview", false);
      return;
    }

    try {
      await copyText(otp);
      toast(`OTP copied: ${otp}`, true);
    } catch (_error) {
      toast("Failed to copy OTP", false);
    }
  }

  function createButtonLike(baseButton) {
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.type = "button";

    // Copy the classes, but remove the site's native "click-to-copy" class
    // to prevent it from accidentally trying to copy the email address
    btn.className = baseButton.className.replace("click-to-copy", "").trim();

    // Inject the same span icon used by the site, followed by our text
    btn.innerHTML = '<span class="icon-control control-copy"></span> Copy OTP';
    btn.style.marginLeft = "8px";
    btn.addEventListener("click", onCopyOtpClick);
    return btn;
  }

  function ensureButton() {
    if (document.getElementById(BUTTON_ID)) {
      return;
    }

    const copyBtn = document.querySelector("#click-to-copy") || document.querySelector("button.copyIconGreenBtn");
    if (!copyBtn || !copyBtn.parentElement) {
      return;
    }

    const otpBtn = createButtonLike(copyBtn);
    copyBtn.insertAdjacentElement("afterend", otpBtn);
  }

  const observer = new MutationObserver(() => {
    ensureButton();
  });

  ensureButton();
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
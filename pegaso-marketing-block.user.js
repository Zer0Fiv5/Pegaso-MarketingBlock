// ==UserScript==
// @name         Pegaso - Marketing Block
// @namespace    https://lms.pegaso.multiversity.click/
// @version      1.0.0
// @description  Hides marketing UI elements, closes known popups, removes the cookie banner, and hides the "Per Te" section on UniPegaso / Multiversity pages.
// @author       Zer0Fiv5
// @license      MIT
// @match        https://*.unipegaso.it/*
// @match        https://*.multiversity.click/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  "use strict";

  const STYLE_ID = "pegaso-clean-ui-style";
  const HIDDEN_CLASS = "pegaso-hidden-by-userscript";

  function normalizeText(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function isVisible(element) {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      element.offsetParent !== null
    );
  }

  function addGlobalStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      [data-modal-hide="popup-modal"] {
        pointer-events: auto !important;
      }

      .${HIDDEN_CLASS} {
        display: none !important;
      }
    `;

    (document.head || document.documentElement).appendChild(style);
  }

  function hideElement(element) {
    if (!element) return;
    element.classList.add(HIDDEN_CLASS);
  }

  function closeMarketingPopup() {
    const buttons = document.querySelectorAll('button[data-modal-hide="popup-modal"]');

    for (const button of buttons) {
      if (!isVisible(button)) continue;

      const modal =
        button.closest('[role="dialog"]') ||
        button.closest(".fixed") ||
        button.closest(".absolute") ||
        button.parentElement;

      if (modal && !modal.classList.contains("invisible")) {
        button.click();
      }
    }
  }

  function hideCookieBanner() {
    const cookieLink = document.querySelector(
      'a[href="https://www.unipegaso.it/website/politica-dei-cookie"]'
    );

    if (!cookieLink) return;

    const banner =
      cookieLink.closest("div.fixed.inset-x-0.bottom-0.bg-platform-secondary") ||
      cookieLink.closest("div.fixed") ||
      cookieLink.closest("section") ||
      cookieLink.parentElement;

    if (!banner) return;

    hideElement(banner);

    const wrapper = banner.parentElement;
    if (wrapper && wrapper.children.length === 1) {
      hideElement(wrapper);
    }
  }

  function hidePerTeSection() {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

    for (const heading of headings) {
      if (normalizeText(heading.textContent) !== "per te") continue;

      const directContainer = heading.parentElement;

      if (directContainer && directContainer.querySelector(".vueperslides")) {
        hideElement(directContainer);
        continue;
      }

      const nextElement = heading.nextElementSibling;
      if (nextElement && nextElement.classList.contains("vueperslides")) {
        hideElement(heading);
        hideElement(nextElement);

        const parent = heading.parentElement;
        if (parent && parent.children.length <= 2) {
          hideElement(parent);
        }
        continue;
      }

      let current = heading.parentElement;
      for (let depth = 0; depth < 4 && current; depth += 1) {
        if (current.querySelector(".vueperslides")) {
          hideElement(current);
          break;
        }
        current = current.parentElement;
      }
    }
  }

  function cleanup() {
    addGlobalStyles();
    closeMarketingPopup();
    hideCookieBanner();
    hidePerTeSection();
  }

  cleanup();

  let scheduled = false;

  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      cleanup();
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();

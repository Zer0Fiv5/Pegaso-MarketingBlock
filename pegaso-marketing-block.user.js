// ==UserScript==
// @name         Pegaso - Marketing Block
// @namespace    https://lms.pegaso.multiversity.click/
// @version      1.1.0
// @description  Hides marketing UI elements, closes known popups, removes the cookie banner, hides the "Per Te" section, and disables upsell course banners on UniPegaso / Multiversity pages.
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
  const DISABLED_CARD_CLASS = "pegaso-disabled-click-card";

  // Normalizza testo per confronto
function normalizeText(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }
  
  // Verifica visibilità elemento
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

  // Aggiunge stili globali
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

      .${DISABLED_CARD_CLASS},
      .${DISABLED_CARD_CLASS} * {
        cursor: default !important;
      }

      .${DISABLED_CARD_CLASS} {
        pointer-events: auto !important;
      }

      .${DISABLED_CARD_CLASS} .btn-plus-container {
        pointer-events: none !important;
        opacity: 0.45 !important;
      }

      .${DISABLED_CARD_CLASS} img[src*="plus-square"] {
        opacity: 0.45 !important;
      }
    `;

    (document.head || document.documentElement).appendChild(style);
  }

  // Nasconde elemento DOM
function hideElement(element) {
    if (!element) return;
    element.classList.add(HIDDEN_CLASS);
  }

  // Blocca click su elemento
function blockClick(element) {
    if (!element || element.dataset.pegasoClickBlocked === "1") return;

    element.dataset.pegasoClickBlocked = "1";
    element.classList.add(DISABLED_CARD_CLASS);
    element.setAttribute("aria-disabled", "true");
    element.setAttribute("tabindex", "-1");

    const stop = (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    };

    const options = {
      capture: true,
      passive: false,
    };

    element.addEventListener("click", stop, options);
    element.addEventListener("dblclick", stop, options);
    element.addEventListener("mousedown", stop, options);
    element.addEventListener("mouseup", stop, options);
    element.addEventListener("pointerdown", stop, options);
    element.addEventListener("pointerup", stop, options);
    element.addEventListener("touchstart", stop, options);
    element.addEventListener("touchend", stop, options);

    element.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter" || event.key === " ") {
          stop(event);
        }
      },
      options
    );

    element.querySelectorAll("a, button, [role='button'], [tabindex]").forEach((child) => {
      child.setAttribute("aria-disabled", "true");
      child.setAttribute("tabindex", "-1");
    });
  }

  // Chiude pop‑up marketing
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

  // Rimuove banner cookie
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

  // Nasconde sezione Per Te
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

  // Disabilita banner upsell
function disableUpsellCourseBanners() {
    const textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span");

    for (const element of textElements) {
      const text = normalizeText(element.textContent);

      const isUpsellText =
        text.includes("accresci le tue competenze") ||
        text.includes("accedendo a più corsi") ||
        text.includes("accedendo a piu corsi");

      if (!isUpsellText) continue;

      const card =
        element.closest(".cursor-pointer") ||
        element.closest(".relative.rounded-lg") ||
        element.closest(".relative") ||
        element.parentElement;

      if (!card) continue;

      //blockClick(card);
      hideElement(card);
    }
  }

  // Esegue pulizia UI
function cleanup() {
    addGlobalStyles();
    closeMarketingPopup();
    hideCookieBanner();
    hidePerTeSection();
    disableUpsellCourseBanners();
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
// ==UserScript==
// @name         Pegaso - Marketing Block
// @namespace    https://lms.pegaso.multiversity.click/
// @version      1.2.2
// @description  Hides marketing UI elements, closes known popups, removes the cookie banner, hides the "Per Te" section, and cleans upsell course cards on UniPegaso / Multiversity pages.
// @author       Zer0Fiv5
// @license      MIT
// @match        https://*.unipegaso.it/*
// @match        https://*.multiversity.click/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Zer0Fiv5/Pegaso-MarketingBlock/main/pegaso-marketing-block.user.js
// @updateURL    https://raw.githubusercontent.com/Zer0Fiv5/Pegaso-MarketingBlock/main/pegaso-marketing-block.user.js
// @run-at       document-idle
// ==/UserScript==

(() => {
  "use strict";

  const STYLE_ID = "pegaso-clean-ui-style";
  const HIDDEN_CLASS = "pegaso-hidden-by-userscript";
  const DISABLED_CARD_CLASS = "pegaso-disabled-click-card";
  const CLEAN_UPSELL_CARD_CLASS = "pegaso-clean-upsell-card";
  const CLEAN_UPSELL_CONTENT_CLASS = "pegaso-clean-upsell-content";

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

      .${CLEAN_UPSELL_CARD_CLASS} {
        cursor: default !important;
      }

      .${CLEAN_UPSELL_CARD_CLASS} * {
        cursor: default !important;
      }

      .${CLEAN_UPSELL_CARD_CLASS} .btn-plus-container,
      .${CLEAN_UPSELL_CARD_CLASS} .${CLEAN_UPSELL_CONTENT_CLASS} {
        display: none !important;
      }

      .${CLEAN_UPSELL_CARD_CLASS} img[src*="plus-square"] {
        display: none !important;
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
    element.classList.remove("cursor-pointer");

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

  // Chiude pop-up marketing
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

  // Disabilita upsell
  function findUpsellCard(element) {
    if (!element) return null;

    let current = element;

    for (let depth = 0; depth < 8 && current; depth += 1) {
      const hasPlusButton = !!current.querySelector(".btn-plus-container");
      const hasCoursesImage = !!current.querySelector('img[src*="courses-"]');
      const hasCardShape =
        current.classList.contains("rounded-lg") &&
        current.classList.contains("bg-white") &&
        current.classList.contains("h-56");

      if ((hasPlusButton || hasCoursesImage) && hasCardShape) {
        return current;
      }

      current = current.parentElement;
    }

    return (
      element.closest(".relative.w-full.rounded-lg") ||
      element.closest(".rounded-lg.bg-white") ||
      null
    );
  }

  // Pulisce solo il contenuto interno della card upsell, lasciando la card visibile
  function cleanUpsellCard(card) {
    if (!card) return;

    card.classList.add(CLEAN_UPSELL_CARD_CLASS);
    blockClick(card);

    const contentWrapper =
      card.querySelector(".btn-plus-container")?.closest(".flex.flex-col.justify-center.items-center") ||
      card.querySelector(".btn-plus-container")?.parentElement ||
      null;

    if (contentWrapper) {
      contentWrapper.classList.add(CLEAN_UPSELL_CONTENT_CLASS);
      hideElement(contentWrapper);
    }

    card.querySelectorAll("p").forEach((paragraph) => {
      const text = normalizeText(paragraph.textContent);

      if (
        text.includes("accresci le tue competenze") ||
        text.includes("accedendo a più corsi") ||
        text.includes("accedendo a piu corsi")
      ) {
        hideElement(paragraph);
      }
    });

    card.querySelectorAll(".btn-plus-container, img[src*='plus-square']").forEach((element) => {
      hideElement(element);
    });
  }

  // Disabilita solo le card upsell
  function disableUpsellCourseBanners() {
    const textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span");

    for (const element of textElements) {
      const text = normalizeText(element.textContent);

      const isUpsellText =
        text.includes("accresci le tue competenze") ||
        text.includes("accedendo a più corsi") ||
        text.includes("accedendo a piu corsi");

      if (!isUpsellText) continue;

      const card = findUpsellCard(element);
      if (!card) continue;

      cleanUpsellCard(card);
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

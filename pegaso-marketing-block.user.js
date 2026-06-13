// ==UserScript==
// @name         Pegaso - Marketing Block
// @namespace    https://lms.pegaso.multiversity.click/
// @version      1.5.2
// @description  Hides marketing UI elements, closes known popups, removes the cookie banner, hides the "Per Te" section, and cleans upsell course cards on UniPegaso / Multiversity pages.
// @author       Zer0Fiv5
// @license      MIT
// @match        https://*.unipegaso.it/*
// @match        https://*.multiversity.click/*
// @grant        none
// @homepageURL  https://github.com/Zer0Fiv5/Pegaso-MarketingBlock
// @supportURL   https://github.com/Zer0Fiv5/Pegaso-MarketingBlock/issues
// @downloadURL  https://raw.githubusercontent.com/Zer0Fiv5/Pegaso-MarketingBlock/main/pegaso-marketing-block.user.js
// @updateURL    https://raw.githubusercontent.com/Zer0Fiv5/Pegaso-MarketingBlock/main/pegaso-marketing-block.user.js
// @run-at       document-idle
// ==/UserScript==

(() => {
  "use strict";

  // CONFIG
  // Toggle individual cleanup actions here.
  const CONFIG = {
    // Close known marketing popups automatically.
    closeMarketingPopup: true,
    // Hide the cookie banner at the bottom of the page.
    hideCookieBanner: true,
    // Hide the "Per Te" recommendation carousel.
    hidePerTeSection: true,
    // Hide the "Pianificazione esami" promo block.
    hideExamPlanningSection: true,
    // Clean upsell cards shown in course tabs.
    disableUpsellCourseBanners: true,
    // Hide the "COMUNICAZIONE IMPORTANTE" block on exam-online.
    hideImportantCommunication: false,
    // Hide the "Registrazione dell'ambiente" popup on exam-online.
    hideEnvironmentRegistrationPopup: false,
  };

  const APPELLI_ICON_URL = "https://lms.pegaso.multiversity.click/assets/calendar-filled-f49c23bb.svg";
  const APPELLI_LINK_CLASS = "pegaso-appelli-sidebar-link";
  const APPELLI_LABEL_CLASS = "pegaso-appelli-sidebar-label";

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

      .${APPELLI_LINK_CLASS} {
        display: flex !important;
        align-items: center !important;
        gap: 0.75rem !important;
        min-height: 1.75rem !important;
        height: auto !important;
        line-height: 1.2 !important;
      }

      .${APPELLI_LINK_CLASS} img {
        flex: 0 0 auto;
      }

      .${APPELLI_LABEL_CLASS} {
        display: inline-block !important;
        font-size: 0.95rem;
        font-weight: 500;
        letter-spacing: 0.01em;
        line-height: 1.2;
        white-space: nowrap;
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

  // Nasconde il blocco Pianificazione esami
  function hideExamPlanningSection() {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

    for (const heading of headings) {
      if (normalizeText(heading.textContent) !== "pianificazione esami") continue;

      let current = heading;
      let target = null;

      for (let depth = 0; depth < 6 && current; depth += 1) {
        current = current.parentElement;
        if (!current) break;

        const normalizedText = normalizeText(current.textContent);
        const hasPlanningButton = [...current.querySelectorAll("button")].some(
          (button) => normalizeText(button.textContent) === "crea pianificazione"
        );

        if (normalizedText.includes("ai-powered") || hasPlanningButton) {
          target = current;
          break;
        }
      }

      hideElement(target || heading.parentElement || heading);
    }
  }

  // Nasconde il blocco "COMUNICAZIONE IMPORTANTE" nella pagina esami
  function hideImportantCommunication() {
    const candidates = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, div, span, strong");

    for (const candidate of candidates) {
      if (normalizeText(candidate.textContent) !== "comunicazione importante") continue;

      let target = candidate;
      let current = candidate;

      for (let depth = 0; depth < 6 && current; depth += 1) {
        current = current.parentElement;
        if (!current) break;

        const className = String(current.className || "");
        const text = normalizeText(current.textContent);
        const isWalkmeBlock =
          className.includes("walkme-shoutout-") ||
          className.includes("walkme-to-remove") ||
          className.includes("wm-visual-design-full-flex-canvas");

        if (isWalkmeBlock || text.includes("banner di presenza")) {
          target = current;
          break;
        }
      }

      hideElement(target);
    }
  }

  // Nasconde il popup "Registrazione dell'ambiente"
  function hideEnvironmentRegistrationPopup() {
    const dialogs = document.querySelectorAll('[role="dialog"], dialog');

    for (const dialog of dialogs) {
      const text = normalizeText(dialog.textContent);

      if (
        !text.includes("registrazione dell'ambiente") &&
        !text.includes("nuova procedura per la prova online")
      ) {
        continue;
      }

      const target =
        dialog.closest(".fixed.inset-0") ||
        dialog.closest(".fixed") ||
        dialog;

      hideElement(target);
    }
  }

  // Aggiunge il collegamento "Appelli" nel menu laterale sinistro
  function addAppelliSidebarLink() {
    const sidebar = document.getElementById("scrollableDiv");
    if (
      !sidebar ||
      sidebar.querySelector('a[href="/appelli"]') ||
      sidebar.querySelector('[data-pegaso-appelli-link="1"]')
    ) {
      return;
    }

    const referenceLink =
      sidebar.querySelector('a[href="/exam-online"]') ||
      sidebar.querySelector('a[href="/video-conference"]') ||
      sidebar.querySelector("a");

    if (!referenceLink) return;

    const link = document.createElement("a");
    link.href = "/appelli";
    link.className = `flex items-center nav-item px-9 mb-6 hover:text-platform-primary ${APPELLI_LINK_CLASS}`;
    link.dataset.pegasoAppelliLink = "1";
    link.title = "Appelli";
    link.setAttribute("aria-label", "Appelli");

    const icon = document.createElement("img");
    icon.className = "h-5";
    icon.src = APPELLI_ICON_URL;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.className = APPELLI_LABEL_CLASS;
    label.textContent = "Appelli";

    link.appendChild(icon);
    link.appendChild(label);

    if (window.location.pathname === "/appelli") {
      link.classList.add("nav-item-filled");
      link.setAttribute("aria-current", "page");
    }

    referenceLink.insertAdjacentElement("afterend", link);
  }

  const UPSELL_TEXT_PATTERNS = [
    "accresci le tue competenze",
    "accedendo a più corsi",
    "accedendo a piu corsi",
  ];

  function isUpsellText(text) {
    const normalized = normalizeText(text);
    return UPSELL_TEXT_PATTERNS.some((pattern) => normalized.includes(pattern));
  }

  function hasUpsellMarkers(card) {
    return !!card.querySelector(
      ".btn-plus-container, img[src*='plus-square'], a[href*='/all-inclusive']"
    );
  }

  function isLikelyUpsellCard(card) {
    if (!card) return false;

    const text = normalizeText(card.textContent);
    return hasUpsellMarkers(card) || isUpsellText(text);
  }

  // Disabilita upsell
  function findUpsellCard(element) {
    if (!element) return null;

    let current = element;

    for (let depth = 0; depth < 10 && current; depth += 1) {
      const hasCardShape =
        current.classList.contains("rounded-lg") ||
        current.classList.contains("border") ||
        current.classList.contains("vueperslide");

      if (hasCardShape && isLikelyUpsellCard(current)) {
        return current;
      }

      current = current.parentElement;
    }

    return (
      element.closest(".vueperslide") ||
      element.closest(".relative.w-full.rounded-lg") ||
      element.closest(".rounded-lg.bg-white") ||
      element.closest(".border.rounded-lg") ||
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
      if (!isUpsellText(element.textContent)) continue;

      const card = findUpsellCard(element);
      if (!card) continue;

      cleanUpsellCard(card);
    }

    for (const card of document.querySelectorAll(".vueperslide, .rounded-lg.bg-white, .border.rounded-lg")) {
      if (!isLikelyUpsellCard(card)) continue;
      cleanUpsellCard(card);
    }
  }

  // Esegue pulizia UI
  function cleanup() {
    addGlobalStyles();
    if (CONFIG.closeMarketingPopup) closeMarketingPopup();
    if (CONFIG.hideCookieBanner) hideCookieBanner();
    if (CONFIG.hidePerTeSection) hidePerTeSection();
    if (CONFIG.hideExamPlanningSection) hideExamPlanningSection();
    if (CONFIG.disableUpsellCourseBanners) disableUpsellCourseBanners();
    if (CONFIG.hideImportantCommunication) hideImportantCommunication();
    if (CONFIG.hideEnvironmentRegistrationPopup) hideEnvironmentRegistrationPopup();
    addAppelliSidebarLink();
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

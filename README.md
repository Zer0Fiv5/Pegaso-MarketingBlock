# Pegaso Marketing Block

Userscript for UniPegaso and Multiversity pages that hides selected marketing interface elements, closes known popups, removes the cookie banner, and hides the **"Per Te"** section.

## What it does

This userscript helps clean up the page UI by automatically removing or hiding some non-essential interface elements.

Main features:

- Closes known marketing popups
- Hides the cookie banner
- Hides the **Per Te** section when it contains the related slider
- Hides the **Pianificazione esami** promo block
- Cleans upsell cards in the course tabs
- Can hide the **COMUNICAZIONE IMPORTANTE** block on `exam-online`
- Can hide the **Registrazione dell'ambiente** popup on `exam-online`
- Adds an **Appelli** sidebar entry with visible text next to the icon
- Re-runs cleanup automatically when the page updates dynamically
- Works on both `*.unipegaso.it` and `*.multiversity.click`

## Configuration

At the top of [`pegaso-marketing-block.user.js`](./pegaso-marketing-block.user.js) you will find a `CONFIG` block with `true` / `false` switches for each cleanup action.

Available toggles:

- `closeMarketingPopup`: close known marketing popups
- `hideCookieBanner`: hide the cookie banner
- `hidePerTeSection`: hide the **Per Te** recommendation carousel
- `hideExamPlanningSection`: hide the **Pianificazione esami** promo block
- `disableUpsellCourseBanners`: clean upsell cards in the course tabs
- `hideImportantCommunication`: hide the **COMUNICAZIONE IMPORTANTE** block on `exam-online` (`false` by default)
- `hideEnvironmentRegistrationPopup`: hide the **Registrazione dell'ambiente** popup on `exam-online` (`false` by default)

## Supported pages

The script runs on:

```text
https://*.unipegaso.it/*
https://*.multiversity.click/*
```

## Installation

To use this script, you need a userscript manager in your browser.

Supported managers include:

* Tampermonkey
* Violentmonkey
* Greasemonkey

### Install

Install the script directly from GitHub:

[Install Pegaso Marketing Block](https://raw.githubusercontent.com/Zer0Fiv5/Pegaso-MarketingBlock/main/pegaso-marketing-block.user.js)

Your userscript manager should detect the `.user.js` file automatically and show an installation screen.

After installation, visit a supported UniPegaso or Multiversity page and the script will run automatically.

### Automatic updates

The script supports automatic updates through the `@updateURL` metadata field.

When a new version is published on GitHub, your userscript manager can update the installed script automatically.

## Features

### Marketing popup closing

The script detects known popup close buttons and clicks them automatically when visible.

### Cookie banner hiding

The script looks for the known cookie policy link and hides the related banner container.

### "Per Te" section hiding

The script searches for headings named **Per Te** and hides the related content block when it detects the expected slider structure.

### "Pianificazione esami" block hiding

The script hides the promo block titled **Pianificazione esami**, including the related planning call-to-action.

### Upsell card cleanup

The script detects upsell cards in the course tabs and cleans their inner content while leaving the card shell visible.

### Exam online banners

The script can also hide the **COMUNICAZIONE IMPORTANTE** block and the **Registrazione dell'ambiente** popup on the `exam-online` page. Both options are available as `false` by default in the `CONFIG` block.

### Left sidebar shortcut

The script adds an **Appelli** sidebar entry to the left sidebar, pointing to `/appelli`, with visible text next to the icon.

### Dynamic page cleanup

Because the target sites may update content dynamically, the script uses a `MutationObserver` and re-applies cleanup after DOM changes.

## How it works

The script performs these actions:

1. Injects a small CSS helper class used to hide elements
2. Searches for visible marketing popup close buttons
3. Hides the cookie banner when detected
4. Searches for the **Per Te** heading
5. Hides the nearest matching section containing the slider
6. Hides the **Pianificazione esami** promo block
7. Cleans upsell cards found in the course tabs
8. Hides the exam-online communication block when enabled
9. Hides the exam-online environment registration popup when enabled
10. Adds the **Appelli** sidebar entry with visible text to the left sidebar
11. Observes the page for changes and repeats the cleanup when needed

## Usage

This script does not require manual commands.

Once installed, it runs automatically on matching pages.

## Notes

This script is intentionally focused on UI cleanup only.

It does not modify lesson progress, account data, or platform logic beyond closing or hiding selected visual elements.

## Limitations

This script depends on the current site structure and CSS classes.

It may stop working if the platform changes:

* DOM structure
* class names
* popup structure
* cookie banner structure
* slider layout for the **Per Te** section

If that happens, the selectors may need to be updated.

## Troubleshooting

### The script does not seem to work

Check that:

* the userscript is enabled
* you are on a supported domain
* the page has fully loaded
* your userscript manager did not block the script

### The popup is still visible

Possible reasons:

* the popup structure changed
* the close button selector changed
* the popup is loaded later than expected

Reloading the page may help confirm whether the observer is catching the updated DOM correctly.

### The "Per Te" section is still visible

Possible reasons:

* the heading text changed
* the slider structure changed
* the section is rendered differently on that page

### The upsell card is still visible

Possible reasons:

* the upsell text changed
* the card structure changed
* the card uses a new layout that is not yet covered by the selectors

### The exam-online popup or communication is still visible

Possible reasons:

* the page structure changed
* the block uses a different heading or dialog text
* the corresponding `CONFIG` toggle is still set to `false`

## Intended use

This project is intended as a browser-side UI cleanup helper for personal browsing convenience.

Use it responsibly and only where you are allowed to modify the client-side page experience.

## Disclaimer

This project is not affiliated with, endorsed by, or maintained by UniPegaso or Multiversity.

It is provided as an independent userscript for personal browser customization.

## Contributing

Issues and pull requests are welcome.

Useful contributions include:

* improving selectors
* supporting additional popup layouts
* making the section detection more resilient
* documenting layout changes
* improving compatibility across pages

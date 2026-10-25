import type { RichTextAllowedAttributes } from "@thewaver/ss-components";

export const WCAG_URLS = {
    "1.3.1": "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
    "1.4.2": "https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html",
    "1.4.13": "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html",
    "2.1.1": "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
    "2.1.2": "https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html",
    "2.1.4": "https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html",
    "2.2.2": "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html",
    "2.4.6": "https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html",
    "2.5.3": "https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html",
    "2.5.7": "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html",
    "2.5.8": "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html",
    "4.1.2": "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
    "4.1.3": "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html",
};

export const DOCS_PROSE_PROP_TAG = "prop";

export const DOCS_PROSE_WCAG_TAG = "wcag";

export const DOCS_PROSE_ALLOWED_ATTRIBUTES: RichTextAllowedAttributes = { [DOCS_PROSE_WCAG_TAG]: ["id"] };

import type { RichTextAllowedAttributes } from "./RichText.types";

import * as styles from "./RichText.css";

export const RICH_TEXT_DEFAULTS = {
    removeOtherTags: false,
    allowedAttributes: {} as RichTextAllowedAttributes,
};

export const RICH_TEXT_DEFAULT_CLASSES: Record<string, string> = {
    b: styles.boldText,
    i: styles.italicText,
    s: styles.strikedText,
    u: styles.underlineText,
    li: styles.listItem,
};

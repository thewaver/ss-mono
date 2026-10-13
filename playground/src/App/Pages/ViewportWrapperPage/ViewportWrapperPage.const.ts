import type { SelectOptionRecord } from "@thewaver/ss-components";

import * as styles from "./ViewportWrapperPage.css";

export const EXAMPLE_NAMES = {
    roaming: "A control roaming the viewport",
    scrolled: "An anchor inside a scrolled box",
};

export const COUNTRIES: SelectOptionRecord<string, never>[] = [
    { value: "Belgium" },
    { value: "Denmark" },
    { value: "Estonia" },
    { value: "Finland" },
    { value: "Germany" },
    { value: "Iceland" },
    { value: "Ireland" },
    { value: "Latvia" },
    { value: "Norway" },
    { value: "Poland" },
    { value: "Portugal" },
    { value: "Sweden" },
];

export const PERCENT = 100;

export const INNER_TOAST_GAP = 10;

export const INNER_TOAST_MARGIN = 10;

export const INNER_TOAST_MESSAGE = "Raised inside the square.";

export const SCROLL_SIZE = { width: styles.HOST_SIZE, height: styles.HOST_SIZE };

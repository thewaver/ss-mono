import type { TypewriterTextEffect } from "./TypewriterTextEffect.types";

import * as styles from "./TypewriterPage.css";

export const EXAMPLE_NAMES = {
    complex: "Complex",
    customInput: "Custom Input",
    phrases: "Phrases",
    karaoke: "Karaoke",
    scrollLit: "Lit by scrolling",
    outward: "Flying outward",
};

export const TEXT_EFFECTS: TypewriterTextEffect[] = ["fade", "scale", "glow", "drop", "slide"];

export const CUSTOM_TEXT_WIDTH = 320;

export const CUSTOM_TEXT_MIN_ROWS = 6;

export const CUSTOM_TEXT_MAX_ROWS = 12;

export const EXAMPLES_ROOT = "/src/App/Pages/TypewriterPage/Examples";

export const TEXT_EFFECT_MAP: Record<TypewriterTextEffect, string> = {
    fade: styles.typewriterFade,
    scale: styles.typewriterScale,
    glow: styles.typewriterGlow,
    drop: styles.typewriterDrop,
    slide: styles.typewriterSlide,
};

export const LYRIC = "Twinkle, twinkle, little star";

export const HOW_FAR_LINE_HAS_LABEL = "How far the line has been sung";

export const TEXT =
    "Scroll this past the middle of the box and it comes apart line by line: the first half flies off to the left, the second to the right, and back again on the way down.";

export const SCROLL_LIT_TEXT =
    "Every word here waits, dimmed, until it reaches the middle of the box, then lights up in reading order as it passes — and dims again on the way back down.";

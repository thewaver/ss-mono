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

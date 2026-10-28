import type { RGBAnimationSourceKey } from "./RGBAnimationPage.types";

export const EXAMPLE_NAMES = {
    glitch: "Glitch",
    swell: "Swell",
    orbit: "Orbit",
    focusPull: "Focus pull",
    twist: "Twist",
    hueSwap: "Hue swap",
    tilt: "Tilt",
    anaglyph: "Anaglyph",
    echo: "Echo",
};

export const EXAMPLES_ROOT = "/src/App/Pages/RGBAnimationPage/Examples";

export const FIELD_WIDTH = 110;

export const PHOTO_WIDTH = 240;

export const HEADLINE_WIDTH = 360;

export const HEADLINE_SOURCE = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="100"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="sans-serif" font-size="72" font-weight="bold" letter-spacing="4" fill="white" stroke="black" stroke-width="2">SIGNAL</text></svg>`,
)}`;

export const SOURCE_KEYS: RGBAnimationSourceKey[] = ["knight", "text"];

export const SOURCE_WIDTHS: Record<RGBAnimationSourceKey, number> = { knight: PHOTO_WIDTH, text: HEADLINE_WIDTH };

export const SOURCE_LABELS: Record<RGBAnimationSourceKey, string> = { knight: "A knight in armor", text: "Signal" };

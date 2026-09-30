import { Color } from "@thewaver/ss-utils";
import { createTheme, createThemeContract, globalStyle } from "@vanilla-extract/css";

import {
    type ColorFamily,
    DEFAULT_THEME_VALUES,
    REACT_THEME_VALUES,
    SOLID_THEME_VALUES,
    SVELTE_THEME_VALUES,
    VUE_THEME_VALUES,
} from "./Theme.const";
import { toCssFamily } from "./Theme.utils";

const SECONDARY_ROTATIONS = [90, 180, 270];
const RAINBOW_SATURATION = 75;
const RAINBOW_EDGE_SATURATION = 50;
const RAINBOW_EDGES_UNDER_WHITE = { dark: 40, light: 50 };
const RAINBOW_EDGES_UNDER_BLACK = { dark: 50, light: 60 };
const RAINBOW_MID_LIGHTNESS = 50;
const LIGHTNESS_MIN = 0;
const LIGHTNESS_MAX = 100;
const WHITE: Color.RGB = { r: 255, g: 255, b: 255 };
const BLACK: Color.RGB = { r: 0, g: 0, b: 0 };

const rotateFamily = (family: ColorFamily, degrees: number): ColorFamily => ({
    dark: { ...family.dark, h: family.dark.h + degrees },
    main: { ...family.main, h: family.main.h + degrees },
    light: { ...family.light, h: family.light.h + degrees },
    contrast: { ...family.contrast, h: family.contrast.h + degrees },
});

const contrastWithin = (family: ColorFamily) =>
    Color.getContrastRatio(Color.HSL.toRgb(family.main), Color.HSL.toRgb(family.contrast)) ?? 0;

const toSecondary = (primary: ColorFamily) =>
    SECONDARY_ROTATIONS.map((degrees) => rotateFamily(primary, degrees)).reduce((best, candidate) =>
        contrastWithin(candidate) > contrastWithin(best) ? candidate : best,
    );

const toRainbowFamily = (hue: number): ColorFamily => {
    const [picked] = [
        { against: WHITE, text: { h: hue, s: RAINBOW_SATURATION, l: LIGHTNESS_MAX }, edges: RAINBOW_EDGES_UNDER_WHITE },
        { against: BLACK, text: { h: hue, s: RAINBOW_SATURATION, l: LIGHTNESS_MIN }, edges: RAINBOW_EDGES_UNDER_BLACK },
    ]
        .flatMap(({ against, text, edges }) => {
            const fill = Color.getContrastingColor(hue, RAINBOW_SATURATION, against, "AAA");

            return fill ? [{ fill, text, edges }] : [];
        })
        .sort((a, b) => Math.abs(a.fill.l - RAINBOW_MID_LIGHTNESS) - Math.abs(b.fill.l - RAINBOW_MID_LIGHTNESS));

    return {
        dark: { h: hue, s: RAINBOW_EDGE_SATURATION, l: picked.edges.dark },
        main: picked.fill,
        light: { h: hue, s: RAINBOW_EDGE_SATURATION, l: picked.edges.light },
        contrast: picked.text,
    };
};

const toThemeValues = <T extends { color: { primary: ColorFamily } }>(values: T) => ({
    ...values,
    color: {
        ...values.color,
        primary: toCssFamily(values.color.primary),
        secondary: toCssFamily(toSecondary(values.color.primary)),
    },
});

export const RAINBOW_HUES = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5] as const;

export const RAINBOW = Object.fromEntries(RAINBOW_HUES.map((hue) => [hue, toCssFamily(toRainbowFamily(hue))]));

export const themeVars = createThemeContract(toThemeValues(DEFAULT_THEME_VALUES));

export const PLAYGROUND_THEMES = {
    default: createTheme(themeVars, toThemeValues(DEFAULT_THEME_VALUES)),
    react: createTheme(themeVars, toThemeValues(REACT_THEME_VALUES)),
    solid: createTheme(themeVars, toThemeValues(SOLID_THEME_VALUES)),
    svelte: createTheme(themeVars, toThemeValues(SVELTE_THEME_VALUES)),
    vue: createTheme(themeVars, toThemeValues(VUE_THEME_VALUES)),
};

globalStyle("*", {
    boxSizing: "border-box",
    scrollbarWidth: "thin",
    scrollbarColor: [
        `${themeVars.color.primary.main} ${themeVars.color.background.dark}`,
        `${themeVars.color.primary.main} rgb(from ${themeVars.color.background.dark} r g b / 25%)`,
    ],
});

globalStyle(":focus", {
    outline: "0 none",
});

export const FOCUS_RING_WIDTH = 2;

globalStyle(":focus-visible", {
    outline: `${FOCUS_RING_WIDTH}px solid ${themeVars.color.outline.main}`,
});

globalStyle(":disabled, [aria-disabled='true']", {
    cursor: "not-allowed",
});

globalStyle("::-webkit-scrollbar", {
    width: 8,
    height: 8,
});

globalStyle("::-webkit-scrollbar-corner", {
    backgroundColor: themeVars.color.primary.main,
});

globalStyle("::-webkit-scrollbar-track", {
    backgroundColor: [themeVars.color.background.dark, `rgb(from ${themeVars.color.background.dark} r g b / 25%)`],
});

globalStyle("::-webkit-scrollbar-thumb", {
    backgroundColor: themeVars.color.primary.main,
});

globalStyle("::-webkit-scrollbar-track:hover, ::-webkit-scrollbar-thumb:hover", {
    filter: themeVars.hover.filter,
});

globalStyle("a, a:visited", {
    color: themeVars.color.primary.main,
    textDecoration: "none",
    outlineOffset: 2,
});

globalStyle("a:hover:not([aria-disabled='true'])", {
    filter: themeVars.hover.filter,
});

globalStyle("a:active:not([aria-disabled='true'])", {
    filter: themeVars.active.filter,
});

globalStyle("body", {
    margin: 0,
    padding: 0,
    color: themeVars.color.background.contrast,
    backgroundColor: "#202020",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 16,
    lineHeight: 1.5,
    colorScheme: themeVars.scheme,
});

globalStyle(".shiki", {
    margin: 0,
    padding: 0,
});

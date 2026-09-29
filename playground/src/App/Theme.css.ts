import { createTheme, createThemeContract, globalStyle } from "@vanilla-extract/css";

import {
    DEFAULT_THEME_VALUES,
    REACT_THEME_VALUES,
    SOLID_THEME_VALUES,
    SVELTE_THEME_VALUES,
    VUE_THEME_VALUES,
} from "./Theme.const";

export const themeVars = createThemeContract(DEFAULT_THEME_VALUES);

export const PLAYGROUND_THEMES = {
    default: createTheme(themeVars, DEFAULT_THEME_VALUES),
    react: createTheme(themeVars, REACT_THEME_VALUES),
    solid: createTheme(themeVars, SOLID_THEME_VALUES),
    svelte: createTheme(themeVars, SVELTE_THEME_VALUES),
    vue: createTheme(themeVars, VUE_THEME_VALUES),
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

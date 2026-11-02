import { style } from "@vanilla-extract/css";

import type { Look } from "./Look.types";

import { layerVars } from "../StyledComponents/Layer/Layer.css";
import { themeVars } from "../Theme.css";

export const pageBackground = style({
    backgroundColor: themeVars.color.background.dark,
    backgroundImage: `linear-gradient(315deg, ${themeVars.color.background.dark}, ${themeVars.color.background.light})`,
    color: themeVars.color.background.contrast,
});

export const leftNav = style({
    backgroundColor: themeVars.color.surface.dark,
    backgroundImage: `linear-gradient(45deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,
    color: themeVars.color.surface.contrast,
    boxShadow: themeVars.shadow.large,
});

export const surface = style({
    backgroundColor: themeVars.color.surface.dark,
    backgroundImage: `linear-gradient(315deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,
    color: themeVars.color.surface.contrast,
    boxShadow: themeVars.shadow.medium,
});

export const tooltip = style({
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    boxShadow: themeVars.shadow.small,
});

const BUTTON_STATES = {
    "&:hover": {
        filter: themeVars.hover.filter,
    },
    "&:active": {
        filter: themeVars.active.filter,
    },
    "[aria-disabled='true'] &": {
        filter: themeVars.disabled.filter,
        opacity: themeVars.disabled.opacity,
    },
} as const;

export const button = style({
    backgroundColor: themeVars.color.primary.dark,
    backgroundImage: `linear-gradient(315deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
    color: themeVars.color.primary.contrast,
    boxShadow: themeVars.shadow.small,
    selectors: BUTTON_STATES,
});

export const buttonSimple = style({
    backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
    color: layerVars.contrast,
    boxShadow: themeVars.shadow.small,
    selectors: BUTTON_STATES,
});

export const input = style({
    border: `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    boxShadow: themeVars.shadow.small,

    selectors: {
        "&:has(~ :is(input, textarea):hover)": {
            filter: themeVars.hover.filter,
        },
        "&:has(~ :is(input, textarea)[aria-readonly='true'])": {
            backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
        },
        "&:has(~ :is(input, textarea)[aria-invalid='true'])": {
            borderColor: themeVars.color.error.main,
        },
        "&:has(~ :is(input, textarea)[aria-disabled='true'])": {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const dropdown = style({
    border: `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    boxShadow: themeVars.shadow.small,
});

export const hoverFloater = style({
    backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
});

export const item = style({
    selectors: {
        "[aria-selected='true'] &": {
            color: themeVars.color.primary.main,
        },
        "[aria-disabled='true'] &": {
            backgroundColor: "transparent",
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const Plasticine: Look = {
    pageBackground,
    leftNav,
    surface,
    tooltip,
    button,
    buttonSimple,
    input,
    dropdown,
    hoverFloater,
    item,
};

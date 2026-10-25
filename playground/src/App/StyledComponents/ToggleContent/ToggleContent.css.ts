import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

const TOGGLE_WIDTH = 56;
const TOGGLE_HEIGHT = 32;
const TOGGLE_BORDER = 2;
const HANDLE_GAP = 4;
const HANDLE_SIZE = TOGGLE_HEIGHT - 2 * (TOGGLE_BORDER + HANDLE_GAP);
const HANDLE_TRAVEL = TOGGLE_WIDTH - 2 * (TOGGLE_BORDER + HANDLE_GAP) - HANDLE_SIZE;

export const isChecked = style({});
export const isMixed = style({});
export const isHovered = style({});
export const isDisabled = style({});
export const hasError = style({});

export const toggleContent = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.full,
    transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            filter: themeVars.hover.filter,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const toggleTrack = style({
    position: "relative",
    flexShrink: 0,
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    boxShadow: themeVars.shadow.small,
    border: `${TOGGLE_BORDER}px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    borderRadius: TOGGLE_HEIGHT * 0.5,
    backgroundColor: layerVars.main,
    transition: `border-color ${themeVars.animation.duration}`,

    selectors: {
        [`${toggleContent}.${hasError} &`]: {
            borderColor: themeVars.color.error.main,
        },
    },
});

export const toggleHandle = style({
    position: "absolute",
    top: HANDLE_GAP,
    insetInlineStart: HANDLE_GAP,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: "50%",
    backgroundColor: `rgb(from ${layerVars.contrast} r g b / 75%)`,
    transition: `inset-inline-start ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,

    selectors: {
        [`${toggleContent}.${isMixed} &`]: {
            insetInlineStart: HANDLE_GAP + HANDLE_TRAVEL * 0.5,
            backgroundColor: themeVars.color.primary.main,
        },
        [`${toggleContent}.${isChecked} &`]: {
            insetInlineStart: HANDLE_GAP + HANDLE_TRAVEL,
            backgroundColor: themeVars.color.primary.main,
        },
    },
});

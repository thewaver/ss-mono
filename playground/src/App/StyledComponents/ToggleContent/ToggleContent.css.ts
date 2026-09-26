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
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    boxShadow: themeVars.shadow.small,
    border: `${TOGGLE_BORDER}px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    borderRadius: TOGGLE_HEIGHT * 0.5,
    backgroundColor: layerVars.main,
    transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${hasError}`]: {
            borderColor: themeVars.color.error.main,
        },
        [`&.${isHovered}`]: {
            filter: themeVars.hover.filter,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const toggleHandle = style({
    position: "absolute",
    left: HANDLE_GAP,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: "50%",
    backgroundColor: `rgb(from ${layerVars.contrast} r g b / 75%)`,
    transform: "translateX(0)",
    transition: `transform ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,

    selectors: {
        [`${toggleContent}.${isMixed} &`]: {
            backgroundColor: themeVars.color.primary.main,
            transform: `translateX(${HANDLE_TRAVEL / 2}px)`,
        },
        [`${toggleContent}.${isChecked} &`]: {
            backgroundColor: themeVars.color.primary.main,
            transform: `translateX(${HANDLE_TRAVEL}px)`,
        },
    },
});

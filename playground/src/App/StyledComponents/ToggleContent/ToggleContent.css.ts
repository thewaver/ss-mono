import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

const TOGGLE_WIDTH = 56;
const TOGGLE_HEIGHT = 32;
const TOGGLE_BORDER = 2;
const HANDLE_GAP = 4;
const HANDLE_SIZE = TOGGLE_HEIGHT - 2 * (TOGGLE_BORDER + HANDLE_GAP);
const HANDLE_TRAVEL = TOGGLE_WIDTH - 2 * (TOGGLE_BORDER + HANDLE_GAP) - HANDLE_SIZE;

export const isChecked = style([lookStates.isChecked]);
export const isMixed = style([lookStates.isMixed]);
export const isHovered = style({});
export const isDisabled = style({});
export const hasError = style([lookStates.hasError]);

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

export const toggleTrack = style([
    lookEntries.toggleTrack,
    {
        position: "relative",
        flexShrink: 0,
        width: TOGGLE_WIDTH,
        height: TOGGLE_HEIGHT,
        transition: `border-color ${themeVars.animation.duration}`,
    },
]);

export const toggleHandle = style([
    lookEntries.toggleHandle,
    {
        position: "absolute",
        top: HANDLE_GAP,
        insetInlineStart: HANDLE_GAP,
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
        transition: `inset-inline-start ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,

        selectors: {
            [`${toggleContent}.${isMixed} &`]: {
                insetInlineStart: HANDLE_GAP + HANDLE_TRAVEL * 0.5,
            },
            [`${toggleContent}.${isChecked} &`]: {
                insetInlineStart: HANDLE_GAP + HANDLE_TRAVEL,
            },
        },
    },
]);

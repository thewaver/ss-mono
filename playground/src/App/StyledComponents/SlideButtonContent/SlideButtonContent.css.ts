import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const SLIDE_BUTTON_THUMB_SIZE = 44;
export const SLIDE_BUTTON_LENGTH = 240;

export const isVertical = style([skinStates.isVertical]);
export const isRightToLeft = style({});
export const isTracking = style({});
export const isFocused = style({});
export const isDisabled = style({});
export const hasError = style([skinStates.hasError]);

export const slideButtonContent = style({
    position: "relative",
    height: SLIDE_BUTTON_THUMB_SIZE,
    transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isVertical}`]: {
            width: SLIDE_BUTTON_THUMB_SIZE,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const slideButtonTrack = style([
    skinEntries.slideButtonTrack,
    {
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",

        selectors: {
            [`.${isVertical} &`]: {
                flexDirection: "column",
            },
        },
    },
]);

export const slideButtonFill = style([
    skinEntries.slideButtonFill,
    {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        transition: `width ${themeVars.animation.duration}`,

        selectors: {
            [`.${isVertical} &`]: {
                top: "auto",
                right: 0,
                transition: `height ${themeVars.animation.duration}`,
            },
            [`.${isRightToLeft} &`]: {
                left: "auto",
                right: 0,
            },
            [`&.${isTracking}`]: {
                transition: "none",
            },
        },
    },
]);

export const slideButtonHint = style({
    position: "relative",
    flex: 1,
    textAlign: "center",
    paddingInline: SLIDE_BUTTON_THUMB_SIZE,
    whiteSpace: "nowrap",

    selectors: {
        [`.${isVertical} &`]: {
            writingMode: "vertical-rl",
            textOrientation: "upright",
            letterSpacing: "-0.25em",
        },
    },
});

export const slideButtonThumb = style([
    skinEntries.slideButtonThumb,
    {
        position: "absolute",
        left: 0,
        top: 0,
        width: SLIDE_BUTTON_THUMB_SIZE,
        height: SLIDE_BUTTON_THUMB_SIZE,
        cursor: "grab",
        transition: `left ${themeVars.animation.duration}, transform ${themeVars.animation.duration}`,

        selectors: {
            [`.${isVertical} &`]: {
                top: "auto",
                bottom: 0,
                transition: `bottom ${themeVars.animation.duration}, transform ${themeVars.animation.duration}`,
            },
            [`.${isRightToLeft} &`]: {
                left: "auto",
                right: 0,
                transition: `right ${themeVars.animation.duration}, transform ${themeVars.animation.duration}`,
            },
            [`&.${isTracking}`]: {
                transition: `transform ${themeVars.animation.duration}`,
                cursor: "grabbing",
            },
            [`&.${isFocused}`]: {
                transform: "scale(1.1)",
            },
        },
    },
]);

export const slideButtonArrow = style({
    display: "block",
    width: "100%",
    height: "100%",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",

    selectors: {
        [`.${isVertical} &`]: {
            transform: "rotate(-90deg)",
        },
        [`.${isRightToLeft} &`]: {
            transform: "rotate(180deg)",
        },
    },
});

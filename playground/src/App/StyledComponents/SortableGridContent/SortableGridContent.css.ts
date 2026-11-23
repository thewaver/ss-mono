import { createVar, globalStyle, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isCarried = style({});
export const isHovered = style({});
export const isDisabled = style({});
export const isAllowed = style({});
export const isReceiving = style({});
export const isCarrying = style({});
export const isOdd = style({});
export const isBlocked = style({});

export const tileHue = createVar();

export const sortableGridCell = style({
    border: "1px solid color-mix(in srgb, currentColor 10%, transparent)",
    backgroundColor: "color-mix(in srgb, currentColor 10%, transparent)",
    flex: "1 1 auto",
    borderRadius: themeVars.borderRadius.half,

    selectors: {
        [`&.${isOdd}`]: {
            backgroundColor: "color-mix(in srgb, currentColor 25%, transparent)",
        },
        [`&.${isBlocked}`]: {
            borderColor: "color-mix(in srgb, currentColor 50%, transparent)",
            backgroundColor: "color-mix(in srgb, currentColor 25%, transparent)",
            backgroundImage:
                "repeating-linear-gradient(45deg, color-mix(in srgb, currentColor 35%, transparent) 0 3px, transparent 3px 7px)",
        },
    },
});

export const sortableGridItemContent = style({
    position: "relative",
    flex: "1 1 auto",
    minWidth: 0,
    cursor: "grab",

    selectors: {
        [`&.${isCarried}`]: {
            cursor: "grabbing",
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
            cursor: "default",
        },
    },
});

export const sortableGridItemShape = style({
    position: "absolute",
    inset: 0,
    overflow: "visible",
});

export const sortableGridItemContour = style({
    fill: "black",
    stroke: `rgb(from ${themeVars.color.primary.main} r g b / 50%)`,
    strokeWidth: 2,
    transition: `fill ${themeVars.animation.duration}, stroke ${themeVars.animation.duration}`,

    selectors: {
        [`.${isHovered} &`]: {
            stroke: themeVars.color.primary.light,
        },
        [`.${isCarried} &`]: {
            fill: "transparent",
            stroke: themeVars.color.primary.main,
            strokeDasharray: "4 3",
        },
    },
});

export const sortableGridItemTile = style({
    position: "absolute",
    border: `1px solid hsl(${tileHue} 100% 50% / 65%)`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: `hsl(${tileHue} 25% 25% / 90%)`,
    transition: `background-color ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}`,

    selectors: {
        [`.${isHovered} &`]: {
            borderColor: `hsl(${tileHue} 100% 75%)`,
        },
        [`.${isCarried} &`]: {
            borderStyle: "dashed",
            borderColor: themeVars.color.primary.main,
            backgroundColor: "transparent",
        },
    },
});

export const sortableGridItemGlyph = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    position: "absolute",
    fontSize: themeVars.fontSize.large,
    pointerEvents: "none",
    transition: `opacity ${themeVars.animation.duration}`,

    selectors: {
        [`.${isCarried} &`]: {
            opacity: 0.5,
        },
    },
});

export const sortableGridItemName = style({
    fontSize: themeVars.fontSize.xSmall,
    textAlign: "center",
    whiteSpace: "nowrap",
    opacity: 0.75,
});

export const sortableGridLanding = style({
    position: "absolute",
    inset: 0,
    overflow: "visible",
});

export const sortableGridLandingContour = style({
    fill: `rgb(from ${themeVars.color.error.main} r g b / 25%)`,
    stroke: themeVars.color.error.main,
    strokeWidth: 2,
    strokeDasharray: "5 4",

    selectors: {
        [`.${isAllowed} &`]: {
            fill: `rgb(from ${themeVars.color.primary.main} r g b / 25%)`,
            stroke: themeVars.color.primary.main,
        },
    },
});

export const sortableGridSurface = style({
    border: "1px dashed color-mix(in srgb, currentColor 25%, transparent)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    inset: `calc(-1 * ${themeVars.spacing.half})`,
    zIndex: -1,
    borderRadius: themeVars.borderRadius.full,
    pointerEvents: "none",
    transition: `border-color ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isCarrying}`]: {
            borderColor: "color-mix(in srgb, currentColor 50%, transparent)",
        },
        [`&.${isReceiving}`]: {
            borderColor: themeVars.color.primary.main,
            backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 10%)`,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const sortableGridEmpty = style({
    fontSize: themeVars.fontSize.small,
    fontStyle: "italic",
    opacity: 0.5,
});

globalStyle(`${sortableGridItemShape}, ${sortableGridLanding}`, {
    pointerEvents: "none",
});

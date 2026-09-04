import { createVar, globalStyle, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isCarried = style({});
export const isHovered = style({});
export const isDisabled = style({});
export const isAllowed = style({});
export const isReceiving = style({});
export const isCarrying = style({});
export const isOdd = style({});

export const tileHue = createVar();

export const sortableGridCell = style({
    flex: "1 1 auto",
    border: `1px solid rgb(from currentColor r g b / 15%)`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: `rgb(from currentColor r g b / 5%)`,

    selectors: {
        [`&.${isOdd}`]: {
            backgroundColor: `rgb(from currentColor r g b / 10%)`,
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

export const sortableGridItemOutline = style({
    fill: themeVars.color.surface.light,
    stroke: `rgb(from ${themeVars.color.secondary.main} r g b / 50%)`,
    strokeWidth: 2,
    transition: `fill ${themeVars.animation.duration}, stroke ${themeVars.animation.duration}`,

    selectors: {
        [`.${isHovered} &`]: {
            stroke: themeVars.color.secondary.light,
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
    border: `1px solid hsl(${tileHue} 70% 65% / 65%)`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: `hsl(${tileHue} 35% 25% / 90%)`,
    transition: `background-color ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}`,

    selectors: {
        [`.${isHovered} &`]: {
            borderColor: `hsl(${tileHue} 85% 75%)`,
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
    lineHeight: 1,
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

export const sortableGridLandingOutline = style({
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    inset: `calc(-1 * ${themeVars.spacing.half})`,
    zIndex: -1,
    border: `1px dashed rgb(from currentColor r g b / 25%)`,
    borderRadius: themeVars.borderRadius.full,
    pointerEvents: "none",
    transition: `border-color ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isCarrying}`]: {
            borderColor: `rgb(from currentColor r g b / 50%)`,
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

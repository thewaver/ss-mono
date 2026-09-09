import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isCurrent = style({});
export const isHovered = style({});
export const isActive = style({});
export const isDisabled = style({});

const cellBase = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 32,
    height: 32,
    paddingInline: themeVars.spacing.half,
    color: themeVars.color.surface.contrast,
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.small,
    transition: `color ${themeVars.animation.duration}, filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            color: themeVars.color.primary.main,
        },
        [`&.${isActive}`]: {
            filter: themeVars.active.filter,
        },
        [`&.${isDisabled}`]: {
            opacity: themeVars.disabled.opacity,
            filter: themeVars.disabled.filter,
        },
    },
});

export const paginatorPage = style([
    cellBase,
    {
        backgroundColor: `rgb(from ${themeVars.color.surface.contrast} r g b / 10%)`,

        selectors: {
            [`&.${isCurrent}`]: {
                color: themeVars.color.primary.contrast,
                backgroundImage: `linear-gradient(215deg, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
            },
        },
    },
]);

export const paginatorStep = style([
    cellBase,
    {
        backgroundColor: `rgb(from ${themeVars.color.surface.contrast} r g b / 10%)`,
    },
]);

export const paginatorGap = style([
    cellBase,
    {
        opacity: 0.5,
    },
]);

export const paginatorWedge = style({
    position: "relative",
    containerType: "inline-size",
    width: "100%",
    height: "100%",
    cursor: "pointer",

    selectors: {
        [`&.${isDisabled}`]: {
            cursor: "not-allowed",
        },
    },
});

export const paginatorWedgeCanvas = style({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    overflow: "visible",
    pointerEvents: "none",
});

export const paginatorWedgeShape = style({
    fill: `rgb(from ${themeVars.color.surface.contrast} r g b / 10%)`,
    stroke: themeVars.color.surface.contrast,
    strokeWidth: 1,
    strokeOpacity: 0.25,
    vectorEffect: "non-scaling-stroke",
    pointerEvents: "all",
    transition: `fill ${themeVars.animation.duration}, stroke-opacity ${themeVars.animation.duration}`,

    selectors: {
        [`.${isHovered} &`]: {
            fill: `rgb(from ${themeVars.color.primary.main} r g b / 30%)`,
        },
        [`.${isActive} &`]: {
            filter: themeVars.active.filter,
        },
        [`.${isCurrent} &`]: {
            strokeOpacity: 0.6,
        },
        [`.${isDisabled} &`]: {
            opacity: themeVars.disabled.opacity,
            filter: themeVars.disabled.filter,
        },
    },
});

export const paginatorWedgeFill = style({
    opacity: 0,
    pointerEvents: "none",
    transition: `opacity ${themeVars.animation.duration}`,

    selectors: {
        [`.${isCurrent} &`]: {
            opacity: 1,
        },
        [`.${isDisabled} &`]: {
            opacity: 0,
        },
    },
});

export const paginatorWedgeGradientFrom = style({
    stopColor: themeVars.color.primary.dark,
});

export const paginatorWedgeGradientTo = style({
    stopColor: themeVars.color.primary.light,
});

export const paginatorWedgeLabel = style({
    display: "flex",
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.small,
    textAlign: "center",
    pointerEvents: "none",
    transition: `color ${themeVars.animation.duration}`,

    selectors: {
        [`.${isCurrent} &`]: {
            color: themeVars.color.primary.contrast,
        },
        [`.${isDisabled} &`]: {
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const paginatorDemo = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    width: "100%",
    minWidth: 0,
});

export const paginatorPanel = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    borderRadius: themeVars.borderRadius.half,
    padding: themeVars.spacing.full,
    backgroundColor: themeVars.color.surface.dark,
    fontSize: themeVars.fontSize.small,
});

export const paginatorPanelSummary = style({
    color: themeVars.color.surface.contrast,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const paginatorPanelRow = style({
    display: "flex",
    justifyContent: "space-between",
    gap: themeVars.spacing.full,
    borderBlockEnd: `1px solid rgb(from ${themeVars.color.surface.contrast} r g b / 15%)`,
    paddingBlock: themeVars.spacing.half,
    color: themeVars.color.surface.contrast,

    selectors: {
        "&:last-child": {
            borderBlockEnd: "none",
        },
    },
});

export const paginatorPanelIndex = style({
    color: themeVars.color.primary.main,
    fontFamily: "monospace",
});

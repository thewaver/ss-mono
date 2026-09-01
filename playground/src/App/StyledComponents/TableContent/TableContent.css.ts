import { style, styleVariants } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isSortable = style({});
export const isSorted = style({});
export const isHovered = style({});
export const isSelected = style({});
export const isResizing = style({});
export const isDisabled = style({});

export const alignVariants = styleVariants({
    start: { justifyContent: "flex-start", textAlign: "left" },
    end: { justifyContent: "flex-end", textAlign: "right" },
});

export const tableHeaderContent = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.half,
    height: "100%",
    padding: themeVars.spacing.half,
    borderBottom: `2px solid rgb(from ${themeVars.color.surface.contrast} r g b / 30%)`,
    backgroundColor: themeVars.color.surface.dark,
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.small,
    fontWeight: 700,
    lineHeight: 1.25,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isSortable}`]: {
            cursor: "pointer",
        },
        [`&.${isSortable}.${isHovered}`]: {
            backgroundColor: themeVars.color.surface.light,
        },
        [`&.${isSorted}`]: {
            color: themeVars.color.primary.main,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const tableText = style({
    minWidth: 0,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
});

export const tableSortMarker = style({
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.5,

    selectors: {
        [`${tableHeaderContent}.${isSorted} &`]: {
            opacity: 1,
        },
    },
});

export const tableCellContent = style({
    display: "flex",
    alignItems: "center",
    height: "100%",
    padding: themeVars.spacing.half,
    borderBottom: `1px solid rgb(from ${themeVars.color.surface.contrast} r g b / 12%)`,
    fontSize: themeVars.fontSize.small,
    lineHeight: 1.25,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            backgroundColor: `rgb(from ${themeVars.color.surface.contrast} r g b / 8%)`,
        },
        [`&.${isSelected}`]: {
            backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 22%)`,
            color: themeVars.color.primary.light,
        },
        [`&.${isSelected}.${isHovered}`]: {
            backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 30%)`,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const tableResizerHandle = style({
    width: "100%",
    height: "100%",
    borderRight: `2px solid rgb(from ${themeVars.color.surface.contrast} r g b / 25%)`,
    transition: `border-color ${themeVars.animation.duration}`,

    selectors: {
        [`&:hover, &.${isResizing}`]: {
            borderRightColor: themeVars.color.primary.main,
        },
    },
});

export const tableMarker = style({
    width: 2,
    height: "100%",
    backgroundColor: themeVars.color.primary.main,
});

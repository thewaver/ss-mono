import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isBranch = style({});
export const isExpanded = style({});
export const isHovered = style({});
export const isSelected = style({});
export const isDisabled = style({});
export const isCategory = style({});

export const treeNodeContent = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.full,
    padding: themeVars.spacing.half,
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.medium,
    lineHeight: 1.25,
    whiteSpace: "nowrap",
    transition: `background-color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isCategory}`]: {
            textTransform: "uppercase",
            fontWeight: "bold",
            color: `hsl(from ${themeVars.color.surface.contrast} h 50% 75%)`,
        },
        [`&.${isHovered}`]: {
            backgroundColor: `rgb(from ${themeVars.color.surface.contrast} r g b / 25%)`,
        },
        [`&.${isSelected}`]: {
            color: themeVars.color.primary.main,
            fontWeight: "bold",
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const treeNodeMarker = style({
    width: "1ch",
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.5,
    transition: `transform ${themeVars.animation.duration}`,

    selectors: {
        [`${treeNodeContent}.${isBranch} &`]: {
            opacity: 1,
        },
        [`${treeNodeContent}.${isExpanded} &`]: {
            transform: "rotate(90deg)",
        },
    },
});

export const treeNodeDetail = style({
    fontSize: themeVars.fontSize.small,
    opacity: 0.75,
});

export const treeNodePending = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.full,
    padding: themeVars.spacing.half,
    fontSize: themeVars.fontSize.small,
    fontStyle: "italic",
    whiteSpace: "nowrap",
    opacity: 0.75,
});

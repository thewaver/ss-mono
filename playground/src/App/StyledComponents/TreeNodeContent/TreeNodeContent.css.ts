import { globalStyle, style } from "@vanilla-extract/css";

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

export const isRootRank = style({});
export const isOuterRank = style({});

export const treeRadialNode = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: themeVars.color.surface.dark,
    boxShadow: themeVars.shadow.small,
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.xSmall,
    whiteSpace: "nowrap",
    transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isOuterRank}`]: {
            scale: "0.7",
            fontSize: "0.625rem",
        },
        [`&.${isHovered}`]: {
            color: themeVars.color.primary.main,
        },
        [`&.${isSelected}`]: {
            backgroundImage: `linear-gradient(45deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
            color: themeVars.color.primary.contrast,
        },
        [`&.${isRootRank}`]: {
            backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.secondary.light}, ${themeVars.color.secondary.dark})`,
            color: themeVars.color.secondary.contrast,
            fontWeight: "bold",
        },
        [`&.${isRootRank}.${isHovered}`]: {
            filter: themeVars.hover.filter,
        },
        [`&.${isRootRank}.${isSelected}`]: {
            boxShadow: `0 0 0 3px ${themeVars.color.secondary.light}`,
        },
        [`&.${isDisabled}`]: {
            opacity: themeVars.disabled.opacity,
            filter: themeVars.disabled.filter,
        },
    },
});

globalStyle(`[role="treeitem"]:has(> ${treeRadialNode})`, {
    borderRadius: "50%",
});

import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isExpanded = style({});
export const isHovered = style({});
export const isDisabled = style({});

export const accordionHeader = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: themeVars.spacing.full,
    width: "100%",
    borderRadius: themeVars.borderRadius.half,
    padding: themeVars.spacing.full,
    backgroundColor: layerVars.main,
    fontSize: themeVars.fontSize.medium,
    transition: `filter ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            filter: themeVars.hover.filter,
        },
        [`&.${isDisabled}`]: {
            opacity: themeVars.disabled.opacity,
            filter: themeVars.disabled.filter,
        },
    },
});

export const accordionMarker = style({
    fontSize: themeVars.fontSize.small,
    transition: `transform ${themeVars.animation.duration}`,

    selectors: {
        [`${accordionHeader}.${isExpanded} &`]: {
            transform: "rotate(90deg)",
        },
        [`&[data-side="top"]`]: {
            transform: "rotate(-180deg)",
        },
        [`&[data-side="right"]`]: {
            transform: "rotate(-90deg)",
        },
        [`&[data-side="left"]`]: {
            transform: "rotate(90deg)",
        },
        [`${accordionHeader}.${isExpanded} &[data-side="top"]`]: {
            transform: "rotate(-90deg)",
        },
        [`${accordionHeader}.${isExpanded} &[data-side="right"]`]: {
            transform: "rotate(0deg)",
        },
        [`${accordionHeader}.${isExpanded} &[data-side="left"]`]: {
            transform: "rotate(180deg)",
        },
    },
});

export const accordionPanel = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    padding: themeVars.spacing.full,
    fontSize: themeVars.fontSize.small,
    backgroundColor: layerVars.main,
});

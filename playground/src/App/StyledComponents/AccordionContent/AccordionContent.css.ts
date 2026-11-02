import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

export const isExpanded = style([lookStates.isExpanded]);
export const isHovered = style([lookStates.isHovered]);
export const isDisabled = style([lookStates.isDisabled]);

export const accordionHeader = style([
    lookEntries.accordionHeader,
    {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: themeVars.spacing.full,
        width: "100%",
        padding: themeVars.spacing.full,
        transition: `filter ${themeVars.animation.duration}`,
    },
]);

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

export const accordionPanel = style([
    lookEntries.panel,
    {
        display: "flex",
        flexDirection: "column",
        gap: themeVars.spacing.full,
        padding: themeVars.spacing.full,
        fontSize: themeVars.fontSize.small,
    },
]);

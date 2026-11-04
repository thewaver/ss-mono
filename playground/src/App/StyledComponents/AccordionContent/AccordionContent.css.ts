import type { CollapsibleSide } from "@thewaver/ss-components";
import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isExpanded = style([skinStates.isExpanded]);
export const isHovered = style([skinStates.isHovered]);
export const isDisabled = style([skinStates.isDisabled]);

const isJoinedBlockStart = style([skinStates.isJoinedBlockStart]);
const isJoinedBlockEnd = style([skinStates.isJoinedBlockEnd]);
const isJoinedInlineStart = style([skinStates.isJoinedInlineStart]);
const isJoinedInlineEnd = style([skinStates.isJoinedInlineEnd]);

export const headerJoins: Record<CollapsibleSide, string> = {
    top: isJoinedBlockStart,
    right: isJoinedInlineEnd,
    bottom: isJoinedBlockEnd,
    left: isJoinedInlineStart,
};

export const panelJoins: Record<CollapsibleSide, string> = {
    top: isJoinedBlockEnd,
    right: isJoinedInlineStart,
    bottom: isJoinedBlockStart,
    left: isJoinedInlineEnd,
};

export const accordionHeader = style([
    skinEntries.accordionHeader,
    {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: themeVars.spacing.full,
        width: "100%",
        padding: themeVars.spacing.full,
        transition: `filter ${themeVars.animation.duration}`,

        selectors: {
            [`.${skinEntries.hollowSurface} &`]: {
                borderRadius: "inherit",
            },
        },
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
    skinEntries.accordionPanel,
    {
        display: "flex",
        flexDirection: "column",
        gap: themeVars.spacing.full,
        padding: themeVars.spacing.full,
        fontSize: themeVars.fontSize.small,

        selectors: {
            [`.${skinEntries.hollowSurface} &`]: {
                borderRadius: "inherit",
            },
        },
    },
]);

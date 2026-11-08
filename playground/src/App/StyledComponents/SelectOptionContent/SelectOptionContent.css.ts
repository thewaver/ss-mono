import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isHovered = style([skinStates.isHovered]);
export const isSelected = style([skinStates.isSelected]);
export const isDisabled = style([skinStates.isDisabled]);
export const hasHoverFloater = style([skinStates.hasHoverFloater]);
export const hasSelectionFloater = style([skinStates.hasSelectionFloater]);

const selectOptionBase = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: themeVars.spacing.full,
    padding: themeVars.spacing.full,
    whiteSpace: "nowrap",
    transition: `background-color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,
});

export const selectOptionContent = style([skinEntries.itemBase, selectOptionBase]);

export const selectOptionText = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
});

export const selectOptionDescription = style({
    maxWidth: "36ch",
    whiteSpace: "normal",
    fontSize: themeVars.fontSize.small,
    opacity: 0.75,
});

export const selectOptionShortcut = style({
    marginLeft: "auto",
    opacity: 0.5,
    fontSize: themeVars.fontSize.xSmall,
});

export const selectOptionMark = style({
    opacity: 0,

    selectors: {
        [`${selectOptionBase}.${isSelected} &`]: {
            opacity: 1,
        },
    },
});

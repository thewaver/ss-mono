import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

export const isHovered = style([lookStates.isHovered]);
export const isSelected = style([lookStates.isSelected]);
export const isDisabled = style([lookStates.isDisabled]);

const selectOptionBase = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: themeVars.spacing.full,
    padding: themeVars.spacing.full,
    whiteSpace: "nowrap",
    transition: `background-color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,
});

export const selectOptionContent = style([lookEntries.itemWithFloater, selectOptionBase]);

export const selectOptionContentWithoutFloater = style([lookEntries.itemWithoutFloater, selectOptionBase]);

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

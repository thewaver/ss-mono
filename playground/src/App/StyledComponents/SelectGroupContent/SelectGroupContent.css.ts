import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isChecked = style([skinStates.isChecked]);
export const isMixed = style([skinStates.isMixed]);

export const selectGroupContent = style([
    skinEntries.itemGroupLabel,
    {
        display: "flex",
        alignItems: "center",
        gap: themeVars.spacing.half,
        padding: `${themeVars.spacing.full} ${themeVars.spacing.full} ${themeVars.spacing.half}`,
        fontSize: themeVars.fontSize.xSmall,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
    },
]);

export const selectGroupMark = style({
    display: "flex",
    flexShrink: 0,
});

export const selectGroupMarkBox = style([
    skinEntries.checkboxBox,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 16,
        height: 16,
        fontSize: themeVars.fontSize.small,
        transition: `border-color ${themeVars.animation.duration}`,
    },
]);

export const selectGroupMarkTick = style([
    skinEntries.checkboxMark,
    {
        transform: "scale(0)",
        transition: `transform ${themeVars.animation.duration}`,

        selectors: {
            [`${selectGroupMark}.${isChecked} &, ${selectGroupMark}.${isMixed} &`]: {
                transform: "scale(1)",
            },
        },
    },
]);

export const selectGroupBox = style([
    skinEntries.itemGroup,
    {
        margin: themeVars.spacing.half,
        paddingBottom: themeVars.spacing.half,
        borderRadius: themeVars.borderRadius.full,
    },
]);

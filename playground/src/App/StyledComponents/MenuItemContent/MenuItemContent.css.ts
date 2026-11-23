import { globalStyle, style } from "@vanilla-extract/css";

import { skinEntries, skinStates, skinVars } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isHovered = style([skinStates.isHovered]);
export const isActive = style({});
export const isDisabled = style([skinStates.isDisabled]);
export const hasHoverFloater = style([skinStates.hasHoverFloater]);
export const hasSelectionFloater = style([skinStates.hasSelectionFloater]);

const menuItemBase = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: themeVars.spacing.double,
    padding: themeVars.spacing.full,
    whiteSpace: "nowrap",
    transition: `background-color ${themeVars.animation.duration}, filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isActive}`]: {
            filter: themeVars.active.filter,
        },
    },
});

export const menuItemContent = style([skinEntries.itemBase, menuItemBase]);

export const menuItemShortcut = style({
    opacity: 0.5,
    fontSize: themeVars.fontSize.xSmall,
});

export const menuItemSubmenuMark = style({
    opacity: 0.75,
    fontSize: themeVars.fontSize.medium,
});

export const menuItemMark = style({
    width: "1ch",
    color: skinVars.accentColor,
    fontSize: themeVars.fontSize.small,
    textAlign: "center",
});

globalStyle(`${menuItemMark} + div`, {
    flex: 1,
});

export const menuGroupBox = style([
    skinEntries.itemGroup,
    {
        paddingBottom: themeVars.spacing.half,
        marginBottom: themeVars.spacing.half,
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
    },
]);

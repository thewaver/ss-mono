import { globalStyle, style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isHovered = style([lookStates.isHovered]);
export const isActive = style({});
export const isDisabled = style([lookStates.isDisabled]);

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

export const menuItemContent = style([lookEntries.itemWithFloater, menuItemBase]);

export const menuItemContentWithoutFloater = style([lookEntries.itemWithoutFloater, menuItemBase]);

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
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.small,
    textAlign: "center",
});

globalStyle(`${menuItemMark} + div`, {
    flex: 1,
});

export const menuGroupBox = style({
    paddingBottom: themeVars.spacing.half,
    marginBottom: themeVars.spacing.half,
    borderBottom: `1px solid rgb(from ${layerVars.contrast} r g b / 15%)`,
});

import { style } from "@vanilla-extract/css";

import { skinVars } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isCurrent = style({});
export const isOpen = style({});

export const flyoutMenuLink = style({
    display: "block",
    padding: `${themeVars.spacing.half} ${themeVars.spacing.full}`,
    borderRadius: themeVars.borderRadius.half,
    whiteSpace: "nowrap",

    selectors: {
        [`&.${isCurrent}`]: {
            color: skinVars.accentColor,
            fontWeight: "bold",
        },
    },
});

export const MIN_TARGET_SIZE = 24;

export const flyoutMenuToggle = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: MIN_TARGET_SIZE,
    minHeight: MIN_TARGET_SIZE,
    padding: `${themeVars.spacing.half} ${themeVars.spacing.half}`,
    borderRadius: themeVars.borderRadius.half,
    cursor: "pointer",
});

export const flyoutMenuOverflowToggle = style([
    flyoutMenuToggle,
    {
        gap: themeVars.spacing.half,
        padding: `${themeVars.spacing.half} ${themeVars.spacing.full}`,
    },
]);

export const flyoutMenuChevron = style({
    color: skinVars.accentColor,
    fontSize: themeVars.fontSize.xSmall,
    transition: `transform ${themeVars.animation.duration}`,

    selectors: {
        [`.${isOpen} &`]: {
            transform: "rotate(180deg)",
        },
    },
});

export const flyoutMenuPanelBody = style({
    overflow: "hidden",
});

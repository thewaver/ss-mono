import { globalStyle, style } from "@vanilla-extract/css";

import { skinEntries, skinVars } from "../../../Skins/Skin.css";
import { FOCUS_RING_WIDTH, themeVars } from "../../../Theme.css";

export const root = style({
    borderRadius: themeVars.borderRadius.full,
    overflow: "hidden",
    selectors: {
        "&:has(> :focus-visible)": {
            outline: `${FOCUS_RING_WIDTH}px solid ${skinVars.outlineColor}`,
        },
    },
});

globalStyle(`${root} > :focus-visible`, {
    outline: "0 none",
});

export const photo = style({
    display: "block",
    width: "100%",
    height: "auto",
    userSelect: "none",
});

export const print = style([
    skinEntries.panel,
    {
        display: "flex",
        flexDirection: "column",
        gap: themeVars.spacing.half,
        height: 260,
        padding: themeVars.spacing.double,
        fontSize: themeVars.fontSize.small,
        userSelect: "none",
    },
]);

export const printTitle = style({
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.large,
});

export const finePrint = style({
    fontSize: themeVars.fontSize.xSmall,
});

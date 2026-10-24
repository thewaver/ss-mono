import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const root = style({});

export const counter = style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: themeVars.spacing.full,
});

export const counterValue = style({
    minWidth: themeVars.spacing.quad,
    textAlign: "center",
    fontSize: themeVars.fontSize.large,
    fontVariantNumeric: "tabular-nums",
});

export const isPressed = style({});

export const pressedContent = style({
    position: "relative",

    selectors: {
        [`&.${isPressed}::after`]: {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: themeVars.borderRadius.half,
            boxShadow: `inset 0 0 0 4px white`,
            mixBlendMode: "overlay",
            pointerEvents: "none",
        },
    },
});

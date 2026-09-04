import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const hasError = style({});

export const formFieldStack = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: themeVars.spacing.full,
});

export const formFieldCaption = style({
    fontSize: themeVars.fontSize.small,
    opacity: 0.75,
});

export const formFieldMessage = style({
    maxWidth: 240,
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.5,

    selectors: {
        [`&.${hasError}`]: {
            color: themeVars.color.error.main,
            opacity: 1,
        },
    },
});

export const formFieldButtons = style({
    display: "flex",
    gap: themeVars.spacing.full,
});

export const formSectionCaption = style({
    fontSize: themeVars.fontSize.small,
    fontWeight: "bold",
});

export const formSectionBody = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: themeVars.spacing.full,
    paddingLeft: themeVars.spacing.full,
    borderLeft: `1px solid rgb(from ${themeVars.color.surface.contrast} r g b / 25%)`,
});

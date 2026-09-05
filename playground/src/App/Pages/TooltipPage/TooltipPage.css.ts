import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const anchorRow = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: themeVars.spacing.full,
    padding: themeVars.spacing.double,
});

export const anchorButton = style({
    color: themeVars.color.primary.contrast,
    backgroundColor: themeVars.color.primary.main,
    border: "none",
    borderRadius: themeVars.borderRadius.full,
    padding: `${themeVars.spacing.half} ${themeVars.spacing.full}`,
    fontFamily: "inherit",
    fontSize: themeVars.fontSize.small,
    cursor: "pointer",

    selectors: {
        "&:hover": {
            filter: themeVars.hover.filter,
        },
        "&:focus-visible": {
            outline: `2px solid ${themeVars.color.outline.main}`,
            outlineOffset: 2,
        },
    },
});

export const sentence = style({
    padding: themeVars.spacing.double,
    lineHeight: 1.6,
});

export const anchorWord = style({
    borderBottom: `1px dotted currentColor`,
    cursor: "help",

    selectors: {
        "&:focus-visible": {
            outline: `2px solid ${themeVars.color.outline.main}`,
            outlineOffset: 2,
        },
    },
});

export const richTitle = style({
    marginBottom: themeVars.spacing.half,
    fontSize: themeVars.fontSize.small,
    fontWeight: "bold",
});

export const richBody = style({
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.85,
});

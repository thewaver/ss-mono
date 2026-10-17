import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const sentence = style({});

export const handle = style({
    padding: 0,
    border: "none",
    background: "none",
    color: themeVars.color.primary.main,
    font: "inherit",
    cursor: "pointer",

    selectors: {
        "&:hover": {
            textDecoration: "underline",
        },
        "&:focus-visible": {
            outline: `2px solid ${themeVars.color.outline.main}`,
            outlineOffset: 2,
        },
    },
});

export const profileHeader = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.full,
});

export const avatar = style({
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
});

export const profileName = style({
    fontWeight: "bold",
});

export const profileHandle = style({
    fontSize: themeVars.fontSize.small,
    opacity: 0.7,
});

export const profileBio = style({
    fontSize: themeVars.fontSize.small,
});

export const profileActions = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: themeVars.spacing.full,
});

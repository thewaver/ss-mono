import { createVar, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const bridgeTopVar = createVar();
export const bridgeRightVar = createVar();
export const bridgeBottomVar = createVar();
export const bridgeLeftVar = createVar();

export const sentence = style({
    lineHeight: 1.6,
});

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
    lineHeight: 1.5,
});

export const profileActions = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: themeVars.spacing.full,
});

export const navList = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.half,
    margin: 0,
    padding: 0,
    listStyle: "none",
});

export const navLink = style({
    display: "block",
    padding: `${themeVars.spacing.half} ${themeVars.spacing.full}`,
    borderRadius: themeVars.borderRadius.half,
});

export const flyoutPanel = style({
    position: "relative",
    isolation: "isolate",

    selectors: {
        "&::before": {
            content: '""',
            position: "absolute",
            zIndex: -1,
            top: bridgeTopVar,
            right: bridgeRightVar,
            bottom: bridgeBottomVar,
            left: bridgeLeftVar,
        },
    },
});

export const flyoutList = style({
    display: "flex",
    flexDirection: "column",
    minWidth: 180,
    margin: 0,
    padding: 0,
    listStyle: "none",
});

export const flyoutLink = style({
    display: "block",
    padding: `${themeVars.spacing.half} ${themeVars.spacing.full}`,
    borderRadius: themeVars.borderRadius.half,
    whiteSpace: "nowrap",
});

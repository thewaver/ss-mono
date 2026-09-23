import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const root = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.quad,
});

export const demo = style({
    width: 420,
    maxWidth: "100%",
});

export const item = style({
    display: "flex",
    flexShrink: 0,
});

export const chip = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    height: 32,
    paddingInline: themeVars.spacing.double,
    color: themeVars.color.surface.contrast,
    backgroundColor: `rgb(from ${themeVars.color.surface.contrast} r g b / 10%)`,
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.small,
    whiteSpace: "nowrap",
});

export const tocRoot = style({
    display: "grid",
    gridTemplateColumns: "160px minmax(0, 1fr)",
    gap: themeVars.spacing.double,
    width: "min(720px, 100%)",
});

export const tocNav = style({
    position: "sticky",
    top: themeVars.spacing.double,
    alignSelf: "start",
});

export const tocList = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    margin: 0,
    padding: 0,
    listStyle: "none",
});

export const tocLink = style({
    display: "block",
    paddingInlineStart: themeVars.spacing.full,
    borderInlineStart: "2px solid transparent",
    color: "inherit",
    opacity: 0.6,
    textDecoration: "none",
    transition: `opacity ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}`,

    selectors: {
        "&[aria-current='true']": {
            opacity: 1,
            borderInlineStartColor: themeVars.color.primary.main,
        },
        "&:hover": {
            opacity: 1,
        },
    },
});

export const tocArticle = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.quad,
    paddingBottom: "70vh",
});

export const tocSection = style({
    minHeight: 320,
});

export const tocHeading = style({
    margin: 0,
    scrollMarginTop: themeVars.spacing.double,
});

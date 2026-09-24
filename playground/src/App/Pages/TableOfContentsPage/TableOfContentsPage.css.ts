import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

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

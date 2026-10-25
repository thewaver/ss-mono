import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const tocRoot = style({
    display: "grid",
    gridTemplateColumns: "160px minmax(0, 1fr)",
    gap: themeVars.spacing.double,
});

export const tocNav = style({
    alignSelf: "start",
});

export const tocArticle = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
    paddingInlineEnd: themeVars.spacing.double,
    height: 320,
    overflowY: "auto",
});

export const tocSection = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
});

export const tocHeading = style({
    margin: 0,
});

export const tocText = style({
    margin: 0,
});

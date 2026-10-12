import { style } from "@vanilla-extract/css";

import { layoutVars } from "../../Layout.css";
import { themeVars } from "../../Theme.css";

export const aboutPage = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.quad,
    width: "100%",
    maxWidth: layoutVars.readingWidth,
});

export const aboutTitle = style({
    margin: 0,
    fontSize: themeVars.fontSize.xLarge,
    fontWeight: "normal",
});

export const aboutSection = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
});

export const aboutHeading = style({
    margin: 0,
    fontSize: themeVars.fontSize.large,
    fontWeight: "normal",
});

export const aboutParagraph = style({
    margin: 0,
    fontSize: themeVars.fontSize.medium,
});

export const aboutList = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    margin: 0,
    paddingLeft: themeVars.spacing.quad,
    fontSize: themeVars.fontSize.medium,
});

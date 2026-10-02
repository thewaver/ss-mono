import { globalStyle, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const root = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: themeVars.spacing.quad,
});

export const colorList = style({
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.full,
});

export const paragraph = style({
    fontSize: themeVars.fontSize.large,
});

export const icon = style({});

globalStyle(`.${icon} svg`, {
    width: "1em",
    height: "1em",
    verticalAlign: "middle",
});

export const image = style({
    height: "1.5em",
    verticalAlign: "middle",
});

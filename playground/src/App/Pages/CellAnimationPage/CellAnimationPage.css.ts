import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const root = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.quad,
});

export const exampleRoot = style({
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "start",
    flexWrap: "wrap",
    gap: themeVars.spacing.double,
});

export const valueList = style({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: themeVars.spacing.full,
});

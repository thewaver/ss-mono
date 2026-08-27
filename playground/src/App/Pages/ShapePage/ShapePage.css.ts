import { createVar, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const exampleSize = 320;

export const backgroundColor = createVar();

export const root = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.quad,
});

export const valueList = style({
    display: "grid",
    gap: themeVars.spacing.full,
});

export const colorList = style({
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.full,
});

export const stressExample = style({
    backgroundImage: "linear-gradient(#000000C0, #00000040)",
    padding: themeVars.spacing.full,
});

export const exampleHost = style({
    width: "fit-content",
});

export const example = style({
    backgroundImage: "linear-gradient(#000000C0, #00000040)",
    resize: "both",
    overflow: "auto",
    width: exampleSize,
    height: exampleSize,
});

export const exampleInner = style({
    border: "2px dashed #FFFFFF40",
    width: "100%",
    height: "100%",
});

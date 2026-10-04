import { globalStyle, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { typewriterCaretBlink } from "../TypewriterPage/TypewriterPage.css";

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

export const stack = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: themeVars.spacing.double,
});

export const buttonRow = style({
    display: "flex",
    gap: themeVars.spacing.double,
});

export const fill = style({
    alignSelf: "stretch",
});

export const typedHeading = style({
    fontSize: themeVars.fontSize.xLarge,
    fontWeight: "bold",
});

export const caret = style({
    alignSelf: "center",
    width: "2px",
    height: "0.9em",
    background: "currentColor",
});

export const caretBlinking = style({
    animationName: typewriterCaretBlink,
    animationDuration: "1s",
    animationTimingFunction: "steps(1)",
    animationIterationCount: "infinite",
});

export const ringText = style({
    fontSize: themeVars.fontSize.large,
    fontWeight: "bold",
    letterSpacing: "0.1em",
});

export const waveText = style({
    fontSize: themeVars.fontSize.large,
});

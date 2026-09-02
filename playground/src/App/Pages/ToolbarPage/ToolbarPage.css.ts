import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const resizer = style({
    resize: "horizontal",
    overflow: "hidden",
    minWidth: 80,
    maxWidth: "100%",
    padding: 5,
    border: `2px dashed ${themeVars.color.primary.dark}`,
    borderRadius: themeVars.borderRadius.full,
});

export const bar = style({
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: themeVars.spacing.half,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.control.background.main,
});

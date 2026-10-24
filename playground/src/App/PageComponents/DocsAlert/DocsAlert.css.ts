import { style } from "@vanilla-extract/css";

import { layoutVars } from "../../Layout.css";
import { themeVars } from "../../Theme.css";

export const docsAlertRoot = style({
    position: "relative",
    maxWidth: layoutVars.readingWidth,
    padding: `${themeVars.spacing.full} ${themeVars.spacing.double}`,
    border: `2px solid ${themeVars.color.alert.main}`,
    borderRadius: themeVars.borderRadius.full,
    boxShadow: themeVars.shadow.medium,
    color: themeVars.color.alert.main,
    backgroundColor: themeVars.color.alert.contrast,
});

export const docsAlertContent = style({
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: `calc(${themeVars.spacing.double} - 2px)`,
});

export const docsAlertLogo = style({
    fontSize: 48,
    lineHeight: 1,
});

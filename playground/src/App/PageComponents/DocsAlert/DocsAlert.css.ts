import { createVar, style } from "@vanilla-extract/css";

import { layoutVars } from "../../Layout.css";
import { themeVars } from "../../Theme.css";

export const color = createVar();
export const backgroundColor = createVar();

export const docsAlertRoot = style({
    position: "relative",
    maxWidth: layoutVars.readingWidth,
    padding: `${themeVars.spacing.full} ${themeVars.spacing.double}`,
    borderRadius: themeVars.borderRadius.full,
    boxShadow: themeVars.shadow.medium,
    border: `2px solid ${color}`,
    backgroundColor,
    color,
    fontWeight: 600,
});

export const docsAlertContent = style({
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: `calc(${themeVars.spacing.double} - 2px)`,
});

export const docsAlertLogo = style({
    fontSize: 48,
    fontWeight: 400,
    lineHeight: 1,
});

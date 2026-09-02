import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const CONNECTOR_FROM_COLOR = themeVars.color.primary.dark;
export const CONNECTOR_TO_COLOR = themeVars.color.primary.light;

export const board = style({
    color: themeVars.color.primary.dark,
});

export const node = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    padding: `0 ${themeVars.spacing.half}`,
    border: `1px solid ${themeVars.color.surface.dark}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundImage: panel(themeVars.color.surface.dark, themeVars.color.surface.light),
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.xSmall,
    textAlign: "center",
    cursor: "pointer",
});

export const nodeFocused = style({
    borderColor: themeVars.color.primary.main,
    color: themeVars.color.primary.main,
});

export const nodeRoot = style({
    backgroundImage: panel(themeVars.color.secondary.dark, themeVars.color.secondary.light),
    color: themeVars.color.secondary.contrast,
});

export const nodeDisabled = style({
    opacity: themeVars.disabled.opacity,
    filter: themeVars.disabled.filter,
    cursor: "not-allowed",
});

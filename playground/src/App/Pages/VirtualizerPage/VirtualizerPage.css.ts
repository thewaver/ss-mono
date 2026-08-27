import { globalStyle, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const pinnedRoot = style({
    display: "flex",
    flexDirection: "column",
    width: "100%",
});

export const scroller = style({
    width: "100%",
    height: 260,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: themeVars.color.control.background.main,
    overflowY: "auto",
    overflowX: "hidden",
});

export const sizer = style({
    position: "relative",
    width: "100%",
});

export const sizerRow = style({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
});

export const row = style({
    display: "flex",
    gap: themeVars.spacing.full,
    alignItems: "center",
    padding: `0 ${themeVars.spacing.full}`,
    borderBottom: `1px solid rgb(from ${themeVars.color.control.background.contrast} r g b / 20%)`,
    color: themeVars.color.control.background.contrast,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
});

export const rowIndex = style({
    color: themeVars.color.primary.main,
    minWidth: 70,
});

export const rowPinned = style({
    backgroundImage: panel(themeVars.color.secondary.dark, themeVars.color.secondary.light),
    color: themeVars.color.secondary.contrast,
});

globalStyle(`${rowPinned} .${rowIndex}`, {
    color: "inherit",
});

export const controls = style({
    display: "flex",
    flexShrink: 0,
    gap: themeVars.spacing.full,
    alignItems: "center",
    marginBottom: themeVars.spacing.full,
    fontSize: themeVars.fontSize.xSmall,
});

export const button = style({
    padding: `2px ${themeVars.spacing.full}`,
    border: `1px solid ${themeVars.color.primary.main}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: "transparent",
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.xSmall,
    cursor: "pointer",
});

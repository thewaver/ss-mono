import { style } from "@vanilla-extract/css";

import { GRID_SIZE } from "./ScrollerPage.const";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const root = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.quad,
});

export const demo = style({
    width: 420,
    maxWidth: "100%",
});

export const tabbedDemo = style([
    demo,
    {
        display: "flex",
        flexDirection: "column",
        gap: themeVars.spacing.full,
    },
]);

export const verticalDemo = style({
    width: 240,
    maxWidth: "100%",
    height: 260,
});

export const bothWaysDemo = style([
    demo,
    {
        height: 300,
    },
]);

export const cellGrid = style({
    display: "grid",
    gridTemplateColumns: `repeat(${GRID_SIZE}, auto)`,
    gap: themeVars.spacing.half,
    flexShrink: 0,
});

export const item = style({
    display: "flex",
    flexShrink: 0,
});

export const chip = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    height: 32,
    paddingInline: themeVars.spacing.double,
    color: layerVars.contrast,
    backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.small,
    whiteSpace: "nowrap",
});

export const row = style([
    chip,
    {
        justifyContent: "flex-start",
        marginBlockEnd: themeVars.spacing.half,
    },
]);

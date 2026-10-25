import { style, styleVariants } from "@vanilla-extract/css";

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

export const scrollerCell = style({
    flex: "1 1 0",
    alignSelf: "stretch",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr)",
    minWidth: 0,
    minHeight: 0,
});

export const stripLayout = style([
    demo,
    {
        display: "flex",
        alignItems: "center",
        gap: themeVars.spacing.full,
    },
]);

export const tabbedStripLayout = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.full,
});

export const columnLayout = style([
    verticalDemo,
    {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: themeVars.spacing.full,
    },
]);

export const bothWaysLayout = style([
    bothWaysDemo,
    {
        display: "grid",
        gridTemplateAreas: `". up ." "back box next" ". down ."`,
        gridTemplateColumns: "auto minmax(0, 1fr) auto",
        gridTemplateRows: "auto minmax(0, 1fr) auto",
        alignItems: "center",
        justifyItems: "center",
        gap: themeVars.spacing.full,
    },
]);

export const bothWaysCell = styleVariants({
    up: { gridArea: "up" },
    back: { gridArea: "back" },
    next: { gridArea: "next" },
    down: { gridArea: "down" },
    box: {
        gridArea: "box",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gridTemplateRows: "minmax(0, 1fr)",
        alignSelf: "stretch",
        justifySelf: "stretch",
        minWidth: 0,
        minHeight: 0,
    },
});

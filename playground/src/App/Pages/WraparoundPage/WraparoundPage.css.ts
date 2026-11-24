import { style } from "@vanilla-extract/css";

import { MOSAIC_GAP } from "./WraparoundPage.const";

import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

const GRID_CELL_SIZE = 72;
const MARQUEE_ROW_HEIGHT = 64;

export const stage = style([
    skinEntries.panel,
    {
        width: "100%",
        height: 360,
        borderRadius: themeVars.borderRadius.half,
    },
]);

export const smallStage = style([stage, { height: 240 }]);

export const mosaicTile = style({
    width: 640,
    padding: MOSAIC_GAP * 0.5,
});

export const gridTile = style({
    display: "grid",
    gridTemplateColumns: `repeat(3, ${GRID_CELL_SIZE}px)`,
    gap: themeVars.spacing.full,
    padding: `calc(${themeVars.spacing.full} * 0.5)`,
});

export const gridCell = style({
    width: GRID_CELL_SIZE,
    height: GRID_CELL_SIZE,
    border: "none",
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: `color-mix(in srgb, ${themeVars.color.primary.main} 25%, transparent)`,
    fontSize: themeVars.fontSize.large,
    fontWeight: "bold",
    cursor: "pointer",
    transition: `background-color ${themeVars.animation.duration}`,

    selectors: {
        "&:hover": {
            backgroundColor: `color-mix(in srgb, ${themeVars.color.primary.main} 50%, transparent)`,
        },
        "&:focus-visible": {
            outline: `2px solid ${themeVars.color.primary.main}`,
            outlineOffset: 2,
        },
    },
});

export const marqueeStack = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: themeVars.spacing.full,
    width: "100%",
});

export const marqueeStage = style([stage, { height: MARQUEE_ROW_HEIGHT }]);

export const marqueeTile = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.double,
    height: MARQUEE_ROW_HEIGHT,
    paddingInline: `calc(${themeVars.spacing.double} * 0.5)`,
});

export const marqueeWord = style({
    padding: `${themeVars.spacing.half} ${themeVars.spacing.full}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: `color-mix(in srgb, ${themeVars.color.primary.main} 25%, transparent)`,
    fontSize: themeVars.fontSize.large,
    fontWeight: "bold",
    whiteSpace: "nowrap",
});

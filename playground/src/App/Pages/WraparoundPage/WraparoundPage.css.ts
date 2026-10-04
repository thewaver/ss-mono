import { style } from "@vanilla-extract/css";

import { MOSAIC_GAP } from "./WraparoundPage.const";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

const GRID_CELL_SIZE = 72;

export const stage = style({
    width: "100%",
    height: 360,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: layerVars.main,
});

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
    backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 25%)`,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.large,
    fontWeight: "bold",
    cursor: "pointer",
    transition: `background-color ${themeVars.animation.duration}`,

    selectors: {
        "&:hover": {
            backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 50%)`,
        },
        "&:focus-visible": {
            outline: `2px solid ${themeVars.color.primary.main}`,
            outlineOffset: 2,
        },
    },
});

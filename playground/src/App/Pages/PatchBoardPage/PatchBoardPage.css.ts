import { style } from "@vanilla-extract/css";

import { BOARD_HEIGHT_RATIO, BOARD_WIDTH, PAN_BOARD_WIDTH } from "./PatchBoardPage.const";

import { themeVars } from "../../Theme.css";

const PAN_WINDOW_HEIGHT = 260;

export const rackGrid = style({
    width: BOARD_WIDTH,
    backgroundImage: `radial-gradient(circle, rgb(from ${themeVars.color.primary.main} r g b / 40%) 1px, transparent 1.5px)`,
});

export const panWindow = style({
    width: BOARD_WIDTH,
    height: PAN_WINDOW_HEIGHT,
    overflow: "auto",
});

export const panBoard = style({
    width: PAN_BOARD_WIDTH,
});

export const zoomStage = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: themeVars.spacing.full,
});

export const zoomControls = style({
    display: "flex",
    gap: themeVars.spacing.half,
});

export const zoomWindow = style({
    width: BOARD_WIDTH,
    height: BOARD_WIDTH * BOARD_HEIGHT_RATIO,
    overflow: "auto",
});

export const zoomScaler = style({
    width: BOARD_WIDTH,
    transformOrigin: "0 0",
});

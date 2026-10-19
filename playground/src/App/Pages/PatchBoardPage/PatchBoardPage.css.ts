import { style } from "@vanilla-extract/css";

import { BOARD_WIDTH } from "./PatchBoardPage.const";

import { themeVars } from "../../Theme.css";

export const rackGrid = style({
    width: BOARD_WIDTH,
    backgroundImage: `radial-gradient(circle, rgb(from ${themeVars.color.primary.main} r g b / 40%) 1px, transparent 1.5px)`,
});

export const viewStage = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: themeVars.spacing.full,
});

export const viewWindow = style({
    width: BOARD_WIDTH,
});

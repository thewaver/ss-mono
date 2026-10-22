import { style } from "@vanilla-extract/css";

import { ARROW_BED_BOX_SIZE, ARROW_BED_GAP, CIRCLING_SLIDER_WIDTH } from "./TooltipPage.const";

import { themeVars } from "../../Theme.css";

export const anchorRow = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: themeVars.spacing.full,
    padding: themeVars.spacing.double,
});

export const anchorButton = style({
    all: "revert",
});

export const sentence = style({
    padding: themeVars.spacing.double,
});

export const anchorWord = style({
    borderBottom: `1px dotted currentColor`,
    cursor: "help",

    selectors: {
        "&:focus-visible": {
            outline: `2px solid ${themeVars.color.outline.main}`,
            outlineOffset: 2,
        },
    },
});

export const richTitle = style({
    marginBottom: themeVars.spacing.half,
    fontSize: themeVars.fontSize.small,
    fontWeight: "bold",
});

export const richBody = style({
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.85,
});

export const arrowBed = style({
    display: "grid",
    gridTemplateColumns: "repeat(3, max-content)",
    justifyContent: "center",
    alignItems: "center",
    justifyItems: "center",
    gap: ARROW_BED_GAP,
    padding: themeVars.spacing.double,
});

export const arrowBedLabel = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: ARROW_BED_BOX_SIZE.width,
    minHeight: ARROW_BED_BOX_SIZE.height,
    padding: themeVars.spacing.double,
    color: themeVars.color.surface.contrast,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
    textAlign: "center",
});

export const arrowBedAnchor = style({
    width: ARROW_BED_BOX_SIZE.width,
    height: ARROW_BED_BOX_SIZE.height,
    border: `1px dashed currentColor`,
    borderRadius: themeVars.borderRadius.half,
    opacity: 0.5,
});

export const circlingStage = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: ARROW_BED_GAP,
    padding: ARROW_BED_GAP,
});

export const circlingSlider = style({
    width: CIRCLING_SLIDER_WIDTH,
});

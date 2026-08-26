import { style, styleVariants } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const cuboidFaceBase = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: themeVars.spacing.half,
    width: "100%",
    height: "100%",
    borderRadius: themeVars.borderRadius.half,
    textAlign: "center",
});

export const cuboidFace = styleVariants({
    front: [cuboidFaceBase, { backgroundColor: themeVars.color.tooltip.dark, color: themeVars.color.tooltip.contrast }],
    back: [cuboidFaceBase, { backgroundColor: themeVars.color.tooltip.light, color: themeVars.color.tooltip.contrast }],
    left: [cuboidFaceBase, { backgroundColor: themeVars.color.primary.dark, color: themeVars.color.primary.contrast }],
    right: [cuboidFaceBase, { backgroundColor: themeVars.color.primary.main, color: themeVars.color.primary.contrast }],
    top: [
        cuboidFaceBase,
        { backgroundColor: themeVars.color.secondary.main, color: themeVars.color.secondary.contrast },
    ],
    bottom: [
        cuboidFaceBase,
        { backgroundColor: themeVars.color.secondary.dark, color: themeVars.color.secondary.contrast },
    ],
});

export const cuboidFaceTitle = style({
    fontSize: themeVars.fontSize.large,
});

export const cuboidFaceBody = style({
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const cuboidStack = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: themeVars.spacing.full,
});

export const cuboidPad = style({
    display: "grid",
    gridTemplateColumns: "repeat(3, auto)",
    justifyItems: "center",
    alignItems: "center",
    gap: themeVars.spacing.half,
});

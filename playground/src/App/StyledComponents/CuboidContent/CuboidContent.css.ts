import { style, styleVariants } from "@vanilla-extract/css";

import { RAINBOW, themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

const rainbowFace = (hue: number) => ({ backgroundColor: RAINBOW[hue].main, color: RAINBOW[hue].contrast });

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
    front: [cuboidFaceBase, { backgroundColor: `rgb(from ${layerVars.main} r g b / 50%)`, color: layerVars.contrast }],
    back: [cuboidFaceBase, { backgroundColor: `rgb(from ${layerVars.main} r g b / 75%)`, color: layerVars.contrast }],
    left: [cuboidFaceBase, rainbowFace(22.5)],
    right: [cuboidFaceBase, rainbowFace(202.5)],
    top: [cuboidFaceBase, rainbowFace(112.5)],
    bottom: [cuboidFaceBase, rainbowFace(292.5)],
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

export const cuboidRow = style({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: themeVars.spacing.half,
});

import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

const FRAME_MAX_WIDTH = 380;
const PICTURE_ASPECT = 1;

export const isDragging = style({});
export const isDisabled = style({});

const gutterBase = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: themeVars.borderRadius.half,
    transition: `background-color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isDragging}`]: {
            backgroundColor: themeVars.color.primary.main,
        },
        [`&.${isDisabled}`]: {
            opacity: themeVars.disabled.opacity,
        },
    },
} as const;

export const rowGutter = style({ ...gutterBase, width: "100%", height: "100%" });

export const columnGutter = style({ ...gutterBase, width: "100%", height: "100%" });

export const gutterGrip = style({
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: `rgb(from ${layerVars.contrast} r g b / 50%)`,
});

export const rowGrip = style([gutterGrip, { width: 2, height: 24 }]);

export const columnGrip = style([gutterGrip, { width: 24, height: 2 }]);

export const splitPaneBox = style({
    width: "100%",
    height: "100%",
    padding: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.half,
    color: layerVars.contrast,
    backgroundColor: layerVars.main,
    fontSize: themeVars.fontSize.small,
    overflow: "auto",
});

export const splitPaneFrame = style({
    width: "100%",
    maxWidth: FRAME_MAX_WIDTH,
    height: 220,
    padding: themeVars.spacing.half,
    border: `1px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
});

export const compareFrame = style([
    splitPaneFrame,
    { containerType: "inline-size", height: "auto", aspectRatio: `${PICTURE_ASPECT}` },
]);

export const compareBox = style({
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: themeVars.borderRadius.half,
    overflow: "hidden",
});

const compareImageBase = {
    position: "absolute",
    top: 0,
    width: "100cqw",
    height: "100%",
    objectFit: "cover",
} as const;

export const compareStartImage = style({ ...compareImageBase, left: 0 });

export const compareEndImage = style({ ...compareImageBase, right: 0 });

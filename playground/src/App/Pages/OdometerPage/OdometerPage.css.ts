import { createVar, keyframes, style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const fadeDurationVar = createVar();

const fadeIn = keyframes({
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
});

const fadeOut = keyframes({
    "0%": { opacity: 1 },
    "100%": { opacity: 0 },
});

export const isEntering = style({
    animation: `${fadeIn} ${fadeDurationVar} ease-out`,
});

export const isLeaving = style({
    animation: `${fadeOut} ${fadeDurationVar} ease-in forwards`,
});

export const stack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "flex-start",
    width: "100%",
});

export const controls = style({
    display: "flex",
    gap: themeVars.spacing.half,
    flexWrap: "wrap",
});

export const digit = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: layerVars.main,
    color: themeVars.color.primary.main,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xLarge,
});

export const fixed = style({
    color: layerVars.contrast,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xLarge,
});

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

export const board = style({
    display: "inline-flex",
    padding: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.full,
    background: `linear-gradient(215deg, ${themeVars.color.background.light}, ${themeVars.color.background.dark})`,
    boxShadow: themeVars.shadow.medium,
});

export const flapTile = style({
    "position": "relative",
    "display": "grid",
    "placeItems": "center",
    "width": "100%",
    "height": "100%",
    "border": `1px solid ${themeVars.color.background.dark}`,
    "borderRadius": themeVars.borderRadius.half,
    "background": `linear-gradient(215deg, ${themeVars.color.surface.light}, ${themeVars.color.surface.dark})`,
    "color": themeVars.color.surface.contrast,
    "fontFamily": "monospace",
    "fontSize": themeVars.fontSize.xLarge,
    "::after": {
        content: "''",
        position: "absolute",
        left: 0,
        right: 0,
        top: "50%",
        height: 2,
        transform: "translateY(-50%)",
        backgroundColor: themeVars.color.background.dark,
    },
});

export const flapFixed = style({
    color: themeVars.color.background.contrast,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xLarge,
});

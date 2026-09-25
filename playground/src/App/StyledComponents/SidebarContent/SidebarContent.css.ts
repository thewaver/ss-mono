import { style, styleVariants } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const FRAME_MAX_WIDTH = 520;
const FRAME_HEIGHT = 240;

export const sidebarFrameVariants = styleVariants({
    left: {
        flexDirection: "row",
    },
    right: {
        flexDirection: "row-reverse",
    },
});

export const sidebarFrame = style({
    display: "flex",
    width: "100%",
    maxWidth: FRAME_MAX_WIDTH,
    height: FRAME_HEIGHT,
    border: `1px solid rgb(from currentColor r g b / 25%)`,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.background.dark,
    overflow: "hidden",
});

export const sidebarSurface = style({
    width: "100%",
    height: "100%",
    overflow: "hidden",
    color: themeVars.color.surface.contrast,
    backgroundImage: `linear-gradient(215deg, ${themeVars.color.surface.light}, ${themeVars.color.surface.dark})`,
    boxShadow: themeVars.shadow.medium,
});

export const sidebarSurfaceContent = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    boxSizing: "border-box",
    height: "100%",
    padding: themeVars.spacing.full,
});

export const isFaded = style({});
export const isHidden = style({});

export const sidebarFade = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    transitionProperty: "opacity",

    selectors: {
        [`&.${isFaded}`]: {
            opacity: 0,
        },
        [`&.${isHidden}`]: {
            visibility: "hidden",
        },
    },
});

export const sidebarPhase = style({
    fontSize: themeVars.fontSize.small,
    opacity: 0.75,
});

export const sidebarNeighbor = style({
    flex: 1,
    minWidth: 0,
    padding: themeVars.spacing.double,
    fontSize: themeVars.fontSize.small,
    overflow: "auto",
});

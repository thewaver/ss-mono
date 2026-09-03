import { style } from "@vanilla-extract/css";

import { FOCUS_RING_WIDTH, themeVars } from "../../Theme.css";

export const isCarried = style({});
export const isHovered = style({});
export const isFocusVisible = style({});
export const isDisabled = style({});
export const isTaken = style({});
export const isSource = style({});
export const isAimed = style({});
export const isRefused = style({});
export const isIn = style({});
export const isPending = style({});

export const patchNode = style({
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    justifyContent: "center",
    gap: themeVars.spacing.half,
    minWidth: 0,
    padding: themeVars.spacing.full,
    border: `1px solid rgb(from ${themeVars.color.primary.main} r g b / 50%)`,
    borderRadius: themeVars.borderRadius.half,
    background: `linear-gradient(215deg, ${themeVars.color.surface.light}, ${themeVars.color.surface.dark})`,
    color: themeVars.color.surface.contrast,
    boxShadow: themeVars.shadow.small,
    cursor: "grab",
    transition: `border-color ${themeVars.animation.duration}, box-shadow ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            borderColor: themeVars.color.primary.main,
        },
        [`&.${isFocusVisible}`]: {
            outline: `${FOCUS_RING_WIDTH}px solid ${themeVars.color.outline.main}`,
            outlineOffset: 2,
        },
        [`&.${isCarried}`]: {
            cursor: "grabbing",
            boxShadow: themeVars.shadow.medium,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
            cursor: "default",
        },
    },
});

export const patchNodeName = style({
    fontSize: themeVars.fontSize.small,
    fontWeight: "bold",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
});

export const patchNodeKind = style({
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.xSmall,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
});

export const patchSocket = style({
    flex: "1 1 auto",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    borderRadius: "50%",
    border: `2px solid ${themeVars.color.primary.main}`,
    background: themeVars.color.control.background.main,
    cursor: "crosshair",
    transition: `background ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}, transform ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isIn}`]: {
            borderColor: themeVars.color.secondary.main,
        },
        [`&.${isTaken}`]: {
            background: `radial-gradient(circle at 70% 30%, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
        },
        [`&.${isIn}.${isTaken}`]: {
            background: `radial-gradient(circle at 70% 30%, ${themeVars.color.secondary.light}, ${themeVars.color.secondary.dark})`,
        },
        [`&.${isHovered}`]: {
            transform: "scale(1.25)",
        },
        [`&.${isSource}`]: {
            transform: "scale(1.25)",
            borderColor: themeVars.color.alert.main,
        },
        [`&.${isAimed}`]: {
            transform: "scale(1.4)",
        },
        [`&.${isRefused}`]: {
            borderColor: themeVars.color.error.main,
            borderStyle: "dashed",
        },
        [`&.${isFocusVisible}`]: {
            outline: `${FOCUS_RING_WIDTH}px solid ${themeVars.color.outline.main}`,
            outlineOffset: 2,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
            cursor: "default",
        },
    },
});

export const patchCable = style({
    fill: "none",
    stroke: themeVars.color.primary.main,
    strokeWidth: 2,
    strokeLinecap: "round",

    selectors: {
        [`&.${isPending}`]: {
            stroke: themeVars.color.alert.main,
            strokeDasharray: "6 5",
        },
        [`&.${isPending}.${isRefused}`]: {
            stroke: themeVars.color.error.main,
        },
    },
});

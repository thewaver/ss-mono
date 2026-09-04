import { style, styleVariants } from "@vanilla-extract/css";

import { FOCUS_RING_WIDTH, themeVars } from "../../Theme.css";

export const AXIS_HEIGHT = 22;
const FRAME_WIDTH = 520;

export const isMajor = style({});
export const isHovered = style({});
export const isFocusVisible = style({});
export const isDisabled = style({});

export const timelineFrame = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    width: "100%",
    maxWidth: FRAME_WIDTH,
    padding: themeVars.spacing.full,
    border: `1px solid rgb(from currentColor r g b / 25%)`,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.background.dark,
    touchAction: "none",
    userSelect: "none",
});

export const timelineRow = style({
    display: "flex",
    alignItems: "stretch",
    gap: themeVars.spacing.half,
});

export const timelineLanes = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    flex: "0 0 auto",
    paddingTop: AXIS_HEIGHT,
});

export const timelineLaneName = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    boxSizing: "border-box",
    paddingRight: themeVars.spacing.half,
    color: themeVars.color.background.contrast,
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.6,
    whiteSpace: "nowrap",
});

export const timelineTrack = style({
    flex: "1 1 auto",
    minWidth: 0,
    cursor: "grab",
});

export const timelineRule = style({
    position: "absolute",
    top: AXIS_HEIGHT,
    bottom: 0,
    width: 1,
    backgroundColor: `rgb(from currentColor r g b / 12%)`,

    selectors: {
        [`&.${isMajor}`]: {
            backgroundColor: `rgb(from currentColor r g b / 30%)`,
        },
    },
});

export const timelineTickLabel = style({
    position: "absolute",
    top: 0,
    left: 0,
    paddingLeft: 4,
    color: themeVars.color.background.contrast,
    fontSize: themeVars.fontSize.xSmall,
    fontVariantNumeric: "tabular-nums",
    lineHeight: `${AXIS_HEIGHT}px`,
    opacity: 0.7,
    whiteSpace: "nowrap",
});

export const timelineBlock = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    minWidth: 0,
    padding: `0 ${themeVars.spacing.half}`,
    borderRadius: themeVars.borderRadius.half,
    boxShadow: themeVars.shadow.small,
    cursor: "pointer",
    overflow: "hidden",
    transition: `filter ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            filter: "brightness(1.2)",
        },
        [`&.${isFocusVisible}`]: {
            outline: `${FOCUS_RING_WIDTH}px solid ${themeVars.color.outline.main}`,
            outlineOffset: 1,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
            cursor: "default",
        },
    },
});

export const timelineBlockTones = styleVariants({
    primary: {
        border: `1px solid ${themeVars.color.primary.dark}`,
        background: `linear-gradient(180deg, ${themeVars.color.primary.dark}, ${themeVars.color.surface.dark})`,
    },
    secondary: {
        border: `1px solid ${themeVars.color.secondary.dark}`,
        background: `linear-gradient(180deg, ${themeVars.color.secondary.dark}, ${themeVars.color.surface.dark})`,
    },
    info: {
        border: `1px solid ${themeVars.color.info.main}`,
        background: `linear-gradient(180deg, ${themeVars.color.info.main}, ${themeVars.color.surface.dark})`,
    },
});

export const timelineBlockName = style({
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.xSmall,
    fontWeight: "bold",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
});

export const timelineBlockNote = style({
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.7,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
});

export const timelineControls = style({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: themeVars.spacing.half,
});

import { style, styleVariants } from "@vanilla-extract/css";

import { FOCUS_RING_WIDTH, RAINBOW, RAINBOW_HUES, themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const AXIS_HEIGHT = 22;

export const PAGE_TIMELINE_FAMILIES = RAINBOW_HUES;

const FRAME_WIDTH = 520;

export const isMajor = style({});
export const isHovered = style({});
export const isFocusVisible = style({});
export const isDisabled = style({});
export const isHeldStart = style({});
export const isHeldEnd = style({});

const MARKER_WIDTH = 2;
const MARKER_HEAD = 8;
const HELD_EDGE_WIDTH = 3;

export const timelineFrame = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    width: "100%",
    maxWidth: FRAME_WIDTH,
    padding: themeVars.spacing.full,
    border: `1px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: layerVars.main,
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
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.5,
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
    backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,

    selectors: {
        [`&.${isMajor}`]: {
            backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
        },
    },
});

export const timelineTickLabel = style({
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    height: AXIS_HEIGHT,
    paddingLeft: themeVars.spacing.half,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.xSmall,
    fontVariantNumeric: "tabular-nums",
    opacity: 0.75,
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
        [`&.${isHeldStart}`]: {
            boxShadow: `inset ${HELD_EDGE_WIDTH}px 0 0 ${themeVars.color.outline.main}`,
        },
        [`&.${isHeldEnd}`]: {
            boxShadow: `inset -${HELD_EDGE_WIDTH}px 0 0 ${themeVars.color.outline.main}`,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
            cursor: "default",
        },
    },
});

export const timelineBlockFamily = styleVariants(
    Object.fromEntries(
        PAGE_TIMELINE_FAMILIES.map((family) => [
            family,
            {
                color: RAINBOW[family].contrast,
                border: `1px solid ${RAINBOW[family].dark}`,
                background: `linear-gradient(180deg, ${RAINBOW[family].dark}, ${RAINBOW[family].light})`,
            },
        ]),
    ),
);

export const timelineBlockName = style({
    fontSize: themeVars.fontSize.xSmall,
    fontWeight: "bold",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
});

export const timelineBlockNote = style({
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
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

export const timelineMarker = style({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: -MARKER_WIDTH * 0.5,
    width: MARKER_WIDTH,

    selectors: {
        "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: (MARKER_WIDTH - MARKER_HEAD) * 0.5,
            width: MARKER_HEAD,
            height: MARKER_HEAD,
            clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
            backgroundColor: "inherit",
        },
    },
});

export const timelineMarkerTones = styleVariants({
    now: {
        backgroundColor: themeVars.color.error.main,
    },
    playhead: {
        backgroundColor: themeVars.color.primary.main,
    },
});

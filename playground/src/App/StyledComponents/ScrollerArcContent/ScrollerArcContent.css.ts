import { style } from "@vanilla-extract/css";

import { ARC_THUMB_SIZE } from "./ScrollerArcContent.const";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const ARC_LINE = 6;

export const isHidden = style({});
export const isDragging = style({});

export const scrollerArc = style({
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    transition: `opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHidden}`]: {
            opacity: 0,
        },
    },
});

export const scrollerArcTrack = style({
    position: "relative",
    flexShrink: 0,
});

export const scrollerArcSvg = style({
    position: "absolute",
    inset: 0,
    overflow: "visible",
});

export const scrollerArcPath = style({
    fill: "none",
    stroke: `rgb(from ${layerVars.contrast} r g b / 25%)`,
    strokeWidth: ARC_LINE,
    strokeLinecap: "round",
});

export const scrollerArcThumb = style({
    position: "absolute",
    width: ARC_THUMB_SIZE,
    height: ARC_THUMB_SIZE,
    marginTop: -ARC_THUMB_SIZE * 0.5,
    marginLeft: -ARC_THUMB_SIZE * 0.5,
    borderRadius: "50%",
    backgroundColor: themeVars.color.primary.main,
    boxShadow: themeVars.shadow.small,

    selectors: {
        [`&.${isDragging}`]: {
            filter: themeVars.active.filter,
        },
    },
});

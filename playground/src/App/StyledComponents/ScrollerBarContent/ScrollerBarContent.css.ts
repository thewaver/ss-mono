import { style, styleVariants } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const SCROLLER_BAR_THICKNESS = 24;
export const SCROLLER_BAR_LINE = 6;

export const isHidden = style({});
export const isDragging = style({});

export const scrollerBar = style({
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

export const scrollerBarVariants = styleVariants({
    x: {
        flexDirection: "row",
        height: SCROLLER_BAR_THICKNESS,
    },
    y: {
        flexDirection: "column",
        width: SCROLLER_BAR_THICKNESS,
    },
});

export const scrollerBarTrack = style({
    position: "relative",
    flexGrow: 1,

    selectors: {
        "&::before": {
            content: '""',
            position: "absolute",
            borderRadius: SCROLLER_BAR_LINE,
            backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
        },
    },
});

export const scrollerBarTrackVariants = styleVariants({
    x: {
        selectors: {
            "&::before": {
                left: 0,
                right: 0,
                top: "50%",
                height: SCROLLER_BAR_LINE,
                transform: "translateY(-50%)",
            },
        },
    },
    y: {
        selectors: {
            "&::before": {
                top: 0,
                bottom: 0,
                left: "50%",
                width: SCROLLER_BAR_LINE,
                transform: "translateX(-50%)",
            },
        },
    },
});

export const scrollerBarThumb = style({
    position: "absolute",

    selectors: {
        "&::before": {
            content: '""',
            position: "absolute",
            borderRadius: SCROLLER_BAR_LINE,
            backgroundColor: themeVars.color.primary.main,
            boxShadow: themeVars.shadow.small,
        },
        [`&.${isDragging}::before`]: {
            filter: themeVars.active.filter,
        },
    },
});

export const scrollerBarThumbVariants = styleVariants({
    x: {
        top: 0,
        bottom: 0,

        selectors: {
            "&::before": {
                left: 0,
                right: 0,
                top: "50%",
                height: SCROLLER_BAR_LINE,
                transform: "translateY(-50%)",
            },
        },
    },
    y: {
        left: 0,
        right: 0,

        selectors: {
            "&::before": {
                top: 0,
                bottom: 0,
                left: "50%",
                width: SCROLLER_BAR_LINE,
                transform: "translateX(-50%)",
            },
        },
    },
});

import { style, styleVariants } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

export const RANGE_THUMB_SIZE = 18;
export const RANGE_TRACK_THICKNESS = 6;
export const RANGE_LENGTH = 220;

export const isFocused = style({});
export const isDisabled = style({});
export const hasError = style([lookStates.hasError]);
export const isStart = style([lookStates.isStart]);
export const isEnd = style([lookStates.isEnd]);

export const rangeContent = style({
    position: "relative",
    transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const rangeContentVariants = styleVariants({
    horizontal: {
        height: RANGE_THUMB_SIZE,
    },
    vertical: {
        width: RANGE_THUMB_SIZE,
    },
});

export const rangeTrack = style([
    lookEntries.rangeTrack,
    {
        position: "absolute",
    },
]);

export const rangeTrackVariants = styleVariants({
    horizontal: {
        left: 0,
        right: 0,
        top: "50%",
        height: RANGE_TRACK_THICKNESS,
        transform: `translateY(-50%)`,
    },
    vertical: [
        lookStates.isVertical,
        {
            top: 0,
            bottom: 0,
            left: "50%",
            width: RANGE_TRACK_THICKNESS,
            transform: `translateX(-50%)`,
        },
    ],
});

export const rangeFill = style([
    lookEntries.rangeFill,
    {
        position: "absolute",
    },
]);

export const rangeFillVariants = styleVariants({
    horizontal: {
        top: 0,
        bottom: 0,
    },
    vertical: [
        lookStates.isVertical,
        {
            left: 0,
            right: 0,
        },
    ],
});

export const rangeThumb = style([
    lookEntries.rangeThumb,
    {
        position: "absolute",
        width: RANGE_THUMB_SIZE,
        height: RANGE_THUMB_SIZE,
        transition: `border-color ${themeVars.animation.duration}, transform ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isFocused}`]: {
                transform: "scale(1.2)",
            },
        },
    },
]);

export const rangeThumbVariants = styleVariants({
    horizontal: {
        top: "50%",
        marginTop: -RANGE_THUMB_SIZE * 0.5,
    },
    vertical: [
        lookStates.isVertical,
        {
            left: "50%",
            marginLeft: -RANGE_THUMB_SIZE * 0.5,
        },
    ],
});

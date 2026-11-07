import { fallbackVar, style, styleVariants } from "@vanilla-extract/css";

import { skinEntries, skinStates, skinVars } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const RANGE_THUMB_SIZE = 20;
export const RANGE_TRACK_THICKNESS = 6;
export const RANGE_LENGTH = 220;

const PRESS_SIZE = `${RANGE_THUMB_SIZE}px`;
const TRACK_THICKNESS = fallbackVar(skinVars.rangeTrackThickness, `${RANGE_TRACK_THICKNESS}px`);
const FILL_THICKNESS = fallbackVar(skinVars.rangeFillThickness, "100%");
const THUMB_WIDTH = fallbackVar(skinVars.rangeThumbWidth, PRESS_SIZE);
const THUMB_HEIGHT = fallbackVar(skinVars.rangeThumbHeight, PRESS_SIZE);
const CROSS_SIZE = `max(${PRESS_SIZE}, ${TRACK_THICKNESS}, ${THUMB_HEIGHT}, ${fallbackVar(skinVars.rangeFillThickness, "0px")})`;

export const RANGE_DRAWN_THUMB_WIDTH = THUMB_WIDTH;
const CENTERING_OFFSET = `calc((${PRESS_SIZE} - ${THUMB_WIDTH}) * 0.5)`;

export const isFocused = style({});
export const isDisabled = style({});
export const hasError = style([skinStates.hasError]);
export const isStart = style([skinStates.isStart]);
export const isEnd = style([skinStates.isEnd]);

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
        height: CROSS_SIZE,
    },
    vertical: {
        width: CROSS_SIZE,
    },
});

export const rangeTrack = style([
    skinEntries.rangeTrack,
    {
        position: "absolute",
    },
]);

export const rangeTrackVariants = styleVariants({
    horizontal: {
        left: 0,
        right: 0,
        top: "50%",
        height: TRACK_THICKNESS,
        transform: `translateY(-50%)`,
    },
    vertical: [
        skinStates.isVertical,
        {
            top: 0,
            bottom: 0,
            left: "50%",
            width: TRACK_THICKNESS,
            transform: `translateX(-50%)`,
        },
    ],
});

export const rangeFill = style([
    skinEntries.rangeFill,
    {
        position: "absolute",
    },
]);

export const rangeFillVariants = styleVariants({
    horizontal: {
        top: "50%",
        height: FILL_THICKNESS,
        transform: `translateY(-50%)`,
    },
    vertical: [
        skinStates.isVertical,
        {
            left: "50%",
            width: FILL_THICKNESS,
            transform: `translateX(-50%)`,
        },
    ],
});

export const rangeThumb = style([
    skinEntries.rangeThumb,
    {
        position: "absolute",
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
        width: THUMB_WIDTH,
        height: THUMB_HEIGHT,
        marginTop: `calc(${THUMB_HEIGHT} * -0.5)`,
        marginInlineStart: CENTERING_OFFSET,
    },
    vertical: [
        skinStates.isVertical,
        {
            left: "50%",
            width: THUMB_HEIGHT,
            height: THUMB_WIDTH,
            marginLeft: `calc(${THUMB_HEIGHT} * -0.5)`,
            marginBottom: CENTERING_OFFSET,
        },
    ],
});

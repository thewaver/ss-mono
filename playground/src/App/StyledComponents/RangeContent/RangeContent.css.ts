import { style, styleVariants } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const RANGE_THUMB_SIZE = 20;
export const RANGE_LENGTH = 240;

const PRESS_SIZE = `${RANGE_THUMB_SIZE}px`;
const CENTERING_SHIFT = `calc(${PRESS_SIZE} * 0.5 - 50%)`;
const CENTERING_SHIFT_REVERSED = `calc(50% - ${PRESS_SIZE} * 0.5)`;

export const isFocused = style({});
export const isDisabled = style({});
export const hasError = style([skinStates.hasError]);
export const isStart = style([skinStates.isStart]);
export const isEnd = style([skinStates.isEnd]);

export const rangeContent = style({
    display: "grid",
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
        alignItems: "center",
        justifyItems: "start",
        minHeight: PRESS_SIZE,
    },
    vertical: {
        alignItems: "end",
        justifyItems: "center",
        width: "fit-content",
        minWidth: PRESS_SIZE,
    },
});

const rangePart = {
    position: "relative",
    gridArea: "1 / 1",
} as const;

export const rangeTrack = style([skinEntries.rangeTrack, rangePart]);

export const rangeTrackVariants = styleVariants({
    horizontal: {
        justifySelf: "stretch",
    },
    vertical: [
        skinStates.isVertical,
        {
            alignSelf: "stretch",
        },
    ],
});

export const rangeFill = style([skinEntries.rangeFill, rangePart, { boxSizing: "content-box" }]);

export const rangeFillVariants = styleVariants({
    horizontal: {},
    vertical: [skinStates.isVertical],
});

export const rangeThumb = style([
    skinEntries.rangeThumb,
    rangePart,
    {
        transition: `border-color ${themeVars.animation.duration}, scale ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isFocused}`]: {
                scale: "1.2",
            },
        },
    },
]);

export const rangeThumbVariants = styleVariants({
    horizontal: {
        translate: CENTERING_SHIFT,

        selectors: {
            "&:dir(rtl)": {
                translate: CENTERING_SHIFT_REVERSED,
            },
        },
    },
    vertical: [
        skinStates.isVertical,
        {
            translate: `0 ${CENTERING_SHIFT_REVERSED}`,
        },
    ],
});

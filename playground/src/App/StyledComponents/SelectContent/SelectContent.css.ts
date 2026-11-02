import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";
import { SELECT_CLEAR_SIZE } from "../SelectClear/SelectClear.css";

const FIELD_WIDTH = 240;
const FIELD_HEIGHT = 40;
const FIELD_BORDER = 2;
const FIELD_BOX_PADDING = 10;

export const FIELD_PADDING = FIELD_BOX_PADDING + FIELD_BORDER;
export const FIELD_CHEVRON_WIDTH = 10;
export const FIELD_GAP = 10;
export const FIELD_FONT_SIZE = themeVars.fontSize.medium;

export const isEmpty = style({});
export const isFiltering = style({});
export const isHovered = style([lookStates.isHovered]);
export const isActive = style({});
export const isOpen = style({});
export const isDisabled = style([lookStates.isDisabled]);
export const hasError = style([lookStates.hasError]);

export const selectContent = style([
    lookEntries.input,
    {
        display: "flex",
        alignItems: "center",
        gap: FIELD_GAP,
        boxSizing: "border-box",
        width: FIELD_WIDTH,
        height: FIELD_HEIGHT,
        padding: FIELD_BOX_PADDING,
        textAlign: "start",
        transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isOpen}`]: {
                filter: themeVars.hover.filter,
            },
            [`&.${isActive}`]: {
                filter: themeVars.active.filter,
            },
        },
    },
]);

export const selectValue = style({
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    transition: `opacity ${themeVars.animation.duration}`,

    selectors: {
        [`${selectContent}.${isEmpty} &`]: {
            color: `rgb(from ${layerVars.contrast} r g b / 50%)`,
        },
        [`${selectContent}.${isFiltering} &`]: {
            opacity: 0,
        },
    },
});

export const selectClearSpace = style({
    flexShrink: 0,
    width: SELECT_CLEAR_SIZE,
});

export const selectChevron = style({
    flexShrink: 0,
    width: 0,
    height: 0,
    borderLeft: `${FIELD_CHEVRON_WIDTH * 0.5}px solid transparent`,
    borderRight: `${FIELD_CHEVRON_WIDTH * 0.5}px solid transparent`,
    borderTop: "6px solid currentColor",
    transition: `transform ${themeVars.animation.duration}`,

    selectors: {
        [`${selectContent}.${isOpen} &`]: {
            transform: "rotate(180deg)",
        },
    },
});

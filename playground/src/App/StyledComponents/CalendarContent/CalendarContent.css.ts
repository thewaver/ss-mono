import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";
import { FIELD_HEIGHT } from "../TextFieldContent/TextFieldContent.css";

const CELL_SIZE = 46;
const WIDE_CELL_WIDTH = 92;

export const isSelected = style([skinStates.isSelected]);
export const isToday = style({});
export const isOutsideMonth = style({});
export const isHovered = style([skinStates.isHovered]);
export const isDisabled = style([skinStates.isDisabled]);
export const isInRange = style({});
export const isRangeStart = style({});
export const isRangeEnd = style({});
export const isWide = style({});

const calendarDayBase = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: CELL_SIZE,
    height: CELL_SIZE,
    fontSize: themeVars.fontSize.small,
    fontVariantNumeric: "tabular-nums",
    transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isWide}`]: {
            width: WIDE_CELL_WIDTH,
        },
        [`&.${isOutsideMonth}:not(.${isDisabled})`]: {
            opacity: 0.5,
        },
        [`&.${isToday}`]: {
            textDecoration: "underline",
            textUnderlineOffset: themeVars.spacing.half,
        },
        [`&.${isInRange}:not(.${isRangeStart})`]: {
            borderStartStartRadius: 0,
            borderEndStartRadius: 0,
        },
        [`&.${isInRange}:not(.${isRangeEnd})`]: {
            borderStartEndRadius: 0,
            borderEndEndRadius: 0,
        },
    },
});

export const calendarDay = style([skinEntries.itemBase, calendarDayBase]);

export const calendarWeekday = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: CELL_SIZE,
    height: CELL_SIZE,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.xSmall,
    textTransform: "uppercase",
    opacity: 0.75,
});

export const calendarTitle = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: FIELD_HEIGHT,
    paddingInline: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.half,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.small,
    fontWeight: "bold",
    whiteSpace: "nowrap",
    transition: `color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            color: themeVars.color.primary.main,
        },
    },
});

export const calendarHeader = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: themeVars.spacing.half,
    width: "100%",
    paddingBottom: themeVars.spacing.half,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.small,
});

export const calendarFrame = style([
    skinEntries.dropdown,
    {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "fit-content",
        padding: themeVars.spacing.full,
    },
]);

export const calendarCaptionFields = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.half,
});

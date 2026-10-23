import { style, styleVariants } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

const CONTROL_SIZE = 24;
const RESIZER_WIDTH = 8;

export const isSortable = style({});
export const isResizable = style({});
export const isSorted = style({});
export const isHovered = style({});
export const isSelected = style({});
export const isResizing = style({});
export const isDisabled = style({});
export const isPinnedStart = style({});
export const isPinnedEnd = style({});
export const isExpanded = style({});

const HOVER_TINT = `rgb(from ${layerVars.contrast} r g b / 10%)`;
const SELECTED_TINT = `rgb(from ${themeVars.color.primary.main} r g b / 25%)`;
const SELECTED_HOVER_TINT = `rgb(from ${themeVars.color.primary.main} r g b / 35%)`;
const PIN_EDGE = `1px solid rgb(from ${layerVars.contrast} r g b / 25%)`;

const tint = (color: string) => ({
    backgroundColor: layerVars.main,
    backgroundImage: `linear-gradient(${color}, ${color})`,
});

export const alignVariants = styleVariants({
    start: { justifyContent: "flex-start", textAlign: "left" },
    end: { justifyContent: "flex-end", textAlign: "right" },
});

export const tableHeaderContent = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.half,
    height: "100%",
    padding: themeVars.spacing.half,
    borderBottom: `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.small,
    fontWeight: 700,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isSortable}`]: {
            cursor: "pointer",
        },
        [`&.${isResizable}`]: {
            paddingInlineEnd: RESIZER_WIDTH,
        },
        [`&.${isSortable}.${isHovered}`]: {
            backgroundColor: HOVER_TINT,
        },
        [`&.${isPinnedStart}`]: {
            borderInlineEnd: PIN_EDGE,
        },
        [`&.${isPinnedEnd}`]: {
            borderInlineStart: PIN_EDGE,
        },
        [`&.${isPinnedStart}.${isSortable}.${isHovered}, &.${isPinnedEnd}.${isSortable}.${isHovered}`]:
            tint(HOVER_TINT),
        [`&.${isSorted}`]: {
            color: themeVars.color.primary.main,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const tableText = style({
    minWidth: 0,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
});

const headerControl = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: CONTROL_SIZE,
    height: CONTROL_SIZE,
} as const;

export const tableHeaderText = style([
    tableText,
    {
        flex: 1,
    },
]);

export const tableSortMarker = style({
    ...headerControl,
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.5,

    selectors: {
        [`${tableHeaderContent}.${isSorted} &`]: {
            opacity: 1,
        },
    },
});

export const tableCellContent = style({
    display: "flex",
    alignItems: "center",
    height: "100%",
    padding: themeVars.spacing.half,
    borderBottom: `1px solid rgb(from ${layerVars.contrast} r g b / 10%)`,
    fontSize: themeVars.fontSize.small,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            backgroundColor: HOVER_TINT,
        },
        [`&.${isSelected}`]: {
            backgroundColor: SELECTED_TINT,
            color: themeVars.color.primary.light,
        },
        [`&.${isSelected}.${isHovered}`]: {
            backgroundColor: SELECTED_HOVER_TINT,
        },
        [`&.${isExpanded}`]: {
            borderBottomColor: "transparent",
        },
        [`&.${isPinnedStart}`]: {
            backgroundColor: layerVars.main,
            borderInlineEnd: PIN_EDGE,
        },
        [`&.${isPinnedEnd}`]: {
            backgroundColor: layerVars.main,
            borderInlineStart: PIN_EDGE,
        },
        [`&.${isPinnedStart}.${isHovered}, &.${isPinnedEnd}.${isHovered}`]: tint(HOVER_TINT),
        [`&.${isPinnedStart}.${isSelected}, &.${isPinnedEnd}.${isSelected}`]: tint(SELECTED_TINT),
        [`&.${isPinnedStart}.${isSelected}.${isHovered}, &.${isPinnedEnd}.${isSelected}.${isHovered}`]:
            tint(SELECTED_HOVER_TINT),
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const tableCellLeading = style({
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    width: CONTROL_SIZE,
    height: CONTROL_SIZE,
    marginInlineEnd: themeVars.spacing.half,
});

export const tableRowExpander = style({
    ...headerControl,
    display: "inline-flex",
    verticalAlign: "middle",
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.6,

    selectors: {
        "&:hover": {
            opacity: 1,
        },
    },
});

export const tableDetailContent = style({
    padding: themeVars.spacing.full,
    borderBottom: `1px solid rgb(from ${layerVars.contrast} r g b / 10%)`,
    backgroundColor: `rgb(from ${layerVars.contrast} r g b / 5%)`,
    fontSize: themeVars.fontSize.small,
    lineHeight: 1.5,

    selectors: {
        [`&.${isSelected}`]: {
            backgroundColor: SELECTED_TINT,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

export const tableResizerHandle = style({
    width: "100%",
    height: "100%",
    borderRight: `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    transition: `border-color ${themeVars.animation.duration}`,

    selectors: {
        [`&:hover, &.${isResizing}`]: {
            borderRightColor: themeVars.color.primary.main,
        },
    },
});

export const tableMarker = style({
    width: 2,
    height: "100%",
    backgroundColor: themeVars.color.primary.main,
});

export const tableReorderGrip = style({
    ...headerControl,
    opacity: 0.4,
    cursor: "grab",
    selectors: {
        "&:hover": {
            opacity: 1,
        },
    },
});

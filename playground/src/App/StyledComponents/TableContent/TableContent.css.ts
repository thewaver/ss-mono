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
    lineHeight: 1.25,
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
            backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
        },
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
    lineHeight: 1.25,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
        },
        [`&.${isSelected}`]: {
            backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 25%)`,
            color: themeVars.color.primary.light,
        },
        [`&.${isSelected}.${isHovered}`]: {
            backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 35%)`,
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

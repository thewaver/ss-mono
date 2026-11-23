import { style, styleVariants } from "@vanilla-extract/css";

import { skinEntries, skinStates, skinVars } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

const CONTROL_SIZE = 24;
const RESIZER_WIDTH = 8;

export const isSortable = style([skinStates.isSortable]);
export const isResizable = style({});
export const isSorted = style([skinStates.isSorted]);
export const isHovered = style([skinStates.isHovered]);
export const isSelected = style([skinStates.isSelected]);
export const isResizing = style({});
export const isDisabled = style({});
export const isPinnedStart = style([skinStates.isPinned]);
export const isPinnedEnd = style([skinStates.isPinned]);
export const isExpanded = style({});

export const alignVariants = styleVariants({
    start: { justifyContent: "flex-start", textAlign: "left" },
    end: { justifyContent: "flex-end", textAlign: "right" },
});

export const tableHeaderContent = style([
    skinEntries.tableHeader,
    {
        display: "flex",
        alignItems: "center",
        gap: themeVars.spacing.half,
        height: "100%",
        padding: themeVars.spacing.half,
        fontSize: themeVars.fontSize.small,
        fontWeight: 700,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        borderBottomWidth: 2,
        borderBottomStyle: "solid",
        transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isSortable}`]: {
                cursor: "pointer",
            },
            [`&.${isResizable}`]: {
                paddingInlineEnd: RESIZER_WIDTH,
            },
            [`&.${isPinnedStart}`]: {
                borderInlineEndWidth: 1,
                borderInlineEndStyle: "solid",
            },
            [`&.${isPinnedEnd}`]: {
                borderInlineStartWidth: 1,
                borderInlineStartStyle: "solid",
            },
            [`&.${isDisabled}`]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
]);

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

export const tableCellContent = style([
    skinEntries.tableCell,
    {
        display: "flex",
        alignItems: "center",
        height: "100%",
        padding: themeVars.spacing.half,
        fontSize: themeVars.fontSize.small,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isExpanded}`]: {
                borderBottomColor: "transparent",
            },
            [`&.${isPinnedStart}`]: {
                borderInlineEndWidth: 1,
                borderInlineEndStyle: "solid",
            },
            [`&.${isPinnedEnd}`]: {
                borderInlineStartWidth: 1,
                borderInlineStartStyle: "solid",
            },
            [`&.${isDisabled}`]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
]);

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

export const tableDetailContent = style([
    skinEntries.tableDetail,
    {
        padding: themeVars.spacing.full,
        fontSize: themeVars.fontSize.small,
        lineHeight: 1.5,
        borderBottomWidth: 1,
        borderBottomStyle: "solid",

        selectors: {
            [`&.${isDisabled}`]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
]);

export const tableResizerHandle = style([
    skinEntries.grip,
    {
        width: "100%",
        height: "100%",
        borderRight: "2px solid currentColor",
        transition: `border-color ${themeVars.animation.duration}`,

        selectors: {
            [`&:hover, &.${isResizing}`]: {
                borderRightColor: skinVars.accentColor,
            },
        },
    },
]);

export const tableMarker = style({
    width: 2,
    height: "100%",
    backgroundColor: skinVars.accentColor,
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

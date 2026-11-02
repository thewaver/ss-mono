import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const retroOS = style({});

const LIGHT_EDGE = "rgb(255 255 255 / 50%)";
const LIGHT_EDGE_INNER = "rgb(255 255 255 / 20%)";
const DARK_EDGE = "rgb(0 0 0 / 75%)";
const DARK_EDGE_INNER = "rgb(0 0 0 / 35%)";
const SEGMENT_WIDTH = 8;
const SEGMENT_GAP = 2;

const RAISED = `inset -1px -1px 0 ${DARK_EDGE}, inset 1px 1px 0 ${LIGHT_EDGE}, inset -2px -2px 0 ${DARK_EDGE_INNER}, inset 2px 2px 0 ${LIGHT_EDGE_INNER}`;
const SUNKEN = `inset 1px 1px 0 ${DARK_EDGE}, inset -1px -1px 0 ${LIGHT_EDGE}, inset 2px 2px 0 ${DARK_EDGE_INNER}, inset -2px -2px 0 ${LIGHT_EDGE_INNER}`;
const THIN_RAISED = `inset -1px -1px 0 ${DARK_EDGE}, inset 1px 1px 0 ${LIGHT_EDGE}`;
const THIN_SUNKEN = `inset 1px 1px 0 ${DARK_EDGE}, inset -1px -1px 0 ${LIGHT_EDGE}`;

const segments = (color: string) =>
    `repeating-linear-gradient(90deg, ${color} 0 ${SEGMENT_WIDTH}px, transparent ${SEGMENT_WIDTH}px ${SEGMENT_WIDTH + SEGMENT_GAP}px)`;

const CHROME = {
    borderRadius: 0,
    backgroundColor: themeVars.color.surface.light,
    color: themeVars.color.surface.contrast,
    boxShadow: RAISED,
} as const;

const WELL = {
    border: "2px solid transparent",
    borderRadius: 0,
    backgroundColor: layerVars.main,
    boxShadow: SUNKEN,
} as const;

const WELL_STATES = {
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const PRESS_STATES = {
    [lookSelectors.isHovered]: {
        filter: themeVars.hover.filter,
    },
    [lookSelectors.isActive]: {
        boxShadow: SUNKEN,
    },
    [lookSelectors.isDisabled]: {
        opacity: themeVars.disabled.opacity,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        backgroundColor: themeVars.color.primary.light,
        color: themeVars.color.primary.contrast,
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        opacity: themeVars.disabled.opacity,
    },
} as const;

LookUtils.define(retroOS, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        color: themeVars.color.background.contrast,
    },
    drawer: CHROME,
    surface: CHROME,
    panel: {
        ...WELL,
        border: "none",
        color: layerVars.contrast,
    },
    tooltip: {
        borderRadius: 0,
        backgroundColor: themeVars.color.alert.light,
        color: themeVars.color.alert.contrast,
        border: `1px solid ${themeVars.color.alert.contrast}`,
    },
    accordionHeader: {
        ...CHROME,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [lookSelectors.isExpanded]: {
                boxShadow: SUNKEN,
            },
            [lookSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    opaqueOverlay: {
        backgroundColor: themeVars.color.background.dark,
    },
    blurredOverlay: {
        backdropFilter: "grayscale(100%)",
    },
    button: {
        ...CHROME,
        paddingInline: themeVars.spacing.double,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isPressed]: {
                backgroundColor: `hsl(from ${themeVars.color.surface.light} h s calc(l - 8))`,
                boxShadow: SUNKEN,
            },
            [lookSelectors.hasError]: {
                color: themeVars.color.error.main,
            },
            ...PRESS_STATES,
        },
    },
    buttonSimple: {
        ...CHROME,
        fontSize: themeVars.fontSize.small,
        selectors: {
            ...PRESS_STATES,
            [lookSelectors.isSelected]: {
                boxShadow: SUNKEN,
                color: themeVars.color.primary.main,
            },
        },
    },
    decoration: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: `rgb(from ${layerVars.contrast} r g b / 65%)`,
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: layerVars.contrast,
                boxShadow: THIN_RAISED,
            },
            [lookSelectors.isActive]: {
                boxShadow: THIN_SUNKEN,
            },
            [lookSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    input: {
        ...WELL,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [lookSelectors.isReadOnly]: {
                backgroundColor: themeVars.color.surface.light,
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
            [lookSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
            [lookSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: layerVars.contrast,
                fontSize: themeVars.fontSize.medium,
            },
            [lookSelectors.fieldTextDisabled]: {
                color: `rgb(from ${layerVars.contrast} r g b / 50%)`,
            },
        },
    },
    dropdown: {
        borderRadius: 0,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: `${RAISED}, 2px 2px 0 0 ${DARK_EDGE}`,
    },
    checkboxBox: {
        ...WELL,
        selectors: WELL_STATES,
    },
    checkboxMark: {
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
    },
    radioBox: {
        ...WELL,
        borderRadius: "50%",
        selectors: WELL_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: layerVars.contrast,
    },
    toggleTrack: {
        ...WELL,
        selectors: {
            ...WELL_STATES,
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: themeVars.color.primary.dark,
            },
        },
    },
    toggleHandle: {
        borderRadius: 0,
        backgroundColor: themeVars.color.surface.light,
        boxShadow: THIN_RAISED,
    },
    progressTrack: {
        ...WELL,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: 0,
        backgroundColor: "transparent",
        backgroundImage: segments(themeVars.color.primary.light),
        selectors: {
            [lookSelectors.withinError]: {
                backgroundImage: segments(themeVars.color.error.light),
            },
        },
    },
    rangeTrack: {
        backgroundColor: layerVars.main,
        boxShadow: THIN_SUNKEN,
    },
    rangeFill: {
        backgroundColor: themeVars.color.primary.light,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.light,
            },
        },
    },
    rangeThumb: {
        ...CHROME,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.light,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: layerVars.main,
                boxShadow: THIN_SUNKEN,
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: themeVars.color.surface.light,
                boxShadow: RAISED,
            },
            [lookSelectors.lineActive]: {
                boxShadow: SUNKEN,
            },
        },
    },
    tag: {
        ...CHROME,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [lookSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    hoverFloater: {
        borderRadius: 0,
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 15%)`,
    },
    selectionFloater: {
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.light,
    },
    itemWithFloater: {
        borderRadius: 0,
        fontSize: themeVars.fontSize.medium,
        selectors: ITEM_STATES,
    },
    itemWithoutFloater: {
        borderRadius: 0,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: themeVars.color.primary.light,
                color: themeVars.color.primary.contrast,
            },
            ...ITEM_STATES,
        },
    },
});

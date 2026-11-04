import { style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

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
    `repeating-linear-gradient(${skinVars.barAngle}, ${color} 0 ${SEGMENT_WIDTH}px, transparent ${SEGMENT_WIDTH}px ${SEGMENT_WIDTH + SEGMENT_GAP}px)`;

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
    [skinSelectors.hasErrorWithin]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const PRESS_STATES = {
    [skinSelectors.isHovered]: {
        filter: themeVars.hover.filter,
    },
    [skinSelectors.isActive]: {
        boxShadow: SUNKEN,
    },
    [skinSelectors.isDisabled]: {
        opacity: themeVars.disabled.opacity,
    },
} as const;

const ITEM_STATES = {
    [skinSelectors.isSelected]: {
        backgroundColor: themeVars.color.primary.main,
        color: themeVars.color.primary.contrast,
    },
    [skinSelectors.isDisabled]: {
        backgroundColor: "transparent",
        opacity: themeVars.disabled.opacity,
    },
} as const;

const PANEL = {
    ...WELL,
    border: "none",
    color: layerVars.contrast,
} as const;

const RANGE_TRACK = {
    borderRadius: 0,
    backgroundColor: layerVars.main,
    boxShadow: THIN_SUNKEN,
} as const;

const RANGE_FILL = {
    borderRadius: 0,
    backgroundColor: themeVars.color.primary.main,
    selectors: {
        [skinSelectors.hasError]: {
            backgroundColor: themeVars.color.error.main,
        },
    },
} as const;

const RANGE_THUMB = {
    ...CHROME,
    selectors: {
        [skinSelectors.hasError]: {
            backgroundColor: themeVars.color.error.main,
        },
    },
} as const;

SkinUtils.define(retroOS, {
    pageBackground: {
        backgroundColor: themeVars.color.background.light,
        color: themeVars.color.background.contrast,
    },
    drawer: CHROME,
    surface: CHROME,
    hollowSurface: SkinUtils.hollow(CHROME),
    panel: PANEL,
    tooltip: {
        borderRadius: 0,
        backgroundColor: themeVars.color.alert.light,
        color: themeVars.color.alert.contrast,
        border: `1px solid ${themeVars.color.alert.contrast}`,
    },
    accordionHeader: {
        ...WELL,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [skinSelectors.isExpanded]: {
                boxShadow: SUNKEN,
            },
            [skinSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    accordionPanel: PANEL,
    opaqueOverlay: {
        backgroundColor: themeVars.color.background.dark,
    },
    blurredOverlay: {
        backdropFilter: "grayscale(100%)",
    },
    button: {
        ...CHROME,
        paddingInline: themeVars.spacing.double,
        backgroundColor: themeVars.color.primary.main,
        color: themeVars.color.primary.contrast,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isPressed]: {
                boxShadow: SUNKEN,
            },
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
            ...PRESS_STATES,
        },
    },
    buttonSimple: {
        ...CHROME,
        fontSize: themeVars.fontSize.small,
        selectors: {
            ...PRESS_STATES,
            [skinSelectors.isSelected]: {
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
            [skinSelectors.isHovered]: {
                color: layerVars.contrast,
                boxShadow: THIN_RAISED,
            },
            [skinSelectors.isActive]: {
                boxShadow: THIN_SUNKEN,
            },
            [skinSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    input: {
        ...WELL,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [skinSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [skinSelectors.isReadOnly]: {
                backgroundColor: themeVars.color.surface.light,
            },
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
            [skinSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
            [skinSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: layerVars.contrast,
                fontSize: themeVars.fontSize.medium,
            },
            [skinSelectors.fieldTextDisabled]: {
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
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                backgroundColor: themeVars.color.primary.main,
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
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: 0,
        backgroundColor: "transparent",
        backgroundImage: segments(themeVars.color.primary.main),
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundImage: segments(themeVars.color.error.main),
            },
        },
    },
    rangeTrack: RANGE_TRACK,
    rangeFill: RANGE_FILL,
    rangeThumb: RANGE_THUMB,
    slideButtonTrack: RANGE_TRACK,
    slideButtonFill: RANGE_FILL,
    slideButtonHint: {
        fontWeight: "bold",
    },
    slideButtonThumb: RANGE_THUMB,
    slideButtonArrow: {
        color: themeVars.color.primary.main,
        selectors: {
            [skinSelectors.hasError]: {
                color: themeVars.color.error.main,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: layerVars.main,
                boxShadow: THIN_SUNKEN,
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: themeVars.color.surface.light,
                boxShadow: RAISED,
            },
            [skinSelectors.lineActive]: {
                boxShadow: SUNKEN,
            },
        },
    },
    tabsFloater: {
        borderBlockEnd: `2px solid ${themeVars.color.primary.main}`,
        selectors: {
            [skinSelectors.isVertical]: {
                borderBlockEnd: "none",
                backgroundImage: `linear-gradient(to right, ${themeVars.color.primary.main} 3px, rgb(from ${layerVars.contrast} r g b / 10%) 3px, transparent)`,
            },
        },
    },
    tabsGutter: {
        borderBlockEnd: `2px solid rgb(from ${layerVars.contrast} r g b / 10%)`,
        selectors: {
            [skinSelectors.isVertical]: {
                borderBlockEnd: "none",
            },
        },
    },
    tabsItem: {
        paddingBlock: themeVars.spacing.half,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.xSmall,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isVertical]: {
                paddingBlock: themeVars.spacing.full,
                paddingInline: themeVars.spacing.double,
                fontSize: themeVars.fontSize.small,
                fontWeight: "inherit",
            },
            [SkinUtils.anyOf(skinSelectors.isHovered, skinSelectors.isSelected)]: {
                color: themeVars.color.primary.main,
            },
            [skinSelectors.isDisabled]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    tag: {
        ...CHROME,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [skinSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [skinSelectors.isDisabled]: {
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
        backgroundColor: themeVars.color.primary.main,
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
            [skinSelectors.isHovered]: {
                backgroundColor: themeVars.color.primary.main,
                color: themeVars.color.primary.contrast,
            },
            ...ITEM_STATES,
        },
    },
});

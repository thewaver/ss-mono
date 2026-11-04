import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors, lookVars } from "../Look.css";

export const terminal = style({});

const MONO = "monospace";
const SEGMENT_WIDTH = 6;
const SEGMENT_GAP = 2;

const dim = (alpha: number) => `rgb(from ${layerVars.contrast} r g b / ${alpha}%)`;

const RULE = `1px solid ${dim(25)}`;
const RULE_STRONG = `1px solid ${dim(50)}`;
const ACCENT_RULE = `1px solid ${themeVars.color.primary.main}`;

const segments = (color: string) =>
    `repeating-linear-gradient(${lookVars.barAngle}, ${color} 0 ${SEGMENT_WIDTH}px, transparent ${SEGMENT_WIDTH}px ${SEGMENT_WIDTH + SEGMENT_GAP}px)`;

const BOX = {
    border: RULE,
    borderRadius: 0,
    backgroundColor: layerVars.main,
} as const;

const BOX_STATES = {
    [lookSelectors.hasErrorWithin]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        color: themeVars.color.primary.main,
        fontWeight: "bold",
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        opacity: themeVars.disabled.opacity,
    },
} as const;

const PANEL = {
    borderRadius: 0,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    border: RULE,
    fontFamily: MONO,
} as const;

const SURFACE = {
    borderRadius: 0,
    backgroundColor: themeVars.color.surface.dark,
    color: themeVars.color.surface.contrast,
    border: RULE,
    fontFamily: MONO,
} as const;

const RANGE_TRACK = {
    borderRadius: 0,
    backgroundColor: dim(25),
} as const;

const RANGE_FILL = {
    borderRadius: 0,
    backgroundColor: themeVars.color.primary.main,
    selectors: {
        [lookSelectors.hasError]: {
            backgroundColor: themeVars.color.error.main,
        },
    },
} as const;

const RANGE_THUMB = {
    borderRadius: 0,
    border: ACCENT_RULE,
    backgroundColor: layerVars.main,
    selectors: {
        [lookSelectors.hasError]: {
            borderColor: themeVars.color.error.main,
        },
    },
} as const;

LookUtils.define(terminal, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        color: themeVars.color.background.contrast,
        fontFamily: MONO,
    },
    drawer: {
        backgroundColor: themeVars.color.surface.dark,
        color: themeVars.color.surface.contrast,
        border: RULE,
        fontFamily: MONO,
    },
    surface: SURFACE,
    hollowSurface: LookUtils.hollow(SURFACE),
    panel: PANEL,
    tooltip: {
        borderRadius: 0,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        border: ACCENT_RULE,
        fontFamily: MONO,
    },
    accordionHeader: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: layerVars.contrast,
        border: RULE,
        fontFamily: MONO,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                border: RULE_STRONG,
            },
            [lookSelectors.isExpanded]: {
                border: ACCENT_RULE,
                color: themeVars.color.primary.main,
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dashed",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    accordionPanel: PANEL,
    opaqueOverlay: {
        backgroundColor: themeVars.color.background.dark,
    },
    blurredOverlay: {
        backdropFilter: "brightness(40%) contrast(80%)",
    },
    button: {
        borderRadius: 0,
        paddingInline: themeVars.spacing.double,
        border: ACCENT_RULE,
        backgroundColor: "transparent",
        color: themeVars.color.primary.main,
        fontFamily: MONO,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isPressed]: {
                backgroundColor: themeVars.color.primary.light,
                color: themeVars.color.primary.contrast,
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
                color: themeVars.color.error.main,
            },
            [lookSelectors.isHovered]: {
                backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 15%)`,
            },
            [lookSelectors.isActive]: {
                backgroundColor: themeVars.color.primary.light,
                color: themeVars.color.primary.contrast,
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dashed",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    buttonSimple: {
        borderRadius: 0,
        border: RULE,
        backgroundColor: "transparent",
        color: layerVars.contrast,
        fontFamily: MONO,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: {
                borderColor: layerVars.contrast,
            },
            [lookSelectors.isActive]: {
                backgroundColor: dim(15),
            },
            [lookSelectors.isSelected]: {
                border: ACCENT_RULE,
                color: themeVars.color.primary.main,
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dashed",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    decoration: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: dim(65),
        fontFamily: MONO,
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: themeVars.color.primary.main,
            },
            [lookSelectors.isActive]: {
                color: themeVars.color.primary.light,
            },
            [lookSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    input: {
        ...BOX,
        color: layerVars.contrast,
        fontFamily: MONO,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                border: RULE_STRONG,
            },
            [lookSelectors.isReadOnly]: {
                borderStyle: "dotted",
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dashed",
                opacity: themeVars.disabled.opacity,
            },
            [lookSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: themeVars.color.primary.main,
                fontFamily: MONO,
                fontSize: themeVars.fontSize.medium,
            },
            [lookSelectors.fieldTextDisabled]: {
                color: dim(50),
            },
        },
    },
    dropdown: {
        ...BOX,
        color: layerVars.contrast,
        fontFamily: MONO,
    },
    checkboxBox: {
        ...BOX,
        selectors: BOX_STATES,
    },
    checkboxMark: {
        color: themeVars.color.primary.main,
        fontFamily: MONO,
        fontSize: themeVars.fontSize.medium,
    },
    radioBox: {
        ...BOX,
        borderRadius: "50%",
        selectors: BOX_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.main,
    },
    toggleTrack: {
        ...BOX,
        selectors: BOX_STATES,
    },
    toggleHandle: {
        borderRadius: 0,
        backgroundColor: dim(50),
        selectors: {
            [LookUtils.anyOf(lookSelectors.isCheckedWithin, lookSelectors.isMixedWithin)]: {
                backgroundColor: themeVars.color.primary.main,
            },
        },
    },
    progressTrack: {
        ...BOX,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: 0,
        backgroundColor: "transparent",
        backgroundImage: segments(themeVars.color.primary.main),
        selectors: {
            [lookSelectors.hasErrorWithin]: {
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
        stroke: themeVars.color.primary.main,
        selectors: {
            [lookSelectors.hasError]: {
                stroke: themeVars.color.error.main,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: dim(25),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
            },
            [lookSelectors.lineActive]: {
                backgroundColor: themeVars.color.primary.light,
            },
        },
    },
    tabsFloater: {
        borderBlockEnd: `2px solid ${themeVars.color.primary.main}`,
        selectors: {
            [lookSelectors.isVertical]: {
                borderBlockEnd: "none",
                backgroundImage: `linear-gradient(to right, ${themeVars.color.primary.main} 3px, rgb(from ${layerVars.contrast} r g b / 10%) 3px, transparent)`,
            },
        },
    },
    tabsGutter: {
        borderBlockEnd: `2px solid rgb(from ${layerVars.contrast} r g b / 10%)`,
        selectors: {
            [lookSelectors.isVertical]: {
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
            [lookSelectors.isVertical]: {
                paddingBlock: themeVars.spacing.full,
                paddingInline: themeVars.spacing.double,
                fontSize: themeVars.fontSize.small,
                fontWeight: "inherit",
            },
            [LookUtils.anyOf(lookSelectors.isHovered, lookSelectors.isSelected)]: {
                color: themeVars.color.primary.main,
            },
            [lookSelectors.isDisabled]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    tag: {
        borderRadius: 0,
        paddingInline: themeVars.spacing.full,
        border: ACCENT_RULE,
        backgroundColor: "transparent",
        color: themeVars.color.primary.main,
        fontFamily: MONO,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 15%)`,
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dashed",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    hoverFloater: {
        borderRadius: 0,
        backgroundColor: dim(15),
    },
    selectionFloater: {
        borderRadius: 0,
        backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 15%)`,
    },
    itemWithFloater: {
        borderRadius: 0,
        fontFamily: MONO,
        fontSize: themeVars.fontSize.medium,
        selectors: ITEM_STATES,
    },
    itemWithoutFloater: {
        borderRadius: 0,
        fontFamily: MONO,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: dim(15),
            },
            ...ITEM_STATES,
        },
    },
});

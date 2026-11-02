import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const blueprint = style({});

const GRID_MINOR = 20;
const GRID_MAJOR = 100;

const ink = (alpha: number) => `rgb(from ${layerVars.contrast} r g b / ${alpha}%)`;

const LINE = `1px solid ${ink(60)}`;
const LINE_STRONG = `1px solid ${layerVars.contrast}`;
const LINE_DASHED = `1px dashed ${ink(45)}`;

const hatch = (color: string) => `repeating-linear-gradient(45deg, ${color} 0 2px, transparent 2px 6px)`;

const LABEL = {
    textTransform: "uppercase",
    letterSpacing: "0.1em",
} as const;

const OUTLINE = {
    border: LINE,
    borderRadius: 0,
    backgroundColor: "transparent",
    color: layerVars.contrast,
} as const;

const OUTLINE_STATES = {
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const PRESS_STATES = {
    [lookSelectors.isHovered]: {
        backgroundColor: ink(10),
        borderColor: layerVars.contrast,
    },
    [lookSelectors.isActive]: {
        backgroundColor: layerVars.contrast,
        color: layerVars.main,
    },
    [lookSelectors.isDisabled]: {
        borderStyle: "dashed",
        opacity: themeVars.disabled.opacity,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        backgroundColor: layerVars.contrast,
        color: layerVars.main,
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        opacity: themeVars.disabled.opacity,
    },
} as const;

LookUtils.define(blueprint, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: [
            `linear-gradient(${ink(12)} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${ink(12)} 1px, transparent 1px)`,
            `linear-gradient(${ink(5)} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${ink(5)} 1px, transparent 1px)`,
        ].join(", "),
        backgroundSize: `${GRID_MAJOR}px ${GRID_MAJOR}px, ${GRID_MAJOR}px ${GRID_MAJOR}px, ${GRID_MINOR}px ${GRID_MINOR}px, ${GRID_MINOR}px ${GRID_MINOR}px`,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        backgroundColor: `rgb(from ${themeVars.color.surface.dark} r g b / 70%)`,
        color: themeVars.color.surface.contrast,
        border: LINE,
    },
    surface: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: themeVars.color.surface.contrast,
        border: LINE,
    },
    panel: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: layerVars.contrast,
        border: LINE_DASHED,
    },
    tooltip: {
        ...OUTLINE,
        backgroundColor: layerVars.main,
        border: LINE_STRONG,
    },
    accordionHeader: {
        ...OUTLINE,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: ink(10),
                borderColor: layerVars.contrast,
            },
            [lookSelectors.isExpanded]: {
                backgroundColor: layerVars.contrast,
                color: layerVars.main,
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dashed",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    opaqueOverlay: {
        backgroundColor: themeVars.color.background.dark,
    },
    blurredOverlay: {
        backdropFilter: "grayscale(100%) brightness(50%)",
    },
    button: {
        ...OUTLINE,
        ...LABEL,
        paddingInline: themeVars.spacing.double,
        border: LINE_STRONG,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isPressed]: {
                backgroundColor: layerVars.contrast,
                color: layerVars.main,
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
                color: themeVars.color.error.main,
            },
            ...PRESS_STATES,
        },
    },
    buttonSimple: {
        ...OUTLINE,
        fontSize: themeVars.fontSize.small,
        selectors: {
            ...PRESS_STATES,
            [lookSelectors.isSelected]: {
                backgroundColor: layerVars.contrast,
                color: layerVars.main,
            },
        },
    },
    decoration: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: ink(65),
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: layerVars.contrast,
                boxShadow: `inset 0 -1px 0 0 ${layerVars.contrast}`,
            },
            [lookSelectors.isActive]: {
                opacity: 0.75,
            },
            [lookSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    input: {
        ...OUTLINE,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                borderColor: layerVars.contrast,
            },
            [lookSelectors.isReadOnly]: {
                borderStyle: "dashed",
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
                fontSize: themeVars.fontSize.medium,
            },
            [lookSelectors.fieldTextDisabled]: {
                color: ink(50),
            },
        },
    },
    dropdown: {
        ...OUTLINE,
        backgroundColor: layerVars.main,
    },
    checkboxBox: {
        ...OUTLINE,
        selectors: OUTLINE_STATES,
    },
    checkboxMark: {
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
    },
    radioBox: {
        ...OUTLINE,
        borderRadius: "50%",
        selectors: OUTLINE_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: layerVars.contrast,
    },
    toggleTrack: {
        ...OUTLINE,
        selectors: {
            ...OUTLINE_STATES,
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundImage: hatch(ink(35)),
            },
        },
    },
    toggleHandle: {
        borderRadius: 0,
        backgroundColor: "transparent",
        boxShadow: `inset 0 0 0 1px ${layerVars.contrast}`,
        selectors: {
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: layerVars.contrast,
            },
        },
    },
    progressTrack: {
        ...OUTLINE,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: 0,
        backgroundColor: "transparent",
        backgroundImage: hatch(layerVars.contrast),
        selectors: {
            [lookSelectors.withinError]: {
                backgroundImage: hatch(themeVars.color.error.main),
            },
        },
    },
    rangeTrack: {
        backgroundColor: "transparent",
        boxShadow: `inset 0 0 0 1px ${ink(60)}`,
    },
    rangeFill: {
        backgroundImage: hatch(layerVars.contrast),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundImage: hatch(themeVars.color.error.main),
            },
        },
    },
    rangeThumb: {
        borderRadius: "50%",
        border: LINE_STRONG,
        backgroundColor: layerVars.main,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: "transparent",
                boxShadow: `inset 0 0 0 1px ${ink(60)}`,
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundImage: hatch(layerVars.contrast),
                boxShadow: `inset 0 0 0 1px ${layerVars.contrast}`,
            },
            [lookSelectors.lineActive]: {
                backgroundColor: layerVars.contrast,
            },
        },
    },
    tag: {
        ...OUTLINE,
        ...LABEL,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: ink(10),
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dashed",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    hoverFloater: {
        borderRadius: 0,
        backgroundColor: "transparent",
        boxShadow: `inset 0 0 0 1px ${ink(60)}`,
    },
    selectionFloater: {
        borderRadius: 0,
        backgroundImage: hatch(ink(35)),
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
                boxShadow: `inset 0 0 0 1px ${ink(60)}`,
            },
            ...ITEM_STATES,
        },
    },
});

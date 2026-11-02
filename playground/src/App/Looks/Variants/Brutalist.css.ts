import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const brutalist = style({});

const INK = layerVars.contrast;
const SHADOW_COLOR = "black";
const STROKE = `3px solid ${INK}`;
const HARD_SHADOW = `6px 6px 0 0 ${SHADOW_COLOR}`;
const HARD_SHADOW_SMALL = `3px 3px 0 0 ${SHADOW_COLOR}`;
const HARD_SHADOW_PRESSED = `1px 1px 0 0 ${SHADOW_COLOR}`;
const STRIPE_WIDTH = 6;

const stripes = (color: string) =>
    `repeating-linear-gradient(135deg, ${color} 0 ${STRIPE_WIDTH}px, transparent ${STRIPE_WIDTH}px ${STRIPE_WIDTH * 2}px)`;

const SHOUT = {
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
} as const;

const PRESS_STATES = {
    [lookSelectors.isHovered]: {
        boxShadow: HARD_SHADOW_SMALL,
    },
    [lookSelectors.isActive]: {
        boxShadow: HARD_SHADOW_PRESSED,
    },
    [lookSelectors.isDisabled]: {
        boxShadow: "none",
        opacity: themeVars.disabled.opacity,
    },
} as const;

const BOX = {
    border: STROKE,
    borderRadius: 0,
    backgroundColor: layerVars.main,
    boxShadow: HARD_SHADOW_SMALL,
} as const;

const BOX_STATES = {
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        backgroundColor: themeVars.color.primary.light,
        color: themeVars.color.primary.contrast,
        fontWeight: "bold",
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        opacity: themeVars.disabled.opacity,
    },
} as const;

LookUtils.define(brutalist, {
    pageBackground: {
        backgroundColor: themeVars.color.background.light,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        backgroundColor: themeVars.color.surface.light,
        color: themeVars.color.surface.contrast,
        boxShadow: HARD_SHADOW,
    },
    surface: {
        borderRadius: 0,
        backgroundColor: themeVars.color.surface.light,
        color: themeVars.color.surface.contrast,
        boxShadow: HARD_SHADOW,
    },
    panel: {
        borderRadius: 0,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: HARD_SHADOW_SMALL,
    },
    tooltip: {
        borderRadius: 0,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: HARD_SHADOW_SMALL,
    },
    accordionHeader: {
        borderRadius: 0,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: HARD_SHADOW_SMALL,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isHovered]: {
                boxShadow: HARD_SHADOW_PRESSED,
            },
            [lookSelectors.isExpanded]: {
                backgroundColor: themeVars.color.primary.light,
                color: themeVars.color.primary.contrast,
            },
            [lookSelectors.isDisabled]: {
                boxShadow: "none",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    opaqueOverlay: {
        backgroundColor: themeVars.color.background.dark,
    },
    blurredOverlay: {
        backdropFilter: "grayscale(100%) contrast(125%)",
    },
    button: {
        ...SHOUT,
        borderRadius: 0,
        paddingInline: themeVars.spacing.double,
        backgroundColor: themeVars.color.primary.light,
        color: themeVars.color.primary.contrast,
        boxShadow: HARD_SHADOW_SMALL,
        selectors: {
            [lookSelectors.isPressed]: {
                backgroundColor: INK,
                color: layerVars.main,
                boxShadow: "none",
            },
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.light,
                color: themeVars.color.error.contrast,
            },
            ...PRESS_STATES,
        },
    },
    buttonSimple: {
        ...SHOUT,
        borderRadius: 0,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: HARD_SHADOW_PRESSED,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: `rgb(from ${INK} r g b / 25%)`,
            },
            [lookSelectors.isActive]: {
                boxShadow: "none",
            },
            [lookSelectors.isSelected]: {
                backgroundColor: themeVars.color.primary.light,
                color: themeVars.color.primary.contrast,
            },
            [lookSelectors.isDisabled]: {
                boxShadow: "none",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    decoration: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: INK,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                backgroundColor: INK,
                color: layerVars.main,
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
        ...BOX,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                boxShadow: HARD_SHADOW_PRESSED,
            },
            [lookSelectors.isReadOnly]: {
                backgroundImage: stripes(`rgb(from ${INK} r g b / 10%)`),
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dashed",
                boxShadow: "none",
                opacity: themeVars.disabled.opacity,
            },
            [lookSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: themeVars.color.primary.main,
                fontSize: themeVars.fontSize.medium,
                fontWeight: "bold",
            },
            [lookSelectors.fieldTextDisabled]: {
                color: `rgb(from ${INK} r g b / 50%)`,
            },
        },
    },
    dropdown: {
        borderRadius: 0,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: HARD_SHADOW,
    },
    checkboxBox: {
        ...BOX,
        selectors: BOX_STATES,
    },
    checkboxMark: {
        color: INK,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
    },
    radioBox: {
        ...BOX,
        borderRadius: "50%",
        selectors: BOX_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: INK,
    },
    toggleTrack: {
        ...BOX,
        selectors: {
            ...BOX_STATES,
            [LookUtils.anyOf(lookSelectors.isChecked, lookSelectors.isMixed)]: {
                backgroundColor: themeVars.color.primary.light,
            },
        },
    },
    toggleHandle: {
        borderRadius: 0,
        backgroundColor: INK,
    },
    progressTrack: {
        borderRadius: 0,
        backgroundColor: layerVars.main,
        boxShadow: `inset 0 0 0 2px rgb(from ${INK} r g b / 25%)`,
        selectors: {
            [lookSelectors.hasError]: {
                boxShadow: `inset 0 0 0 2px ${themeVars.color.error.main}`,
            },
        },
    },
    progressFill: {
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.light,
        backgroundImage: stripes(themeVars.color.primary.dark),
        selectors: {
            [lookSelectors.withinError]: {
                backgroundColor: themeVars.color.error.light,
                backgroundImage: stripes(themeVars.color.error.dark),
            },
        },
    },
    rangeTrack: {
        backgroundColor: `rgb(from ${INK} r g b / 25%)`,
    },
    rangeFill: {
        backgroundColor: INK,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    rangeThumb: {
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.light,
        boxShadow: HARD_SHADOW_PRESSED,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.light,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: `rgb(from ${INK} r g b / 25%)`,
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: INK,
            },
            [lookSelectors.lineActive]: {
                backgroundColor: themeVars.color.primary.main,
            },
        },
    },
    tag: {
        ...SHOUT,
        borderRadius: 0,
        paddingInline: themeVars.spacing.full,
        backgroundColor: themeVars.color.primary.light,
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: {
                boxShadow: HARD_SHADOW_PRESSED,
            },
            [lookSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    hoverFloater: {
        borderRadius: 0,
        backgroundColor: `rgb(from ${INK} r g b / 25%)`,
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
                backgroundColor: INK,
                color: layerVars.main,
            },
            ...ITEM_STATES,
        },
    },
});

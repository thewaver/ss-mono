import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const pixel = style({});

const PIXEL = 4;
const PIXEL_PX = `${PIXEL}px`;
const FAR = `calc(100% - ${PIXEL_PX})`;

const NOTCHED = `polygon(0 ${PIXEL_PX}, ${PIXEL_PX} ${PIXEL_PX}, ${PIXEL_PX} 0, ${FAR} 0, ${FAR} ${PIXEL_PX}, 100% ${PIXEL_PX}, 100% ${FAR}, ${FAR} ${FAR}, ${FAR} 100%, ${PIXEL_PX} 100%, ${PIXEL_PX} ${FAR}, 0 ${FAR})`;

const INK = layerVars.contrast;
const MONO = "monospace";

const dither = (color: string) => ({
    backgroundImage: [
        `linear-gradient(45deg, ${color} 25%, transparent 25%)`,
        `linear-gradient(-45deg, ${color} 25%, transparent 25%)`,
        `linear-gradient(45deg, transparent 75%, ${color} 75%)`,
        `linear-gradient(-45deg, transparent 75%, ${color} 75%)`,
    ].join(", "),
    backgroundSize: `${PIXEL * 2}px ${PIXEL * 2}px`,
    backgroundPosition: `0 0, 0 ${PIXEL_PX}, ${PIXEL_PX} -${PIXEL_PX}, -${PIXEL_PX} 0`,
});

const BLOCK = {
    clipPath: NOTCHED,
    border: `${PIXEL_PX} solid ${INK}`,
    borderRadius: 0,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    fontFamily: MONO,
} as const;

const BLOCK_STATES = {
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const PRESS_STATES = {
    [lookSelectors.isHovered]: dither(`rgb(from ${INK} r g b / 25%)`),
    [lookSelectors.isActive]: {
        backgroundColor: INK,
        color: layerVars.main,
    },
    [lookSelectors.isDisabled]: {
        borderStyle: "dotted",
        opacity: themeVars.disabled.opacity,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        backgroundColor: INK,
        color: layerVars.main,
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        opacity: themeVars.disabled.opacity,
    },
} as const;

LookUtils.define(pixel, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        color: themeVars.color.background.contrast,
        fontFamily: MONO,
    },
    drawer: {
        backgroundColor: themeVars.color.surface.dark,
        color: themeVars.color.surface.contrast,
        border: `${PIXEL_PX} solid ${themeVars.color.surface.contrast}`,
        fontFamily: MONO,
    },
    surface: {
        clipPath: NOTCHED,
        borderRadius: 0,
        backgroundColor: themeVars.color.surface.dark,
        color: themeVars.color.surface.contrast,
        border: `${PIXEL_PX} solid ${themeVars.color.surface.contrast}`,
        fontFamily: MONO,
    },
    panel: {
        ...BLOCK,
        border: `${PIXEL_PX} solid rgb(from ${INK} r g b / 35%)`,
    },
    tooltip: BLOCK,
    accordionHeader: {
        ...BLOCK,
        clipPath: "none",
        border: `2px solid rgb(from ${INK} r g b / 35%)`,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: dither(`rgb(from ${INK} r g b / 25%)`),
            [lookSelectors.isExpanded]: {
                borderColor: INK,
                backgroundColor: INK,
                color: layerVars.main,
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dotted",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    opaqueOverlay: {
        backgroundColor: themeVars.color.background.dark,
    },
    blurredOverlay: {
        ...dither("rgb(0 0 0 / 60%)"),
        backdropFilter: "none",
    },
    button: {
        ...BLOCK,
        paddingInline: themeVars.spacing.double,
        backgroundColor: themeVars.color.primary.light,
        color: themeVars.color.primary.contrast,
        fontWeight: "bold",
        textTransform: "uppercase",
        selectors: {
            [lookSelectors.isPressed]: {
                ...dither(themeVars.color.primary.dark),
                backgroundColor: themeVars.color.primary.light,
            },
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.light,
                color: themeVars.color.error.contrast,
            },
            ...PRESS_STATES,
        },
    },
    buttonSimple: {
        ...BLOCK,
        fontSize: themeVars.fontSize.small,
        selectors: {
            ...PRESS_STATES,
            [lookSelectors.isSelected]: {
                backgroundColor: themeVars.color.primary.light,
                color: themeVars.color.primary.contrast,
            },
        },
    },
    decoration: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: `rgb(from ${INK} r g b / 65%)`,
        fontFamily: MONO,
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
        ...BLOCK,
        clipPath: "none",
        border: `2px solid ${INK}`,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                boxShadow: `inset 0 0 0 2px rgb(from ${INK} r g b / 25%)`,
            },
            [lookSelectors.isReadOnly]: dither(`rgb(from ${INK} r g b / 10%)`),
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dotted",
                opacity: themeVars.disabled.opacity,
            },
            [lookSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: themeVars.color.primary.main,
                fontFamily: MONO,
                fontSize: themeVars.fontSize.medium,
            },
            [lookSelectors.fieldTextDisabled]: {
                color: `rgb(from ${INK} r g b / 50%)`,
            },
        },
    },
    dropdown: BLOCK,
    checkboxBox: {
        ...BLOCK,
        clipPath: "none",
        border: `2px solid ${INK}`,
        selectors: BLOCK_STATES,
    },
    checkboxMark: {
        color: INK,
        fontFamily: MONO,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
    },
    radioBox: {
        ...BLOCK,
        clipPath: "none",
        border: `2px solid ${INK}`,
        selectors: BLOCK_STATES,
    },
    radioDot: {
        borderRadius: 0,
        backgroundColor: INK,
    },
    toggleTrack: {
        ...BLOCK,
        clipPath: "none",
        border: `2px solid ${INK}`,
        selectors: {
            ...BLOCK_STATES,
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: dither(
                `rgb(from ${themeVars.color.primary.main} r g b / 50%)`,
            ),
        },
    },
    toggleHandle: {
        borderRadius: 0,
        backgroundColor: INK,
    },
    progressTrack: {
        ...BLOCK,
        clipPath: "none",
        border: `2px solid ${INK}`,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        ...dither(themeVars.color.primary.light),
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.dark,
        selectors: {
            [lookSelectors.withinError]: {
                ...dither(themeVars.color.error.light),
                backgroundColor: themeVars.color.error.dark,
            },
        },
    },
    rangeTrack: {
        ...dither(`rgb(from ${INK} r g b / 35%)`),
        backgroundColor: "transparent",
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
        borderRadius: 0,
        border: `2px solid ${INK}`,
        backgroundColor: themeVars.color.primary.light,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.light,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [lookSelectors.line]: dither(`rgb(from ${INK} r g b / 35%)`),
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: INK,
            },
            [lookSelectors.lineActive]: {
                backgroundColor: themeVars.color.primary.light,
            },
        },
    },
    tag: {
        ...BLOCK,
        clipPath: "none",
        paddingInline: themeVars.spacing.full,
        border: `2px solid ${INK}`,
        backgroundColor: themeVars.color.primary.light,
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.xSmall,
        textTransform: "uppercase",
        selectors: {
            [lookSelectors.isHovered]: dither(`rgb(from ${INK} r g b / 25%)`),
            [lookSelectors.isDisabled]: {
                borderStyle: "dotted",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    hoverFloater: {
        borderRadius: 0,
        ...dither(`rgb(from ${INK} r g b / 35%)`),
    },
    selectionFloater: {
        borderRadius: 0,
        backgroundColor: INK,
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
            [lookSelectors.isHovered]: dither(`rgb(from ${INK} r g b / 35%)`),
            ...ITEM_STATES,
        },
    },
});

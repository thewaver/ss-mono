import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const hud = style({});

const CUT = 8;
const CUT_SMALL = 4;

const cutCorners = (size: number) =>
    `polygon(${size}px 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%, 0 ${size}px)`;

const tint = (color: string, alpha: number) => `rgb(from ${color} r g b / ${alpha}%)`;

const PRIMARY = themeVars.color.primary.main;
const FRAME = `1px solid ${tint(PRIMARY, 50)}`;
const FRAME_LIT = `1px solid ${PRIMARY}`;
const FRAME_DIM = `1px solid ${tint(layerVars.contrast, 25)}`;
const INNER_GLOW = `inset 0 0 12px ${tint(PRIMARY, 25)}`;
const INNER_GLOW_STRONG = `inset 0 0 16px ${tint(PRIMARY, 45)}`;

const READOUT = {
    fontSize: themeVars.fontSize.xSmall,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
} as const;

const PANE = {
    clipPath: cutCorners(CUT),
    borderRadius: 0,
    backgroundColor: tint(layerVars.main, 70),
    color: layerVars.contrast,
    border: FRAME,
} as const;

const CELL = {
    clipPath: cutCorners(CUT_SMALL),
    borderRadius: 0,
    backgroundColor: tint(layerVars.main, 70),
    color: layerVars.contrast,
    border: FRAME_DIM,
} as const;

const CELL_STATES = {
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
    },
    [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
        borderColor: PRIMARY,
        boxShadow: INNER_GLOW,
    },
} as const;

const PRESS_STATES = {
    [lookSelectors.isHovered]: {
        borderColor: PRIMARY,
        boxShadow: INNER_GLOW,
    },
    [lookSelectors.isActive]: {
        backgroundColor: tint(PRIMARY, 30),
        boxShadow: INNER_GLOW_STRONG,
    },
    [lookSelectors.isDisabled]: {
        borderStyle: "dashed",
        boxShadow: "none",
        opacity: themeVars.disabled.opacity,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        color: PRIMARY,
        boxShadow: `inset 2px 0 0 0 ${PRIMARY}`,
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        opacity: themeVars.disabled.opacity,
    },
} as const;

LookUtils.define(hud, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: `radial-gradient(ellipse at center, ${tint(PRIMARY, 8)}, transparent 70%)`,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        backgroundColor: tint(themeVars.color.surface.dark, 85),
        color: themeVars.color.surface.contrast,
        border: FRAME,
    },
    surface: {
        ...PANE,
        backgroundColor: tint(themeVars.color.surface.dark, 70),
        color: themeVars.color.surface.contrast,
    },
    panel: {
        ...PANE,
        clipPath: cutCorners(CUT_SMALL),
        border: FRAME_DIM,
    },
    tooltip: {
        ...PANE,
        backgroundColor: tint(layerVars.main, 95),
        border: FRAME_LIT,
    },
    accordionHeader: {
        ...CELL,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                borderColor: PRIMARY,
                boxShadow: INNER_GLOW,
            },
            [lookSelectors.isExpanded]: {
                borderColor: PRIMARY,
                color: PRIMARY,
                boxShadow: `inset 2px 0 0 0 ${PRIMARY}`,
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dashed",
                boxShadow: "none",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    opaqueOverlay: {
        backgroundColor: themeVars.color.background.dark,
    },
    blurredOverlay: {
        backdropFilter: "blur(6px) brightness(60%)",
    },
    button: {
        ...PANE,
        ...READOUT,
        paddingInline: themeVars.spacing.double,
        border: FRAME_LIT,
        color: PRIMARY,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isPressed]: {
                backgroundColor: tint(PRIMARY, 35),
                boxShadow: `${INNER_GLOW_STRONG}, inset 3px 0 0 0 ${PRIMARY}`,
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
                color: themeVars.color.error.main,
            },
            ...PRESS_STATES,
        },
    },
    buttonSimple: {
        ...CELL,
        ...READOUT,
        selectors: {
            ...PRESS_STATES,
            [lookSelectors.isSelected]: {
                borderColor: PRIMARY,
                color: PRIMARY,
                boxShadow: INNER_GLOW,
            },
        },
    },
    decoration: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: tint(layerVars.contrast, 65),
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: PRIMARY,
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
        ...CELL,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                borderColor: tint(PRIMARY, 50),
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
                caretColor: PRIMARY,
                fontSize: themeVars.fontSize.medium,
            },
            [lookSelectors.fieldTextDisabled]: {
                color: tint(layerVars.contrast, 50),
            },
        },
    },
    dropdown: {
        ...PANE,
        backgroundColor: tint(layerVars.main, 92),
    },
    checkboxBox: {
        ...CELL,
        selectors: CELL_STATES,
    },
    checkboxMark: {
        color: PRIMARY,
        fontSize: themeVars.fontSize.medium,
    },
    radioBox: {
        ...CELL,
        clipPath: "none",
        borderRadius: "50%",
        selectors: CELL_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: PRIMARY,
    },
    toggleTrack: {
        ...CELL,
        selectors: CELL_STATES,
    },
    toggleHandle: {
        clipPath: cutCorners(CUT_SMALL),
        borderRadius: 0,
        backgroundColor: tint(layerVars.contrast, 50),
        selectors: {
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: PRIMARY,
            },
        },
    },
    progressTrack: {
        ...CELL,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: 0,
        backgroundColor: tint(PRIMARY, 35),
        boxShadow: `inset 0 0 0 1px ${PRIMARY}`,
        selectors: {
            [lookSelectors.withinError]: {
                backgroundColor: tint(themeVars.color.error.main, 35),
                boxShadow: `inset 0 0 0 1px ${themeVars.color.error.main}`,
            },
        },
    },
    rangeTrack: {
        backgroundColor: tint(layerVars.contrast, 25),
    },
    rangeFill: {
        backgroundColor: PRIMARY,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    rangeThumb: {
        clipPath: cutCorners(CUT_SMALL),
        borderRadius: 0,
        border: FRAME_LIT,
        backgroundColor: layerVars.main,
        boxShadow: INNER_GLOW,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: tint(layerVars.contrast, 25),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: PRIMARY,
            },
            [lookSelectors.lineActive]: {
                backgroundColor: themeVars.color.primary.light,
            },
        },
    },
    tag: {
        ...CELL,
        ...READOUT,
        paddingInline: themeVars.spacing.full,
        border: FRAME,
        color: PRIMARY,
        selectors: {
            [lookSelectors.isHovered]: {
                borderColor: PRIMARY,
                boxShadow: INNER_GLOW,
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dashed",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    hoverFloater: {
        borderRadius: 0,
        backgroundColor: tint(layerVars.contrast, 10),
        boxShadow: `inset 0 0 0 1px ${tint(layerVars.contrast, 25)}`,
    },
    selectionFloater: {
        borderRadius: 0,
        backgroundColor: tint(PRIMARY, 15),
        boxShadow: `inset 2px 0 0 0 ${PRIMARY}`,
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
                backgroundColor: tint(layerVars.contrast, 10),
            },
            ...ITEM_STATES,
        },
    },
});

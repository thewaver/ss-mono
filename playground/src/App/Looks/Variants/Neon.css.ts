import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const neon = style({});

const GRID_SIZE = 40;
const GLOW_NEAR = 6;
const GLOW_FAR = 14;

const tint = (color: string, alpha: number) => `rgb(from ${color} r g b / ${alpha}%)`;

const glow = (color: string) => `0 0 ${GLOW_NEAR}px ${tint(color, 60)}, 0 0 ${GLOW_FAR}px ${tint(color, 30)}`;
const textGlow = (color: string) => `0 0 ${GLOW_NEAR}px ${tint(color, 75)}`;
const haze = (color: string) => `0 0 ${GLOW_FAR * 2}px ${tint(color, 20)}`;

const PRIMARY = themeVars.color.primary.main;
const ERROR = themeVars.color.error.main;

const RULE = `1px solid ${tint(layerVars.contrast, 25)}`;
const PRIMARY_RULE = `1px solid ${PRIMARY}`;
const FAINT_PRIMARY_RULE = `1px solid ${tint(PRIMARY, 50)}`;

const LIT = {
    borderColor: PRIMARY,
    color: PRIMARY,
    boxShadow: glow(PRIMARY),
    textShadow: textGlow(PRIMARY),
} as const;

const LIT_ERROR = {
    borderColor: ERROR,
    color: ERROR,
    boxShadow: glow(ERROR),
    textShadow: textGlow(ERROR),
} as const;

const UNLIT = {
    boxShadow: "none",
    textShadow: "none",
    opacity: themeVars.disabled.opacity,
} as const;

const PANE = (alpha: number) => ({
    backgroundColor: tint(layerVars.main, alpha),
    border: FAINT_PRIMARY_RULE,
    boxShadow: haze(PRIMARY),
    color: layerVars.contrast,
});

const BOX = {
    border: RULE,
    backgroundColor: layerVars.main,
} as const;

const BOX_STATES = {
    [lookSelectors.withinError]: {
        borderColor: ERROR,
        boxShadow: glow(ERROR),
    },
    [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
        borderColor: PRIMARY,
        boxShadow: glow(PRIMARY),
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        color: PRIMARY,
        textShadow: textGlow(PRIMARY),
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        opacity: themeVars.disabled.opacity,
    },
} as const;

LookUtils.define(neon, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: [
            `linear-gradient(${tint(themeVars.color.background.contrast, 4)} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${tint(themeVars.color.background.contrast, 4)} 1px, transparent 1px)`,
        ].join(", "),
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        backgroundColor: tint(themeVars.color.surface.dark, 90),
        color: themeVars.color.surface.contrast,
        border: FAINT_PRIMARY_RULE,
        boxShadow: haze(PRIMARY),
    },
    surface: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(themeVars.color.surface.dark, 85),
        color: themeVars.color.surface.contrast,
        border: FAINT_PRIMARY_RULE,
        boxShadow: haze(PRIMARY),
    },
    panel: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(layerVars.main, 60),
        color: layerVars.contrast,
        border: RULE,
    },
    tooltip: {
        ...PANE(95),
        borderRadius: themeVars.borderRadius.half,
        border: PRIMARY_RULE,
        boxShadow: glow(PRIMARY),
    },
    accordionHeader: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(layerVars.main, 60),
        color: layerVars.contrast,
        border: RULE,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                borderColor: PRIMARY,
                boxShadow: glow(PRIMARY),
            },
            [lookSelectors.isExpanded]: {
                color: PRIMARY,
                textShadow: textGlow(PRIMARY),
            },
            [lookSelectors.isDisabled]: UNLIT,
        },
    },
    opaqueOverlay: {
        backgroundColor: themeVars.color.background.dark,
    },
    blurredOverlay: {
        backdropFilter: "blur(12px) saturate(150%)",
    },
    button: {
        ...LIT,
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.double,
        border: PRIMARY_RULE,
        backgroundColor: "transparent",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        selectors: {
            [lookSelectors.isPressed]: {
                backgroundColor: themeVars.color.primary.light,
                color: themeVars.color.primary.contrast,
                textShadow: "none",
                boxShadow: `${glow(PRIMARY)}, inset 0 0 12px ${tint(themeVars.color.primary.dark, 60)}`,
            },
            [lookSelectors.hasError]: LIT_ERROR,
            [lookSelectors.isHovered]: {
                backgroundColor: tint(PRIMARY, 15),
            },
            [lookSelectors.isActive]: {
                backgroundColor: themeVars.color.primary.light,
                color: themeVars.color.primary.contrast,
                textShadow: "none",
            },
            [lookSelectors.isDisabled]: UNLIT,
        },
    },
    buttonSimple: {
        borderRadius: themeVars.borderRadius.half,
        border: RULE,
        backgroundColor: "transparent",
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: LIT,
            [lookSelectors.isActive]: {
                backgroundColor: tint(PRIMARY, 15),
            },
            [lookSelectors.isSelected]: LIT,
            [lookSelectors.isDisabled]: UNLIT,
        },
    },
    decoration: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        color: tint(layerVars.contrast, 65),
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: PRIMARY,
                textShadow: textGlow(PRIMARY),
            },
            [lookSelectors.isActive]: {
                color: themeVars.color.primary.light,
            },
            [lookSelectors.isDisabled]: UNLIT,
        },
    },
    input: {
        ...BOX,
        borderRadius: themeVars.borderRadius.half,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                borderColor: tint(PRIMARY, 50),
            },
            [lookSelectors.isReadOnly]: {
                borderStyle: "dashed",
            },
            [lookSelectors.hasError]: {
                borderColor: ERROR,
                boxShadow: glow(ERROR),
            },
            [lookSelectors.isDisabled]: UNLIT,
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
        ...PANE(90),
        borderRadius: themeVars.borderRadius.half,
    },
    checkboxBox: {
        ...BOX,
        borderRadius: themeVars.borderRadius.half,
        selectors: BOX_STATES,
    },
    checkboxMark: {
        color: PRIMARY,
        fontSize: themeVars.fontSize.medium,
        textShadow: textGlow(PRIMARY),
    },
    radioBox: {
        ...BOX,
        borderRadius: "50%",
        selectors: BOX_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: PRIMARY,
        boxShadow: glow(PRIMARY),
    },
    toggleTrack: {
        ...BOX,
        borderRadius: themeVars.borderRadius.half,
        selectors: BOX_STATES,
    },
    toggleHandle: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(layerVars.contrast, 50),
        selectors: {
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: PRIMARY,
                boxShadow: glow(PRIMARY),
            },
        },
    },
    progressTrack: {
        ...BOX,
        borderRadius: themeVars.borderRadius.half,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: ERROR,
            },
        },
    },
    progressFill: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: themeVars.color.primary.light,
        boxShadow: glow(PRIMARY),
        selectors: {
            [lookSelectors.withinError]: {
                backgroundColor: themeVars.color.error.light,
                boxShadow: glow(ERROR),
            },
        },
    },
    rangeTrack: {
        backgroundColor: tint(layerVars.contrast, 25),
    },
    rangeFill: {
        backgroundColor: PRIMARY,
        boxShadow: glow(PRIMARY),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: ERROR,
                boxShadow: glow(ERROR),
            },
        },
    },
    rangeThumb: {
        borderRadius: "50%",
        border: PRIMARY_RULE,
        backgroundColor: layerVars.main,
        boxShadow: glow(PRIMARY),
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: ERROR,
                boxShadow: glow(ERROR),
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
                boxShadow: glow(PRIMARY),
            },
            [lookSelectors.lineActive]: {
                backgroundColor: themeVars.color.primary.light,
            },
        },
    },
    tag: {
        ...LIT,
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.full,
        border: PRIMARY_RULE,
        backgroundColor: "transparent",
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: tint(PRIMARY, 15),
            },
            [lookSelectors.isDisabled]: UNLIT,
        },
    },
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(layerVars.contrast, 10),
        boxShadow: `inset 0 0 0 1px ${tint(layerVars.contrast, 25)}`,
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(PRIMARY, 15),
        boxShadow: `inset 0 0 0 1px ${tint(PRIMARY, 50)}, ${glow(PRIMARY)}`,
    },
    itemWithFloater: {
        borderRadius: themeVars.borderRadius.half,
        fontSize: themeVars.fontSize.medium,
        selectors: ITEM_STATES,
    },
    itemWithoutFloater: {
        borderRadius: themeVars.borderRadius.half,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: tint(layerVars.contrast, 10),
            },
            ...ITEM_STATES,
        },
    },
});

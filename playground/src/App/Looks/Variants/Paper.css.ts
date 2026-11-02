import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const paper = style({});

const WOBBLE = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WOBBLE_SMALL = "15px 255px 15px 225px / 225px 15px 255px 15px";
const WOBBLE_ROUND = "48% 52% 50% 50% / 52% 48% 52% 48%";

const INK = layerVars.contrast;
const INK_LINE = `2px solid ${INK}`;
const PENCIL_LINE = `2px solid rgb(from ${INK} r g b / 40%)`;
const HIGHLIGHTER = `rgb(from ${themeVars.color.alert.main} r g b / 45%)`;

const scribble = (color: string) => `repeating-linear-gradient(-55deg, ${color} 0 3px, transparent 3px 6px)`;

const SHEET = {
    borderRadius: WOBBLE,
    border: INK_LINE,
    backgroundColor: themeVars.color.surface.light,
    color: themeVars.color.surface.contrast,
    boxShadow: themeVars.shadow.small,
} as const;

const SKETCH = {
    borderRadius: WOBBLE_SMALL,
    border: INK_LINE,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
} as const;

const SKETCH_STATES = {
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const PRESS_STATES = {
    [lookSelectors.isHovered]: {
        backgroundColor: HIGHLIGHTER,
    },
    [lookSelectors.isActive]: {
        backgroundColor: INK,
        color: layerVars.main,
    },
    [lookSelectors.isDisabled]: {
        borderStyle: "dashed",
        opacity: themeVars.disabled.opacity,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        backgroundColor: HIGHLIGHTER,
        fontWeight: "bold",
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        opacity: themeVars.disabled.opacity,
    },
} as const;

LookUtils.define(paper, {
    pageBackground: {
        backgroundColor: themeVars.color.background.light,
        backgroundImage: `linear-gradient(transparent 27px, rgb(from ${themeVars.color.background.contrast} r g b / 8%) 27px)`,
        backgroundSize: "100% 28px",
        color: themeVars.color.background.contrast,
    },
    drawer: {
        backgroundColor: themeVars.color.surface.light,
        color: themeVars.color.surface.contrast,
        border: INK_LINE,
        boxShadow: themeVars.shadow.medium,
    },
    surface: SHEET,
    panel: {
        ...SKETCH,
        borderRadius: WOBBLE,
        border: PENCIL_LINE,
    },
    tooltip: {
        ...SKETCH,
        borderRadius: WOBBLE,
        backgroundColor: themeVars.color.alert.light,
        color: themeVars.color.alert.contrast,
        boxShadow: themeVars.shadow.small,
    },
    accordionHeader: {
        ...SKETCH,
        borderRadius: WOBBLE,
        border: PENCIL_LINE,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: HIGHLIGHTER,
            },
            [lookSelectors.isExpanded]: {
                border: INK_LINE,
                fontWeight: "bold",
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
        backdropFilter: "blur(4px) grayscale(50%)",
    },
    button: {
        ...SKETCH,
        paddingInline: themeVars.spacing.double,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isPressed]: {
                backgroundImage: scribble(`rgb(from ${INK} r g b / 35%)`),
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
                color: themeVars.color.error.main,
            },
            ...PRESS_STATES,
        },
    },
    buttonSimple: {
        ...SKETCH,
        border: PENCIL_LINE,
        fontSize: themeVars.fontSize.small,
        selectors: {
            ...PRESS_STATES,
            [lookSelectors.isSelected]: {
                borderColor: INK,
                backgroundColor: HIGHLIGHTER,
            },
        },
    },
    decoration: {
        borderRadius: WOBBLE_ROUND,
        backgroundColor: "transparent",
        color: `rgb(from ${INK} r g b / 65%)`,
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: INK,
                backgroundColor: HIGHLIGHTER,
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
        ...SKETCH,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                boxShadow: themeVars.shadow.small,
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
                caretColor: INK,
                fontSize: themeVars.fontSize.medium,
            },
            [lookSelectors.fieldTextDisabled]: {
                color: `rgb(from ${INK} r g b / 50%)`,
            },
        },
    },
    dropdown: {
        ...SKETCH,
        borderRadius: WOBBLE,
        boxShadow: themeVars.shadow.medium,
    },
    checkboxBox: {
        ...SKETCH,
        borderRadius: WOBBLE_ROUND,
        selectors: SKETCH_STATES,
    },
    checkboxMark: {
        color: INK,
        fontSize: themeVars.fontSize.large,
        fontWeight: "bold",
    },
    radioBox: {
        ...SKETCH,
        borderRadius: WOBBLE_ROUND,
        selectors: SKETCH_STATES,
    },
    radioDot: {
        borderRadius: WOBBLE_ROUND,
        backgroundColor: INK,
    },
    toggleTrack: {
        ...SKETCH,
        borderRadius: WOBBLE_SMALL,
        selectors: {
            ...SKETCH_STATES,
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: HIGHLIGHTER,
            },
        },
    },
    toggleHandle: {
        borderRadius: WOBBLE_ROUND,
        border: INK_LINE,
        backgroundColor: layerVars.main,
        selectors: {
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: INK,
            },
        },
    },
    progressTrack: {
        ...SKETCH,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: WOBBLE_SMALL,
        backgroundColor: "transparent",
        backgroundImage: scribble(INK),
        selectors: {
            [lookSelectors.withinError]: {
                backgroundImage: scribble(themeVars.color.error.main),
            },
        },
    },
    rangeTrack: {
        backgroundColor: "transparent",
        boxShadow: `inset 0 0 0 2px ${INK}`,
    },
    rangeFill: {
        backgroundImage: scribble(INK),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundImage: scribble(themeVars.color.error.main),
            },
        },
    },
    rangeThumb: {
        borderRadius: WOBBLE_ROUND,
        border: INK_LINE,
        backgroundColor: themeVars.color.alert.light,
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
                boxShadow: `inset 0 0 0 2px rgb(from ${INK} r g b / 40%)`,
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundImage: scribble(INK),
                boxShadow: `inset 0 0 0 2px ${INK}`,
            },
            [lookSelectors.lineActive]: {
                backgroundColor: HIGHLIGHTER,
            },
        },
    },
    tag: {
        ...SKETCH,
        paddingInline: themeVars.spacing.full,
        backgroundColor: themeVars.color.alert.light,
        color: themeVars.color.alert.contrast,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: {
                boxShadow: themeVars.shadow.small,
            },
            [lookSelectors.isDisabled]: {
                borderStyle: "dashed",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    hoverFloater: {
        borderRadius: WOBBLE_SMALL,
        backgroundColor: "transparent",
        boxShadow: `inset 0 0 0 2px rgb(from ${INK} r g b / 40%)`,
    },
    selectionFloater: {
        borderRadius: WOBBLE_SMALL,
        backgroundColor: HIGHLIGHTER,
    },
    itemWithFloater: {
        borderRadius: WOBBLE_SMALL,
        fontSize: themeVars.fontSize.medium,
        selectors: ITEM_STATES,
    },
    itemWithoutFloater: {
        borderRadius: WOBBLE_SMALL,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                boxShadow: `inset 0 0 0 2px rgb(from ${INK} r g b / 40%)`,
            },
            ...ITEM_STATES,
        },
    },
});

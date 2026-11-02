import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const aqua = style({});

const PILL_RADIUS = "9999px";

const GLOSS =
    "linear-gradient(180deg, rgb(255 255 255 / 55%) 0%, rgb(255 255 255 / 20%) 48%, rgb(255 255 255 / 0%) 52%, rgb(255 255 255 / 12%) 100%)";
const PINSTRIPE = "repeating-linear-gradient(0deg, rgb(255 255 255 / 3%) 0 1px, transparent 1px 3px)";
const WELL_SHADOW = "inset 0 2px 4px rgb(0 0 0 / 50%)";

const tint = (color: string, alpha: number) => `rgb(from ${color} r g b / ${alpha}%)`;

const candy = (dark: string, light: string) => ({
    backgroundColor: light,
    backgroundImage: `${GLOSS}, linear-gradient(180deg, ${light}, ${dark})`,
    border: `1px solid ${dark}`,
    boxShadow: themeVars.shadow.small,
});

const JELLY = candy(themeVars.color.primary.dark, themeVars.color.primary.light);
const JELLY_ERROR = candy(themeVars.color.error.dark, themeVars.color.error.light);

const WELL = {
    border: `1px solid ${tint(layerVars.contrast, 25)}`,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    boxShadow: WELL_SHADOW,
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
        filter: themeVars.active.filter,
        boxShadow: WELL_SHADOW,
    },
    [lookSelectors.isDisabled]: {
        boxShadow: "none",
        filter: themeVars.disabled.filter,
        opacity: themeVars.disabled.opacity,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        ...JELLY,
        border: "none",
        boxShadow: "none",
        color: themeVars.color.primary.contrast,
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        filter: themeVars.disabled.filter,
        opacity: themeVars.disabled.opacity,
    },
} as const;

LookUtils.define(aqua, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: `${PINSTRIPE}, linear-gradient(180deg, ${themeVars.color.background.light}, ${themeVars.color.background.dark})`,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        backgroundColor: themeVars.color.surface.light,
        backgroundImage: PINSTRIPE,
        color: themeVars.color.surface.contrast,
        boxShadow: themeVars.shadow.large,
    },
    surface: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: themeVars.color.surface.light,
        backgroundImage: PINSTRIPE,
        color: themeVars.color.surface.contrast,
        border: `1px solid ${tint(themeVars.color.surface.contrast, 20)}`,
        boxShadow: themeVars.shadow.medium,
    },
    panel: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: `${WELL_SHADOW}, 0 1px 0 rgb(255 255 255 / 10%)`,
    },
    tooltip: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: themeVars.color.alert.light,
        backgroundImage: GLOSS,
        color: themeVars.color.alert.contrast,
        border: `1px solid ${themeVars.color.alert.dark}`,
        boxShadow: themeVars.shadow.small,
    },
    accordionHeader: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: tint(layerVars.contrast, 15),
        backgroundImage: GLOSS,
        color: layerVars.contrast,
        border: `1px solid ${tint(layerVars.contrast, 25)}`,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [lookSelectors.isExpanded]: {
                ...JELLY,
                color: themeVars.color.primary.contrast,
            },
            [lookSelectors.isDisabled]: {
                boxShadow: "none",
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    opaqueOverlay: {
        backgroundColor: themeVars.color.background.dark,
    },
    blurredOverlay: {
        backdropFilter: "blur(10px)",
    },
    button: {
        ...JELLY,
        borderRadius: PILL_RADIUS,
        paddingInline: themeVars.spacing.double,
        color: themeVars.color.primary.contrast,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isPressed]: {
                backgroundColor: themeVars.color.primary.dark,
                backgroundImage: "none",
                boxShadow: WELL_SHADOW,
            },
            [lookSelectors.hasError]: {
                ...JELLY_ERROR,
                color: themeVars.color.error.contrast,
            },
            ...PRESS_STATES,
        },
    },
    buttonSimple: {
        ...candy(tint(layerVars.contrast, 10), tint(layerVars.contrast, 30)),
        borderRadius: PILL_RADIUS,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            ...PRESS_STATES,
            [lookSelectors.isSelected]: {
                ...JELLY,
                color: themeVars.color.primary.contrast,
            },
        },
    },
    decoration: {
        borderRadius: PILL_RADIUS,
        backgroundColor: "transparent",
        color: tint(layerVars.contrast, 65),
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: layerVars.contrast,
                backgroundImage: GLOSS,
                backgroundColor: tint(layerVars.contrast, 20),
            },
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isDisabled]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    input: {
        ...WELL,
        borderRadius: themeVars.borderRadius.full,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                borderColor: tint(layerVars.contrast, 50),
            },
            [lookSelectors.isReadOnly]: {
                backgroundColor: tint(layerVars.contrast, 10),
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
            [lookSelectors.isDisabled]: {
                boxShadow: "none",
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
            [lookSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: themeVars.color.primary.main,
                fontSize: themeVars.fontSize.medium,
            },
            [lookSelectors.fieldTextDisabled]: {
                color: tint(layerVars.contrast, 50),
            },
        },
    },
    dropdown: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: layerVars.main,
        backgroundImage: PINSTRIPE,
        color: layerVars.contrast,
        border: `1px solid ${tint(layerVars.contrast, 25)}`,
        boxShadow: themeVars.shadow.medium,
    },
    checkboxBox: {
        ...WELL,
        borderRadius: themeVars.borderRadius.half,
        selectors: {
            ...WELL_STATES,
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: JELLY,
        },
    },
    checkboxMark: {
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
    },
    radioBox: {
        ...WELL,
        borderRadius: "50%",
        selectors: WELL_STATES,
    },
    radioDot: {
        ...JELLY,
        borderRadius: "50%",
        boxShadow: "none",
    },
    toggleTrack: {
        ...WELL,
        borderRadius: PILL_RADIUS,
        selectors: {
            ...WELL_STATES,
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                ...JELLY,
                boxShadow: WELL_SHADOW,
            },
        },
    },
    toggleHandle: {
        ...candy(tint(layerVars.contrast, 60), layerVars.contrast),
        borderRadius: "50%",
    },
    progressTrack: {
        ...WELL,
        borderRadius: PILL_RADIUS,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        ...JELLY,
        borderRadius: PILL_RADIUS,
        border: "none",
        boxShadow: "none",
        selectors: {
            [lookSelectors.withinError]: {
                ...JELLY_ERROR,
                border: "none",
                boxShadow: "none",
            },
        },
    },
    rangeTrack: {
        backgroundColor: layerVars.main,
        boxShadow: WELL_SHADOW,
    },
    rangeFill: {
        ...JELLY,
        border: "none",
        boxShadow: "none",
        selectors: {
            [lookSelectors.hasError]: {
                ...JELLY_ERROR,
                border: "none",
                boxShadow: "none",
            },
        },
    },
    rangeThumb: {
        ...candy(tint(layerVars.contrast, 60), layerVars.contrast),
        borderRadius: "50%",
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: layerVars.main,
                boxShadow: WELL_SHADOW,
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                ...JELLY,
                border: "none",
            },
            [lookSelectors.lineActive]: {
                filter: themeVars.active.filter,
            },
        },
    },
    tag: {
        ...JELLY,
        borderRadius: PILL_RADIUS,
        paddingInline: themeVars.spacing.full,
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [lookSelectors.isDisabled]: {
                boxShadow: "none",
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    hoverFloater: {
        borderRadius: PILL_RADIUS,
        backgroundColor: tint(layerVars.contrast, 15),
        backgroundImage: GLOSS,
    },
    selectionFloater: {
        ...JELLY,
        borderRadius: PILL_RADIUS,
        border: "none",
        boxShadow: "none",
    },
    itemWithFloater: {
        borderRadius: PILL_RADIUS,
        fontSize: themeVars.fontSize.medium,
        selectors: ITEM_STATES,
    },
    itemWithoutFloater: {
        borderRadius: PILL_RADIUS,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: tint(layerVars.contrast, 15),
                backgroundImage: GLOSS,
            },
            ...ITEM_STATES,
        },
    },
});

import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const material = style({});

const PILL_RADIUS = "9999px";

const ELEVATION_1 = "0 1px 3px rgb(0 0 0 / 30%), 0 1px 2px rgb(0 0 0 / 24%)";
const ELEVATION_2 = "0 3px 6px rgb(0 0 0 / 32%), 0 3px 6px rgb(0 0 0 / 23%)";
const ELEVATION_4 = "0 10px 20px rgb(0 0 0 / 38%), 0 6px 6px rgb(0 0 0 / 23%)";
const ELEVATION_8 = "0 14px 28px rgb(0 0 0 / 45%), 0 10px 10px rgb(0 0 0 / 22%)";

const tint = (color: string, alpha: number) => `rgb(from ${color} r g b / ${alpha}%)`;

const PRIMARY = themeVars.color.primary.main;

const LABEL = {
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
} as const;

const SHEET = {
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: themeVars.color.surface.light,
    color: themeVars.color.surface.contrast,
    boxShadow: ELEVATION_2,
} as const;

const SWITCH_BOX = {
    border: `2px solid ${tint(layerVars.contrast, 60)}`,
    backgroundColor: "transparent",
} as const;

const SWITCH_BOX_STATES = {
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
    },
    [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
        borderColor: themeVars.color.primary.light,
        backgroundColor: themeVars.color.primary.light,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        backgroundColor: tint(PRIMARY, 12),
        color: PRIMARY,
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        opacity: themeVars.disabled.opacity,
    },
} as const;

LookUtils.define(material, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        backgroundColor: themeVars.color.surface.light,
        color: themeVars.color.surface.contrast,
        boxShadow: ELEVATION_8,
    },
    surface: SHEET,
    panel: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: ELEVATION_1,
    },
    tooltip: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(layerVars.contrast, 90),
        color: layerVars.main,
        boxShadow: ELEVATION_2,
    },
    accordionHeader: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: ELEVATION_1,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                boxShadow: ELEVATION_2,
            },
            [lookSelectors.isExpanded]: {
                color: PRIMARY,
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
        backdropFilter: "brightness(50%)",
    },
    button: {
        ...LABEL,
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.double,
        backgroundColor: themeVars.color.primary.light,
        color: themeVars.color.primary.contrast,
        boxShadow: ELEVATION_2,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isPressed]: {
                backgroundColor: themeVars.color.primary.dark,
                boxShadow: "none",
            },
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.light,
                color: themeVars.color.error.contrast,
            },
            [lookSelectors.isHovered]: {
                boxShadow: ELEVATION_4,
                filter: themeVars.hover.filter,
            },
            [lookSelectors.isActive]: {
                boxShadow: ELEVATION_8,
            },
            [lookSelectors.isDisabled]: {
                boxShadow: "none",
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    buttonSimple: {
        ...LABEL,
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        color: PRIMARY,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: tint(PRIMARY, 10),
            },
            [lookSelectors.isActive]: {
                backgroundColor: tint(PRIMARY, 20),
            },
            [lookSelectors.isSelected]: {
                backgroundColor: tint(PRIMARY, 12),
            },
            [lookSelectors.isDisabled]: {
                color: layerVars.contrast,
                opacity: themeVars.disabled.opacity,
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
                backgroundColor: tint(layerVars.contrast, 8),
            },
            [lookSelectors.isActive]: {
                backgroundColor: tint(layerVars.contrast, 16),
            },
            [lookSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    input: {
        borderRadius: `${themeVars.borderRadius.half} ${themeVars.borderRadius.half} 0 0`,
        border: "2px solid transparent",
        borderBottomColor: tint(layerVars.contrast, 40),
        backgroundColor: tint(layerVars.contrast, 8),
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                borderBottomColor: tint(layerVars.contrast, 80),
                backgroundColor: tint(layerVars.contrast, 12),
            },
            [lookSelectors.isReadOnly]: {
                borderBottomStyle: "dotted",
            },
            [lookSelectors.hasError]: {
                borderBottomColor: themeVars.color.error.main,
            },
            [lookSelectors.isDisabled]: {
                borderBottomStyle: "dotted",
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
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: ELEVATION_8,
    },
    checkboxBox: {
        ...SWITCH_BOX,
        borderRadius: themeVars.borderRadius.half,
        selectors: SWITCH_BOX_STATES,
    },
    checkboxMark: {
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
    },
    radioBox: {
        ...SWITCH_BOX,
        borderRadius: "50%",
        selectors: {
            [lookSelectors.withinError]: {
                borderColor: themeVars.color.error.main,
            },
            [lookSelectors.withinChecked]: {
                borderColor: themeVars.color.primary.light,
            },
        },
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.light,
    },
    toggleTrack: {
        border: "2px solid transparent",
        borderRadius: PILL_RADIUS,
        backgroundColor: tint(layerVars.contrast, 40),
        selectors: {
            [lookSelectors.withinError]: {
                borderColor: themeVars.color.error.main,
            },
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: tint(PRIMARY, 50),
            },
        },
    },
    toggleHandle: {
        borderRadius: "50%",
        backgroundColor: layerVars.contrast,
        boxShadow: ELEVATION_1,
        selectors: {
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: themeVars.color.primary.light,
            },
        },
    },
    progressTrack: {
        border: "2px solid transparent",
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(PRIMARY, 25),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: tint(themeVars.color.error.main, 25),
            },
        },
    },
    progressFill: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: themeVars.color.primary.light,
        selectors: {
            [lookSelectors.withinError]: {
                backgroundColor: themeVars.color.error.light,
            },
        },
    },
    rangeTrack: {
        backgroundColor: tint(PRIMARY, 25),
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
        borderRadius: "50%",
        border: "2px solid transparent",
        backgroundColor: themeVars.color.primary.light,
        boxShadow: ELEVATION_1,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.light,
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
                backgroundColor: tint(layerVars.contrast, 60),
            },
            [lookSelectors.lineActive]: {
                backgroundColor: PRIMARY,
            },
        },
    },
    tag: {
        borderRadius: PILL_RADIUS,
        paddingInline: themeVars.spacing.full,
        backgroundColor: tint(layerVars.contrast, 12),
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: tint(layerVars.contrast, 20),
            },
            [lookSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(layerVars.contrast, 8),
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(PRIMARY, 12),
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
                backgroundColor: tint(layerVars.contrast, 8),
            },
            ...ITEM_STATES,
        },
    },
});

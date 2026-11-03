import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const material = style({});

const PILL_RADIUS = "9999px";

const ELEVATION_1 = "0 1px 3px rgb(0 0 0 / 35%), 0 1px 3px rgb(0 0 0 / 25%)";
const ELEVATION_2 = "0 2px 6px rgb(0 0 0 / 40%), 0 2px 6px rgb(0 0 0 / 25%)";
const ELEVATION_4 = "0 4px 12px rgb(0 0 0 / 45%), 0 4px 12px rgb(0 0 0 / 25%)";
const ELEVATION_8 = "0 8px 24px rgb(0 0 0 / 50%), 0 8px 24px rgb(0 0 0 / 25%)";

const alpha = (color: string, alpha: number) => `rgb(from ${color} r g b / ${alpha}%)`;

const LABEL = {
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
} as const;

const SHEET = {
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.surface.light,
    color: themeVars.color.surface.contrast,
    boxShadow: ELEVATION_2,
} as const;

const SWITCH_BOX = {
    border: `2px solid ${alpha(layerVars.contrast, 60)}`,
    backgroundColor: "transparent",
} as const;

const SWITCH_BOX_STATES = {
    [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
        borderColor: themeVars.color.primary.main,
        backgroundColor: themeVars.color.primary.main,
    },
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        backgroundColor: alpha(themeVars.color.primary.main, 15),
        color: themeVars.color.primary.main,
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        opacity: themeVars.disabled.opacity,
    },
} as const;

const PANEL = {
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    boxShadow: ELEVATION_1,
} as const;

const RANGE_TRACK = {
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: alpha(themeVars.color.primary.main, 30),
} as const;

const RANGE_FILL = {
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: themeVars.color.primary.main,
    selectors: {
        [lookSelectors.hasError]: {
            backgroundColor: themeVars.color.error.main,
        },
    },
} as const;

const RANGE_THUMB = {
    borderRadius: "50%",
    border: "2px solid transparent",
    backgroundColor: themeVars.color.primary.light,
    boxShadow: ELEVATION_1,
    selectors: {
        [lookSelectors.hasError]: {
            backgroundColor: themeVars.color.error.light,
        },
    },
} as const;

LookUtils.define(material, {
    pageBackground: {
        backgroundColor: themeVars.color.background.light,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        backgroundColor: themeVars.color.surface.light,
        color: themeVars.color.surface.contrast,
        boxShadow: ELEVATION_8,
    },
    surface: SHEET,
    hollowSurface: LookUtils.hollow(SHEET),
    panel: PANEL,
    tooltip: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: alpha(layerVars.contrast, 60),
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
                color: themeVars.color.primary.main,
            },
            [lookSelectors.isDisabled]: {
                boxShadow: "none",
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    accordionPanel: PANEL,
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
        color: themeVars.color.primary.main,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: alpha(themeVars.color.primary.main, 15),
            },
            [lookSelectors.isActive]: {
                backgroundColor: alpha(themeVars.color.primary.main, 30),
            },
            [lookSelectors.isSelected]: {
                backgroundColor: alpha(themeVars.color.primary.main, 15),
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
        color: alpha(layerVars.contrast, 60),
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: layerVars.contrast,
                backgroundColor: alpha(layerVars.contrast, 15),
            },
            [lookSelectors.isActive]: {
                backgroundColor: alpha(layerVars.contrast, 30),
            },
            [lookSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    input: {
        borderRadius: `${themeVars.borderRadius.half} ${themeVars.borderRadius.half} 0 0`,
        border: "2px solid transparent",
        borderBottomColor: alpha(layerVars.contrast, 60),
        backgroundColor: alpha(layerVars.contrast, 15),
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                borderBottomColor: alpha(layerVars.contrast, 75),
                backgroundColor: alpha(layerVars.contrast, 30),
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
                caretColor: themeVars.color.primary.main,
                fontSize: themeVars.fontSize.medium,
            },
            [lookSelectors.fieldTextDisabled]: {
                color: alpha(layerVars.contrast, 45),
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
        backgroundColor: alpha(layerVars.contrast, 30),
        selectors: {
            [lookSelectors.withinError]: {
                borderColor: themeVars.color.error.main,
            },
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: alpha(themeVars.color.primary.main, 30),
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
        backgroundColor: alpha(themeVars.color.primary.main, 30),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: alpha(themeVars.color.error.main, 30),
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
                backgroundColor: alpha(layerVars.contrast, 30),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: alpha(layerVars.contrast, 60),
            },
            [lookSelectors.lineActive]: {
                backgroundColor: themeVars.color.primary.main,
            },
        },
    },
    tag: {
        borderRadius: PILL_RADIUS,
        paddingInline: themeVars.spacing.full,
        backgroundColor: alpha(layerVars.contrast, 15),
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: alpha(layerVars.contrast, 30),
            },
            [lookSelectors.isDisabled]: {
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: alpha(layerVars.contrast, 15),
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: alpha(themeVars.color.primary.main, 15),
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
                backgroundColor: alpha(layerVars.contrast, 15),
            },
            ...ITEM_STATES,
        },
    },
});

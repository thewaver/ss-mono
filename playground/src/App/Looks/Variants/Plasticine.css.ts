import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors, lookVars } from "../Look.css";

export const plasticine = style({});

const PILL_RADIUS = "9999px";

const SHADOW_SMALL = "0 2px 2px 0px rgba(0, 0, 0, 0.65)";
const SHADOW_MEDIUM = `${SHADOW_SMALL}, 0 4px 8px 0px rgba(0, 0, 0, 0.5)`;
const SHADOW_LARGE = `${SHADOW_MEDIUM}, 0 16px 64px 0px rgba(0, 0, 0, 0.35)`;

const INTERACTIBLE_STATES: StyleRule["selectors"] = {
    [lookSelectors.isHovered]: {
        filter: themeVars.hover.filter,
    },
    [lookSelectors.isActive]: {
        filter: themeVars.active.filter,
    },
    [lookSelectors.isDisabled]: {
        filter: themeVars.disabled.filter,
        opacity: themeVars.disabled.opacity,
    },
} as const;

const INPUT_STATES: StyleRule["selectors"] = {
    [LookUtils.anyOf(lookSelectors.hasErrorWithin, lookSelectors.hasError)]: {
        borderColor: themeVars.color.error.main,
    },
    ...INTERACTIBLE_STATES,
} as const;

const ITEM_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(
    {
        [lookSelectors.isSelected]: {
            color: themeVars.color.primary.main,
            fontWeight: "bold",
        },
        [lookSelectors.isDisabled]: {
            backgroundColor: "transparent",
        },
    },
    INTERACTIBLE_STATES,
);

const FIELD_SHELL: StyleRule = {
    border: `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    backgroundColor: layerVars.main,
    boxShadow: SHADOW_SMALL,
} as const;

const SURFACE: StyleRule = {
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.surface.dark,
    backgroundImage: `linear-gradient(315deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,
    color: themeVars.color.surface.contrast,
    boxShadow: SHADOW_MEDIUM,
} as const;

LookUtils.define(plasticine, {
    accordionHeader: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: `rgb(from ${layerVars.main} r g b / 50%)`,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [lookSelectors.isDisabled]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    accordionPanel: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: `rgb(from ${layerVars.main} r g b / 50%)`,
        color: layerVars.contrast,
        boxShadow: SHADOW_SMALL,
    },
    blurredOverlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
    },
    button: {
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.double,
        backgroundColor: themeVars.color.primary.dark,
        backgroundImage: `linear-gradient(315deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        color: themeVars.color.primary.contrast,
        boxShadow: SHADOW_SMALL,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isPressed]: {
                boxShadow: `inset 0 1px 3px rgb(0 0 0 / 75%), inset 0 2px 6px rgb(0 0 0 / 50%)`,
            },
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: `linear-gradient(315deg, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
                color: themeVars.color.error.contrast,
            },
            ...INTERACTIBLE_STATES,
        },
    },
    buttonSimple: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
        color: layerVars.contrast,
        boxShadow: SHADOW_SMALL,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isSelected]: {
                color: themeVars.color.primary.main,
            },
            ...INTERACTIBLE_STATES,
        },
    },
    checkboxBox: {
        ...FIELD_SHELL,
        borderRadius: themeVars.borderRadius.half,
        selectors: INPUT_STATES,
    },
    checkboxMark: {
        color: themeVars.color.primary.main,
        fontSize: themeVars.fontSize.medium,
    },
    decoration: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        color: `rgb(from ${layerVars.contrast} r g b / 75%)`,
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: layerVars.contrast,
                backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
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
    drawer: {
        backgroundColor: themeVars.color.surface.dark,
        backgroundImage: `linear-gradient(45deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,
        color: themeVars.color.surface.contrast,
        boxShadow: SHADOW_LARGE,
    },
    dropdown: {
        borderRadius: themeVars.borderRadius.full,
        border: `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: SHADOW_SMALL,
    },
    hollowSurface: LookUtils.hollow(SURFACE),
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
    },
    input: {
        ...FIELD_SHELL,
        borderRadius: themeVars.borderRadius.half,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [lookSelectors.isReadOnly]: {
                backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
            [lookSelectors.isDisabled]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
            [lookSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: themeVars.color.primary.main,
                fontSize: themeVars.fontSize.medium,
            },
            [lookSelectors.fieldTextDisabled]: {
                color: `rgb(from ${layerVars.contrast} r g b / 50%)`,
            },
        },
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
                backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
            },
            ...ITEM_STATES,
        },
    },
    opaqueOverlay: {
        backgroundColor: "black",
    },
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: `linear-gradient(315deg, ${themeVars.color.background.dark}, ${themeVars.color.background.light})`,
        color: themeVars.color.background.contrast,
    },
    panel: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: `rgb(from ${layerVars.main} r g b / 50%)`,
        color: layerVars.contrast,
        boxShadow: SHADOW_SMALL,
    },
    progressFill: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: themeVars.color.primary.dark,
        backgroundImage: `linear-gradient(${lookVars.barAngle}, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        selectors: {
            [lookSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.light,
                backgroundImage: `linear-gradient(${lookVars.barAngle}, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
            },
        },
    },
    progressTrack: {
        border: `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: layerVars.main,
        boxShadow: SHADOW_SMALL,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    radioBox: {
        ...FIELD_SHELL,
        borderRadius: "50%",
        selectors: INPUT_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.dark,
        backgroundImage: `linear-gradient(45deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
    },
    rangeFill: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: themeVars.color.primary.dark,
        backgroundImage: `linear-gradient(${lookVars.barAngle}, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.dark,
                backgroundImage: `linear-gradient(${lookVars.barAngle}, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
            },
        },
    },
    rangeThumb: {
        borderRadius: "50%",
        border: `2px solid ${themeVars.color.primary.main}`,
        backgroundColor: layerVars.main,
        boxShadow: SHADOW_SMALL,
        selectors: {
            [lookSelectors.isStart]: {
                borderColor: themeVars.color.primary.dark,
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    rangeTrack: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
        boxShadow: SHADOW_SMALL,
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: SHADOW_SMALL,
            },
            [lookSelectors.lineActive]: {
                filter: themeVars.active.filter,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
            },
        },
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 10%)`,
    },
    slideButtonArrow: {
        stroke: themeVars.color.primary.main,
        selectors: {
            [lookSelectors.hasError]: {
                stroke: themeVars.color.error.main,
            },
        },
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.light,
        backgroundImage: `linear-gradient(${lookVars.barAngle}, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.light,
                backgroundImage: `linear-gradient(${lookVars.barAngle}, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
            },
        },
    },
    slideButtonHint: {
        fontWeight: "bold",
    },
    slideButtonThumb: {
        borderRadius: "50%",
        border: `2px solid ${themeVars.color.primary.main}`,
        backgroundColor: layerVars.main,
        boxShadow: SHADOW_SMALL,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonTrack: {
        borderRadius: PILL_RADIUS,
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
        boxShadow: SHADOW_SMALL,
    },
    surface: SURFACE,
    tabsFloater: {
        borderBlockEnd: `2px solid ${themeVars.color.primary.main}`,
        selectors: {
            [lookSelectors.isVertical]: {
                borderBlockEnd: "none",
                borderInlineStart: `2px solid ${themeVars.color.primary.main}`,
            },
        },
    },
    tabsGutter: {
        borderBlockEnd: `2px solid rgb(from ${layerVars.contrast} r g b / 10%)`,
        selectors: {
            [lookSelectors.isVertical]: {
                borderBlockEnd: "none",
                borderInlineStart: `2px solid rgb(from ${layerVars.contrast} r g b / 10%)`,
            },
        },
    },
    tabsItem: {
        paddingBlock: themeVars.spacing.half,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.small,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isVertical]: {
                paddingBlock: themeVars.spacing.quarter,
                paddingInline: themeVars.spacing.double,
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
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.full,
        backgroundColor: themeVars.color.primary.dark,
        backgroundImage: `linear-gradient(45deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [lookSelectors.isDisabled]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    toggleHandle: {
        borderRadius: "50%",
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 75%)`,
        selectors: {
            [LookUtils.anyOf(lookSelectors.isCheckedWithin, lookSelectors.isMixedWithin)]: {
                backgroundColor: themeVars.color.primary.main,
            },
        },
    },
    toggleTrack: {
        ...FIELD_SHELL,
        borderRadius: PILL_RADIUS,
        selectors: INPUT_STATES,
    },
    tooltip: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: SHADOW_SMALL,
    },
});

import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const plasticine = style({});

const PILL_RADIUS = "9999px";

const FIELD_SURFACE = {
    border: `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    backgroundColor: layerVars.main,
    boxShadow: themeVars.shadow.small,
} as const;

const SWITCH_BOX_STATES = {
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        color: themeVars.color.primary.main,
        fontWeight: "bold",
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        filter: themeVars.disabled.filter,
        opacity: themeVars.disabled.opacity,
    },
} as const;

const BUTTON_STATES = {
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

LookUtils.define(plasticine, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: `linear-gradient(315deg, ${themeVars.color.background.dark}, ${themeVars.color.background.light})`,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        backgroundColor: themeVars.color.surface.dark,
        backgroundImage: `linear-gradient(45deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,
        color: themeVars.color.surface.contrast,
        boxShadow: themeVars.shadow.large,
    },
    surface: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: themeVars.color.surface.dark,
        backgroundImage: `linear-gradient(315deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,
        color: themeVars.color.surface.contrast,
        boxShadow: themeVars.shadow.medium,
    },
    panel: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: `rgb(from ${layerVars.main} r g b / 50%)`,
        color: layerVars.contrast,
        boxShadow: themeVars.shadow.small,
    },
    tooltip: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: themeVars.shadow.small,
    },
    accordionHeader: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: layerVars.main,
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
    opaqueOverlay: {
        backgroundColor: "black",
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
        boxShadow: themeVars.shadow.small,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isPressed]: {
                backgroundImage: `linear-gradient(135deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
                boxShadow: `inset 0 2px 4px rgb(0 0 0 / 50%)`,
            },
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.dark,
                backgroundImage: `linear-gradient(315deg, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
                color: themeVars.color.error.contrast,
            },
            ...BUTTON_STATES,
        },
    },
    buttonSimple: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
        color: layerVars.contrast,
        boxShadow: themeVars.shadow.small,
        fontSize: themeVars.fontSize.small,
        selectors: {
            ...BUTTON_STATES,
            [lookSelectors.isSelected]: {
                color: themeVars.color.primary.main,
            },
        },
    },
    decoration: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        color: `rgb(from ${layerVars.contrast} r g b / 65%)`,
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
    input: {
        ...FIELD_SURFACE,
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
    dropdown: {
        borderRadius: themeVars.borderRadius.full,
        border: `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: themeVars.shadow.small,
    },
    checkboxBox: {
        ...FIELD_SURFACE,
        borderRadius: themeVars.borderRadius.half,
        selectors: SWITCH_BOX_STATES,
    },
    checkboxMark: {
        color: themeVars.color.primary.main,
        fontSize: themeVars.fontSize.medium,
    },
    radioBox: {
        ...FIELD_SURFACE,
        borderRadius: "50%",
        selectors: SWITCH_BOX_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.light,
        backgroundImage: `linear-gradient(45deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
    },
    toggleTrack: {
        ...FIELD_SURFACE,
        borderRadius: PILL_RADIUS,
        selectors: SWITCH_BOX_STATES,
    },
    toggleHandle: {
        borderRadius: "50%",
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 75%)`,
        selectors: {
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: themeVars.color.primary.main,
            },
        },
    },
    progressTrack: {
        border: `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: layerVars.main,
        boxShadow: themeVars.shadow.small,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: themeVars.color.primary.light,
        backgroundImage: `linear-gradient(90deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        selectors: {
            [lookSelectors.rightToLeft]: {
                backgroundImage: `linear-gradient(270deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
            },
            [lookSelectors.withinError]: {
                backgroundColor: themeVars.color.error.light,
                backgroundImage: `linear-gradient(90deg, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
            },
            [lookSelectors.withinErrorRightToLeft]: {
                backgroundImage: `linear-gradient(270deg, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
            },
        },
    },
    rangeTrack: {
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
        boxShadow: themeVars.shadow.small,
    },
    rangeFill: {
        backgroundColor: themeVars.color.primary.main,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    rangeThumb: {
        borderRadius: "50%",
        border: `2px solid ${themeVars.color.primary.main}`,
        backgroundColor: layerVars.main,
        boxShadow: themeVars.shadow.small,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
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
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: themeVars.shadow.small,
            },
            [lookSelectors.lineActive]: {
                filter: themeVars.active.filter,
            },
        },
    },
    tag: {
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.full,
        backgroundColor: themeVars.color.primary.light,
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
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 10%)`,
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
});

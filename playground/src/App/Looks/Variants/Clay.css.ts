import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const clay = style({});

const PILL_RADIUS = "9999px";
const LIFT = 8;
const LIFT_SMALL = 4;
const LIFT_TINY = 2;

const lighter = (color: string) => `hsl(from ${color} h s calc(l + 8))`;
const darker = (color: string) => `hsl(from ${color} h s calc(l - 8))`;

const raised = (color: string, distance: number) =>
    `${-distance}px ${-distance}px ${distance * 2}px ${lighter(color)}, ${distance}px ${distance}px ${distance * 2}px ${darker(color)}`;

const sunken = (color: string, distance: number) =>
    `inset ${distance}px ${distance}px ${distance * 2}px ${darker(color)}, inset ${-distance}px ${-distance}px ${distance * 2}px ${lighter(color)}`;

const MOLD = {
    border: "2px solid transparent",
    backgroundColor: layerVars.main,
    boxShadow: sunken(layerVars.main, LIFT_SMALL),
} as const;

const MOLD_STATES = {
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const PRESS_STATES = {
    [lookSelectors.isHovered]: {
        filter: themeVars.hover.filter,
    },
    [lookSelectors.isActive]: {
        boxShadow: sunken(layerVars.main, LIFT_TINY),
    },
    [lookSelectors.isDisabled]: {
        boxShadow: "none",
        filter: themeVars.disabled.filter,
        opacity: themeVars.disabled.opacity,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        color: themeVars.color.primary.main,
        fontWeight: "bold",
    },
    [lookSelectors.isDisabled]: {
        boxShadow: "none",
        backgroundColor: "transparent",
        filter: themeVars.disabled.filter,
        opacity: themeVars.disabled.opacity,
    },
} as const;

LookUtils.define(clay, {
    pageBackground: {
        backgroundColor: themeVars.color.background.light,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        backgroundColor: themeVars.color.surface.light,
        color: themeVars.color.surface.contrast,
        boxShadow: raised(themeVars.color.surface.light, LIFT * 2),
    },
    surface: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: themeVars.color.surface.light,
        color: themeVars.color.surface.contrast,
        boxShadow: raised(themeVars.color.surface.light, LIFT),
    },
    panel: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: raised(layerVars.main, LIFT_SMALL),
    },
    tooltip: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: raised(layerVars.main, LIFT_SMALL),
    },
    accordionHeader: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: raised(layerVars.main, LIFT_SMALL),
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [lookSelectors.isExpanded]: {
                boxShadow: sunken(layerVars.main, LIFT_SMALL),
                color: themeVars.color.primary.main,
            },
            [lookSelectors.isDisabled]: {
                boxShadow: "none",
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    opaqueOverlay: {
        backgroundColor: themeVars.color.surface.dark,
    },
    blurredOverlay: {
        backdropFilter: "blur(8px)",
    },
    button: {
        borderRadius: PILL_RADIUS,
        paddingInline: themeVars.spacing.double,
        backgroundColor: themeVars.color.primary.light,
        backgroundImage: `linear-gradient(180deg, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
        color: themeVars.color.primary.contrast,
        boxShadow: raised(layerVars.main, LIFT_SMALL),
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isPressed]: {
                backgroundImage: `linear-gradient(180deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
                boxShadow: sunken(layerVars.main, LIFT_SMALL),
            },
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.light,
                backgroundImage: `linear-gradient(180deg, ${themeVars.color.error.light}, ${themeVars.color.error.dark})`,
                color: themeVars.color.error.contrast,
            },
            [lookSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [lookSelectors.isActive]: {
                backgroundImage: `linear-gradient(180deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
                boxShadow: sunken(layerVars.main, LIFT_TINY),
            },
            [lookSelectors.isDisabled]: {
                boxShadow: "none",
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    buttonSimple: {
        borderRadius: PILL_RADIUS,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: raised(layerVars.main, LIFT_SMALL),
        fontSize: themeVars.fontSize.small,
        selectors: {
            ...PRESS_STATES,
            [lookSelectors.isSelected]: {
                color: themeVars.color.primary.main,
                boxShadow: sunken(layerVars.main, LIFT_SMALL),
            },
        },
    },
    decoration: {
        borderRadius: PILL_RADIUS,
        backgroundColor: "transparent",
        color: `rgb(from ${layerVars.contrast} r g b / 65%)`,
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: layerVars.contrast,
                boxShadow: sunken(layerVars.main, LIFT_TINY),
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
        ...MOLD,
        borderRadius: themeVars.borderRadius.full,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [lookSelectors.isReadOnly]: {
                boxShadow: "none",
                backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
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
                color: `rgb(from ${layerVars.contrast} r g b / 50%)`,
            },
        },
    },
    dropdown: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: raised(layerVars.main, LIFT),
    },
    checkboxBox: {
        ...MOLD,
        borderRadius: themeVars.borderRadius.half,
        selectors: MOLD_STATES,
    },
    checkboxMark: {
        color: themeVars.color.primary.main,
        fontSize: themeVars.fontSize.medium,
    },
    radioBox: {
        ...MOLD,
        borderRadius: "50%",
        selectors: MOLD_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.light,
        backgroundImage: `radial-gradient(circle at 30% 30%, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
        boxShadow: raised(layerVars.main, LIFT_TINY),
    },
    toggleTrack: {
        ...MOLD,
        borderRadius: PILL_RADIUS,
        selectors: MOLD_STATES,
    },
    toggleHandle: {
        borderRadius: "50%",
        backgroundColor: layerVars.main,
        boxShadow: raised(layerVars.main, LIFT_TINY),
        selectors: {
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: themeVars.color.primary.light,
                backgroundImage: `radial-gradient(circle at 30% 30%, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
            },
        },
    },
    progressTrack: {
        ...MOLD,
        borderRadius: PILL_RADIUS,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: PILL_RADIUS,
        backgroundColor: themeVars.color.primary.light,
        backgroundImage: `linear-gradient(180deg, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
        selectors: {
            [lookSelectors.withinError]: {
                backgroundColor: themeVars.color.error.light,
                backgroundImage: `linear-gradient(180deg, ${themeVars.color.error.light}, ${themeVars.color.error.dark})`,
            },
        },
    },
    rangeTrack: {
        backgroundColor: layerVars.main,
        boxShadow: sunken(layerVars.main, LIFT_TINY),
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
        border: `2px solid ${lighter(layerVars.main)}`,
        backgroundColor: layerVars.main,
        boxShadow: raised(layerVars.main, LIFT_SMALL),
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
                boxShadow: sunken(layerVars.main, LIFT_TINY),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: raised(layerVars.main, LIFT_TINY),
            },
            [lookSelectors.lineActive]: {
                filter: themeVars.active.filter,
            },
        },
    },
    tag: {
        borderRadius: PILL_RADIUS,
        paddingInline: themeVars.spacing.full,
        backgroundColor: themeVars.color.primary.light,
        backgroundImage: `linear-gradient(180deg, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
        color: themeVars.color.primary.contrast,
        boxShadow: raised(layerVars.main, LIFT_TINY),
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
        backgroundColor: layerVars.main,
        boxShadow: raised(layerVars.main, LIFT_SMALL),
    },
    selectionFloater: {
        borderRadius: PILL_RADIUS,
        backgroundColor: layerVars.main,
        boxShadow: sunken(layerVars.main, LIFT_SMALL),
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
                boxShadow: raised(layerVars.main, LIFT_SMALL),
            },
            ...ITEM_STATES,
        },
    },
});

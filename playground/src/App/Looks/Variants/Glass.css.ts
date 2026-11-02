import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const glass = style({});

const PILL_RADIUS = "9999px";
const FROST = "blur(16px) saturate(160%)";
const LIGHT_FROST = "blur(12px) saturate(140%)";

const tint = (color: string, alpha: number) => `rgb(from ${color} r g b / ${alpha}%)`;

const EDGE = `1px solid ${tint(layerVars.contrast, 20)}`;
const EDGE_STRONG = `1px solid ${tint(layerVars.contrast, 35)}`;
const HIGHLIGHT = `inset 0 1px 0 0 ${tint(layerVars.contrast, 35)}`;

const pane = (color: string, alpha: number, shadow: string) => ({
    backgroundColor: tint(color, alpha),
    backdropFilter: FROST,
    border: EDGE,
    boxShadow: `${HIGHLIGHT}, ${shadow}`,
});

const PRESS_STATES = {
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

const BOX = {
    backgroundColor: tint(layerVars.main, 40),
    backdropFilter: LIGHT_FROST,
    border: EDGE_STRONG,
    boxShadow: HIGHLIGHT,
} as const;

const BOX_STATES = {
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

LookUtils.define(glass, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: [
            `radial-gradient(circle at 15% 10%, ${tint(themeVars.color.primary.dark, 55)}, transparent 45%)`,
            `radial-gradient(circle at 85% 90%, ${tint(themeVars.color.secondary.dark, 55)}, transparent 45%)`,
            `linear-gradient(315deg, ${themeVars.color.background.dark}, ${themeVars.color.background.light})`,
        ].join(", "),
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...pane(themeVars.color.surface.light, 35, themeVars.shadow.large),
        color: themeVars.color.surface.contrast,
    },
    surface: {
        borderRadius: themeVars.borderRadius.full,
        ...pane(themeVars.color.surface.light, 30, themeVars.shadow.medium),
        color: themeVars.color.surface.contrast,
    },
    panel: {
        borderRadius: themeVars.borderRadius.full,
        ...pane(layerVars.main, 35, themeVars.shadow.small),
        color: layerVars.contrast,
    },
    tooltip: {
        ...pane(layerVars.main, 60, themeVars.shadow.small),
        borderRadius: themeVars.borderRadius.full,
        color: layerVars.contrast,
    },
    accordionHeader: {
        ...pane(layerVars.main, 35, themeVars.shadow.small),
        borderRadius: themeVars.borderRadius.half,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                borderColor: tint(layerVars.contrast, 50),
            },
            [lookSelectors.isExpanded]: {
                color: themeVars.color.primary.main,
            },
            [lookSelectors.isDisabled]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    opaqueOverlay: {
        backgroundColor: themeVars.color.background.dark,
    },
    blurredOverlay: {
        backdropFilter: "blur(24px) saturate(120%)",
    },
    button: {
        borderRadius: PILL_RADIUS,
        paddingInline: themeVars.spacing.double,
        backgroundColor: tint(themeVars.color.primary.light, 70),
        backgroundImage: `linear-gradient(180deg, ${tint(themeVars.color.primary.light, 75)}, ${tint(themeVars.color.primary.dark, 75)})`,
        backdropFilter: LIGHT_FROST,
        border: `1px solid ${tint(themeVars.color.primary.light, 70)}`,
        color: themeVars.color.primary.contrast,
        boxShadow: `${HIGHLIGHT}, ${themeVars.shadow.small}`,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isPressed]: {
                backgroundColor: tint(themeVars.color.primary.dark, 95),
                backgroundImage: "none",
                boxShadow: `inset 0 2px 6px rgb(0 0 0 / 45%)`,
            },
            [lookSelectors.hasError]: {
                backgroundColor: tint(themeVars.color.error.light, 70),
                backgroundImage: `linear-gradient(180deg, ${tint(themeVars.color.error.light, 75)}, ${tint(themeVars.color.error.dark, 75)})`,
                borderColor: tint(themeVars.color.error.light, 70),
                color: themeVars.color.error.contrast,
            },
            ...PRESS_STATES,
        },
    },
    buttonSimple: {
        borderRadius: PILL_RADIUS,
        backgroundColor: tint(layerVars.contrast, 12),
        backdropFilter: LIGHT_FROST,
        border: EDGE,
        color: layerVars.contrast,
        boxShadow: HIGHLIGHT,
        fontSize: themeVars.fontSize.small,
        selectors: {
            ...PRESS_STATES,
            [lookSelectors.isSelected]: {
                color: themeVars.color.primary.main,
                borderColor: tint(themeVars.color.primary.main, 50),
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
                backgroundColor: tint(layerVars.contrast, 12),
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
        ...BOX,
        borderRadius: themeVars.borderRadius.full,
        color: layerVars.contrast,
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
        ...pane(layerVars.main, 60, themeVars.shadow.medium),
        color: layerVars.contrast,
    },
    checkboxBox: {
        ...BOX,
        borderRadius: themeVars.borderRadius.half,
        selectors: BOX_STATES,
    },
    checkboxMark: {
        color: themeVars.color.primary.main,
        fontSize: themeVars.fontSize.medium,
    },
    radioBox: {
        ...BOX,
        borderRadius: "50%",
        selectors: BOX_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.light,
        backgroundImage: `radial-gradient(circle at 30% 30%, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    },
    toggleTrack: {
        ...BOX,
        borderRadius: PILL_RADIUS,
        selectors: {
            ...BOX_STATES,
            [LookUtils.anyOf(lookSelectors.isChecked, lookSelectors.isMixed)]: {
                backgroundColor: tint(themeVars.color.primary.main, 30),
                borderColor: tint(themeVars.color.primary.main, 50),
            },
        },
    },
    toggleHandle: {
        borderRadius: "50%",
        backgroundColor: tint(layerVars.contrast, 85),
        boxShadow: themeVars.shadow.small,
        selectors: {
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: themeVars.color.primary.light,
            },
        },
    },
    progressTrack: {
        ...BOX,
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
        boxShadow: HIGHLIGHT,
        selectors: {
            [lookSelectors.withinError]: {
                backgroundColor: themeVars.color.error.light,
                backgroundImage: `linear-gradient(180deg, ${themeVars.color.error.light}, ${themeVars.color.error.dark})`,
            },
        },
    },
    rangeTrack: {
        backgroundColor: tint(layerVars.contrast, 20),
        boxShadow: HIGHLIGHT,
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
        border: EDGE_STRONG,
        backgroundColor: tint(layerVars.contrast, 85),
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
                backgroundColor: tint(layerVars.contrast, 20),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: tint(layerVars.contrast, 60),
                boxShadow: themeVars.shadow.small,
            },
            [lookSelectors.lineActive]: {
                backgroundColor: layerVars.contrast,
            },
        },
    },
    tag: {
        borderRadius: PILL_RADIUS,
        paddingInline: themeVars.spacing.full,
        backgroundColor: tint(themeVars.color.primary.light, 70),
        backdropFilter: LIGHT_FROST,
        border: `1px solid ${tint(themeVars.color.primary.light, 70)}`,
        color: themeVars.color.primary.contrast,
        boxShadow: HIGHLIGHT,
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
        backgroundColor: tint(layerVars.contrast, 12),
        border: EDGE,
        boxShadow: HIGHLIGHT,
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(themeVars.color.primary.main, 20),
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
                backgroundColor: tint(layerVars.contrast, 12),
            },
            ...ITEM_STATES,
        },
    },
});

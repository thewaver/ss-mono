import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const plasma = style({});

const PILL_RADIUS = "9999px";
const BOX_RADIUS = `calc(${themeVars.borderRadius.full} * 2)`;

const tint = (color: string, alpha: number) => `rgb(from ${color} r g b / ${alpha}%)`;

const RIM = `2px solid ${tint(layerVars.contrast, 25)}`;
const RIM_STRONG = `2px solid ${tint(layerVars.contrast, 50)}`;
const PRIMARY_RIM = `2px solid ${themeVars.color.primary.dark}`;

const STICKER = {
    border: PRIMARY_RIM,
    backgroundColor: themeVars.color.primary.light,
    color: themeVars.color.primary.contrast,
} as const;

const ERROR_STICKER = {
    borderColor: themeVars.color.error.dark,
    backgroundColor: themeVars.color.error.light,
    color: themeVars.color.error.contrast,
} as const;

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
    border: RIM,
    backgroundColor: layerVars.main,
} as const;

const BOX_STATES = {
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
    },
    [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
        borderColor: themeVars.color.primary.main,
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

LookUtils.define(plasma, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        backgroundColor: themeVars.color.surface.light,
        color: themeVars.color.surface.contrast,
        border: RIM,
    },
    surface: {
        borderRadius: BOX_RADIUS,
        backgroundColor: themeVars.color.surface.light,
        color: themeVars.color.surface.contrast,
        border: RIM,
    },
    panel: {
        borderRadius: BOX_RADIUS,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        border: `2px solid ${tint(layerVars.contrast, 15)}`,
    },
    tooltip: {
        borderRadius: BOX_RADIUS,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        border: `2px solid ${themeVars.color.primary.main}`,
    },
    accordionHeader: {
        ...BOX,
        borderRadius: BOX_RADIUS,
        border: `2px solid ${tint(layerVars.contrast, 15)}`,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                border: RIM_STRONG,
            },
            [lookSelectors.isExpanded]: {
                borderColor: themeVars.color.primary.main,
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
        backdropFilter: "blur(8px)",
    },
    button: {
        ...STICKER,
        borderRadius: PILL_RADIUS,
        paddingInline: themeVars.spacing.double,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isPressed]: {
                borderColor: themeVars.color.primary.light,
                backgroundColor: themeVars.color.primary.dark,
            },
            [lookSelectors.hasError]: ERROR_STICKER,
            ...PRESS_STATES,
        },
    },
    buttonSimple: {
        ...BOX,
        borderRadius: PILL_RADIUS,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: {
                border: RIM_STRONG,
            },
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isSelected]: {
                borderColor: themeVars.color.primary.main,
                color: themeVars.color.primary.main,
            },
            [lookSelectors.isDisabled]: {
                filter: themeVars.disabled.filter,
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
                backgroundColor: tint(layerVars.contrast, 10),
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
        borderRadius: PILL_RADIUS,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                border: RIM_STRONG,
            },
            [lookSelectors.isReadOnly]: {
                borderStyle: "dashed",
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
        ...BOX,
        borderRadius: BOX_RADIUS,
        color: layerVars.contrast,
    },
    checkboxBox: {
        ...BOX,
        borderRadius: themeVars.borderRadius.full,
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
        backgroundColor: themeVars.color.primary.main,
    },
    toggleTrack: {
        ...BOX,
        borderRadius: PILL_RADIUS,
        selectors: BOX_STATES,
    },
    toggleHandle: {
        borderRadius: "50%",
        backgroundColor: tint(layerVars.contrast, 75),
        selectors: {
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: themeVars.color.primary.main,
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
        selectors: {
            [lookSelectors.withinError]: {
                backgroundColor: themeVars.color.error.light,
            },
        },
    },
    rangeTrack: {
        backgroundColor: tint(layerVars.contrast, 25),
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
        ...STICKER,
        borderRadius: "50%",
        selectors: {
            [lookSelectors.hasError]: ERROR_STICKER,
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
                backgroundColor: themeVars.color.primary.main,
            },
            [lookSelectors.lineActive]: {
                backgroundColor: themeVars.color.primary.light,
            },
        },
    },
    tag: {
        ...STICKER,
        borderRadius: PILL_RADIUS,
        paddingInline: themeVars.spacing.full,
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
        borderRadius: PILL_RADIUS,
        backgroundColor: tint(layerVars.contrast, 15),
    },
    selectionFloater: {
        borderRadius: PILL_RADIUS,
        backgroundColor: tint(themeVars.color.primary.main, 15),
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
            },
            ...ITEM_STATES,
        },
    },
});

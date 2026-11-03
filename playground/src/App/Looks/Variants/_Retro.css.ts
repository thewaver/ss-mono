import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const _retro = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const lighten = (color: string, amount: number) => `hsl(from ${color} h s clamp(0, l + ${amount}, 100))`;

const HARD_SHADOW = "2px 2px 0 black";
const HARD_SHADOW_LARGE = "4px 4px 0 black";
const SUNKEN = `inset 2px 2px 0 ${withAlpha("black", 75)}, inset -2px -2px 0 ${withAlpha("white", 25)}`;

const accent = (family: Family) => ({
    backgroundColor: family.main,
    backgroundImage: "none",
    color: family.contrast,
    boxShadow: HARD_SHADOW,
});

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const PRESSED = {
    backgroundColor: lighten(themeVars.color.primary.main, -15),
    boxShadow: SUNKEN,
} as const;

const FIELD = {
    border: "2px solid black",
    borderRadius: 0,
    backgroundColor: lighten(layerVars.main, -5),
    boxShadow: HARD_SHADOW,
} as const;

const FIELD_STATES = {
    [lookSelectors.isHovered]: {
        backgroundColor: lighten(layerVars.main, -10),
    },
    [lookSelectors.isDisabled]: DISABLED,
} as const;

const SWITCH_BOX_STATES = {
    [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
        backgroundColor: themeVars.color.primary.main,
    },
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        backgroundColor: themeVars.color.primary.main,
        color: themeVars.color.primary.contrast,
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        ...DISABLED,
    },
} as const;

const PANEL = {
    border: "2px solid black",
    borderRadius: 0,
    backgroundColor: lighten(layerVars.main, -5),
    color: layerVars.contrast,
} as const;

const SURFACE = {
    border: "2px solid black",
    borderRadius: 0,
    backgroundColor: themeVars.color.surface.light,
    color: themeVars.color.surface.contrast,
    boxShadow: HARD_SHADOW_LARGE,
} as const;

LookUtils.define(_retro, {
    pageBackground: {
        backgroundColor: themeVars.color.background.light,
        backgroundImage: `radial-gradient(${withAlpha(themeVars.color.background.contrast, 10)} 1px, transparent 1px)`,
        backgroundSize: "8px 8px",
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        boxShadow: "8px 0 0 black",
    },
    surface: SURFACE,
    hollowSurface: LookUtils.hollow(SURFACE),
    panel: PANEL,
    tooltip: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: themeVars.color.secondary.main,
        color: themeVars.color.secondary.contrast,
        boxShadow: HARD_SHADOW,
    },
    accordionHeader: {
        ...PANEL,
        backgroundColor: themeVars.color.surface.light,
        boxShadow: HARD_SHADOW,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: lighten(themeVars.color.surface.light, 10),
            },
            [lookSelectors.isExpanded]: {
                backgroundColor: themeVars.color.primary.main,
                color: themeVars.color.primary.contrast,
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: PANEL,
    opaqueOverlay: {
        backgroundColor: "black",
    },
    blurredOverlay: {
        backgroundColor: withAlpha("black", 50),
        backgroundImage: `repeating-linear-gradient(0deg, ${withAlpha("black", 25)} 0 2px, transparent 2px 4px)`,
    },
    button: {
        border: "2px solid black",
        borderRadius: 0,
        paddingInline: themeVars.spacing.double,
        ...accent(themeVars.color.primary),
        fontWeight: "bold",
        textTransform: "uppercase",
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: lighten(themeVars.color.primary.main, 10),
            },
            [lookSelectors.isActive]: PRESSED,
            [lookSelectors.isPressed]: PRESSED,
            [lookSelectors.hasError]: accent(themeVars.color.error),
            [LookUtils.allOf(lookSelectors.hasError, lookSelectors.isHovered)]: {
                backgroundColor: lighten(themeVars.color.error.main, 10),
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: themeVars.color.surface.light,
        color: themeVars.color.surface.contrast,
        boxShadow: HARD_SHADOW,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: lighten(themeVars.color.surface.light, 10),
            },
            [lookSelectors.isActive]: {
                boxShadow: SUNKEN,
            },
            [lookSelectors.isSelected]: {
                backgroundColor: themeVars.color.primary.main,
                color: themeVars.color.primary.contrast,
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    decoration: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: withAlpha(layerVars.contrast, 75),
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: themeVars.color.primary.contrast,
                backgroundColor: themeVars.color.primary.main,
            },
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    input: {
        ...FIELD,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            ...FIELD_STATES,
            [lookSelectors.isReadOnly]: {
                borderStyle: "dashed",
                boxShadow: "none",
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
            [lookSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: themeVars.color.primary.main,
                fontSize: themeVars.fontSize.medium,
            },
            [lookSelectors.fieldTextDisabled]: {
                color: withAlpha(layerVars.contrast, 50),
            },
        },
    },
    dropdown: {
        ...SURFACE,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
    },
    checkboxBox: {
        ...FIELD,
        selectors: SWITCH_BOX_STATES,
    },
    checkboxMark: {
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
    },
    radioBox: {
        ...FIELD,
        borderRadius: "50%",
        selectors: SWITCH_BOX_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.contrast,
    },
    toggleTrack: {
        ...FIELD,
        selectors: SWITCH_BOX_STATES,
    },
    toggleHandle: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: themeVars.color.surface.light,
    },
    progressTrack: {
        ...FIELD,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: `repeating-linear-gradient(90deg, transparent 0 8px, ${withAlpha("black", 50)} 8px 10px)`,
        selectors: {
            [lookSelectors.withinError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    rangeTrack: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: lighten(layerVars.main, -5),
    },
    rangeFill: {
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.main,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    rangeThumb: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: themeVars.color.surface.light,
        boxShadow: HARD_SHADOW,
        selectors: {
            [lookSelectors.isStart]: {
                backgroundColor: themeVars.color.secondary.main,
            },
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonTrack: {
        ...FIELD,
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.main,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonHint: {
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    slideButtonThumb: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: themeVars.color.surface.light,
        boxShadow: HARD_SHADOW,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonArrow: {
        stroke: themeVars.color.surface.contrast,
        selectors: {
            [lookSelectors.hasError]: {
                stroke: themeVars.color.error.contrast,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: withAlpha(layerVars.contrast, 25),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: HARD_SHADOW,
            },
            [lookSelectors.lineActive]: {
                filter: themeVars.active.filter,
            },
        },
    },
    tag: {
        border: "2px solid black",
        borderRadius: 0,
        paddingInline: themeVars.spacing.full,
        ...accent(themeVars.color.secondary),
        fontSize: themeVars.fontSize.xSmall,
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: lighten(themeVars.color.secondary.main, 10),
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: 0,
        backgroundColor: withAlpha(layerVars.contrast, 15),
    },
    selectionFloater: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.main,
        boxShadow: HARD_SHADOW,
    },
    itemWithFloater: {
        borderRadius: 0,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isSelected]: {
                color: themeVars.color.primary.contrast,
                fontWeight: "bold",
            },
            [lookSelectors.isDisabled]: ITEM_STATES[lookSelectors.isDisabled],
        },
    },
    itemWithoutFloater: {
        borderRadius: 0,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: withAlpha(layerVars.contrast, 15),
            },
            ...ITEM_STATES,
        },
    },
});

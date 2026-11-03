import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors, lookVars } from "../Look.css";

export const _acrylic = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const lighten = (color: string, amount: number) => `hsl(from ${color} h s clamp(0, l + ${amount}, 100))`;

const MIX_INV = `rgb(from ${layerVars.contrast} calc(255 - r) calc(255 - g) calc(255 - b))`;
const SHADOW_COLOR = `hsl(from ${themeVars.color.background.dark} h s max(l - 25, 0))`;
const FROST = "blur(16px) saturate(150%)";

const accent = (family: Family) => ({
    backgroundColor: family.main,
    backgroundImage: "none",
    color: family.contrast,
    boxShadow: `0 2px 10px ${withAlpha(family.main, 25)}`,
});

const accentHover = (family: Family) => ({
    backgroundColor: lighten(family.main, 10),
    boxShadow: `0 2px 10px ${withAlpha(lighten(family.main, 10), 25)}`,
});

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const FIELD = {
    border: "none",
    borderBottom: `2px solid ${withAlpha(layerVars.contrast, 50)}`,
    borderRadius: 0,
    backgroundColor: "transparent",
    backgroundImage: `linear-gradient(${withAlpha(MIX_INV, 20)} 25%, ${withAlpha(MIX_INV, 30)})`,
    boxShadow: `0 2px 10px ${withAlpha(SHADOW_COLOR, 50)}`,
    backdropFilter: FROST,
} as const;

const FIELD_HOVER = {
    borderBottomColor: withAlpha(layerVars.contrast, 75),
    backgroundImage: `linear-gradient(${withAlpha(MIX_INV, 40)} 25%, ${withAlpha(MIX_INV, 50)})`,
} as const;

const SWITCH_BOX_STATES = {
    [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
        ...accent(themeVars.color.primary),
        borderBottomColor: themeVars.color.primary.main,
    },
    [lookSelectors.withinError]: {
        borderBottomColor: themeVars.color.error.main,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        color: themeVars.color.primary.main,
        fontWeight: "bold",
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        ...DISABLED,
    },
} as const;

const PANE = {
    borderRadius: 0,
    backgroundColor: withAlpha(layerVars.main, 50),
    color: layerVars.contrast,
    backdropFilter: FROST,
} as const;

const SURFACE = {
    borderRadius: 0,
    border: `1px solid ${withAlpha(themeVars.color.surface.contrast, 10)}`,
    backgroundColor: withAlpha(themeVars.color.surface.dark, 60),
    color: themeVars.color.surface.contrast,
    boxShadow: `0 4px 16px ${withAlpha(SHADOW_COLOR, 50)}`,
    backdropFilter: FROST,
} as const;

LookUtils.define(_acrylic, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: `radial-gradient(circle at 20% 10%, ${withAlpha(themeVars.color.primary.main, 25)}, transparent 40%), radial-gradient(circle at 80% 70%, ${withAlpha(themeVars.color.secondary.main, 20)}, transparent 40%), linear-gradient(315deg, ${themeVars.color.background.dark}, ${themeVars.color.background.light})`,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        boxShadow: `0 8px 32px ${withAlpha(SHADOW_COLOR, 75)}`,
    },
    surface: SURFACE,
    hollowSurface: LookUtils.hollow(SURFACE),
    panel: PANE,
    tooltip: {
        ...PANE,
        border: `1px solid ${withAlpha(layerVars.contrast, 10)}`,
        boxShadow: `0 2px 10px ${withAlpha(SHADOW_COLOR, 50)}`,
    },
    accordionHeader: {
        ...PANE,
        borderBottom: `2px solid ${withAlpha(layerVars.contrast, 25)}`,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                borderBottomColor: withAlpha(layerVars.contrast, 75),
                backgroundColor: withAlpha(layerVars.main, 75),
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: PANE,
    opaqueOverlay: {
        backgroundColor: "black",
    },
    blurredOverlay: {
        backdropFilter: "blur(20px) saturate(120%)",
        backgroundColor: withAlpha(MIX_INV, 25),
    },
    button: {
        borderRadius: 0,
        paddingInline: themeVars.spacing.quad,
        ...accent(themeVars.color.primary),
        selectors: {
            [lookSelectors.isHovered]: accentHover(themeVars.color.primary),
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isPressed]: {
                ...accent(themeVars.color.secondary),
                boxShadow: `inset 0 2px 6px ${withAlpha(SHADOW_COLOR, 75)}`,
            },
            [lookSelectors.hasError]: accent(themeVars.color.error),
            [LookUtils.allOf(lookSelectors.hasError, lookSelectors.isHovered)]: accentHover(themeVars.color.error),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        borderRadius: 0,
        backgroundColor: withAlpha(layerVars.contrast, 10),
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        backdropFilter: FROST,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: withAlpha(layerVars.contrast, 20),
            },
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isSelected]: {
                color: themeVars.color.primary.main,
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
                color: layerVars.contrast,
                backgroundColor: withAlpha(layerVars.contrast, 10),
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
            [lookSelectors.isHovered]: FIELD_HOVER,
            [lookSelectors.isReadOnly]: {
                borderBottomStyle: "dotted",
            },
            [lookSelectors.hasError]: {
                borderBottomColor: themeVars.color.error.main,
            },
            [lookSelectors.isDisabled]: DISABLED,
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
        backgroundColor: withAlpha(layerVars.main, 75),
        color: layerVars.contrast,
    },
    checkboxBox: {
        ...FIELD,
        selectors: SWITCH_BOX_STATES,
    },
    checkboxMark: {
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.medium,
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
        borderRadius: 0,
        backgroundColor: withAlpha(layerVars.contrast, 75),
        selectors: {
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: themeVars.color.primary.contrast,
            },
        },
    },
    progressTrack: {
        ...FIELD,
        selectors: {
            [lookSelectors.hasError]: {
                borderBottomColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.main,
        boxShadow: `0 0 10px ${withAlpha(themeVars.color.primary.main, 50)}`,
        selectors: {
            [lookSelectors.withinError]: {
                backgroundColor: themeVars.color.error.main,
                boxShadow: `0 0 10px ${withAlpha(themeVars.color.error.main, 50)}`,
            },
        },
    },
    rangeTrack: {
        borderRadius: 0,
        backgroundColor: withAlpha(layerVars.contrast, 25),
        backdropFilter: FROST,
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
        border: `2px solid ${themeVars.color.primary.main}`,
        borderRadius: 0,
        backgroundColor: layerVars.contrast,
        selectors: {
            [lookSelectors.isStart]: {
                borderColor: themeVars.color.secondary.main,
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonTrack: {
        ...FIELD,
    },
    slideButtonFill: {
        backgroundColor: withAlpha(themeVars.color.primary.main, 50),
        backgroundImage: `linear-gradient(${lookVars.barAngle}, transparent, ${withAlpha(themeVars.color.primary.main, 75)})`,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: withAlpha(themeVars.color.error.main, 50),
                backgroundImage: `linear-gradient(${lookVars.barAngle}, transparent, ${withAlpha(themeVars.color.error.main, 75)})`,
            },
        },
    },
    slideButtonHint: {
        fontWeight: "bold",
    },
    slideButtonThumb: {
        borderRadius: 0,
        ...accent(themeVars.color.primary),
        selectors: {
            [lookSelectors.hasError]: accent(themeVars.color.error),
        },
    },
    slideButtonArrow: {
        stroke: themeVars.color.primary.contrast,
        selectors: {
            [lookSelectors.hasError]: {
                stroke: themeVars.color.error.contrast,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: withAlpha(layerVars.contrast, 10),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
            },
            [lookSelectors.lineActive]: {
                filter: themeVars.active.filter,
            },
        },
    },
    tag: {
        borderRadius: 0,
        paddingInline: themeVars.spacing.full,
        ...accent(themeVars.color.secondary),
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: accentHover(themeVars.color.secondary),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: 0,
        backgroundColor: withAlpha(layerVars.contrast, 15),
    },
    selectionFloater: {
        borderRadius: 0,
        backgroundColor: withAlpha(themeVars.color.primary.main, 15),
        boxShadow: `inset 0 -2px 0 ${themeVars.color.primary.main}`,
    },
    itemWithFloater: {
        borderRadius: 0,
        fontSize: themeVars.fontSize.medium,
        selectors: ITEM_STATES,
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

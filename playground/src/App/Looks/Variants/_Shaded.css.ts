import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors, lookVars } from "../Look.css";

export const _shaded = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const lighten = (color: string, amount: number) => `hsl(from ${color} h s clamp(0, l + ${amount}, 100))`;
const spin = (color: string, degrees: number) => `hsl(from ${color} calc(h + ${degrees}) s l)`;

const SPIN = 15;
const MIX_INV = `rgb(from ${layerVars.contrast} calc(255 - r) calc(255 - g) calc(255 - b))`;
const SHADOW_COLOR = `hsl(from ${themeVars.color.background.dark} h s max(l - 25, 0))`;
const SHADOW = `0 2px 15px ${withAlpha(SHADOW_COLOR, 50)}`;

const shade = (from: string, to: string, angle = "180deg") => `linear-gradient(${angle}, ${from}, ${to})`;

const glow = (color: string) => `0 2px 15px ${withAlpha(color, 50)}`;

const accent = (family: Family) => ({
    backgroundColor: family.main,
    backgroundImage: shade(family.main, spin(family.main, SPIN)),
    color: family.contrast,
    boxShadow: glow(family.main),
});

const accentHover = (family: Family) => ({
    backgroundImage: shade(lighten(family.main, 10), lighten(spin(family.main, SPIN), 10)),
    boxShadow: glow(lighten(family.main, 10)),
});

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const FIELD = {
    border: `1px solid ${withAlpha(MIX_INV, 60)}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: "transparent",
    backgroundImage: shade(withAlpha(MIX_INV, 60), withAlpha(MIX_INV, 40)),
    boxShadow: SHADOW,
} as const;

const FIELD_HOVER = {
    borderColor: withAlpha(MIX_INV, 80),
    backgroundImage: shade(withAlpha(MIX_INV, 80), withAlpha(MIX_INV, 60)),
} as const;

const SWITCH_BOX_STATES = {
    [lookSelectors.isHovered]: FIELD_HOVER,
    [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: accent(themeVars.color.primary),
    [lookSelectors.withinError]: {
        borderColor: themeVars.color.error.main,
        boxShadow: glow(themeVars.color.error.main),
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

const PANEL = {
    borderRadius: themeVars.borderRadius.half,
    backgroundImage: shade(withAlpha(MIX_INV, 40), withAlpha(MIX_INV, 20)),
    color: layerVars.contrast,
    boxShadow: SHADOW,
} as const;

const SURFACE = {
    border: `1px solid ${withAlpha(themeVars.color.surface.contrast, 10)}`,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.surface.dark,
    backgroundImage: shade(themeVars.color.surface.light, themeVars.color.surface.dark),
    color: themeVars.color.surface.contrast,
    boxShadow: `0 4px 24px ${withAlpha(SHADOW_COLOR, 75)}`,
} as const;

LookUtils.define(_shaded, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: shade(themeVars.color.background.light, themeVars.color.background.dark),
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        borderRadius: 0,
        boxShadow: `0 8px 32px ${withAlpha(SHADOW_COLOR, 75)}`,
    },
    surface: SURFACE,
    hollowSurface: LookUtils.hollow(SURFACE),
    panel: PANEL,
    tooltip: {
        ...FIELD,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
    },
    accordionHeader: {
        ...FIELD,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: FIELD_HOVER,
            [lookSelectors.isExpanded]: {
                borderColor: withAlpha(themeVars.color.primary.main, 50),
                boxShadow: glow(themeVars.color.primary.main),
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: PANEL,
    opaqueOverlay: {
        backgroundColor: "black",
    },
    blurredOverlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
    },
    button: {
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.quad,
        ...accent(themeVars.color.primary),
        selectors: {
            [lookSelectors.isHovered]: accentHover(themeVars.color.primary),
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isPressed]: {
                ...accent(themeVars.color.secondary),
                backgroundImage: shade(spin(themeVars.color.secondary.main, SPIN), themeVars.color.secondary.main),
            },
            [lookSelectors.hasError]: accent(themeVars.color.error),
            [LookUtils.allOf(lookSelectors.hasError, lookSelectors.isHovered)]: accentHover(themeVars.color.error),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        ...FIELD,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: FIELD_HOVER,
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isSelected]: {
                color: themeVars.color.primary.main,
                boxShadow: glow(themeVars.color.primary.main),
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    decoration: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        color: withAlpha(layerVars.contrast, 75),
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: layerVars.contrast,
                backgroundImage: shade(withAlpha(layerVars.contrast, 15), withAlpha(layerVars.contrast, 5)),
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
                backgroundImage: "none",
                boxShadow: "none",
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
                boxShadow: glow(themeVars.color.error.main),
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
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: layerVars.main,
        backgroundImage: "none",
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
        borderRadius: themeVars.borderRadius.full,
        selectors: SWITCH_BOX_STATES,
    },
    toggleHandle: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: shade(layerVars.contrast, withAlpha(layerVars.contrast, 60)),
        selectors: {
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundImage: shade(
                    themeVars.color.primary.contrast,
                    withAlpha(themeVars.color.primary.contrast, 75),
                ),
            },
        },
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
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: shade(
            themeVars.color.primary.main,
            spin(themeVars.color.primary.main, SPIN),
            lookVars.barAngle,
        ),
        boxShadow: glow(themeVars.color.primary.main),
        selectors: {
            [lookSelectors.withinError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: shade(
                    themeVars.color.error.main,
                    spin(themeVars.color.error.main, SPIN),
                    lookVars.barAngle,
                ),
                boxShadow: glow(themeVars.color.error.main),
            },
        },
    },
    rangeTrack: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: shade(withAlpha(MIX_INV, 60), withAlpha(MIX_INV, 40)),
        boxShadow: `inset 0 1px 4px ${withAlpha(SHADOW_COLOR, 75)}`,
    },
    rangeFill: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: shade(
            themeVars.color.primary.main,
            spin(themeVars.color.primary.main, SPIN),
            lookVars.barAngle,
        ),
        boxShadow: glow(themeVars.color.primary.main),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: shade(
                    themeVars.color.error.main,
                    spin(themeVars.color.error.main, SPIN),
                    lookVars.barAngle,
                ),
                boxShadow: glow(themeVars.color.error.main),
            },
        },
    },
    rangeThumb: {
        border: `2px solid ${themeVars.color.primary.main}`,
        borderRadius: themeVars.borderRadius.half,
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
        borderRadius: themeVars.borderRadius.full,
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: shade(
            themeVars.color.primary.main,
            spin(themeVars.color.primary.main, SPIN),
            lookVars.barAngle,
        ),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: shade(
                    themeVars.color.error.main,
                    spin(themeVars.color.error.main, SPIN),
                    lookVars.barAngle,
                ),
            },
        },
    },
    slideButtonHint: {
        fontWeight: "bold",
    },
    slideButtonThumb: {
        borderRadius: themeVars.borderRadius.full,
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
                backgroundColor: withAlpha(layerVars.contrast, 15),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: glow(themeVars.color.primary.main),
            },
            [lookSelectors.lineActive]: {
                filter: themeVars.active.filter,
            },
        },
    },
    tag: {
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.full,
        ...accent(themeVars.color.secondary),
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: accentHover(themeVars.color.secondary),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: shade(withAlpha(layerVars.contrast, 20), withAlpha(layerVars.contrast, 10)),
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: shade(
            withAlpha(themeVars.color.primary.main, 25),
            withAlpha(themeVars.color.primary.main, 10),
        ),
        boxShadow: glow(themeVars.color.primary.main),
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
                backgroundImage: shade(withAlpha(layerVars.contrast, 20), withAlpha(layerVars.contrast, 10)),
            },
            ...ITEM_STATES,
        },
    },
});

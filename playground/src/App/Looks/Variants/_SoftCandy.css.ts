import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors, lookVars } from "../Look.css";

export const _softCandy = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const lighten = (color: string, amount: number) => `hsl(from ${color} h s clamp(0, l + ${amount}, 100))`;
const spin = (color: string, degrees: number) => `hsl(from ${color} calc(h + ${degrees}) s l)`;
const tint = (color: string, toward: string, percent: number) => `color-mix(in srgb, ${color}, ${toward} ${percent}%)`;

const SPIN = 45;
const MIX = layerVars.contrast;
const SHADOW_COLOR = `hsl(from ${themeVars.color.background.dark} h s max(l - 25, 0))`;
const SHADOW = `0 2px 5px ${withAlpha(SHADOW_COLOR, 50)}`;

const candy = (color: string, angle = "45deg") => `linear-gradient(${angle}, ${color}, ${spin(color, SPIN)})`;

const edge = (color: string) => `linear-gradient(45deg, ${spin(color, -SPIN)}, ${color}) 2`;

const wash = (color: string, shift: number) =>
    `linear-gradient(45deg, ${withAlpha(spin(lighten(color, shift), -SPIN), 25)}, ${withAlpha(lighten(color, shift), 25)})`;

const sweet = (family: Family) => ({
    backgroundColor: family.main,
    backgroundImage: candy(family.main),
    color: family.contrast,
    boxShadow: SHADOW,
});

const sweetHover = (family: Family) => ({
    backgroundImage: candy(lighten(family.main, 10)),
});

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const FIELD = {
    border: "2px solid",
    borderImage: edge(themeVars.color.primary.main),
    borderRadius: 0,
    backgroundColor: "transparent",
    backgroundImage: wash(themeVars.color.primary.main, -20),
    boxShadow: SHADOW,
} as const;

const FIELD_HOVER = {
    borderImage: edge(tint(themeVars.color.primary.main, MIX, 25)),
    backgroundImage: wash(themeVars.color.primary.main, 0),
} as const;

const FIELD_ERROR = {
    borderImage: edge(themeVars.color.error.main),
} as const;

const SWITCH_BOX_STATES = {
    [lookSelectors.isHovered]: FIELD_HOVER,
    [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
        ...sweet(themeVars.color.primary),
        borderImage: edge(themeVars.color.primary.main),
    },
    [lookSelectors.withinError]: FIELD_ERROR,
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        color: tint(themeVars.color.primary.main, MIX, 25),
        fontWeight: "bold",
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        ...DISABLED,
    },
} as const;

const PANEL = {
    borderRadius: themeVars.borderRadius.half,
    backgroundImage: wash(themeVars.color.primary.main, -20),
    color: layerVars.contrast,
} as const;

const SURFACE = {
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.surface.dark,
    backgroundImage: `linear-gradient(45deg, ${withAlpha(spin(themeVars.color.primary.main, -SPIN), 10)}, ${withAlpha(themeVars.color.primary.main, 10)}), linear-gradient(${themeVars.color.surface.dark}, ${themeVars.color.surface.dark})`,
    color: themeVars.color.surface.contrast,
    boxShadow: `0 4px 12px ${withAlpha(SHADOW_COLOR, 50)}`,
} as const;

LookUtils.define(_softCandy, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: `linear-gradient(45deg, ${withAlpha(spin(themeVars.color.primary.dark, -SPIN), 6)}, ${withAlpha(spin(themeVars.color.primary.dark, SPIN), 6)}), linear-gradient(${themeVars.color.background.dark}, ${themeVars.color.background.light})`,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        borderRadius: 0,
    },
    surface: SURFACE,
    hollowSurface: {
        borderRadius: themeVars.borderRadius.full,
        boxShadow: `0 4px 12px ${withAlpha(SHADOW_COLOR, 50)}, inset 0 0 0 2px ${withAlpha(themeVars.color.primary.main, 25)}`,
    },
    panel: PANEL,
    tooltip: {
        ...sweet(themeVars.color.secondary),
        borderRadius: themeVars.borderRadius.half,
    },
    accordionHeader: {
        ...PANEL,
        boxShadow: SHADOW,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundImage: wash(themeVars.color.primary.main, 0),
            },
            [lookSelectors.isExpanded]: sweet(themeVars.color.primary),
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
        ...sweet(themeVars.color.primary),
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isHovered]: sweetHover(themeVars.color.primary),
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isPressed]: {
                ...sweet(themeVars.color.primary),
                backgroundImage: candy(themeVars.color.primary.main, "225deg"),
                boxShadow: `inset 0 2px 5px ${withAlpha(SHADOW_COLOR, 75)}`,
            },
            [lookSelectors.hasError]: sweet(themeVars.color.error),
            [LookUtils.allOf(lookSelectors.hasError, lookSelectors.isHovered)]: sweetHover(themeVars.color.error),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: wash(themeVars.color.primary.main, -20),
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundImage: wash(themeVars.color.primary.main, 0),
            },
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isSelected]: sweet(themeVars.color.primary),
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
                backgroundImage: wash(themeVars.color.primary.main, 0),
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
                borderImage: edge(withAlpha(MIX, 25)),
                backgroundImage: "none",
            },
            [lookSelectors.hasError]: FIELD_ERROR,
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
        border: `2px solid ${spin(themeVars.color.primary.main, -SPIN)}`,
        borderRadius: "50%",
        backgroundImage: wash(themeVars.color.primary.main, -20),
        boxShadow: SHADOW,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundImage: wash(themeVars.color.primary.main, 0),
            },
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: sweet(themeVars.color.primary),
            [lookSelectors.withinError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.contrast,
    },
    toggleTrack: {
        border: `2px solid ${spin(themeVars.color.primary.main, -SPIN)}`,
        borderRadius: themeVars.borderRadius.full,
        backgroundImage: wash(themeVars.color.primary.main, -20),
        boxShadow: SHADOW,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundImage: wash(themeVars.color.primary.main, 0),
            },
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: sweet(themeVars.color.primary),
            [lookSelectors.withinError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    toggleHandle: {
        borderRadius: "50%",
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
            [lookSelectors.hasError]: FIELD_ERROR,
        },
    },
    progressFill: {
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: candy(themeVars.color.primary.main, lookVars.barAngle),
        selectors: {
            [lookSelectors.withinError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: candy(themeVars.color.error.main, lookVars.barAngle),
            },
        },
    },
    rangeTrack: {
        borderRadius: themeVars.borderRadius.full,
        backgroundImage: wash(themeVars.color.primary.main, 0),
    },
    rangeFill: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: candy(themeVars.color.primary.main, lookVars.barAngle),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: candy(themeVars.color.error.main, lookVars.barAngle),
            },
        },
    },
    rangeThumb: {
        borderRadius: "50%",
        border: `2px solid ${themeVars.color.primary.contrast}`,
        ...sweet(themeVars.color.primary),
        selectors: {
            [lookSelectors.isStart]: sweet(themeVars.color.secondary),
            [lookSelectors.hasError]: sweet(themeVars.color.error),
        },
    },
    slideButtonTrack: {
        borderRadius: themeVars.borderRadius.full,
        backgroundImage: wash(themeVars.color.primary.main, -20),
        boxShadow: SHADOW,
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: candy(themeVars.color.primary.main, lookVars.barAngle),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: candy(themeVars.color.error.main, lookVars.barAngle),
            },
        },
    },
    slideButtonHint: {
        fontWeight: "bold",
    },
    slideButtonThumb: {
        borderRadius: "50%",
        ...sweet(themeVars.color.primary),
        selectors: {
            [lookSelectors.hasError]: sweet(themeVars.color.error),
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
                backgroundImage: wash(themeVars.color.primary.main, 0),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                backgroundImage: candy(themeVars.color.primary.main),
            },
            [lookSelectors.lineActive]: {
                filter: themeVars.active.filter,
            },
        },
    },
    tag: {
        borderRadius: themeVars.borderRadius.full,
        paddingInline: themeVars.spacing.full,
        ...sweet(themeVars.color.secondary),
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: sweetHover(themeVars.color.secondary),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: wash(themeVars.color.primary.main, 0),
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: `linear-gradient(45deg, ${withAlpha(themeVars.color.primary.main, 35)}, ${withAlpha(spin(themeVars.color.primary.main, SPIN), 35)})`,
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
                backgroundImage: wash(themeVars.color.primary.main, 0),
            },
            ...ITEM_STATES,
        },
    },
});

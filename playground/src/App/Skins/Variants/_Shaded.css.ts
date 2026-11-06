import { style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

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
    [skinSelectors.isHovered]: FIELD_HOVER,
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: accent(themeVars.color.primary),
    [skinSelectors.hasErrorWithin]: {
        borderColor: themeVars.color.error.main,
        boxShadow: glow(themeVars.color.error.main),
    },
} as const;

const ITEM_STATES = {
    [skinSelectors.isSelected]: {
        color: themeVars.color.primary.main,
        fontWeight: "bold",
    },
    [skinSelectors.isDisabled]: {
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

SkinUtils.define(_shaded, {
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
    hollowSurface: SkinUtils.hollow(SURFACE),
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
            [skinSelectors.isHovered]: FIELD_HOVER,
            [skinSelectors.isExpanded]: {
                borderColor: withAlpha(themeVars.color.primary.main, 50),
                boxShadow: glow(themeVars.color.primary.main),
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: PANEL,
    overlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
    },
    button: {
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.quad,
        ...accent(themeVars.color.primary),
        selectors: {
            [skinSelectors.isHovered]: accentHover(themeVars.color.primary),
            [skinSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [skinSelectors.isPressed]: {
                ...accent(themeVars.color.secondary),
                backgroundImage: shade(spin(themeVars.color.secondary.main, SPIN), themeVars.color.secondary.main),
            },
            [skinSelectors.hasError]: accent(themeVars.color.error),
            [SkinUtils.allOf(skinSelectors.hasError, skinSelectors.isHovered)]: accentHover(themeVars.color.error),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        ...FIELD,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [skinSelectors.isHovered]: FIELD_HOVER,
            [skinSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [skinSelectors.isSelected]: {
                color: themeVars.color.primary.main,
                boxShadow: glow(themeVars.color.primary.main),
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    decoration: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        color: withAlpha(layerVars.contrast, 75),
        selectors: {
            [skinSelectors.isHovered]: {
                color: layerVars.contrast,
                backgroundImage: shade(withAlpha(layerVars.contrast, 15), withAlpha(layerVars.contrast, 5)),
            },
            [skinSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    input: {
        ...FIELD,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [skinSelectors.isHovered]: FIELD_HOVER,
            [skinSelectors.isReadOnly]: {
                backgroundImage: "none",
                boxShadow: "none",
            },
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
                boxShadow: glow(themeVars.color.error.main),
            },
            [skinSelectors.isDisabled]: DISABLED,
            [skinSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: themeVars.color.primary.main,
                fontSize: themeVars.fontSize.medium,
            },
            [skinSelectors.fieldTextDisabled]: {
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
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
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
            [skinSelectors.hasError]: {
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
            skinVars.barAngle,
        ),
        boxShadow: glow(themeVars.color.primary.main),
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: shade(
                    themeVars.color.error.main,
                    spin(themeVars.color.error.main, SPIN),
                    skinVars.barAngle,
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
            skinVars.barAngle,
        ),
        boxShadow: glow(themeVars.color.primary.main),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: shade(
                    themeVars.color.error.main,
                    spin(themeVars.color.error.main, SPIN),
                    skinVars.barAngle,
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
            [skinSelectors.isStart]: {
                borderColor: themeVars.color.secondary.main,
            },
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonTrack: {
        ...FIELD,
        borderRadius: themeVars.borderRadius.full,
        fontWeight: "bold",
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: shade(
            themeVars.color.primary.main,
            spin(themeVars.color.primary.main, SPIN),
            skinVars.barAngle,
        ),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: shade(
                    themeVars.color.error.main,
                    spin(themeVars.color.error.main, SPIN),
                    skinVars.barAngle,
                ),
            },
        },
    },
    slideButtonThumb: {
        borderRadius: themeVars.borderRadius.full,
        ...accent(themeVars.color.primary),
        color: themeVars.color.primary.contrast,
        selectors: {
            [skinSelectors.hasError]: {
                ...accent(themeVars.color.error),
                color: themeVars.color.error.contrast,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: withAlpha(layerVars.contrast, 15),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: glow(themeVars.color.primary.main),
            },
            [skinSelectors.lineActive]: {
                filter: themeVars.active.filter,
            },
        },
    },
    tabsFloater: {
        borderBlockEnd: `2px solid ${themeVars.color.primary.main}`,
        selectors: {
            [skinSelectors.isVertical]: {
                borderBlockEnd: "none",
                backgroundImage: `linear-gradient(to right, ${themeVars.color.primary.main} 3px, rgb(from ${layerVars.contrast} r g b / 10%) 3px, transparent)`,
            },
        },
    },
    tabsGutter: {
        borderBlockEnd: `2px solid rgb(from ${layerVars.contrast} r g b / 10%)`,
        selectors: {
            [skinSelectors.isVertical]: {
                borderBlockEnd: "none",
            },
        },
    },
    tabsItem: {
        paddingBlock: themeVars.spacing.half,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.xSmall,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isVertical]: {
                paddingBlock: themeVars.spacing.full,
                paddingInline: themeVars.spacing.double,
                fontSize: themeVars.fontSize.small,
                fontWeight: "inherit",
            },
            [SkinUtils.anyOf(skinSelectors.isHovered, skinSelectors.isSelected)]: {
                color: themeVars.color.primary.main,
            },
            [skinSelectors.isDisabled]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    tag: {
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.full,
        ...accent(themeVars.color.secondary),
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [skinSelectors.isHovered]: accentHover(themeVars.color.secondary),
            [skinSelectors.isDisabled]: DISABLED,
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
            [skinSelectors.isHovered]: {
                backgroundImage: shade(withAlpha(layerVars.contrast, 20), withAlpha(layerVars.contrast, 10)),
            },
            ...ITEM_STATES,
        },
    },
});

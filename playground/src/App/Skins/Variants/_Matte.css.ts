import { style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

export const _matte = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const lighten = (color: string, amount: number) => `hsl(from ${color} h s clamp(0, l + ${amount}, 100))`;
const spin = (color: string, degrees: number) => `hsl(from ${color} calc(h + ${degrees}) s l)`;

const SPIN = 15;
const MIX_INV = `rgb(from ${layerVars.contrast} calc(255 - r) calc(255 - g) calc(255 - b))`;
const SHADOW_COLOR = `hsl(from ${themeVars.color.background.dark} h s max(l - 25, 0))`;
const SHADOW = `0 2px 5px ${withAlpha(SHADOW_COLOR, 75)}`;

const sweep = (from: string, to: string, angle = "to right") => `linear-gradient(${angle}, ${from}, ${to})`;

const accent = (family: Family) => ({
    backgroundColor: family.main,
    backgroundImage: sweep(family.main, spin(family.main, SPIN)),
    color: family.contrast,
    boxShadow: SHADOW,
});

const accentHover = (family: Family) => ({
    backgroundImage: sweep(lighten(family.main, 10), lighten(spin(family.main, SPIN), 10)),
});

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const FIELD = {
    border: "none",
    borderInlineStart: `4px solid ${withAlpha(themeVars.color.primary.main, 75)}`,
    borderRadius: 0,
    backgroundColor: "transparent",
    backgroundImage: sweep(withAlpha(MIX_INV, 40), withAlpha(MIX_INV, 20)),
    boxShadow: SHADOW,
} as const;

const FIELD_HOVER = {
    borderInlineStartColor: themeVars.color.primary.main,
    backgroundImage: sweep(withAlpha(MIX_INV, 60), withAlpha(MIX_INV, 40)),
} as const;

const SWITCH_BOX = {
    border: `2px solid ${withAlpha(themeVars.color.primary.main, 75)}`,
    borderRadius: 0,
    backgroundColor: withAlpha(MIX_INV, 40),
    boxShadow: SHADOW,
} as const;

const SWITCH_BOX_STATES = {
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
        ...accent(themeVars.color.primary),
        borderColor: "transparent",
    },
    [skinSelectors.hasErrorWithin]: {
        borderColor: themeVars.color.error.main,
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
    borderRadius: 0,
    borderInlineStart: `4px solid ${withAlpha(layerVars.contrast, 25)}`,
    backgroundImage: sweep(withAlpha(MIX_INV, 30), withAlpha(MIX_INV, 10)),
    color: layerVars.contrast,
} as const;

const SURFACE = {
    borderRadius: 0,
    backgroundColor: themeVars.color.surface.dark,
    backgroundImage: sweep(themeVars.color.surface.light, themeVars.color.surface.dark),
    color: themeVars.color.surface.contrast,
    boxShadow: `0 4px 10px ${withAlpha(SHADOW_COLOR, 75)}`,
} as const;

SkinUtils.define(_matte, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: sweep(themeVars.color.background.light, themeVars.color.background.dark),
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        boxShadow: `4px 0 16px ${withAlpha(SHADOW_COLOR, 75)}`,
    },
    surface: SURFACE,
    hollowSurface: {
        borderRadius: 0,
        borderInlineStart: `4px solid ${themeVars.color.primary.main}`,
        boxShadow: `0 4px 10px ${withAlpha(SHADOW_COLOR, 75)}`,
    },
    panel: PANEL,
    tooltip: {
        borderRadius: 0,
        borderInlineStart: `4px solid ${themeVars.color.primary.main}`,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: SHADOW,
    },
    accordionHeader: {
        ...PANEL,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [skinSelectors.isHovered]: {
                borderInlineStartColor: withAlpha(layerVars.contrast, 75),
                backgroundImage: sweep(withAlpha(MIX_INV, 50), withAlpha(MIX_INV, 30)),
            },
            [skinSelectors.isExpanded]: {
                borderInlineStartColor: themeVars.color.primary.main,
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: {
        ...PANEL,
        borderInlineStartColor: "transparent",
    },
    overlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
    },
    button: {
        borderRadius: 0,
        paddingInline: themeVars.spacing.quad,
        ...accent(themeVars.color.primary),
        selectors: {
            [skinSelectors.isHovered]: accentHover(themeVars.color.primary),
            [skinSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [skinSelectors.isPressed]: {
                ...accent(themeVars.color.secondary),
                boxShadow: `inset 0 2px 5px ${withAlpha(SHADOW_COLOR, 75)}`,
            },
            [skinSelectors.hasError]: accent(themeVars.color.error),
            [SkinUtils.allOf(skinSelectors.hasError, skinSelectors.isHovered)]: accentHover(themeVars.color.error),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        borderRadius: 0,
        backgroundImage: sweep(withAlpha(layerVars.contrast, 15), withAlpha(layerVars.contrast, 5)),
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundImage: sweep(withAlpha(layerVars.contrast, 25), withAlpha(layerVars.contrast, 10)),
            },
            [skinSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [skinSelectors.isSelected]: {
                color: themeVars.color.primary.main,
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    decoration: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: withAlpha(layerVars.contrast, 75),
        selectors: {
            [skinSelectors.isHovered]: {
                color: layerVars.contrast,
                backgroundImage: sweep(withAlpha(layerVars.contrast, 15), "transparent"),
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
                borderInlineStartColor: withAlpha(layerVars.contrast, 25),
            },
            [skinSelectors.hasError]: {
                borderInlineStartColor: themeVars.color.error.main,
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
        borderRadius: 0,
        borderInlineStart: `4px solid ${themeVars.color.primary.main}`,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: `0 4px 10px ${withAlpha(SHADOW_COLOR, 75)}`,
    },
    checkboxBox: {
        ...SWITCH_BOX,
        selectors: SWITCH_BOX_STATES,
    },
    checkboxMark: {
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.medium,
    },
    radioBox: {
        ...SWITCH_BOX,
        borderRadius: "50%",
        selectors: SWITCH_BOX_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.contrast,
    },
    toggleTrack: {
        ...SWITCH_BOX,
        selectors: SWITCH_BOX_STATES,
    },
    toggleHandle: {
        borderRadius: 0,
        backgroundColor: withAlpha(layerVars.contrast, 75),
        selectors: {
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                backgroundColor: themeVars.color.primary.contrast,
            },
        },
    },
    progressTrack: {
        ...FIELD,
        borderInlineStartWidth: "2px",
        selectors: {
            [skinSelectors.hasError]: {
                borderInlineStartColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: sweep(
            themeVars.color.primary.main,
            spin(themeVars.color.primary.main, SPIN),
            skinVars.barAngle,
        ),
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: sweep(
                    themeVars.color.error.main,
                    spin(themeVars.color.error.main, SPIN),
                    skinVars.barAngle,
                ),
            },
        },
    },
    rangeTrack: {
        borderRadius: 0,
        backgroundColor: withAlpha(layerVars.contrast, 20),
        boxShadow: SHADOW,
    },
    rangeFill: {
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: sweep(
            themeVars.color.primary.main,
            spin(themeVars.color.primary.main, SPIN),
            skinVars.barAngle,
        ),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: sweep(
                    themeVars.color.error.main,
                    spin(themeVars.color.error.main, SPIN),
                    skinVars.barAngle,
                ),
            },
        },
    },
    rangeThumb: {
        border: `2px solid ${themeVars.color.primary.main}`,
        borderRadius: 0,
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
        fontWeight: "bold",
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: sweep(
            themeVars.color.primary.main,
            spin(themeVars.color.primary.main, SPIN),
            skinVars.barAngle,
        ),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: sweep(
                    themeVars.color.error.main,
                    spin(themeVars.color.error.main, SPIN),
                    skinVars.barAngle,
                ),
            },
        },
    },
    slideButtonThumb: {
        borderRadius: 0,
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
                backgroundImage: sweep(themeVars.color.primary.main, spin(themeVars.color.primary.main, SPIN)),
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
        borderRadius: 0,
        paddingInline: themeVars.spacing.full,
        ...accent(themeVars.color.secondary),
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [skinSelectors.isHovered]: accentHover(themeVars.color.secondary),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: 0,
        backgroundImage: sweep(withAlpha(layerVars.contrast, 20), "transparent"),
    },
    selectionFloater: {
        borderRadius: 0,
        borderInlineStart: `4px solid ${themeVars.color.primary.main}`,
        backgroundImage: sweep(withAlpha(themeVars.color.primary.main, 25), "transparent"),
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
            [skinSelectors.isHovered]: {
                backgroundImage: sweep(withAlpha(layerVars.contrast, 20), "transparent"),
            },
            ...ITEM_STATES,
        },
    },
});

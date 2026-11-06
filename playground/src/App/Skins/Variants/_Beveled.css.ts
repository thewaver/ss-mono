import { style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors } from "../Skin.css";

export const _beveled = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const lighten = (color: string, amount: number) => `hsl(from ${color} h s clamp(0, l + ${amount}, 100))`;
const tint = (color: string, toward: string, percent: number) => `color-mix(in srgb, ${color}, ${toward} ${percent}%)`;

const MIX_INV = `rgb(from ${layerVars.contrast} calc(255 - r) calc(255 - g) calc(255 - b))`;
const SHADOW_COLOR = `hsl(from ${themeVars.color.background.dark} h s max(l - 25, 0))`;
const SHADOW = `0 1px 10px ${withAlpha(SHADOW_COLOR, 75)}`;
const RIM = "2px solid black";
const HIGHLIGHT = `inset 0 1px 0 ${withAlpha("white", 25)}`;

const bevel = (color: string, angle = "180deg") =>
    `linear-gradient(${angle}, ${tint(color, "white", 35)}, ${tint(color, "black", 35)})`;

const accent = (family: Family) => ({
    border: RIM,
    backgroundColor: family.main,
    backgroundImage: bevel(family.main),
    color: family.contrast,
    boxShadow: `${HIGHLIGHT}, ${SHADOW}`,
});

const accentHover = (family: Family) => ({
    backgroundImage: bevel(lighten(family.main, 10)),
});

const accentPressed = (family: Family) => ({
    backgroundImage: bevel(family.main, "0deg"),
    boxShadow: `inset 0 2px 6px ${withAlpha("black", 50)}`,
});

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const WELL = {
    border: `2px solid ${withAlpha("black", 25)}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: "transparent",
    backgroundImage: `linear-gradient(${withAlpha(MIX_INV, 50)}, ${withAlpha(MIX_INV, 25)})`,
    boxShadow: `inset 0 1px 10px ${MIX_INV}`,
} as const;

const SHALLOW_WELL = {
    backgroundImage: `linear-gradient(${withAlpha(MIX_INV, 25)}, ${withAlpha(MIX_INV, 10)})`,
    boxShadow: `inset 0 1px 4px ${withAlpha(MIX_INV, 50)}`,
} as const;

const WELL_HOVER = {
    backgroundImage: `linear-gradient(${withAlpha(MIX_INV, 75)}, ${withAlpha(MIX_INV, 50)})`,
} as const;

const SWITCH_BOX_STATES = {
    [skinSelectors.isHovered]: WELL_HOVER,
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: accent(themeVars.color.primary),
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

const raised = (color: string) => ({
    border: `1px solid ${withAlpha("black", 50)}`,
    backgroundColor: color,
    backgroundImage: `linear-gradient(${withAlpha("white", 10)}, ${withAlpha("black", 15)})`,
    boxShadow: `${HIGHLIGHT}, ${SHADOW}`,
});

const SURFACE = {
    ...raised(themeVars.color.surface.light),
    borderRadius: themeVars.borderRadius.full,
    color: themeVars.color.surface.contrast,
} as const;

SkinUtils.define(_beveled, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: `linear-gradient(${themeVars.color.background.light}, ${themeVars.color.background.dark})`,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        borderRadius: 0,
    },
    surface: SURFACE,
    hollowSurface: SkinUtils.hollow(SURFACE),
    panel: {
        ...WELL,
        ...SHALLOW_WELL,
        color: layerVars.contrast,
    },
    tooltip: {
        ...raised(layerVars.main),
        borderRadius: themeVars.borderRadius.half,
        color: layerVars.contrast,
    },
    accordionHeader: {
        ...raised(layerVars.main),
        borderRadius: themeVars.borderRadius.half,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundImage: `linear-gradient(${withAlpha("white", 20)}, ${withAlpha("black", 10)})`,
            },
            [skinSelectors.isExpanded]: {
                backgroundImage: `linear-gradient(${withAlpha("black", 15)}, ${withAlpha("white", 10)})`,
                boxShadow: `inset 0 1px 4px ${withAlpha("black", 50)}`,
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: {
        ...WELL,
        ...SHALLOW_WELL,
        color: layerVars.contrast,
    },
    overlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
    },
    button: {
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.quad,
        ...accent(themeVars.color.primary),
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isHovered]: accentHover(themeVars.color.primary),
            [skinSelectors.isActive]: accentPressed(themeVars.color.primary),
            [skinSelectors.isPressed]: accentPressed(themeVars.color.primary),
            [skinSelectors.hasError]: accent(themeVars.color.error),
            [SkinUtils.allOf(skinSelectors.hasError, skinSelectors.isHovered)]: accentHover(themeVars.color.error),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        ...raised(layerVars.main),
        borderRadius: themeVars.borderRadius.half,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundImage: `linear-gradient(${withAlpha("white", 20)}, ${withAlpha("black", 10)})`,
            },
            [skinSelectors.isActive]: {
                backgroundImage: `linear-gradient(${withAlpha("black", 15)}, ${withAlpha("white", 10)})`,
                boxShadow: `inset 0 1px 4px ${withAlpha("black", 50)}`,
            },
            [skinSelectors.isSelected]: {
                color: themeVars.color.primary.main,
                backgroundImage: `linear-gradient(${withAlpha("black", 15)}, ${withAlpha("white", 10)})`,
                boxShadow: `inset 0 1px 4px ${withAlpha("black", 50)}`,
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
                backgroundImage: `linear-gradient(${withAlpha("white", 15)}, ${withAlpha("black", 10)})`,
                boxShadow: HIGHLIGHT,
            },
            [skinSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    input: {
        ...WELL,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [skinSelectors.isHovered]: WELL_HOVER,
            [skinSelectors.isReadOnly]: {
                backgroundImage: "none",
                boxShadow: "none",
            },
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
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
        ...raised(layerVars.main),
        borderRadius: themeVars.borderRadius.half,
        color: layerVars.contrast,
    },
    checkboxBox: {
        ...WELL,
        selectors: SWITCH_BOX_STATES,
    },
    checkboxMark: {
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
    },
    radioBox: {
        ...WELL,
        borderRadius: "50%",
        selectors: SWITCH_BOX_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.contrast,
    },
    toggleTrack: {
        ...WELL,
        borderRadius: themeVars.borderRadius.full,
        selectors: SWITCH_BOX_STATES,
    },
    toggleHandle: {
        ...raised(themeVars.color.surface.light),
        borderRadius: themeVars.borderRadius.half,
    },
    progressTrack: {
        ...WELL,
        selectors: {
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: bevel(themeVars.color.primary.main),
        boxShadow: HIGHLIGHT,
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: bevel(themeVars.color.error.main),
            },
        },
    },
    rangeTrack: {
        ...WELL,
        borderWidth: "1px",
    },
    rangeFill: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: bevel(themeVars.color.primary.main),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: bevel(themeVars.color.error.main),
            },
        },
    },
    rangeThumb: {
        ...raised(themeVars.color.surface.light),
        borderRadius: themeVars.borderRadius.half,
        selectors: {
            [skinSelectors.isStart]: {
                backgroundColor: themeVars.color.secondary.main,
            },
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonTrack: {
        ...WELL,
        borderRadius: themeVars.borderRadius.full,
        fontWeight: "bold",
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: bevel(themeVars.color.primary.main),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: bevel(themeVars.color.error.main),
            },
        },
    },
    slideButtonThumb: {
        ...accent(themeVars.color.primary),
        borderRadius: themeVars.borderRadius.full,
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
                backgroundColor: withAlpha("black", 50),
                boxShadow: `inset 0 1px 2px ${withAlpha("black", 75)}`,
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                backgroundImage: bevel(themeVars.color.primary.main, "90deg"),
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
        ...accent(themeVars.color.secondary),
        border: "1px solid black",
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [skinSelectors.isHovered]: accentHover(themeVars.color.secondary),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: `linear-gradient(${withAlpha("white", 15)}, ${withAlpha("black", 10)})`,
        boxShadow: HIGHLIGHT,
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: `linear-gradient(${withAlpha("black", 20)}, ${withAlpha("white", 5)})`,
        boxShadow: `inset 0 1px 4px ${withAlpha("black", 50)}, inset 0 -2px 0 ${themeVars.color.primary.main}`,
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
                backgroundImage: `linear-gradient(${withAlpha("white", 15)}, ${withAlpha("black", 10)})`,
            },
            ...ITEM_STATES,
        },
    },
});

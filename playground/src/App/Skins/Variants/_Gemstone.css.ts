import { style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors } from "../Skin.css";

export const _gemstone = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const midtone = (color: string) => `hsl(from ${color} h s 50)`;
const tint = (color: string, toward: string, percent: number) => `color-mix(in srgb, ${color}, ${toward} ${percent}%)`;

const MIX = layerVars.contrast;
const MIX_INV = `rgb(from ${layerVars.contrast} calc(255 - r) calc(255 - g) calc(255 - b))`;
const SHADOW_COLOR = `hsl(from ${themeVars.color.background.dark} h s max(l - 25, 0))`;
const SHADOW = `0 1px 10px ${withAlpha(SHADOW_COLOR, 75)}`;

const facets = (color: string, base: string) => {
    const gem = midtone(color);
    const sparkle = tint(gem, "white", 75);

    return [
        `radial-gradient(50% 50% at left, ${withAlpha(gem, 25)}, transparent)`,
        `radial-gradient(50% 50% at right, ${withAlpha(gem, 25)}, transparent)`,
        `radial-gradient(100% 50% at top, ${sparkle}, ${withAlpha(gem, 50)}, transparent)`,
        `radial-gradient(100% 50% at bottom, ${sparkle}, ${withAlpha(gem, 50)}, transparent)`,
        `linear-gradient(${base}, ${base})`,
    ].join(", ");
};

const GLASS = [
    `linear-gradient(${withAlpha(MIX, 50)}, transparent 4px, transparent calc(100% - 4px), ${withAlpha(MIX, 50)})`,
    `linear-gradient(${withAlpha(MIX, 25)}, transparent 10px, transparent calc(100% - 10px), ${withAlpha(MIX, 25)})`,
    `linear-gradient(${withAlpha(MIX_INV, 0)}, ${withAlpha(MIX_INV, 75)})`,
].join(", ");

const GLASS_HOVER = [
    `linear-gradient(${withAlpha(MIX, 50)}, transparent 4px, transparent calc(100% - 4px), ${withAlpha(MIX, 50)})`,
    `linear-gradient(${withAlpha(MIX, 25)}, transparent 10px, transparent calc(100% - 10px), ${withAlpha(MIX, 25)})`,
    `linear-gradient(${withAlpha(MIX_INV, 25)}, ${MIX_INV})`,
].join(", ");

const gem = (family: Family) => ({
    border: "2px solid black",
    backgroundColor: "black",
    backgroundImage: facets(family.main, "black"),
    color: tint(midtone(family.main), "white", 85),
    boxShadow: SHADOW,
});

const gemHover = (family: Family) => ({
    borderColor: tint(midtone(family.main), "black", 75),
    backgroundImage: facets(family.main, tint(midtone(family.main), "black", 75)),
});

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const FIELD = {
    border: `2px solid ${withAlpha(SHADOW_COLOR, 50)}`,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: "transparent",
    backgroundImage: GLASS,
    boxShadow: SHADOW,
} as const;

const SWITCH_BOX_STATES = {
    [skinSelectors.isHovered]: {
        backgroundImage: GLASS_HOVER,
    },
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: gem(themeVars.color.primary),
    [skinSelectors.hasErrorWithin]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const ITEM_STATES = {
    [skinSelectors.isSelected]: {
        color: tint(midtone(themeVars.color.primary.main), "white", 50),
        fontWeight: "bold",
    },
    [skinSelectors.isDisabled]: {
        backgroundColor: "transparent",
        ...DISABLED,
    },
} as const;

const SURFACE = {
    border: `2px solid ${withAlpha(SHADOW_COLOR, 50)}`,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.surface.dark,
    backgroundImage: GLASS,
    color: themeVars.color.surface.contrast,
    boxShadow: `0 4px 20px ${withAlpha(SHADOW_COLOR, 75)}`,
} as const;

SkinUtils.define(_gemstone, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: `radial-gradient(ellipse at top, ${withAlpha(midtone(themeVars.color.primary.main), 15)}, transparent 60%), linear-gradient(${themeVars.color.background.light}, ${themeVars.color.background.dark})`,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        borderRadius: 0,
    },
    surface: SURFACE,
    hollowSurface: SkinUtils.hollow(SURFACE),
    panel: {
        ...FIELD,
        color: layerVars.contrast,
    },
    tooltip: {
        ...gem(themeVars.color.secondary),
        borderRadius: themeVars.borderRadius.full,
    },
    accordionHeader: {
        ...FIELD,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundImage: GLASS_HOVER,
            },
            [skinSelectors.isExpanded]: gem(themeVars.color.primary),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: {
        ...FIELD,
        color: layerVars.contrast,
    },
    overlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
    },
    button: {
        borderRadius: themeVars.borderRadius.full,
        paddingInline: themeVars.spacing.quad,
        ...gem(themeVars.color.primary),
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isHovered]: gemHover(themeVars.color.primary),
            [skinSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [skinSelectors.isPressed]: gem(themeVars.color.secondary),
            [skinSelectors.hasError]: gem(themeVars.color.error),
            [SkinUtils.allOf(skinSelectors.hasError, skinSelectors.isHovered)]: gemHover(themeVars.color.error),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        ...FIELD,
        borderRadius: themeVars.borderRadius.half,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundImage: GLASS_HOVER,
            },
            [skinSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [skinSelectors.isSelected]: gem(themeVars.color.primary),
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
                backgroundImage: GLASS,
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
            [skinSelectors.isHovered]: {
                backgroundImage: GLASS_HOVER,
            },
            [skinSelectors.isReadOnly]: {
                backgroundImage: "none",
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
        ...SURFACE,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
    },
    checkboxBox: {
        ...FIELD,
        borderRadius: themeVars.borderRadius.half,
        selectors: SWITCH_BOX_STATES,
    },
    checkboxMark: {
        color: tint(midtone(themeVars.color.primary.main), "white", 85),
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
        backgroundColor: tint(midtone(themeVars.color.primary.main), "white", 85),
    },
    toggleTrack: {
        ...FIELD,
        selectors: SWITCH_BOX_STATES,
    },
    toggleHandle: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: withAlpha(layerVars.contrast, 75),
        selectors: {
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                backgroundColor: tint(midtone(themeVars.color.primary.main), "white", 85),
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
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: "black",
        backgroundImage: facets(themeVars.color.primary.main, "black"),
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundImage: facets(themeVars.color.error.main, "black"),
            },
        },
    },
    rangeTrack: {
        ...FIELD,
        borderWidth: "1px",
    },
    rangeFill: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: "black",
        backgroundImage: facets(themeVars.color.primary.main, "black"),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundImage: facets(themeVars.color.error.main, "black"),
            },
        },
    },
    rangeThumb: {
        ...gem(themeVars.color.primary),
        borderRadius: "50%",
        selectors: {
            [skinSelectors.isStart]: gem(themeVars.color.secondary),
            [skinSelectors.hasError]: gem(themeVars.color.error),
        },
    },
    slideButtonTrack: {
        ...FIELD,
        fontWeight: "bold",
    },
    slideButtonFill: {
        backgroundColor: "black",
        backgroundImage: facets(themeVars.color.primary.main, "black"),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundImage: facets(themeVars.color.error.main, "black"),
            },
        },
    },
    slideButtonThumb: {
        ...gem(themeVars.color.primary),
        borderRadius: "50%",
        color: tint(midtone(themeVars.color.primary.main), "white", 85),
        selectors: {
            [skinSelectors.hasError]: {
                ...gem(themeVars.color.error),
                color: tint(midtone(themeVars.color.error.main), "white", 85),
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
                backgroundColor: midtone(themeVars.color.primary.main),
                boxShadow: `0 0 6px ${midtone(themeVars.color.primary.main)}`,
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
        ...gem(themeVars.color.secondary),
        border: "1px solid black",
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [skinSelectors.isHovered]: gemHover(themeVars.color.secondary),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: GLASS,
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: facets(themeVars.color.primary.main, "transparent"),
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
                backgroundImage: GLASS,
            },
            ...ITEM_STATES,
        },
    },
});

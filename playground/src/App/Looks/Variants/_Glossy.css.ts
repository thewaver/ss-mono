import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors, lookVars } from "../Look.css";

export const _glossy = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const lighten = (color: string, amount: number) => `hsl(from ${color} h s clamp(0, l + ${amount}, 100))`;
const tint = (color: string, toward: string, percent: number) => `color-mix(in srgb, ${color}, ${toward} ${percent}%)`;

const MIX_INV = `rgb(from ${layerVars.contrast} calc(255 - r) calc(255 - g) calc(255 - b))`;
const SHADOW_COLOR = `hsl(from ${themeVars.color.background.dark} h s max(l - 25, 0))`;
const DROP = `0 1px 10px ${withAlpha(SHADOW_COLOR, 75)}`;
const GLOSS = `linear-gradient(${withAlpha("white", 35)}, ${withAlpha("white", 10)} 50%, transparent 50%)`;

const body = (color: string, angle = "180deg") =>
    `linear-gradient(${angle}, ${tint(color, "white", 25)}, ${tint(color, "black", 25)})`;

const accent = (family: Family) => ({
    border: "2px solid black",
    backgroundColor: family.main,
    backgroundImage: `${GLOSS}, ${body(family.main)}`,
    color: family.contrast,
    boxShadow: DROP,
});

const accentHover = (family: Family) => ({
    backgroundImage: `${GLOSS}, ${body(lighten(family.main, 10))}`,
});

const accentPressed = (family: Family) => ({
    backgroundImage: body(family.main, "0deg"),
    boxShadow: `inset 0 2px 6px ${withAlpha("black", 50)}`,
});

const bar = (color: string) =>
    `${GLOSS}, linear-gradient(${lookVars.barAngle}, ${tint(color, "black", 25)}, ${tint(color, "white", 25)})`;

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const WELL = {
    border: `2px solid ${withAlpha("black", 50)}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: "transparent",
    backgroundImage: `linear-gradient(${withAlpha(MIX_INV, 50)}, ${withAlpha(MIX_INV, 25)})`,
    boxShadow: `inset 0 1px 5px ${withAlpha(MIX_INV, 50)}, 0 1px 5px ${withAlpha("white", 25)}`,
} as const;

const SHALLOW_WELL = {
    backgroundImage: `linear-gradient(${withAlpha(MIX_INV, 25)}, ${withAlpha(MIX_INV, 10)})`,
    boxShadow: `inset 0 1px 4px ${withAlpha(MIX_INV, 50)}`,
} as const;

const WELL_HOVER = {
    backgroundImage: `linear-gradient(${withAlpha(MIX_INV, 75)}, ${withAlpha(MIX_INV, 50)})`,
} as const;

const SWITCH_BOX_STATES = {
    [lookSelectors.isHovered]: WELL_HOVER,
    [LookUtils.anyOf(lookSelectors.isCheckedWithin, lookSelectors.isMixedWithin)]: accent(themeVars.color.primary),
    [lookSelectors.hasErrorWithin]: {
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
        ...DISABLED,
    },
} as const;

const glassy = (color: string) => ({
    border: `1px solid ${withAlpha("black", 50)}`,
    backgroundColor: color,
    backgroundImage: `linear-gradient(${withAlpha("white", 15)}, ${withAlpha("white", 5)} 12px, transparent 12px)`,
    boxShadow: DROP,
});

const SURFACE = {
    ...glassy(themeVars.color.surface.dark),
    borderRadius: themeVars.borderRadius.full,
    color: themeVars.color.surface.contrast,
} as const;

LookUtils.define(_glossy, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: `repeating-linear-gradient(0deg, ${withAlpha(themeVars.color.background.contrast, 3)} 0 2px, transparent 2px 4px), linear-gradient(${themeVars.color.background.light}, ${themeVars.color.background.dark})`,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        borderRadius: 0,
    },
    surface: SURFACE,
    hollowSurface: LookUtils.hollow(SURFACE),
    panel: {
        ...WELL,
        ...SHALLOW_WELL,
        color: layerVars.contrast,
    },
    tooltip: {
        ...accent(themeVars.color.secondary),
        borderRadius: themeVars.borderRadius.half,
    },
    accordionHeader: {
        ...glassy(layerVars.main),
        borderRadius: themeVars.borderRadius.half,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: lighten(layerVars.main, 10),
            },
            [lookSelectors.isExpanded]: {
                ...accent(themeVars.color.primary),
                borderWidth: "1px",
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: {
        ...WELL,
        ...SHALLOW_WELL,
        color: layerVars.contrast,
    },
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
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isHovered]: accentHover(themeVars.color.primary),
            [lookSelectors.isActive]: accentPressed(themeVars.color.primary),
            [lookSelectors.isPressed]: accentPressed(themeVars.color.primary),
            [lookSelectors.hasError]: accent(themeVars.color.error),
            [LookUtils.allOf(lookSelectors.hasError, lookSelectors.isHovered)]: accentHover(themeVars.color.error),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        ...glassy(layerVars.main),
        borderRadius: themeVars.borderRadius.half,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: lighten(layerVars.main, 10),
            },
            [lookSelectors.isActive]: {
                boxShadow: `inset 0 2px 4px ${withAlpha("black", 50)}`,
            },
            [lookSelectors.isSelected]: accent(themeVars.color.primary),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    decoration: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        color: withAlpha(layerVars.contrast, 75),
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                ...glassy(lighten(layerVars.main, 10)),
                color: layerVars.contrast,
                boxShadow: "none",
            },
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    input: {
        ...WELL,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: WELL_HOVER,
            [lookSelectors.isReadOnly]: {
                backgroundImage: "none",
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
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
        ...glassy(layerVars.main),
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
        borderRadius: "50%",
        backgroundColor: themeVars.color.surface.light,
        backgroundImage: GLOSS,
        boxShadow: DROP,
    },
    progressTrack: {
        ...WELL,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: bar(themeVars.color.primary.main),
        selectors: {
            [lookSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: bar(themeVars.color.error.main),
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
        backgroundImage: bar(themeVars.color.primary.main),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: bar(themeVars.color.error.main),
            },
        },
    },
    rangeThumb: {
        ...accent(themeVars.color.primary),
        borderWidth: "1px",
        borderRadius: "50%",
        selectors: {
            [lookSelectors.isStart]: accent(themeVars.color.secondary),
            [lookSelectors.hasError]: accent(themeVars.color.error),
        },
    },
    slideButtonTrack: {
        ...WELL,
        borderRadius: themeVars.borderRadius.full,
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: bar(themeVars.color.primary.main),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: bar(themeVars.color.error.main),
            },
        },
    },
    slideButtonHint: {
        fontWeight: "bold",
    },
    slideButtonThumb: {
        ...accent(themeVars.color.primary),
        borderRadius: "50%",
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
                backgroundColor: withAlpha("black", 50),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                backgroundImage: `linear-gradient(90deg, ${withAlpha("white", 35)}, transparent)`,
            },
            [lookSelectors.lineActive]: {
                filter: themeVars.active.filter,
            },
        },
    },
    tabsFloater: {
        borderBlockEnd: `2px solid ${themeVars.color.primary.main}`,
        selectors: {
            [lookSelectors.isVertical]: {
                borderBlockEnd: "none",
                backgroundImage: `linear-gradient(to right, ${themeVars.color.primary.main} 3px, rgb(from ${layerVars.contrast} r g b / 10%) 3px, transparent)`,
            },
        },
    },
    tabsGutter: {
        borderBlockEnd: `2px solid rgb(from ${layerVars.contrast} r g b / 10%)`,
        selectors: {
            [lookSelectors.isVertical]: {
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
            [lookSelectors.isVertical]: {
                paddingBlock: themeVars.spacing.full,
                paddingInline: themeVars.spacing.double,
                fontSize: themeVars.fontSize.small,
                fontWeight: "inherit",
            },
            [LookUtils.anyOf(lookSelectors.isHovered, lookSelectors.isSelected)]: {
                color: themeVars.color.primary.main,
            },
            [lookSelectors.isDisabled]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    tag: {
        ...accent(themeVars.color.secondary),
        border: "1px solid black",
        borderRadius: themeVars.borderRadius.full,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: accentHover(themeVars.color.secondary),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: withAlpha(layerVars.contrast, 10),
        backgroundImage: GLOSS,
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: withAlpha(themeVars.color.primary.main, 35),
        backgroundImage: GLOSS,
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
                backgroundColor: withAlpha(layerVars.contrast, 10),
                backgroundImage: GLOSS,
            },
            ...ITEM_STATES,
        },
    },
});

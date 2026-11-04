import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors, lookVars } from "../Look.css";

export const _hardCandy = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const lighten = (color: string, amount: number) => `hsl(from ${color} h s clamp(0, l + ${amount}, 100))`;

const BAND = 20;
const SMALL_BAND = 6;
const MIX_INV = `rgb(from ${layerVars.contrast} calc(255 - r) calc(255 - g) calc(255 - b))`;
const SHADOW_COLOR = `hsl(from ${themeVars.color.background.dark} h s max(l - 25, 0))`;
const SHADOW = `0 2px 10px ${SHADOW_COLOR}`;

const stripes = (first: string, second: string, angle: string, band: number) =>
    `repeating-linear-gradient(${angle}, ${first} 0 ${band}px, ${second} ${band}px ${band * 2}px)`;

const sheen = (first: string, second: string, percent: number) =>
    `linear-gradient(to bottom, ${withAlpha(first, percent)}, transparent, ${withAlpha(second, percent)})`;

const cane = (color: string, band = BAND) => {
    const light = lighten(color, 20);

    return `${sheen(color, light, 50)}, ${stripes(color, light, "-45deg", band)}`;
};

const edge = (color: string) => `${stripes(color, lighten(color, 10), "45deg", BAND)} 2`;

const WRAPPER = `${sheen(themeVars.color.primary.main, lighten(themeVars.color.primary.main, 10), 25)}, ${stripes(withAlpha(MIX_INV, 25), withAlpha(MIX_INV, 50), "-45deg", BAND)}`;

const candy = (family: Family, band = BAND) => ({
    backgroundColor: family.main,
    backgroundImage: cane(family.main, band),
    color: family.contrast,
    boxShadow: SHADOW,
    textShadow: `0 1px 2px ${withAlpha(family.main, 75)}`,
});

const candyHover = (family: Family, band = BAND) => ({
    backgroundImage: cane(lighten(family.main, 10), band),
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
    backgroundImage: WRAPPER,
    boxShadow: SHADOW,
} as const;

const FIELD_HOVER = {
    borderImage: edge(lighten(themeVars.color.primary.main, 10)),
} as const;

const FIELD_ERROR = {
    borderImage: edge(themeVars.color.error.main),
} as const;

const RING = {
    border: `2px solid ${themeVars.color.primary.main}`,
    backgroundColor: "transparent",
    backgroundImage: WRAPPER,
    boxShadow: SHADOW,
} as const;

const RING_STATES = {
    [lookSelectors.isHovered]: {
        borderColor: lighten(themeVars.color.primary.main, 10),
    },
    [LookUtils.anyOf(lookSelectors.isCheckedWithin, lookSelectors.isMixedWithin)]: candy(
        themeVars.color.primary,
        SMALL_BAND,
    ),
    [lookSelectors.hasErrorWithin]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        color: lighten(themeVars.color.primary.main, 10),
        fontWeight: "bold",
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        ...DISABLED,
    },
} as const;

const PANEL = {
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: withAlpha(MIX_INV, 25),
    backgroundImage: stripes(withAlpha(MIX_INV, 10), withAlpha(MIX_INV, 25), "-45deg", BAND),
    color: layerVars.contrast,
} as const;

const SURFACE = {
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.surface.dark,
    backgroundImage: `${sheen("white", "black", 5)}, ${stripes(themeVars.color.surface.dark, themeVars.color.surface.light, "-45deg", BAND * 2)}`,
    color: themeVars.color.surface.contrast,
    boxShadow: SHADOW,
} as const;

LookUtils.define(_hardCandy, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: stripes(
            themeVars.color.background.dark,
            `color-mix(in srgb, ${themeVars.color.background.dark}, ${themeVars.color.background.light} 35%)`,
            "-45deg",
            BAND * 4,
        ),
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        borderRadius: 0,
    },
    surface: SURFACE,
    hollowSurface: {
        borderRadius: themeVars.borderRadius.full,
        boxShadow: SHADOW,
    },
    panel: PANEL,
    tooltip: {
        ...candy(themeVars.color.secondary, SMALL_BAND),
        borderRadius: themeVars.borderRadius.half,
    },
    accordionHeader: {
        ...PANEL,
        boxShadow: SHADOW,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundImage: stripes(withAlpha(MIX_INV, 25), withAlpha(MIX_INV, 40), "-45deg", BAND),
            },
            [lookSelectors.isExpanded]: candy(themeVars.color.primary),
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
        ...candy(themeVars.color.primary),
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isHovered]: candyHover(themeVars.color.primary),
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isPressed]: candy(themeVars.color.secondary),
            [lookSelectors.hasError]: candy(themeVars.color.error),
            [LookUtils.allOf(lookSelectors.hasError, lookSelectors.isHovered)]: candyHover(themeVars.color.error),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        ...PANEL,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundImage: stripes(withAlpha(MIX_INV, 25), withAlpha(MIX_INV, 40), "-45deg", BAND),
            },
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isSelected]: candy(themeVars.color.primary, SMALL_BAND),
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
                backgroundImage: stripes(
                    withAlpha(layerVars.contrast, 10),
                    withAlpha(layerVars.contrast, 20),
                    "-45deg",
                    SMALL_BAND,
                ),
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
                borderImage: edge(withAlpha(layerVars.contrast, 25)),
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
        borderRadius: themeVars.borderRadius.half,
        border: `2px solid ${themeVars.color.primary.main}`,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: SHADOW,
    },
    checkboxBox: {
        ...RING,
        borderRadius: themeVars.borderRadius.half,
        selectors: RING_STATES,
    },
    checkboxMark: {
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
    },
    radioBox: {
        ...RING,
        borderRadius: "50%",
        selectors: RING_STATES,
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.contrast,
    },
    toggleTrack: {
        ...RING,
        borderRadius: themeVars.borderRadius.full,
        selectors: RING_STATES,
    },
    toggleHandle: {
        borderRadius: "50%",
        backgroundColor: layerVars.contrast,
        backgroundImage: sheen("white", "black", 25),
        selectors: {
            [LookUtils.anyOf(lookSelectors.isCheckedWithin, lookSelectors.isMixedWithin)]: {
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
        backgroundImage: stripes(
            themeVars.color.primary.main,
            lighten(themeVars.color.primary.main, 10),
            `calc(${lookVars.barAngle} - 45deg)`,
            SMALL_BAND,
        ),
        selectors: {
            [lookSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: stripes(
                    themeVars.color.error.main,
                    lighten(themeVars.color.error.main, 10),
                    `calc(${lookVars.barAngle} - 45deg)`,
                    SMALL_BAND,
                ),
            },
        },
    },
    rangeTrack: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: withAlpha(MIX_INV, 40),
        boxShadow: `inset 0 1px 3px ${SHADOW_COLOR}`,
    },
    rangeFill: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: stripes(
            themeVars.color.primary.main,
            lighten(themeVars.color.primary.main, 10),
            `calc(${lookVars.barAngle} - 45deg)`,
            SMALL_BAND,
        ),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: stripes(
                    themeVars.color.error.main,
                    lighten(themeVars.color.error.main, 10),
                    `calc(${lookVars.barAngle} - 45deg)`,
                    SMALL_BAND,
                ),
            },
        },
    },
    rangeThumb: {
        borderRadius: "50%",
        ...candy(themeVars.color.primary, SMALL_BAND),
        selectors: {
            [lookSelectors.isStart]: candy(themeVars.color.secondary, SMALL_BAND),
            [lookSelectors.hasError]: candy(themeVars.color.error, SMALL_BAND),
        },
    },
    slideButtonTrack: {
        ...RING,
        borderRadius: themeVars.borderRadius.full,
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: cane(themeVars.color.primary.main, SMALL_BAND),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: cane(themeVars.color.error.main, SMALL_BAND),
            },
        },
    },
    slideButtonHint: {
        fontWeight: "bold",
    },
    slideButtonThumb: {
        borderRadius: "50%",
        ...candy(themeVars.color.primary, SMALL_BAND),
        selectors: {
            [lookSelectors.hasError]: candy(themeVars.color.error, SMALL_BAND),
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
                backgroundColor: withAlpha(MIX_INV, 40),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                backgroundImage: stripes(
                    themeVars.color.primary.main,
                    lighten(themeVars.color.primary.main, 10),
                    "-45deg",
                    SMALL_BAND,
                ),
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
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.full,
        ...candy(themeVars.color.secondary, SMALL_BAND),
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: candyHover(themeVars.color.secondary, SMALL_BAND),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: stripes(
            withAlpha(layerVars.contrast, 5),
            withAlpha(layerVars.contrast, 15),
            "-45deg",
            SMALL_BAND,
        ),
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundImage: stripes(
            withAlpha(themeVars.color.primary.main, 15),
            withAlpha(themeVars.color.primary.main, 30),
            "-45deg",
            SMALL_BAND,
        ),
        boxShadow: `inset 0 0 0 2px ${themeVars.color.primary.main}`,
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
                backgroundImage: stripes(
                    withAlpha(layerVars.contrast, 5),
                    withAlpha(layerVars.contrast, 15),
                    "-45deg",
                    SMALL_BAND,
                ),
            },
            ...ITEM_STATES,
        },
    },
});

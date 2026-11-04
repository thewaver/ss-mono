import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const _neon = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const tint = (color: string, toward: string, percent: number) => `color-mix(in srgb, ${color}, ${toward} ${percent}%)`;

const MIX = layerVars.contrast;

const glow = (color: string, blur: number) => `inset 0 0 ${blur}px ${color}, 0 0 ${blur}px ${color}`;

const HAZE = withAlpha(tint(themeVars.color.background.dark, MIX, 50), 75);
const HAZE_BRIGHT = tint(themeVars.color.background.dark, MIX, 75);

const tube = (family: Family) => ({
    border: `2px solid ${tint(family.main, MIX, 75)}`,
    backgroundColor: withAlpha(family.main, 10),
    backgroundImage: "none",
    color: tint(family.main, MIX, 75),
    boxShadow: glow(withAlpha(family.main, 75), 15),
    textShadow: `0 0 8px ${family.main}`,
});

const tubeHover = (family: Family) => ({
    backgroundColor: withAlpha(family.main, 25),
    boxShadow: glow(tint(family.main, MIX, 25), 20),
});

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
    boxShadow: "none",
    textShadow: "none",
} as const;

const FIELD = {
    border: `2px solid ${MIX}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: "transparent",
    boxShadow: glow(HAZE, 15),
} as const;

const FIELD_HOVER = {
    boxShadow: glow(HAZE_BRIGHT, 20),
} as const;

const SWITCH_BOX_STATES = {
    [lookSelectors.isHovered]: FIELD_HOVER,
    [LookUtils.anyOf(lookSelectors.isCheckedWithin, lookSelectors.isMixedWithin)]: tube(themeVars.color.primary),
    [lookSelectors.hasErrorWithin]: {
        borderColor: themeVars.color.error.main,
        boxShadow: glow(withAlpha(themeVars.color.error.main, 75), 15),
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        color: tint(themeVars.color.primary.main, MIX, 50),
        textShadow: `0 0 8px ${themeVars.color.primary.main}`,
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        ...DISABLED,
    },
} as const;

const PANEL = {
    border: `1px solid ${withAlpha(MIX, 50)}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: withAlpha("black", 50),
    color: layerVars.contrast,
    boxShadow: glow(withAlpha(HAZE, 50), 10),
} as const;

const SURFACE = {
    border: `1px solid ${withAlpha(themeVars.color.primary.main, 50)}`,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: withAlpha("black", 75),
    color: themeVars.color.surface.contrast,
    boxShadow: glow(withAlpha(themeVars.color.primary.main, 25), 20),
} as const;

LookUtils.define(_neon, {
    pageBackground: {
        backgroundColor: "black",
        backgroundImage: `radial-gradient(ellipse at bottom, ${withAlpha(themeVars.color.primary.main, 10)}, transparent 60%), radial-gradient(ellipse at top, ${withAlpha(themeVars.color.secondary.main, 10)}, transparent 60%)`,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        borderRadius: 0,
    },
    surface: SURFACE,
    hollowSurface: LookUtils.hollow(SURFACE),
    panel: PANEL,
    tooltip: {
        ...tube(themeVars.color.secondary),
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: withAlpha("black", 85),
    },
    accordionHeader: {
        ...PANEL,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: FIELD_HOVER,
            [lookSelectors.isExpanded]: tube(themeVars.color.primary),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: PANEL,
    opaqueOverlay: {
        backgroundColor: "black",
    },
    blurredOverlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
        backgroundColor: withAlpha("black", 50),
    },
    button: {
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.quad,
        ...tube(themeVars.color.primary),
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isHovered]: tubeHover(themeVars.color.primary),
            [lookSelectors.isActive]: {
                backgroundColor: withAlpha(themeVars.color.primary.main, 40),
            },
            [lookSelectors.isPressed]: tube(themeVars.color.secondary),
            [lookSelectors.hasError]: tube(themeVars.color.error),
            [LookUtils.allOf(lookSelectors.hasError, lookSelectors.isHovered)]: tubeHover(themeVars.color.error),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        border: `1px solid ${withAlpha(MIX, 50)}`,
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: {
                borderColor: MIX,
                boxShadow: glow(HAZE, 10),
            },
            [lookSelectors.isActive]: {
                backgroundColor: withAlpha(MIX, 10),
            },
            [lookSelectors.isSelected]: tube(themeVars.color.primary),
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
                textShadow: `0 0 8px ${MIX}`,
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
                borderStyle: "dashed",
                boxShadow: "none",
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
                boxShadow: glow(withAlpha(themeVars.color.error.main, 75), 15),
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
        backgroundColor: "black",
        color: layerVars.contrast,
    },
    checkboxBox: {
        ...FIELD,
        selectors: SWITCH_BOX_STATES,
    },
    checkboxMark: {
        color: tint(themeVars.color.primary.main, MIX, 75),
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
        backgroundColor: tint(themeVars.color.primary.main, MIX, 75),
        boxShadow: `0 0 8px ${themeVars.color.primary.main}`,
    },
    toggleTrack: {
        ...FIELD,
        borderRadius: themeVars.borderRadius.full,
        selectors: SWITCH_BOX_STATES,
    },
    toggleHandle: {
        borderRadius: "50%",
        backgroundColor: withAlpha(MIX, 50),
        selectors: {
            [LookUtils.anyOf(lookSelectors.isCheckedWithin, lookSelectors.isMixedWithin)]: {
                backgroundColor: tint(themeVars.color.primary.main, MIX, 75),
                boxShadow: `0 0 10px ${themeVars.color.primary.main}`,
            },
        },
    },
    progressTrack: {
        ...FIELD,
        borderWidth: "1px",
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(themeVars.color.primary.main, MIX, 50),
        boxShadow: `0 0 12px ${themeVars.color.primary.main}`,
        selectors: {
            [lookSelectors.hasErrorWithin]: {
                backgroundColor: tint(themeVars.color.error.main, MIX, 50),
                boxShadow: `0 0 12px ${themeVars.color.error.main}`,
            },
        },
    },
    rangeTrack: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: withAlpha(MIX, 20),
    },
    rangeFill: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: tint(themeVars.color.primary.main, MIX, 50),
        boxShadow: `0 0 10px ${themeVars.color.primary.main}`,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: tint(themeVars.color.error.main, MIX, 50),
                boxShadow: `0 0 10px ${themeVars.color.error.main}`,
            },
        },
    },
    rangeThumb: {
        ...tube(themeVars.color.primary),
        borderRadius: "50%",
        backgroundColor: "black",
        selectors: {
            [lookSelectors.isStart]: tube(themeVars.color.secondary),
            [lookSelectors.hasError]: tube(themeVars.color.error),
        },
    },
    slideButtonTrack: {
        ...FIELD,
        borderRadius: themeVars.borderRadius.full,
    },
    slideButtonFill: {
        backgroundColor: withAlpha(themeVars.color.primary.main, 30),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: withAlpha(themeVars.color.error.main, 30),
            },
        },
    },
    slideButtonHint: {
        textShadow: `0 0 8px ${MIX}`,
    },
    slideButtonThumb: {
        ...tube(themeVars.color.primary),
        borderRadius: "50%",
        backgroundColor: "black",
        selectors: {
            [lookSelectors.hasError]: tube(themeVars.color.error),
        },
    },
    slideButtonArrow: {
        stroke: tint(themeVars.color.primary.main, MIX, 75),
        selectors: {
            [lookSelectors.hasError]: {
                stroke: tint(themeVars.color.error.main, MIX, 75),
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: withAlpha(MIX, 15),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: tint(themeVars.color.primary.main, MIX, 50),
                boxShadow: `0 0 8px ${themeVars.color.primary.main}`,
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
        ...tube(themeVars.color.secondary),
        borderWidth: "1px",
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.xSmall,
        boxShadow: glow(withAlpha(themeVars.color.secondary.main, 75), 8),
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: withAlpha(themeVars.color.secondary.main, 25),
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        boxShadow: `inset 0 0 0 1px ${withAlpha(MIX, 50)}, ${glow(withAlpha(HAZE, 50), 8)}`,
    },
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: withAlpha(themeVars.color.primary.main, 10),
        boxShadow: `inset 0 0 0 1px ${tint(themeVars.color.primary.main, MIX, 75)}, ${glow(withAlpha(themeVars.color.primary.main, 75), 10)}`,
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
                boxShadow: `inset 0 0 0 1px ${withAlpha(MIX, 50)}`,
            },
            ...ITEM_STATES,
        },
    },
});

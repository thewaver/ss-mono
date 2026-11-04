import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const _minimal = style({});

type Family = typeof themeVars.color.primary;

const PILL_RADIUS = "9999px";

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const lighten = (color: string, amount: number) => `hsl(from ${color} h s clamp(0, l + ${amount}, 100))`;

const LINE = `2px solid ${withAlpha(layerVars.contrast, 25)}`;
const LINE_HOVER = withAlpha(layerVars.contrast, 75);
const HOVER_TINT = `radial-gradient(circle at bottom right, ${withAlpha(layerVars.contrast, 5)}, transparent)`;

const accent = (family: Family) => ({
    backgroundColor: family.main,
    backgroundImage: "none",
    color: family.contrast,
});

const accentHover = (family: Family) => ({
    backgroundColor: lighten(family.main, 10),
    boxShadow: `0 0 10px ${withAlpha(lighten(family.main, 10), 50)}`,
});

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const UNDERLINED = {
    border: "none",
    borderBottom: LINE,
    borderRadius: 0,
    backgroundColor: "transparent",
} as const;

const UNDERLINED_STATES = {
    [lookSelectors.isHovered]: {
        borderBottomColor: LINE_HOVER,
        backgroundImage: HOVER_TINT,
    },
    [lookSelectors.hasError]: {
        borderBottomColor: themeVars.color.error.main,
    },
    [lookSelectors.isDisabled]: DISABLED,
} as const;

const SWITCH_BOX = {
    border: LINE,
    backgroundColor: "transparent",
} as const;

const SWITCH_BOX_STATES = {
    [LookUtils.anyOf(lookSelectors.isCheckedWithin, lookSelectors.isMixedWithin)]: {
        ...accent(themeVars.color.primary),
        borderColor: themeVars.color.primary.main,
    },
    [lookSelectors.hasErrorWithin]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        color: themeVars.color.primary.main,
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        ...DISABLED,
    },
} as const;

const PANEL = {
    borderRadius: 0,
    borderBottom: `1px solid ${withAlpha(layerVars.contrast, 25)}`,
    backgroundColor: "transparent",
    color: layerVars.contrast,
} as const;

const SURFACE = {
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: themeVars.color.surface.dark,
    color: themeVars.color.surface.contrast,
} as const;

LookUtils.define(_minimal, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        backgroundColor: themeVars.color.surface.dark,
        color: themeVars.color.surface.contrast,
        borderInlineEnd: `1px solid ${withAlpha(themeVars.color.surface.contrast, 10)}`,
    },
    surface: SURFACE,
    hollowSurface: {
        borderRadius: themeVars.borderRadius.full,
        border: `1px solid ${withAlpha(themeVars.color.surface.contrast, 10)}`,
    },
    panel: PANEL,
    tooltip: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: themeVars.color.primary.main,
        color: themeVars.color.primary.contrast,
    },
    accordionHeader: {
        ...PANEL,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                borderBottomColor: LINE_HOVER,
                backgroundImage: HOVER_TINT,
            },
            [lookSelectors.isExpanded]: {
                borderBottomColor: themeVars.color.primary.main,
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: {
        backgroundColor: "transparent",
        color: layerVars.contrast,
    },
    opaqueOverlay: {
        backgroundColor: "black",
    },
    blurredOverlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
    },
    button: {
        borderRadius: PILL_RADIUS,
        paddingInline: themeVars.spacing.quad,
        ...accent(themeVars.color.primary),
        selectors: {
            [lookSelectors.isHovered]: accentHover(themeVars.color.primary),
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isPressed]: accent(themeVars.color.secondary),
            [lookSelectors.hasError]: accent(themeVars.color.error),
            [LookUtils.allOf(lookSelectors.hasError, lookSelectors.isHovered)]: accentHover(themeVars.color.error),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        borderRadius: PILL_RADIUS,
        backgroundColor: "transparent",
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: withAlpha(layerVars.contrast, 10),
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
        borderRadius: PILL_RADIUS,
        backgroundColor: "transparent",
        color: withAlpha(layerVars.contrast, 75),
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: themeVars.color.primary.main,
            },
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    input: {
        ...UNDERLINED,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            ...UNDERLINED_STATES,
            [lookSelectors.isReadOnly]: {
                borderBottomStyle: "dotted",
            },
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
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: `0 8px 24px ${withAlpha("black", 50)}`,
    },
    checkboxBox: {
        ...SWITCH_BOX,
        borderRadius: themeVars.borderRadius.half,
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
        borderRadius: PILL_RADIUS,
        selectors: SWITCH_BOX_STATES,
    },
    toggleHandle: {
        borderRadius: "50%",
        backgroundColor: withAlpha(layerVars.contrast, 50),
        selectors: {
            [LookUtils.anyOf(lookSelectors.isCheckedWithin, lookSelectors.isMixedWithin)]: {
                backgroundColor: themeVars.color.primary.contrast,
            },
        },
    },
    progressTrack: {
        borderRadius: PILL_RADIUS,
        backgroundColor: withAlpha(layerVars.contrast, 10),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: withAlpha(themeVars.color.error.main, 25),
            },
        },
    },
    progressFill: {
        borderRadius: PILL_RADIUS,
        backgroundColor: themeVars.color.primary.main,
        selectors: {
            [lookSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    rangeTrack: {
        borderRadius: PILL_RADIUS,
        backgroundColor: withAlpha(layerVars.contrast, 25),
    },
    rangeFill: {
        borderRadius: PILL_RADIUS,
        backgroundColor: themeVars.color.primary.main,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    rangeThumb: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.main,
        selectors: {
            [lookSelectors.isHovered]: {
                boxShadow: `0 0 10px ${withAlpha(themeVars.color.primary.main, 50)}`,
            },
            [lookSelectors.isStart]: {
                backgroundColor: themeVars.color.secondary.main,
            },
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonTrack: {
        borderRadius: PILL_RADIUS,
        backgroundColor: withAlpha(layerVars.contrast, 10),
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.main,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonHint: {
        color: withAlpha(layerVars.contrast, 75),
    },
    slideButtonThumb: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.main,
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
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
        borderRadius: PILL_RADIUS,
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
        backgroundImage: HOVER_TINT,
        borderBottom: `2px solid ${LINE_HOVER}`,
    },
    selectionFloater: {
        borderRadius: 0,
        borderBottom: `2px solid ${themeVars.color.primary.main}`,
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
                backgroundImage: HOVER_TINT,
                boxShadow: `inset 0 -2px 0 ${LINE_HOVER}`,
            },
            ...ITEM_STATES,
        },
    },
});

import { style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors } from "../Skin.css";

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
    [skinSelectors.isHovered]: {
        borderBottomColor: LINE_HOVER,
        backgroundImage: HOVER_TINT,
    },
    [skinSelectors.hasError]: {
        borderBottomColor: themeVars.color.error.main,
    },
    [skinSelectors.isDisabled]: DISABLED,
} as const;

const SWITCH_BOX = {
    border: LINE,
    backgroundColor: "transparent",
} as const;

const SWITCH_BOX_STATES = {
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
        ...accent(themeVars.color.primary),
        borderColor: themeVars.color.primary.main,
    },
    [skinSelectors.hasErrorWithin]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const ITEM_STATES = {
    [skinSelectors.isSelected]: {
        color: themeVars.color.primary.main,
    },
    [skinSelectors.isDisabled]: {
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

SkinUtils.define(_minimal, {
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
            [skinSelectors.isHovered]: {
                borderBottomColor: LINE_HOVER,
                backgroundImage: HOVER_TINT,
            },
            [skinSelectors.isExpanded]: {
                borderBottomColor: themeVars.color.primary.main,
            },
            [skinSelectors.isDisabled]: DISABLED,
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
            [skinSelectors.isHovered]: accentHover(themeVars.color.primary),
            [skinSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [skinSelectors.isPressed]: accent(themeVars.color.secondary),
            [skinSelectors.hasError]: accent(themeVars.color.error),
            [SkinUtils.allOf(skinSelectors.hasError, skinSelectors.isHovered)]: accentHover(themeVars.color.error),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        borderRadius: PILL_RADIUS,
        backgroundColor: "transparent",
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundColor: withAlpha(layerVars.contrast, 10),
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
        borderRadius: PILL_RADIUS,
        backgroundColor: "transparent",
        color: withAlpha(layerVars.contrast, 75),
        selectors: {
            [skinSelectors.isHovered]: {
                color: themeVars.color.primary.main,
            },
            [skinSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    input: {
        ...UNDERLINED,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            ...UNDERLINED_STATES,
            [skinSelectors.isReadOnly]: {
                borderBottomStyle: "dotted",
            },
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
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                backgroundColor: themeVars.color.primary.contrast,
            },
        },
    },
    progressTrack: {
        borderRadius: PILL_RADIUS,
        backgroundColor: withAlpha(layerVars.contrast, 10),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: withAlpha(themeVars.color.error.main, 25),
            },
        },
    },
    progressFill: {
        borderRadius: PILL_RADIUS,
        backgroundColor: themeVars.color.primary.main,
        selectors: {
            [skinSelectors.hasErrorWithin]: {
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
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    rangeThumb: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.main,
        selectors: {
            [skinSelectors.isHovered]: {
                boxShadow: `0 0 10px ${withAlpha(themeVars.color.primary.main, 50)}`,
            },
            [skinSelectors.isStart]: {
                backgroundColor: themeVars.color.secondary.main,
            },
            [skinSelectors.hasError]: {
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
            [skinSelectors.hasError]: {
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
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonArrow: {
        color: themeVars.color.primary.contrast,
        selectors: {
            [skinSelectors.hasError]: {
                color: themeVars.color.error.contrast,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: withAlpha(layerVars.contrast, 10),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
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
        borderRadius: PILL_RADIUS,
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
            [skinSelectors.isHovered]: {
                backgroundImage: HOVER_TINT,
                boxShadow: `inset 0 -2px 0 ${LINE_HOVER}`,
            },
            ...ITEM_STATES,
        },
    },
});

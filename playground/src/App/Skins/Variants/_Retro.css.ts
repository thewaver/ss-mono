import { style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors } from "../Skin.css";

export const _retro = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const lighten = (color: string, amount: number) => `hsl(from ${color} h s clamp(0, l + ${amount}, 100))`;

const HARD_SHADOW = "2px 2px 0 black";
const HARD_SHADOW_LARGE = "4px 4px 0 black";
const SUNKEN = `inset 2px 2px 0 ${withAlpha("black", 75)}, inset -2px -2px 0 ${withAlpha("white", 25)}`;

const accent = (family: Family) => ({
    backgroundColor: family.main,
    backgroundImage: "none",
    color: family.contrast,
    boxShadow: HARD_SHADOW,
});

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const PRESSED = {
    backgroundColor: lighten(themeVars.color.primary.main, -15),
    boxShadow: SUNKEN,
} as const;

const FIELD = {
    border: "2px solid black",
    borderRadius: 0,
    backgroundColor: lighten(layerVars.main, -5),
    boxShadow: HARD_SHADOW,
} as const;

const FIELD_STATES = {
    [skinSelectors.isHovered]: {
        backgroundColor: lighten(layerVars.main, -10),
    },
    [skinSelectors.isDisabled]: DISABLED,
} as const;

const SWITCH_BOX_STATES = {
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
        backgroundColor: themeVars.color.primary.main,
    },
    [skinSelectors.hasErrorWithin]: {
        borderColor: themeVars.color.error.main,
    },
} as const;

const ITEM_STATES = {
    [skinSelectors.isSelected]: {
        backgroundColor: themeVars.color.primary.main,
        color: themeVars.color.primary.contrast,
    },
    [skinSelectors.isDisabled]: {
        backgroundColor: "transparent",
        ...DISABLED,
    },
} as const;

const PANEL = {
    border: "2px solid black",
    borderRadius: 0,
    backgroundColor: lighten(layerVars.main, -5),
    color: layerVars.contrast,
} as const;

const SURFACE = {
    border: "2px solid black",
    borderRadius: 0,
    backgroundColor: themeVars.color.surface.light,
    color: themeVars.color.surface.contrast,
    boxShadow: HARD_SHADOW_LARGE,
} as const;

SkinUtils.define(_retro, {
    pageBackground: {
        backgroundColor: themeVars.color.background.light,
        backgroundImage: `radial-gradient(${withAlpha(themeVars.color.background.contrast, 10)} 1px, transparent 1px)`,
        backgroundSize: "8px 8px",
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        boxShadow: "8px 0 0 black",
    },
    surface: SURFACE,
    hollowSurface: SkinUtils.hollow(SURFACE),
    panel: PANEL,
    tooltip: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: themeVars.color.secondary.main,
        color: themeVars.color.secondary.contrast,
        boxShadow: HARD_SHADOW,
    },
    accordionHeader: {
        ...PANEL,
        backgroundColor: themeVars.color.surface.light,
        boxShadow: HARD_SHADOW,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundColor: lighten(themeVars.color.surface.light, 10),
            },
            [skinSelectors.isExpanded]: {
                backgroundColor: themeVars.color.primary.main,
                color: themeVars.color.primary.contrast,
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: PANEL,
    opaqueOverlay: {
        backgroundColor: "black",
    },
    blurredOverlay: {
        backgroundColor: withAlpha("black", 50),
        backgroundImage: `repeating-linear-gradient(0deg, ${withAlpha("black", 25)} 0 2px, transparent 2px 4px)`,
    },
    button: {
        border: "2px solid black",
        borderRadius: 0,
        paddingInline: themeVars.spacing.double,
        ...accent(themeVars.color.primary),
        fontWeight: "bold",
        textTransform: "uppercase",
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundColor: lighten(themeVars.color.primary.main, 10),
            },
            [skinSelectors.isActive]: PRESSED,
            [skinSelectors.isPressed]: PRESSED,
            [skinSelectors.hasError]: accent(themeVars.color.error),
            [SkinUtils.allOf(skinSelectors.hasError, skinSelectors.isHovered)]: {
                backgroundColor: lighten(themeVars.color.error.main, 10),
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: themeVars.color.surface.light,
        color: themeVars.color.surface.contrast,
        boxShadow: HARD_SHADOW,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundColor: lighten(themeVars.color.surface.light, 10),
            },
            [skinSelectors.isActive]: {
                boxShadow: SUNKEN,
            },
            [skinSelectors.isSelected]: {
                backgroundColor: themeVars.color.primary.main,
                color: themeVars.color.primary.contrast,
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
                color: themeVars.color.primary.contrast,
                backgroundColor: themeVars.color.primary.main,
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
            ...FIELD_STATES,
            [skinSelectors.isReadOnly]: {
                borderStyle: "dashed",
                boxShadow: "none",
            },
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
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
        ...SURFACE,
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
        selectors: SWITCH_BOX_STATES,
    },
    toggleHandle: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: themeVars.color.surface.light,
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
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: `repeating-linear-gradient(90deg, transparent 0 8px, ${withAlpha("black", 50)} 8px 10px)`,
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    rangeTrack: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: lighten(layerVars.main, -5),
    },
    rangeFill: {
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.main,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    rangeThumb: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: themeVars.color.surface.light,
        boxShadow: HARD_SHADOW,
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
        ...FIELD,
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
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    slideButtonThumb: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: themeVars.color.surface.light,
        boxShadow: HARD_SHADOW,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonArrow: {
        color: themeVars.color.surface.contrast,
        selectors: {
            [skinSelectors.hasError]: {
                color: themeVars.color.error.contrast,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: withAlpha(layerVars.contrast, 25),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: HARD_SHADOW,
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
        border: "2px solid black",
        borderRadius: 0,
        paddingInline: themeVars.spacing.full,
        ...accent(themeVars.color.secondary),
        fontSize: themeVars.fontSize.xSmall,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundColor: lighten(themeVars.color.secondary.main, 10),
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: 0,
        backgroundColor: withAlpha(layerVars.contrast, 15),
    },
    selectionFloater: {
        border: "2px solid black",
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.main,
        boxShadow: HARD_SHADOW,
    },
    itemWithFloater: {
        borderRadius: 0,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [skinSelectors.isSelected]: {
                color: themeVars.color.primary.contrast,
                fontWeight: "bold",
            },
            [skinSelectors.isDisabled]: ITEM_STATES[skinSelectors.isDisabled],
        },
    },
    itemWithoutFloater: {
        borderRadius: 0,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundColor: withAlpha(layerVars.contrast, 15),
            },
            ...ITEM_STATES,
        },
    },
});

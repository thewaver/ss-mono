import { style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors } from "../Skin.css";

export const _hollow = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;
const tint = (color: string, toward: string, percent: number) => `color-mix(in srgb, ${color}, ${toward} ${percent}%)`;

const MIX = layerVars.contrast;
const MIX_INV = `rgb(from ${layerVars.contrast} calc(255 - r) calc(255 - g) calc(255 - b))`;

const rim = (family: Family) => ({
    border: `2px solid ${family.main}`,
    backgroundColor: withAlpha(family.main, 10),
    backgroundImage: "none",
    color: tint(family.main, MIX, 75),
});

const rimHover = (family: Family) => ({
    borderColor: tint(family.main, MIX, 50),
    backgroundColor: withAlpha(family.main, 25),
    color: MIX,
});

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const FIELD = {
    border: `2px solid ${withAlpha(MIX, 50)}`,
    borderRadius: 0,
    backgroundColor: withAlpha(MIX_INV, 10),
} as const;

const FIELD_HOVER = {
    borderColor: MIX,
    backgroundColor: withAlpha(MIX_INV, 25),
} as const;

const SWITCH_BOX_STATES = {
    [skinSelectors.isHovered]: FIELD_HOVER,
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: rim(themeVars.color.primary),
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

const OUTLINE = `1px solid ${withAlpha(MIX, 25)}`;

const SURFACE = {
    border: `1px solid ${withAlpha(themeVars.color.surface.contrast, 25)}`,
    borderRadius: 0,
    backgroundColor: "transparent",
    color: themeVars.color.surface.contrast,
} as const;

SkinUtils.define(_hollow, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        backgroundColor: themeVars.color.background.dark,
        borderBlock: "none",
        borderInlineStart: "none",
    },
    surface: SURFACE,
    hollowSurface: SkinUtils.hollow(SURFACE),
    panel: {
        border: OUTLINE,
        borderRadius: 0,
        backgroundColor: "transparent",
        color: layerVars.contrast,
    },
    tooltip: {
        ...rim(themeVars.color.secondary),
        borderRadius: 0,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
    },
    accordionHeader: {
        border: OUTLINE,
        borderRadius: 0,
        backgroundColor: "transparent",
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [skinSelectors.isHovered]: {
                borderColor: MIX,
            },
            [skinSelectors.isExpanded]: rim(themeVars.color.primary),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: {
        borderInline: OUTLINE,
        borderBottom: OUTLINE,
        borderRadius: 0,
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
        borderRadius: 0,
        paddingInline: themeVars.spacing.double,
        ...rim(themeVars.color.primary),
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isHovered]: rimHover(themeVars.color.primary),
            [skinSelectors.isActive]: {
                backgroundColor: withAlpha(themeVars.color.primary.main, 30),
            },
            [skinSelectors.isPressed]: {
                ...rimHover(themeVars.color.primary),
                backgroundColor: withAlpha(themeVars.color.primary.main, 30),
            },
            [skinSelectors.hasError]: rim(themeVars.color.error),
            [SkinUtils.allOf(skinSelectors.hasError, skinSelectors.isHovered)]: rimHover(themeVars.color.error),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        border: OUTLINE,
        borderRadius: 0,
        backgroundColor: "transparent",
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [skinSelectors.isHovered]: {
                borderColor: MIX,
            },
            [skinSelectors.isActive]: {
                backgroundColor: withAlpha(MIX, 10),
            },
            [skinSelectors.isSelected]: rim(themeVars.color.primary),
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
                boxShadow: `inset 0 0 0 1px ${withAlpha(MIX, 50)}`,
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
                borderStyle: "dashed",
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
        border: `1px solid ${withAlpha(MIX, 50)}`,
        borderRadius: 0,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
    },
    checkboxBox: {
        ...FIELD,
        selectors: SWITCH_BOX_STATES,
    },
    checkboxMark: {
        color: tint(themeVars.color.primary.main, MIX, 50),
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
        backgroundColor: themeVars.color.primary.main,
    },
    toggleTrack: {
        ...FIELD,
        selectors: SWITCH_BOX_STATES,
    },
    toggleHandle: {
        borderRadius: 0,
        border: `2px solid ${withAlpha(MIX, 75)}`,
        backgroundColor: "transparent",
        selectors: {
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                borderColor: themeVars.color.primary.main,
                backgroundColor: themeVars.color.primary.main,
            },
        },
    },
    progressTrack: {
        ...FIELD,
        borderWidth: "1px",
        selectors: {
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: 0,
        backgroundColor: withAlpha(themeVars.color.primary.main, 25),
        boxShadow: `inset 0 0 0 1px ${themeVars.color.primary.main}`,
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundColor: withAlpha(themeVars.color.error.main, 25),
                boxShadow: `inset 0 0 0 1px ${themeVars.color.error.main}`,
            },
        },
    },
    rangeTrack: {
        border: OUTLINE,
        borderRadius: 0,
        backgroundColor: "transparent",
    },
    rangeFill: {
        borderRadius: 0,
        backgroundColor: withAlpha(themeVars.color.primary.main, 30),
        boxShadow: `inset 0 0 0 1px ${themeVars.color.primary.main}`,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: withAlpha(themeVars.color.error.main, 40),
                boxShadow: `inset 0 0 0 1px ${themeVars.color.error.main}`,
            },
        },
    },
    rangeThumb: {
        borderRadius: 0,
        border: `2px solid ${themeVars.color.primary.main}`,
        backgroundColor: layerVars.main,
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
    },
    slideButtonFill: {
        backgroundColor: withAlpha(themeVars.color.primary.main, 25),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: withAlpha(themeVars.color.error.main, 25),
            },
        },
    },
    slideButtonHint: {
        fontWeight: "bold",
    },
    slideButtonThumb: {
        borderRadius: 0,
        border: `2px solid ${themeVars.color.primary.main}`,
        backgroundColor: layerVars.main,
        selectors: {
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonArrow: {
        color: themeVars.color.primary.main,
        selectors: {
            [skinSelectors.hasError]: {
                color: themeVars.color.error.main,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: withAlpha(MIX, 15),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: withAlpha(themeVars.color.primary.main, 25),
                boxShadow: `inset 0 0 0 1px ${themeVars.color.primary.main}`,
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
        ...rim(themeVars.color.secondary),
        borderWidth: "1px",
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [skinSelectors.isHovered]: rimHover(themeVars.color.secondary),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: 0,
        boxShadow: `inset 0 0 0 1px ${withAlpha(MIX, 50)}`,
    },
    selectionFloater: {
        borderRadius: 0,
        backgroundColor: withAlpha(themeVars.color.primary.main, 10),
        boxShadow: `inset 0 0 0 2px ${themeVars.color.primary.main}`,
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
                boxShadow: `inset 0 0 0 1px ${withAlpha(MIX, 50)}`,
            },
            ...ITEM_STATES,
        },
    },
});

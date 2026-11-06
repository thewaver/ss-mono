import { style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

export const _clear = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;

const MIX_INV = `rgb(from ${layerVars.contrast} calc(255 - r) calc(255 - g) calc(255 - b))`;
const SHADOW_COLOR = `hsl(from ${themeVars.color.background.dark} h s max(l - 25, 0))`;
const SHADOW = `0 2px 10px ${withAlpha(SHADOW_COLOR, 50)}`;

const sheen = (color: string, base: string) =>
    [
        `radial-gradient(75% 50% at top, ${withAlpha("white", 40)}, transparent)`,
        `radial-gradient(75% 50% at bottom, ${withAlpha(color, 20)}, transparent)`,
        base,
    ].join(", ");

const pane = (family: Family) => ({
    border: "none",
    borderBottom: `2px solid ${family.main}`,
    backgroundColor: "transparent",
    backgroundImage: sheen(family.main, `linear-gradient(${withAlpha("white", 10)}, ${withAlpha("black", 10)})`),
    color: layerVars.contrast,
    boxShadow: `0 2px 10px ${SHADOW_COLOR}`,
});

const paneHover = (family: Family) => ({
    backgroundImage: sheen(
        family.main,
        `linear-gradient(${withAlpha(family.main, 10)}, ${withAlpha(family.main, 20)})`,
    ),
});

const panePressed = (family: Family) => ({
    backgroundImage: sheen(
        family.main,
        `linear-gradient(${withAlpha(family.main, 10)}, ${withAlpha(family.main, 25)})`,
    ),
    boxShadow: `inset 0 2px 6px ${withAlpha("black", 50)}`,
});

const bar = (color: string) =>
    `linear-gradient(${withAlpha("white", 30)}, transparent 50%), linear-gradient(${skinVars.barAngle}, ${withAlpha(color, 40)}, ${color})`;

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const FIELD = {
    border: `1px solid ${withAlpha(layerVars.contrast, 10)}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: "transparent",
    backgroundImage: `linear-gradient(${withAlpha(MIX_INV, 25)}, ${withAlpha(MIX_INV, 50)})`,
    boxShadow: SHADOW,
} as const;

const FIELD_HOVER = {
    backgroundImage: `linear-gradient(${withAlpha(MIX_INV, 50)}, ${withAlpha(MIX_INV, 75)})`,
} as const;

const SWITCH_BOX_STATES = {
    [skinSelectors.isHovered]: FIELD_HOVER,
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
        borderColor: themeVars.color.primary.main,
        backgroundImage: sheen(
            themeVars.color.primary.main,
            `linear-gradient(${withAlpha(themeVars.color.primary.main, 40)}, ${withAlpha(themeVars.color.primary.main, 60)})`,
        ),
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

const SURFACE = {
    border: `1px solid ${withAlpha(themeVars.color.surface.contrast, 15)}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: withAlpha(themeVars.color.surface.dark, 40),
    backgroundImage: `radial-gradient(75% 40% at top, ${withAlpha("white", 10)}, transparent)`,
    color: themeVars.color.surface.contrast,
    boxShadow: `0 4px 16px ${withAlpha(SHADOW_COLOR, 75)}`,
    backdropFilter: "blur(8px)",
} as const;

SkinUtils.define(_clear, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: `radial-gradient(circle at 30% 20%, ${withAlpha(themeVars.color.primary.main, 15)}, transparent 50%), radial-gradient(circle at 70% 80%, ${withAlpha(themeVars.color.secondary.main, 15)}, transparent 50%), linear-gradient(${themeVars.color.background.light}, ${themeVars.color.background.dark})`,
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
        ...pane(themeVars.color.primary),
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: withAlpha(layerVars.main, 75),
        backdropFilter: "blur(8px)",
    },
    accordionHeader: {
        ...pane(themeVars.color.primary),
        borderBottomColor: withAlpha(layerVars.contrast, 25),
        borderRadius: themeVars.borderRadius.half,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [skinSelectors.isHovered]: paneHover(themeVars.color.primary),
            [skinSelectors.isExpanded]: {
                borderBottomColor: themeVars.color.primary.main,
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: {
        ...FIELD,
        color: layerVars.contrast,
    },
    overlay: {
        backdropFilter: "blur(12px)",
        backgroundColor: withAlpha(MIX_INV, 25),
    },
    button: {
        borderRadius: 0,
        paddingInline: themeVars.spacing.quad,
        ...pane(themeVars.color.primary),
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isHovered]: paneHover(themeVars.color.primary),
            [skinSelectors.isActive]: panePressed(themeVars.color.primary),
            [skinSelectors.isPressed]: {
                ...pane(themeVars.color.secondary),
                ...panePressed(themeVars.color.secondary),
            },
            [skinSelectors.hasError]: pane(themeVars.color.error),
            [SkinUtils.allOf(skinSelectors.hasError, skinSelectors.isHovered)]: paneHover(themeVars.color.error),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        ...pane(themeVars.color.primary),
        borderBottomColor: withAlpha(layerVars.contrast, 25),
        borderRadius: 0,
        fontSize: themeVars.fontSize.small,
        boxShadow: "none",
        selectors: {
            [skinSelectors.isHovered]: paneHover(themeVars.color.primary),
            [skinSelectors.isActive]: panePressed(themeVars.color.primary),
            [skinSelectors.isSelected]: {
                borderBottomColor: themeVars.color.primary.main,
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
                ...paneHover(themeVars.color.primary),
                color: layerVars.contrast,
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
                backgroundImage: "none",
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
        ...SURFACE,
        backgroundColor: withAlpha(layerVars.main, 75),
        color: layerVars.contrast,
    },
    checkboxBox: {
        ...FIELD,
        selectors: SWITCH_BOX_STATES,
    },
    checkboxMark: {
        color: layerVars.contrast,
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
        backgroundColor: layerVars.contrast,
    },
    toggleTrack: {
        ...FIELD,
        borderRadius: themeVars.borderRadius.full,
        selectors: SWITCH_BOX_STATES,
    },
    toggleHandle: {
        borderRadius: "50%",
        backgroundColor: withAlpha(layerVars.contrast, 50),
        backgroundImage: `radial-gradient(circle at 35% 30%, ${withAlpha("white", 75)}, transparent 60%)`,
        selectors: {
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                backgroundColor: layerVars.contrast,
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
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        backgroundImage: bar(themeVars.color.primary.main),
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundImage: bar(themeVars.color.error.main),
            },
        },
    },
    rangeTrack: {
        ...FIELD,
    },
    rangeFill: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        backgroundImage: bar(themeVars.color.primary.main),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundImage: bar(themeVars.color.error.main),
            },
        },
    },
    rangeThumb: {
        border: `2px solid ${themeVars.color.primary.main}`,
        borderRadius: "50%",
        backgroundColor: withAlpha(layerVars.main, 50),
        backgroundImage: `radial-gradient(circle at 35% 30%, ${withAlpha("white", 60)}, transparent 60%)`,
        boxShadow: SHADOW,
        backdropFilter: "blur(4px)",
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
        borderRadius: themeVars.borderRadius.full,
        fontWeight: "bold",
    },
    slideButtonFill: {
        backgroundColor: "transparent",
        backgroundImage: bar(themeVars.color.primary.main),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundImage: bar(themeVars.color.error.main),
            },
        },
    },
    slideButtonThumb: {
        border: `2px solid ${themeVars.color.primary.main}`,
        borderRadius: "50%",
        backgroundColor: withAlpha(layerVars.main, 50),
        backgroundImage: `radial-gradient(circle at 35% 30%, ${withAlpha("white", 60)}, transparent 60%)`,
        boxShadow: SHADOW,
        color: themeVars.color.primary.main,
        selectors: {
            [skinSelectors.hasError]: {
                color: themeVars.color.error.main,
                borderColor: themeVars.color.error.main,
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
                backgroundColor: withAlpha(themeVars.color.primary.main, 75),
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
        ...pane(themeVars.color.secondary),
        borderRadius: 0,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.xSmall,
        boxShadow: "none",
        selectors: {
            [skinSelectors.isHovered]: paneHover(themeVars.color.secondary),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: 0,
        backgroundImage: sheen(
            layerVars.contrast,
            `linear-gradient(${withAlpha("white", 5)}, ${withAlpha("white", 10)})`,
        ),
    },
    selectionFloater: {
        borderRadius: 0,
        borderBottom: `2px solid ${themeVars.color.primary.main}`,
        backgroundImage: sheen(
            themeVars.color.primary.main,
            `linear-gradient(${withAlpha(themeVars.color.primary.main, 10)}, ${withAlpha(themeVars.color.primary.main, 20)})`,
        ),
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
                backgroundImage: sheen(
                    layerVars.contrast,
                    `linear-gradient(${withAlpha("white", 5)}, ${withAlpha("white", 10)})`,
                ),
            },
            ...ITEM_STATES,
        },
    },
});

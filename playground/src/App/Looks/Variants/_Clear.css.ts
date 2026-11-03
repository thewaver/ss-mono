import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors, lookVars } from "../Look.css";

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
    `linear-gradient(${withAlpha("white", 30)}, transparent 50%), linear-gradient(${lookVars.barAngle}, ${withAlpha(color, 40)}, ${color})`;

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
    [lookSelectors.isHovered]: FIELD_HOVER,
    [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
        borderColor: themeVars.color.primary.main,
        backgroundImage: sheen(
            themeVars.color.primary.main,
            `linear-gradient(${withAlpha(themeVars.color.primary.main, 40)}, ${withAlpha(themeVars.color.primary.main, 60)})`,
        ),
    },
    [lookSelectors.withinError]: {
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

const SURFACE = {
    border: `1px solid ${withAlpha(themeVars.color.surface.contrast, 15)}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: withAlpha(themeVars.color.surface.dark, 40),
    backgroundImage: `radial-gradient(75% 40% at top, ${withAlpha("white", 10)}, transparent)`,
    color: themeVars.color.surface.contrast,
    boxShadow: `0 4px 16px ${withAlpha(SHADOW_COLOR, 75)}`,
    backdropFilter: "blur(8px)",
} as const;

LookUtils.define(_clear, {
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
    hollowSurface: LookUtils.hollow(SURFACE),
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
            [lookSelectors.isHovered]: paneHover(themeVars.color.primary),
            [lookSelectors.isExpanded]: {
                borderBottomColor: themeVars.color.primary.main,
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: {
        ...FIELD,
        color: layerVars.contrast,
    },
    opaqueOverlay: {
        backgroundColor: "black",
    },
    blurredOverlay: {
        backdropFilter: "blur(12px)",
        backgroundColor: withAlpha(MIX_INV, 25),
    },
    button: {
        borderRadius: 0,
        paddingInline: themeVars.spacing.quad,
        ...pane(themeVars.color.primary),
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isHovered]: paneHover(themeVars.color.primary),
            [lookSelectors.isActive]: panePressed(themeVars.color.primary),
            [lookSelectors.isPressed]: {
                ...pane(themeVars.color.secondary),
                ...panePressed(themeVars.color.secondary),
            },
            [lookSelectors.hasError]: pane(themeVars.color.error),
            [LookUtils.allOf(lookSelectors.hasError, lookSelectors.isHovered)]: paneHover(themeVars.color.error),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        ...pane(themeVars.color.primary),
        borderBottomColor: withAlpha(layerVars.contrast, 25),
        borderRadius: 0,
        fontSize: themeVars.fontSize.small,
        boxShadow: "none",
        selectors: {
            [lookSelectors.isHovered]: paneHover(themeVars.color.primary),
            [lookSelectors.isActive]: panePressed(themeVars.color.primary),
            [lookSelectors.isSelected]: {
                borderBottomColor: themeVars.color.primary.main,
                color: themeVars.color.primary.main,
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    decoration: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: withAlpha(layerVars.contrast, 75),
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                ...paneHover(themeVars.color.primary),
                color: layerVars.contrast,
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
                backgroundImage: "none",
                borderStyle: "dashed",
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
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: layerVars.contrast,
            },
        },
    },
    progressTrack: {
        ...FIELD,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    progressFill: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        backgroundImage: bar(themeVars.color.primary.main),
        selectors: {
            [lookSelectors.withinError]: {
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
            [lookSelectors.hasError]: {
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
            [lookSelectors.isStart]: {
                borderColor: themeVars.color.secondary.main,
            },
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonTrack: {
        ...FIELD,
        borderRadius: themeVars.borderRadius.full,
    },
    slideButtonFill: {
        backgroundColor: "transparent",
        backgroundImage: bar(themeVars.color.primary.main),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundImage: bar(themeVars.color.error.main),
            },
        },
    },
    slideButtonHint: {
        fontWeight: "bold",
    },
    slideButtonThumb: {
        border: `2px solid ${themeVars.color.primary.main}`,
        borderRadius: "50%",
        backgroundColor: withAlpha(layerVars.main, 50),
        backgroundImage: `radial-gradient(circle at 35% 30%, ${withAlpha("white", 60)}, transparent 60%)`,
        boxShadow: SHADOW,
        selectors: {
            [lookSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonArrow: {
        stroke: themeVars.color.primary.main,
        selectors: {
            [lookSelectors.hasError]: {
                stroke: themeVars.color.error.main,
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
                backgroundColor: withAlpha(themeVars.color.primary.main, 75),
            },
            [lookSelectors.lineActive]: {
                filter: themeVars.active.filter,
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
            [lookSelectors.isHovered]: paneHover(themeVars.color.secondary),
            [lookSelectors.isDisabled]: DISABLED,
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
            [lookSelectors.isHovered]: {
                backgroundImage: sheen(
                    layerVars.contrast,
                    `linear-gradient(${withAlpha("white", 5)}, ${withAlpha("white", 10)})`,
                ),
            },
            ...ITEM_STATES,
        },
    },
});

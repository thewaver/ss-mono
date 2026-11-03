import { style } from "@vanilla-extract/css";

import { LookUtils } from "../Look.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { lookSelectors } from "../Look.css";

export const _plastic = style({});

type Family = typeof themeVars.color.primary;

const withAlpha = (color: string, percent: number) => `rgb(from ${color} r g b / ${percent}%)`;

const glow = (color: string, percent: number) => `0 0 15px ${withAlpha(color, percent)}`;

const molded = (family: Family) => ({
    backgroundColor: withAlpha(family.main, 80),
    backgroundImage: "none",
    color: family.contrast,
    boxShadow: glow(family.main, 20),
});

const moldedHover = (family: Family) => ({
    backgroundColor: family.main,
    boxShadow: glow(family.main, 40),
});

const DISABLED = {
    filter: themeVars.disabled.filter,
    opacity: themeVars.disabled.opacity,
} as const;

const FIELD = {
    border: "none",
    borderRadius: 0,
    backgroundColor: withAlpha(themeVars.color.primary.main, 25),
    boxShadow: glow(themeVars.color.primary.main, 20),
} as const;

const FIELD_HOVER = {
    backgroundColor: withAlpha(themeVars.color.primary.main, 40),
    boxShadow: glow(themeVars.color.primary.main, 40),
} as const;

const SWITCH_BOX_STATES = {
    [lookSelectors.isHovered]: FIELD_HOVER,
    [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: moldedHover(themeVars.color.primary),
    [lookSelectors.withinError]: {
        backgroundColor: withAlpha(themeVars.color.error.main, 40),
        boxShadow: glow(themeVars.color.error.main, 40),
    },
} as const;

const ITEM_STATES = {
    [lookSelectors.isSelected]: {
        backgroundColor: withAlpha(themeVars.color.primary.main, 40),
        fontWeight: "bold",
    },
    [lookSelectors.isDisabled]: {
        backgroundColor: "transparent",
        ...DISABLED,
    },
} as const;

const PANEL = {
    borderRadius: 0,
    backgroundColor: withAlpha(themeVars.color.primary.main, 15),
    color: layerVars.contrast,
} as const;

const SURFACE = {
    borderRadius: 0,
    backgroundColor: themeVars.color.surface.dark,
    backgroundImage: `linear-gradient(${withAlpha(themeVars.color.primary.main, 10)}, ${withAlpha(themeVars.color.primary.main, 5)})`,
    color: themeVars.color.surface.contrast,
    boxShadow: glow(themeVars.color.primary.main, 15),
} as const;

LookUtils.define(_plastic, {
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        backgroundImage: `linear-gradient(315deg, ${themeVars.color.background.dark}, ${withAlpha(themeVars.color.primary.dark, 15)})`,
        color: themeVars.color.background.contrast,
    },
    drawer: {
        ...SURFACE,
        boxShadow: glow(themeVars.color.primary.main, 25),
    },
    surface: SURFACE,
    hollowSurface: LookUtils.hollow(SURFACE),
    panel: PANEL,
    tooltip: {
        ...molded(themeVars.color.secondary),
        borderRadius: 0,
    },
    accordionHeader: {
        ...PANEL,
        backgroundColor: withAlpha(themeVars.color.primary.main, 25),
        boxShadow: glow(themeVars.color.primary.main, 15),
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: FIELD_HOVER,
            [lookSelectors.isExpanded]: {
                ...molded(themeVars.color.primary),
            },
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: PANEL,
    opaqueOverlay: {
        backgroundColor: "black",
    },
    blurredOverlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
        backgroundColor: withAlpha(themeVars.color.primary.dark, 15),
    },
    button: {
        borderRadius: 0,
        paddingInline: themeVars.spacing.quad,
        ...molded(themeVars.color.primary),
        fontWeight: "bold",
        selectors: {
            [lookSelectors.isHovered]: moldedHover(themeVars.color.primary),
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isPressed]: molded(themeVars.color.secondary),
            [lookSelectors.hasError]: molded(themeVars.color.error),
            [LookUtils.allOf(lookSelectors.hasError, lookSelectors.isHovered)]: moldedHover(themeVars.color.error),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        borderRadius: 0,
        backgroundColor: withAlpha(themeVars.color.primary.main, 20),
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: withAlpha(themeVars.color.primary.main, 40),
                boxShadow: glow(themeVars.color.primary.main, 20),
            },
            [lookSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [lookSelectors.isSelected]: molded(themeVars.color.primary),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    decoration: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: layerVars.contrast,
        selectors: {
            [lookSelectors.isHoveredPressable]: {
                color: layerVars.contrast,
                backgroundColor: withAlpha(themeVars.color.primary.main, 40),
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
                backgroundColor: withAlpha(themeVars.color.primary.main, 15),
                boxShadow: "none",
            },
            [lookSelectors.hasError]: {
                backgroundColor: withAlpha(themeVars.color.error.main, 40),
                boxShadow: glow(themeVars.color.error.main, 40),
            },
            [lookSelectors.isDisabled]: DISABLED,
            [lookSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: themeVars.color.primary.contrast,
                fontSize: themeVars.fontSize.medium,
            },
            [lookSelectors.fieldTextDisabled]: {
                color: withAlpha(layerVars.contrast, 50),
            },
        },
    },
    dropdown: {
        ...SURFACE,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: glow(themeVars.color.primary.main, 30),
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
        borderRadius: 0,
        backgroundColor: withAlpha(layerVars.contrast, 75),
        selectors: {
            [LookUtils.anyOf(lookSelectors.withinChecked, lookSelectors.withinMixed)]: {
                backgroundColor: themeVars.color.primary.contrast,
            },
        },
    },
    progressTrack: {
        ...FIELD,
        backgroundColor: withAlpha(themeVars.color.primary.main, 20),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: withAlpha(themeVars.color.error.main, 20),
                boxShadow: glow(themeVars.color.error.main, 20),
            },
        },
    },
    progressFill: {
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.main,
        boxShadow: glow(themeVars.color.primary.main, 60),
        selectors: {
            [lookSelectors.withinError]: {
                backgroundColor: themeVars.color.error.main,
                boxShadow: glow(themeVars.color.error.main, 60),
            },
        },
    },
    rangeTrack: {
        borderRadius: 0,
        backgroundColor: withAlpha(themeVars.color.primary.main, 25),
    },
    rangeFill: {
        borderRadius: 0,
        backgroundColor: themeVars.color.primary.main,
        boxShadow: glow(themeVars.color.primary.main, 40),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                boxShadow: glow(themeVars.color.error.main, 40),
            },
        },
    },
    rangeThumb: {
        borderRadius: 0,
        backgroundColor: layerVars.contrast,
        boxShadow: glow(themeVars.color.primary.main, 60),
        selectors: {
            [lookSelectors.isStart]: {
                boxShadow: glow(themeVars.color.secondary.main, 60),
            },
            [lookSelectors.hasError]: {
                boxShadow: glow(themeVars.color.error.main, 60),
            },
        },
    },
    slideButtonTrack: {
        ...FIELD,
        backgroundColor: withAlpha(themeVars.color.primary.main, 20),
    },
    slideButtonFill: {
        backgroundColor: withAlpha(themeVars.color.primary.main, 60),
        selectors: {
            [lookSelectors.hasError]: {
                backgroundColor: withAlpha(themeVars.color.error.main, 60),
            },
        },
    },
    slideButtonHint: {
        fontWeight: "bold",
    },
    slideButtonThumb: {
        borderRadius: 0,
        ...moldedHover(themeVars.color.primary),
        selectors: {
            [lookSelectors.hasError]: moldedHover(themeVars.color.error),
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
                backgroundColor: withAlpha(themeVars.color.primary.main, 20),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [lookSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: glow(themeVars.color.primary.main, 60),
            },
            [lookSelectors.lineActive]: {
                filter: themeVars.active.filter,
            },
        },
    },
    tag: {
        borderRadius: 0,
        paddingInline: themeVars.spacing.full,
        ...molded(themeVars.color.secondary),
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [lookSelectors.isHovered]: moldedHover(themeVars.color.secondary),
            [lookSelectors.isDisabled]: DISABLED,
        },
    },
    hoverFloater: {
        borderRadius: 0,
        backgroundColor: withAlpha(themeVars.color.primary.main, 20),
    },
    selectionFloater: {
        borderRadius: 0,
        backgroundColor: withAlpha(themeVars.color.primary.main, 40),
        boxShadow: glow(themeVars.color.primary.main, 30),
    },
    itemWithFloater: {
        borderRadius: 0,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isSelected]: {
                fontWeight: "bold",
            },
            [lookSelectors.isDisabled]: ITEM_STATES[lookSelectors.isDisabled],
        },
    },
    itemWithoutFloater: {
        borderRadius: 0,
        fontSize: themeVars.fontSize.medium,
        selectors: {
            [lookSelectors.isHovered]: {
                backgroundColor: withAlpha(themeVars.color.primary.main, 20),
            },
            ...ITEM_STATES,
        },
    },
});

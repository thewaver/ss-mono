import { style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors } from "../Skin.css";

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
    [skinSelectors.isHovered]: FIELD_HOVER,
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: moldedHover(themeVars.color.primary),
    [skinSelectors.hasErrorWithin]: {
        backgroundColor: withAlpha(themeVars.color.error.main, 40),
        boxShadow: glow(themeVars.color.error.main, 40),
    },
} as const;

const ITEM_STATES = {
    [skinSelectors.isSelected]: {
        backgroundColor: withAlpha(themeVars.color.primary.main, 40),
        fontWeight: "bold",
    },
    [skinSelectors.isDisabled]: {
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

SkinUtils.define(_plastic, {
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
    hollowSurface: SkinUtils.hollow(SURFACE),
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
            [skinSelectors.isHovered]: FIELD_HOVER,
            [skinSelectors.isExpanded]: {
                ...molded(themeVars.color.primary),
            },
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    accordionPanel: PANEL,
    overlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
        backgroundColor: withAlpha(themeVars.color.primary.dark, 15),
    },
    button: {
        borderRadius: 0,
        paddingInline: themeVars.spacing.quad,
        ...molded(themeVars.color.primary),
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isHovered]: moldedHover(themeVars.color.primary),
            [skinSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [skinSelectors.isPressed]: molded(themeVars.color.secondary),
            [skinSelectors.hasError]: molded(themeVars.color.error),
            [SkinUtils.allOf(skinSelectors.hasError, skinSelectors.isHovered)]: moldedHover(themeVars.color.error),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    buttonSimple: {
        borderRadius: 0,
        backgroundColor: withAlpha(themeVars.color.primary.main, 20),
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundColor: withAlpha(themeVars.color.primary.main, 40),
                boxShadow: glow(themeVars.color.primary.main, 20),
            },
            [skinSelectors.isActive]: {
                filter: themeVars.active.filter,
            },
            [skinSelectors.isSelected]: molded(themeVars.color.primary),
            [skinSelectors.isDisabled]: DISABLED,
        },
    },
    decoration: {
        borderRadius: 0,
        backgroundColor: "transparent",
        color: layerVars.contrast,
        selectors: {
            [skinSelectors.isHovered]: {
                color: layerVars.contrast,
                backgroundColor: withAlpha(themeVars.color.primary.main, 40),
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
                backgroundColor: withAlpha(themeVars.color.primary.main, 15),
                boxShadow: "none",
            },
            [skinSelectors.hasError]: {
                backgroundColor: withAlpha(themeVars.color.error.main, 40),
                boxShadow: glow(themeVars.color.error.main, 40),
            },
            [skinSelectors.isDisabled]: DISABLED,
            [skinSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: themeVars.color.primary.contrast,
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
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                backgroundColor: themeVars.color.primary.contrast,
            },
        },
    },
    progressTrack: {
        ...FIELD,
        backgroundColor: withAlpha(themeVars.color.primary.main, 20),
        selectors: {
            [skinSelectors.hasError]: {
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
            [skinSelectors.hasErrorWithin]: {
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
            [skinSelectors.hasError]: {
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
            [skinSelectors.isStart]: {
                boxShadow: glow(themeVars.color.secondary.main, 60),
            },
            [skinSelectors.hasError]: {
                boxShadow: glow(themeVars.color.error.main, 60),
            },
        },
    },
    slideButtonTrack: {
        ...FIELD,
        backgroundColor: withAlpha(themeVars.color.primary.main, 20),
        fontWeight: "bold",
    },
    slideButtonFill: {
        backgroundColor: withAlpha(themeVars.color.primary.main, 60),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: withAlpha(themeVars.color.error.main, 60),
            },
        },
    },
    slideButtonThumb: {
        borderRadius: 0,
        ...moldedHover(themeVars.color.primary),
        color: themeVars.color.primary.contrast,
        selectors: {
            [skinSelectors.hasError]: {
                ...moldedHover(themeVars.color.error),
                color: themeVars.color.error.contrast,
            },
        },
    },
    scrollerTrack: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: withAlpha(themeVars.color.primary.main, 20),
            },
        },
    },
    scrollerThumb: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: glow(themeVars.color.primary.main, 60),
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
        ...molded(themeVars.color.secondary),
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [skinSelectors.isHovered]: moldedHover(themeVars.color.secondary),
            [skinSelectors.isDisabled]: DISABLED,
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
            [skinSelectors.isSelected]: {
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
                backgroundColor: withAlpha(themeVars.color.primary.main, 20),
            },
            ...ITEM_STATES,
        },
    },
});

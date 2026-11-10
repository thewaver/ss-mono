import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinBaseColor } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

export const neon = style({
    vars: {
        [skinVars.rangeTrackThickness]: "20px",
    },
});

const darkGlow = (alphaPercent: number) =>
    [
        `inset 0 0 1px 1px rgb(from black r g b / ${alphaPercent * 0.8}%)`,
        `inset 0 0 8px 2px rgb(from black r g b  / ${alphaPercent * 0.65}%)`,
        `inset 0 0 32px 4px rgb(from black r g b  / ${alphaPercent * 0.5}%)`,
        `inset 0 0 64px 8px rgb(from black r g b  / ${alphaPercent * 0.35}%)`,
        `0 0 1px 1px rgb(from black r g b  / ${alphaPercent * 0.8}%)`,
        `0 0 8px 2px rgb(from black r g b  / ${alphaPercent * 0.65}%)`,
        `0 0 32px 4px rgb(from black r g b  / ${alphaPercent * 0.5}%)`,
        `0 0 64px 8px rgb(from black r g b  / ${alphaPercent * 0.35}%)`,
    ].join(", ");

const lightGlow = (color: string, alphaPercent: number) =>
    [
        `inset 0 0 1px 1px hsl(from ${color} h 100 min(l * 1.5, 100) / ${alphaPercent * 1}%)`,
        `inset 0 0 8px 2px hsl(from ${color} h 100 min(l * 1, 100) / ${alphaPercent * 0.5}%)`,
        `inset 0 0 32px 4px hsl(from ${color} h 100 min(l * 1, 100) / ${alphaPercent * 0.25}%)`,
        `inset 0 0 64px 8px hsl(from ${color} h 100 min(l * 1, 100) / ${alphaPercent * 0.1}%)`,
        `0 0 1px 1px hsl(from ${color} h 100 min(l * 1.5, 100) / ${alphaPercent * 1}%)`,
        `0 0 8px 2px hsl(from ${color} h 100 min(l * 1, 100) / ${alphaPercent * 0.5}%)`,
        `0 0 32px 4px hsl(from ${color} h 100 min(l * 1, 100) / ${alphaPercent * 0.25}%)`,
        `0 0 64px 8px hsl(from ${color} h 100 min(l * 1, 100) / ${alphaPercent * 0.1}%)`,
    ].join(", ");

const INTERACTIBLE_STATES: StyleRule["selectors"] = {
    [skinSelectors.isHovered]: {
        filter: themeVars.hover.filter,
    },
    [skinSelectors.isActive]: {
        filter: themeVars.active.filter,
    },
    [skinSelectors.isDisabled]: {
        filter: themeVars.disabled.filter,
        opacity: themeVars.disabled.opacity,
    },
} as const;

const INPUT_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
    [skinSelectors.isReadOnly]: {
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
    },
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {},
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        boxShadow: lightGlow(themeVars.color.error.main, 100),
        color: themeVars.color.error.main,
    },
});

const ITEM_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
    [skinSelectors.isSelected]: {
        color: themeVars.color.primary.main,
        fontWeight: "bold",
    },
    [skinSelectors.isDisabled]: {
        backgroundColor: "transparent",
        boxShadow: "none",
    },
});

const SWITCH_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(INPUT_STATES, {
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
        boxShadow: lightGlow(themeVars.color.primary.main, 100),
        color: themeVars.color.primary.main,
    },
});

const INPUT_SHELL: StyleRule = {
    backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
    backdropFilter: "blur(20px)",
    boxShadow: lightGlow(layerVars.contrast, 25),
    color: layerVars.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
    boxShadow: darkGlow(25),
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    fontSize: themeVars.fontSize.medium,
    selectors: {
        ...ITEM_STATES,
    },
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
    boxShadow: lightGlow(layerVars.contrast, 25),
};

const ITEM_FLOATER_SELECTED: StyleRule = {
    color: themeVars.color.primary.main,
};

const TAB_FLOATER_HOVER: StyleRule = {
    ...ITEM_FLOATER_HOVER,
};

const TAB_FLOATER_SELECTED: StyleRule = {
    ...ITEM_FLOATER_SELECTED,
    boxShadow: lightGlow(themeVars.color.primary.main, 100),
};

const surface = (color: SkinBaseColor): StyleRule => ({
    backgroundColor: [color.main, `rgb(from ${color.main} r g b / 50%)`],
    backdropFilter: "blur(20px)",
    boxShadow: darkGlow(50),
    color: color.contrast,
    fontSize: themeVars.fontSize.medium,
});

SkinUtils.define(neon, {
    accordionHeader: {
        selectors: ObjectUtils.deepMerge(SkinUtils.joinedCorners(), INTERACTIBLE_STATES, {
            [skinSelectors.isExpanded]: {
                color: themeVars.color.primary.main,
                fontWeight: "bold",
            },
        }),
    },
    accordionPanel: {
        selectors: {
            ...SkinUtils.joinedCorners(),
        },
    },
    accordionWrapper: {
        ...ACCORDION,
    },
    button: {
        paddingInline: themeVars.spacing.double,
        boxShadow: lightGlow(layerVars.contrast, 100),
        color: layerVars.contrast,
        fontWeight: "bold",
        selectors: ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
            [skinSelectors.isPressed]: {
                boxShadow: lightGlow(themeVars.color.primary.main, 100),
                color: themeVars.color.primary.main,
            },
            [skinSelectors.hasError]: {
                boxShadow: lightGlow(themeVars.color.error.main, 100),
                color: themeVars.color.error.main,
            },
            [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
                boxShadow: lightGlow(themeVars.color.error.main, 100),
                color: themeVars.color.primary.main,
            },
        }),
    },
    buttonSimple: {
        boxShadow: lightGlow(layerVars.contrast, 100),
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
            [skinSelectors.isPressed]: {
                boxShadow: lightGlow(themeVars.color.primary.main, 100),
                color: themeVars.color.primary.main,
            },
            [skinSelectors.hasError]: {
                boxShadow: lightGlow(themeVars.color.error.main, 100),
                color: themeVars.color.error.main,
            },
            [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
                boxShadow: lightGlow(themeVars.color.error.main, 100),
                color: themeVars.color.primary.main,
            },
        }),
    },
    checkboxBox: {
        ...SWITCH_SHELL,
        selectors: {
            ...SWITCH_STATES,
        },
    },
    checkboxMark: {
        color: themeVars.color.primary.main,
        fontSize: themeVars.fontSize.medium,
        fontWeight: "bold",
        [skinSelectors.hasErrorWithin]: {
            color: themeVars.color.error.main,
        },
    },
    decoration: {
        backgroundColor: "transparent",
        opacity: 0.75,
        selectors: {
            ...INTERACTIBLE_STATES,
        },
    },
    drawer: {
        backgroundColor: [themeVars.color.surface.dark, `rgb(from ${themeVars.color.surface.dark} r g b / 50%)`],
        backdropFilter: "blur(20px)",
        boxShadow: darkGlow(50),
        color: themeVars.color.surface.contrast,
    },
    dropdown: {
        ...INPUT_SHELL,
    },
    dropZone: {
        border: [`2px dashed ${layerVars.contrast}`, `2px dashed rgb(from ${layerVars.contrast} r g b / 25%)`],
        selectors: ObjectUtils.deepMerge(INPUT_STATES, {
            [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
                border: "2px solid white",
            },
            [skinSelectors.isCarrying]: {
                border: "2px solid white",
                boxShadow: lightGlow(layerVars.contrast, 25),
            },
            [skinSelectors.isReceiving]: {
                border: "2px solid white",
                boxShadow: lightGlow(themeVars.color.primary.main, 100),
                backgroundColor: [
                    themeVars.color.primary.main,
                    `rgb(from ${themeVars.color.primary.main} r g b / 10%)`,
                ],
            },
        }),
    },
    input: {
        ...INPUT_SHELL,
        selectors: ObjectUtils.deepMerge(INPUT_STATES, {
            [skinSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: themeVars.color.primary.main,
                fontSize: themeVars.fontSize.medium,
            },
            [skinSelectors.fieldTextDisabled]: {
                color: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / ${themeVars.disabled.opacity})`],
            },
        }),
    },
    itemBase: {
        ...ITEM,
        selectors: ObjectUtils.deepMerge(ITEM_STATES, {
            [skinSelectors.isHoveredWithoutFloater]: {
                ...ITEM_FLOATER_HOVER,
            },
            [skinSelectors.isSelectedWithoutFloater]: {
                ...ITEM_FLOATER_SELECTED,
            },
        }),
    },
    itemHoverFloater: {
        ...ITEM_FLOATER_HOVER,
    },
    itemSelectionFloater: {
        ...ITEM_FLOATER_SELECTED,
    },
    itemStatic: {
        ...ITEM,
        ...ITEM_FLOATER_HOVER,
    },
    overlay: {
        backdropFilter: "blur(20px) grayscale(75%)",
    },
    pageBackground: {
        backgroundColor: themeVars.color.background.light,
        backgroundImage: `linear-gradient(135deg, hsl(from ${themeVars.color.primary.light} h 100 l / 10%), transparent, hsl(from ${themeVars.color.primary.light} h 100 l / 10%))`,
        color: themeVars.color.background.contrast,
        fontFamily: "monospace",
    },
    pageContainer: {
        ...surface(SkinUtils.extendColor(layerVars)),
    },
    panel: {
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
        boxShadow: darkGlow(25),
        color: layerVars.contrast,
    },
    progressFill: {
        backgroundColor: themeVars.color.primary.main,
        boxShadow: lightGlow(themeVars.color.primary.main, 100),
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.main,
                boxShadow: lightGlow(themeVars.color.error.main, 100),
            },
        },
    },
    progressTip: {},
    progressTrack: {
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 25%)`],
        boxShadow: darkGlow(25),
        selectors: {
            [skinSelectors.hasError]: {
                boxShadow: lightGlow(themeVars.color.error.main, 100),
            },
        },
    },
    radioBox: {
        ...SWITCH_SHELL,
        borderRadius: "50%",
        selectors: {
            ...SWITCH_STATES,
        },
    },
    radioDot: {
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary.main,
        [skinSelectors.hasErrorWithin]: {
            backgroundColor: themeVars.color.error.main,
        },
    },
    rangeFill: {
        backgroundColor: themeVars.color.primary.main,
        boxShadow: lightGlow(themeVars.color.primary.main, 100),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                boxShadow: lightGlow(themeVars.color.error.main, 100),
            },
        },
    },
    rangeThumb: {
        backgroundColor: themeVars.color.primary.contrast,
        boxShadow: lightGlow(themeVars.color.primary.main, 100),
        color: themeVars.color.primary.main,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.contrast,
                boxShadow: lightGlow(themeVars.color.error.main, 100),
                color: themeVars.color.error.contrast,
            },
        },
    },
    rangeTrack: {
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 25%)`],
        boxShadow: darkGlow(25),
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
    scrollerTrack: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 25%)`],
            },
        },
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.main,
        boxShadow: lightGlow(themeVars.color.primary.main, 100),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                boxShadow: lightGlow(themeVars.color.error.main, 100),
            },
        },
    },
    slideButtonThumb: {
        backgroundColor: themeVars.color.primary.contrast,
        boxShadow: lightGlow(themeVars.color.primary.main, 100),
        color: themeVars.color.primary.main,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.contrast,
                boxShadow: lightGlow(themeVars.color.error.main, 100),
                color: themeVars.color.error.main,
            },
        },
    },
    slideButtonTrack: {
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 25%)`],
        boxShadow: darkGlow(25),
        fontWeight: "bold",
    },
    surface: {
        ...surface(themeVars.color.surface),
    },
    tabsItemBase: {
        paddingBlock: themeVars.spacing.full,
        paddingInline: themeVars.spacing.double,
        fontSize: themeVars.fontSize.small,
        fontWeight: "bold",
        selectors: ObjectUtils.deepMerge(ITEM_STATES, {
            [skinSelectors.isVertical]: {
                paddingBlock: themeVars.spacing.full,
                paddingInline: themeVars.spacing.double,
            },
            [skinSelectors.isHoveredWithoutFloater]: {
                ...TAB_FLOATER_HOVER,
            },
            [skinSelectors.isSelectedWithoutFloater]: {
                ...TAB_FLOATER_SELECTED,
            },
        }),
    },
    tabsItemHoverFloater: {
        ...TAB_FLOATER_HOVER,
    },
    tabsItemSelectionFloater: {
        ...TAB_FLOATER_SELECTED,
    },
    tabsTrack: {
        boxShadow: lightGlow(layerVars.contrast, 25),
    },
    tag: {
        paddingInline: themeVars.spacing.full,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 25%)`],
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.xSmall,
        fontWeight: "bold",
        selectors: {
            ...INTERACTIBLE_STATES,
        },
    },
    toggleThumb: {
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 75%)`],
        boxShadow: lightGlow(layerVars.contrast, 25),
        selectors: {
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: lightGlow(themeVars.color.primary.main, 100),
            },
            [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
                backgroundColor: themeVars.color.error.main,
                boxShadow: lightGlow(themeVars.color.error.main, 100),
            },
        },
    },
    toggleTrack: {
        ...SWITCH_SHELL,
        selectors: {
            ...SWITCH_STATES,
        },
    },
    tooltip: {
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
    },
});

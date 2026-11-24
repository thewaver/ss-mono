import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinColorFamily } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";
import { SkinBaseUtils } from "../SkinBase.utils";

import { themeVars } from "../../Theme.css";
import { skinSelectors } from "../Skin.css";

const LEVEL = SkinUtils.computeLevelFamily(themeVars.color.layers);

export const xenon = style({});

const darkGlow = (color: string, alphaPercent: number) => [
    [
        `inset 0 0 1px 1px color-mix(in srgb, ${color} ${alphaPercent * 1}%, transparent)`,
        `inset 0 0 8px 2px color-mix(in srgb, ${color} ${alphaPercent * 0.9}%, transparent)`,
        `inset 0 0 32px 4px color-mix(in srgb, ${color} ${alphaPercent * 0.75}%, transparent)`,
        `inset 0 0 64px 8px color-mix(in srgb, ${color} ${alphaPercent * 0.5}%, transparent)`,
        `0 0 1px 1px color-mix(in srgb, ${color} ${alphaPercent * 1}%, transparent)`,
        `0 0 8px 2px color-mix(in srgb, ${color} ${alphaPercent * 0.9}%, transparent)`,
        `0 0 32px 4px color-mix(in srgb, ${color} ${alphaPercent * 0.75}%, transparent)`,
        `0 0 64px 8px color-mix(in srgb, ${color} ${alphaPercent * 0.5}%, transparent)`,
    ].join(", "),
    [
        `inset 0 0 1px 1px hsl(from ${color} h s 10 / ${alphaPercent * 1}%)`,
        `inset 0 0 8px 2px hsl(from ${color} h s 10 / ${alphaPercent * 0.9}%)`,
        `inset 0 0 32px 4px hsl(from ${color} h s 10 / ${alphaPercent * 0.75}%)`,
        `inset 0 0 64px 8px hsl(from ${color} h s 10 / ${alphaPercent * 0.5}%)`,
        `0 0 1px 1px hsl(from ${color} h s 10 / ${alphaPercent * 1}%)`,
        `0 0 8px 2px hsl(from ${color} h s 10 / ${alphaPercent * 0.9}%)`,
        `0 0 32px 4px hsl(from ${color} h s 10 / ${alphaPercent * 0.75}%)`,
        `0 0 64px 8px hsl(from ${color} h s 10 / ${alphaPercent * 0.5}%)`,
    ].join(", "),
];

const lightGlow = (color: string, alphaPercent: number) => [
    [
        `inset 0 0 1px 1px color-mix(in srgb, ${color} ${alphaPercent * 1}%, transparent)`,
        `inset 0 0 8px 2px color-mix(in srgb, ${color} ${alphaPercent * 0.5}%, transparent)`,
        `inset 0 0 32px 4px color-mix(in srgb, ${color} ${alphaPercent * 0.25}%, transparent)`,
        `inset 0 0 64px 8px color-mix(in srgb, ${color} ${alphaPercent * 0.1}%, transparent)`,
        `0 0 1px 1px color-mix(in srgb, ${color} ${alphaPercent * 1}%, transparent)`,
        `0 0 8px 2px color-mix(in srgb, ${color} ${alphaPercent * 0.5}%, transparent)`,
        `0 0 32px 4px color-mix(in srgb, ${color} ${alphaPercent * 0.25}%, transparent)`,
        `0 0 64px 8px color-mix(in srgb, ${color} ${alphaPercent * 0.1}%, transparent)`,
    ].join(", "),
    [
        `inset 0 0 1px 1px hsl(from ${color} h 100 min(l * 1.5, 100) / ${alphaPercent * 1}%)`,
        `inset 0 0 8px 2px hsl(from ${color} h 100 min(l * 1, 100) / ${alphaPercent * 0.5}%)`,
        `inset 0 0 32px 4px hsl(from ${color} h 100 min(l * 1, 100) / ${alphaPercent * 0.25}%)`,
        `inset 0 0 64px 8px hsl(from ${color} h 100 min(l * 1, 100) / ${alphaPercent * 0.1}%)`,
        `0 0 1px 1px hsl(from ${color} h 100 min(l * 1.5, 100) / ${alphaPercent * 1}%)`,
        `0 0 8px 2px hsl(from ${color} h 100 min(l * 1, 100) / ${alphaPercent * 0.5}%)`,
        `0 0 32px 4px hsl(from ${color} h 100 min(l * 1, 100) / ${alphaPercent * 0.25}%)`,
        `0 0 64px 8px hsl(from ${color} h 100 min(l * 1, 100) / ${alphaPercent * 0.1}%)`,
    ].join(", "),
];

const INPUT_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
    [skinSelectors.isReadOnly]: {
        backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 10%, transparent)`,
    },
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {},
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        boxShadow: lightGlow(themeVars.color.error.main, 100),
        color: themeVars.color.error.main,
    },
});

const ITEM_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
    [skinSelectors.isHovered]: {
        filter: "none",
    },
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
    backgroundColor: `color-mix(in srgb, ${LEVEL.main} 50%, transparent)`,
    boxShadow: lightGlow(LEVEL.contrast, 25),
    color: LEVEL.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    backgroundColor: `color-mix(in srgb, ${LEVEL.main} 50%, transparent)`,
    boxShadow: darkGlow(LEVEL.main, 50),
    color: LEVEL.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 10%, transparent)`,
    boxShadow: lightGlow(LEVEL.contrast, 10),
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

const surface = (color: SkinColorFamily): StyleRule => ({
    backgroundColor: `color-mix(in srgb, ${color.dark} 50%, transparent)`,
    backdropFilter: "blur(20px)",
    boxShadow: darkGlow(color.dark, 50),
    color: color.contrast,
    fontSize: themeVars.fontSize.medium,
});

SkinUtils.define(
    xenon,
    SkinBaseUtils.merge(LEVEL, {
        accordionHeader: {
            selectors: ObjectUtils.deepMerge(SkinUtils.joinedCorners(), SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isExpanded]: {
                    color: themeVars.color.primary.main,
                    fontWeight: "bold",
                },
            }),
        },
        accordionWrapper: {
            ...ACCORDION,
        },
        button: {
            paddingInline: themeVars.spacing.double,
            boxShadow: lightGlow(themeVars.color.primary.main, 100),
            color: themeVars.color.primary.main,
            fontWeight: "bold",
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    backgroundColor: `color-mix(in srgb, ${themeVars.color.primary.main} 25%, transparent)`,
                },
                [skinSelectors.hasError]: {
                    boxShadow: lightGlow(themeVars.color.error.main, 100),
                    color: themeVars.color.error.main,
                },
                [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
                    backgroundColor: `color-mix(in srgb, ${themeVars.color.error.main} 25%, transparent)`,
                },
            }),
        },
        buttonSimple: {
            boxShadow: lightGlow(LEVEL.contrast, 100),
            color: LEVEL.contrast,
            fontSize: themeVars.fontSize.small,
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    color: themeVars.color.primary.main,
                },
                [skinSelectors.hasError]: {
                    boxShadow: lightGlow(themeVars.color.error.main, 100),
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
                ...SkinBaseUtils.INTERACTIBLE_STATES,
            },
        },
        drawer: {
            ...surface(LEVEL),
        },
        dropdown: {
            ...INPUT_SHELL,
            backdropFilter: "blur(20px)",
        },
        input: {
            ...INPUT_SHELL,
            selectors: ObjectUtils.deepMerge(INPUT_STATES, {
                [skinSelectors.fieldTextDisabled]: {
                    color: `color-mix(in srgb, ${LEVEL.contrast} calc(${themeVars.disabled.opacity} * 100%), transparent)`,
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
        pageBackground: {
            backgroundColor: themeVars.color.layers.level0.light,
            backgroundImage: `linear-gradient(135deg, hsl(from ${themeVars.color.primary.light} h 100 l / 10%), transparent, hsl(from ${themeVars.color.primary.light} h 100 l / 10%))`,
            color: themeVars.color.layers.level0.contrast,
            fontFamily: "monospace",
        },
        pageContainer: {
            ...surface(LEVEL),
        },
        panel: {
            backgroundColor: `color-mix(in srgb, ${LEVEL.main} 50%, transparent)`,
            boxShadow: darkGlow(LEVEL.main, 50),
            color: LEVEL.contrast,
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
        progressTrack: {
            backgroundColor: `color-mix(in srgb, ${LEVEL.main} 50%, transparent)`,
            boxShadow: darkGlow(LEVEL.main, 50),
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
            selectors: {
                [skinSelectors.hasError]: {
                    backgroundColor: themeVars.color.error.contrast,
                    boxShadow: lightGlow(themeVars.color.error.main, 100),
                },
            },
        },
        rangeTrack: {
            backgroundColor: `color-mix(in srgb, ${LEVEL.main} 50%, transparent)`,
            boxShadow: darkGlow(LEVEL.main, 50),
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
            backgroundColor: `color-mix(in srgb, ${LEVEL.main} 50%, transparent)`,
            boxShadow: darkGlow(LEVEL.main, 50),
            fontWeight: "bold",
        },
        splitPaneFrame: {
            border: `2px dashed color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
        },
        surface: {
            ...surface(LEVEL),
        },
        tabsItemBase: {
            paddingBlock: themeVars.spacing.full,
            paddingInline: themeVars.spacing.double,
            fontSize: themeVars.fontSize.small,
            fontWeight: "bold",
            selectors: ObjectUtils.deepMerge(ITEM_STATES, {
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
            boxShadow: lightGlow(LEVEL.contrast, 25),
        },
        tag: {
            paddingInline: themeVars.spacing.full,
            backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
            color: LEVEL.contrast,
            fontSize: themeVars.fontSize.xSmall,
            fontWeight: "bold",
            selectors: {
                ...SkinBaseUtils.INTERACTIBLE_STATES,
            },
        },
        toggleThumb: {
            backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 75%, transparent)`,
            boxShadow: lightGlow(LEVEL.contrast, 25),
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
            backgroundColor: `color-mix(in srgb, ${LEVEL.main} 50%, transparent)`,
            boxShadow: darkGlow(LEVEL.main, 50),
            backdropFilter: "blur(20px)",
            color: LEVEL.contrast,
        },
    }),
);

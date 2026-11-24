import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinColorFamily } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";
import { SkinBaseUtils } from "../SkinBase.utils";

import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

const LEVEL = SkinUtils.computeLevelFamily(themeVars.color.layers);

export const terminal = style({});

const SEGMENT_WIDTH = 8;
const SEGMENT_GAP = 2;

const segments = (color: string) =>
    `repeating-linear-gradient(${skinVars.barAngle}, ${color} 0 ${SEGMENT_WIDTH}px, transparent ${SEGMENT_WIDTH}px ${SEGMENT_WIDTH + SEGMENT_GAP}px)`;

const INPUT_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
    [skinSelectors.isReadOnly]: {
        backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 10%, transparent)`,
    },
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {},
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        borderColor: themeVars.color.error.main,
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
        borderColor: themeVars.color.primary.main,
        color: themeVars.color.primary.main,
    },
});

const INPUT_SHELL: StyleRule = {
    border: `2px solid color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
    backgroundColor: LEVEL.dark,
    color: LEVEL.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    border: `2px solid color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
    backgroundColor: LEVEL.light,
    color: LEVEL.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    border: "2px solid transparent",
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
};

const ITEM_FLOATER_SELECTED: StyleRule = {
    color: themeVars.color.primary.main,
};

const TAB_FLOATER_HOVER: StyleRule = {
    ...ITEM_FLOATER_HOVER,
};

const TAB_FLOATER_SELECTED: StyleRule = {
    ...ITEM_FLOATER_SELECTED,
    border: `2px solid ${themeVars.color.primary.main}`,
};

const surface = (color: SkinColorFamily): StyleRule => ({
    border: `2px solid color-mix(in srgb, ${color.contrast} 25%, transparent)`,
    backgroundColor: color.main,
    color: color.contrast,
    fontSize: themeVars.fontSize.medium,
});

SkinUtils.define(
    terminal,
    SkinBaseUtils.merge(LEVEL, {
        accordionHeader: {
            selectors: ObjectUtils.deepMerge(SkinUtils.joinedCorners(), SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isExpanded]: {
                    border: `2px solid ${themeVars.color.primary.main}`,
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
            border: `2px solid ${themeVars.color.primary.main}`,
            color: themeVars.color.primary.main,
            fontWeight: "bold",
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    backgroundColor: `color-mix(in srgb, ${themeVars.color.primary.main} 25%, transparent)`,
                },
                [skinSelectors.hasError]: {
                    borderColor: themeVars.color.error.main,
                    color: themeVars.color.error.main,
                },
                [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
                    backgroundColor: `color-mix(in srgb, ${themeVars.color.error.main} 25%, transparent)`,
                },
            }),
        },
        buttonSimple: {
            border: `2px solid ${LEVEL.contrast}`,
            color: LEVEL.contrast,
            fontSize: themeVars.fontSize.small,
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    color: themeVars.color.primary.main,
                },
                [skinSelectors.hasError]: {
                    borderColor: themeVars.color.error.main,
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
            backgroundColor: themeVars.color.layers.level0.main,
            color: themeVars.color.layers.level0.contrast,
            fontFamily: "monospace",
        },
        pageContainer: {
            ...surface(LEVEL),
        },
        panel: {
            border: `2px solid color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
            backgroundColor: LEVEL.light,
            color: LEVEL.contrast,
        },
        progressFill: {
            backgroundImage: segments(themeVars.color.primary.main),
            selectors: {
                [skinSelectors.hasErrorWithin]: {
                    backgroundImage: segments(themeVars.color.error.main),
                },
            },
        },
        progressTrack: {
            border: `2px solid color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
            selectors: {
                [skinSelectors.hasError]: {
                    borderColor: themeVars.color.error.main,
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
            selectors: {
                [skinSelectors.hasError]: {
                    backgroundColor: themeVars.color.error.main,
                },
            },
        },
        rangeThumb: {
            border: `2px solid ${themeVars.color.primary.main}`,
            backgroundColor: themeVars.color.primary.contrast,
            selectors: {
                [skinSelectors.hasError]: {
                    borderColor: themeVars.color.error.main,
                    backgroundColor: themeVars.color.error.contrast,
                },
            },
        },
        rangeTrack: {
            border: `2px solid color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
        },
        slideButtonFill: {
            backgroundColor: themeVars.color.primary.main,
            selectors: {
                [skinSelectors.hasError]: {
                    backgroundColor: themeVars.color.error.main,
                },
            },
        },
        slideButtonThumb: {
            border: `2px solid ${themeVars.color.primary.main}`,
            backgroundColor: themeVars.color.primary.contrast,
            color: themeVars.color.primary.main,
            selectors: {
                [skinSelectors.hasError]: {
                    borderColor: themeVars.color.error.main,
                    backgroundColor: themeVars.color.error.contrast,
                    color: themeVars.color.error.main,
                },
            },
        },
        slideButtonTrack: {
            border: `2px solid color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
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
            border: `2px solid color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
        },
        tag: {
            paddingInline: themeVars.spacing.full,
            border: `2px solid color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
            color: LEVEL.contrast,
            fontSize: themeVars.fontSize.xSmall,
            fontWeight: "bold",
            selectors: {
                ...SkinBaseUtils.INTERACTIBLE_STATES,
            },
        },
        toggleThumb: {
            backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 75%, transparent)`,
            selectors: {
                [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                    backgroundColor: themeVars.color.primary.main,
                },
                [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
                    backgroundColor: themeVars.color.error.main,
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
            border: `2px solid color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
            backgroundColor: LEVEL.light,
            color: LEVEL.contrast,
        },
    }),
);

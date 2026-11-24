import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinColorFamily } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";
import { SkinBaseUtils } from "../SkinBase.utils";

import { themeVars } from "../../Theme.css";
import { skinSelectors } from "../Skin.css";

const LEVEL = SkinUtils.computeLevelFamily(themeVars.color.layers);

export const acrylic = style({});

const SHADOW_SMALL = "0 2px 0 0 rgba(0, 0, 0, 0.75)";
const SHADOW_MEDIUM = `${SHADOW_SMALL}, 0 4px 8px 0 rgba(0, 0, 0, 0.5)`;
// const SHADOW_LARGE = `${SHADOW_MEDIUM}, 0 16px 64px 0 rgba(0, 0, 0, 0.25)`;

const sheenFromColorSet = (color: SkinColorFamily, alphaPercent: number): StyleRule => ({
    backgroundImage: [
        `radial-gradient(100% 50% at top, hsl(from ${color.light} h 100 90 / ${alphaPercent}%), transparent)`,
        `radial-gradient(100% 50% at bottom, hsl(from ${color.dark} h 100 90 / ${alphaPercent * 0.5}%), transparent)`,
        `linear-gradient(to bottom, hsl(from ${color.light} h 100 l), hsl(from ${color.dark} h 100 l))`,
    ].join(", "),
});

const sheenFromColorString = (color: string, alphaPercent: number): StyleRule => ({
    backgroundImage: [
        `radial-gradient(100% 50% at top, hsl(from ${color} h s 90 / ${alphaPercent}%), transparent)`,
        `radial-gradient(100% 50% at bottom, hsl(from ${color} h s 90 / ${alphaPercent * 0.5}%), transparent)`,
        `linear-gradient(to bottom, hsl(from ${color} h s max(l - 5, 0) / ${alphaPercent}%), hsl(from ${color} h s min(l + 5, 100) / ${alphaPercent}%))`,
    ].join(", "),
});

const INPUT_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
    [skinSelectors.isReadOnly]: {
        backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${LEVEL.main} 25%, transparent), color-mix(in srgb, ${LEVEL.main} 10%, transparent))`,
    },
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {},
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        borderColor: themeVars.color.error.main,
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
    },
});

const SWITCH_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(INPUT_STATES, {
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
        ...sheenFromColorSet(themeVars.color.primary, 100),
        border: "none",
    },
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        ...sheenFromColorSet(themeVars.color.error, 100),
        border: "none",
        color: themeVars.color.error.contrast,
    },
});

const INPUT_SHELL: StyleRule = {
    border: `2px solid color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
    backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${LEVEL.dark} 50%, transparent), color-mix(in srgb, ${LEVEL.light} 25%, transparent))`,
    boxShadow: SHADOW_SMALL,
    color: LEVEL.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${LEVEL.dark} 50%, transparent), color-mix(in srgb, ${LEVEL.light} 25%, transparent))`,
    borderRadius: themeVars.borderRadius.half,
    boxShadow: SHADOW_SMALL,
    color: LEVEL.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    ...sheenFromColorString(LEVEL.main, 25),
};

const ITEM_FLOATER_SELECTED: StyleRule = {
    color: themeVars.color.primary.main,
};

const TAB_FLOATER_HOVER_HORIZ: StyleRule = {
    ...ITEM_FLOATER_HOVER,
};

const TAB_FLOATER_HOVER_VERT: StyleRule = {
    ...ITEM_FLOATER_HOVER,
};

const TAB_FLOATER_SELECTED_HORIZ: StyleRule = {
    ...ITEM_FLOATER_SELECTED,
    border: "none",
    borderBlockEnd: `2px solid ${themeVars.color.primary.main}`,
};

const TAB_FLOATER_SELECTED_VERT: StyleRule = {
    ...ITEM_FLOATER_SELECTED,
    border: "none",
    borderInlineStart: `2px solid ${themeVars.color.primary.main}`,
};

const surface = (color: SkinColorFamily): StyleRule => ({
    ...sheenFromColorString(LEVEL.main, 25),
    backdropFilter: "blur(20px)",
    borderRadius: themeVars.borderRadius.half,
    boxShadow: SHADOW_MEDIUM,
    color: color.contrast,
    fontSize: themeVars.fontSize.medium,
});

SkinUtils.define(
    acrylic,
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
            ...sheenFromColorSet(themeVars.color.primary, 100),
            borderRadius: SkinUtils.PILL_RADIUS,
            paddingInline: themeVars.spacing.double,
            boxShadow: SHADOW_SMALL,
            color: themeVars.color.primary.contrast,
            fontWeight: "bold",
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    boxShadow: `inset 0 2px 2px rgb(0 0 0 / 100%), inset 0 2px 4px rgb(0 0 0 / 75%), inset 0 2px 8px rgb(0 0 0 / 50%)`,
                },
                [skinSelectors.hasError]: {
                    ...sheenFromColorSet(themeVars.color.error, 100),
                    color: themeVars.color.error.contrast,
                },
            }),
        },
        buttonSimple: {
            ...sheenFromColorString(LEVEL.main, 25),
            borderRadius: SkinUtils.PILL_RADIUS,
            boxShadow: SHADOW_SMALL,
            color: LEVEL.contrast,
            fontSize: themeVars.fontSize.xSmall,
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    color: themeVars.color.primary.main,
                },
                [skinSelectors.hasError]: {
                    boxShadow: [`inset 0 0 0 2px ${themeVars.color.error.main}`, SHADOW_SMALL].join(", "),
                },
            }),
        },
        checkboxBox: {
            ...SWITCH_SHELL,
            borderRadius: themeVars.borderRadius.half,
            selectors: {
                ...SWITCH_STATES,
            },
        },
        checkboxMark: {
            color: themeVars.color.primary.contrast,
            fontSize: themeVars.fontSize.medium,
            fontWeight: "bold",
        },
        decoration: {
            borderRadius: themeVars.borderRadius.half,
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
            boxShadow: SHADOW_MEDIUM,
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
        },
        pageContainer: {
            ...surface(LEVEL),
        },
        panel: {
            backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${LEVEL.dark} 50%, transparent), color-mix(in srgb, ${LEVEL.light} 25%, transparent))`,
            boxShadow: SHADOW_SMALL,
            color: LEVEL.contrast,
        },
        progressFill: {
            ...sheenFromColorSet(themeVars.color.primary, 100),
            borderRadius: SkinUtils.PILL_RADIUS,
            selectors: {
                [skinSelectors.hasErrorWithin]: {
                    ...sheenFromColorSet(themeVars.color.error, 100),
                },
            },
        },
        progressTrack: {
            borderRadius: SkinUtils.PILL_RADIUS,
            backgroundColor: `color-mix(in srgb, ${LEVEL.main} 50%, transparent)`,
            boxShadow: SHADOW_SMALL,
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
            backgroundColor: themeVars.color.primary.contrast,
        },
        rangeFill: ObjectUtils.deepMerge(SkinUtils.roundedFillEnds("20px"), {
            ...sheenFromColorSet(themeVars.color.primary, 100),
            borderRadius: SkinUtils.PILL_RADIUS,
            boxShadow: SHADOW_SMALL,
            selectors: {
                [skinSelectors.hasError]: {
                    ...sheenFromColorSet(themeVars.color.error, 100),
                },
            },
        }),
        rangeThumb: {
            ...sheenFromColorString(themeVars.color.primary.contrast, 100),
            borderRadius: "50%",
            border: `2px solid ${themeVars.color.primary.main}`,
            boxShadow: SHADOW_SMALL,
            selectors: {
                [skinSelectors.hasError]: {
                    ...sheenFromColorString(themeVars.color.error.contrast, 100),
                    borderColor: themeVars.color.error.main,
                },
            },
        },
        rangeTrack: {
            ...sheenFromColorString(LEVEL.main, 25),
            borderRadius: SkinUtils.PILL_RADIUS,
            boxShadow: SHADOW_SMALL,
        },
        slideButtonFill: {
            ...sheenFromColorSet(themeVars.color.primary, 100),
            borderRadius: SkinUtils.PILL_RADIUS,
            selectors: {
                [skinSelectors.hasError]: {
                    ...sheenFromColorSet(themeVars.color.error, 100),
                },
            },
        },
        slideButtonThumb: {
            ...sheenFromColorString(themeVars.color.primary.contrast, 100),
            borderRadius: "50%",
            border: `2px solid ${themeVars.color.primary.main}`,
            boxShadow: SHADOW_SMALL,
            color: themeVars.color.primary.main,
            selectors: {
                [skinSelectors.hasError]: {
                    ...sheenFromColorString(themeVars.color.error.contrast, 100),
                    borderColor: themeVars.color.error.main,
                    color: themeVars.color.error.main,
                },
            },
        },
        slideButtonTrack: {
            ...sheenFromColorString(LEVEL.main, 25),
            borderRadius: SkinUtils.PILL_RADIUS,
            boxShadow: SHADOW_SMALL,
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
                    ...TAB_FLOATER_HOVER_HORIZ,
                },
                [skinSelectors.isSelectedWithoutFloater]: {
                    ...TAB_FLOATER_SELECTED_HORIZ,
                },
                [SkinUtils.allOf(skinSelectors.isVertical, skinSelectors.isHoveredWithoutFloater)]: {
                    ...TAB_FLOATER_HOVER_VERT,
                },
                [SkinUtils.allOf(skinSelectors.isVertical, skinSelectors.isSelectedWithoutFloater)]: {
                    ...TAB_FLOATER_SELECTED_VERT,
                },
            }),
        },
        tabsItemHoverFloater: {
            ...TAB_FLOATER_HOVER_HORIZ,
            selectors: {
                [skinSelectors.isVertical]: {
                    ...TAB_FLOATER_HOVER_VERT,
                },
            },
        },
        tabsItemSelectionFloater: {
            ...TAB_FLOATER_SELECTED_HORIZ,
            selectors: {
                [skinSelectors.isVertical]: {
                    ...TAB_FLOATER_SELECTED_VERT,
                },
            },
        },
        tabsTrack: {
            borderBlockEnd: `2px solid color-mix(in srgb, ${LEVEL.contrast} 10%, transparent)`,
            selectors: {
                [skinSelectors.isVertical]: {
                    borderBlockEnd: "none",
                    borderInlineStart: `2px solid color-mix(in srgb, ${LEVEL.contrast} 10%, transparent)`,
                },
            },
        },
        tag: {
            ...sheenFromColorString(LEVEL.main, 25),
            borderRadius: SkinUtils.PILL_RADIUS,
            boxShadow: SHADOW_SMALL,
            paddingInline: themeVars.spacing.full,
            color: LEVEL.contrast,
            fontSize: themeVars.fontSize.xSmall,
            fontWeight: "bold",
            selectors: {
                ...SkinBaseUtils.INTERACTIBLE_STATES,
            },
        },
        toggleThumb: {
            ...sheenFromColorString(LEVEL.contrast, 100),
            borderRadius: "50%",
            selectors: {
                ...SWITCH_STATES,
            },
        },
        toggleTrack: {
            ...SWITCH_SHELL,
            borderRadius: SkinUtils.PILL_RADIUS,
        },
        tooltip: {
            backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${LEVEL.dark} 50%, transparent), color-mix(in srgb, ${LEVEL.light} 25%, transparent))`,
            boxShadow: SHADOW_MEDIUM,
            backdropFilter: "blur(20px)",
            backgroundOrigin: "border-box",
            color: LEVEL.contrast,
        },
    }),
);

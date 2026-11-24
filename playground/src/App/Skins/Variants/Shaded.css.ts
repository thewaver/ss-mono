import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinColorFamily } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";
import { SkinBaseUtils } from "../SkinBase.utils";

import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

const LEVEL = SkinUtils.computeLevelFamily(themeVars.color.layers);

export const shaded = style({});

const SHADED_RANGE_TRACK_THICKNESS = "6px";

const SHADOW_SMALL = "0 2px 0 0 rgba(0, 0, 0, 0.75)";
const SHADOW_MEDIUM = `${SHADOW_SMALL}, 0 4px 8px 0 rgba(0, 0, 0, 0.5)`;
// const SHADOW_LARGE = `${SHADOW_MEDIUM}, 0 16px 64px 0 rgba(0, 0, 0, 0.25)`;

const shade = (color: SkinColorFamily, angle: string = "315deg", isTranslucent?: boolean): StyleRule => ({
    backgroundColor: isTranslucent ? "transparent" : color.main,
    backgroundImage: `linear-gradient(${angle}, ${color.dark}, ${color.light})`,
    color: color.contrast,
});

const INPUT_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
    [skinSelectors.isReadOnly]: {
        backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 10%, transparent)`,
    },
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

const SWITCH_STATES: StyleRule["selectors"] = {
    ...INPUT_STATES,
};

const INPUT_SHELL: StyleRule = {
    border: `2px solid color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
    backgroundColor: `color-mix(in srgb, ${LEVEL.dark} 75%, transparent)`,
    boxShadow: SHADOW_SMALL,
    color: LEVEL.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: `color-mix(in srgb, ${LEVEL.dark} 50%, transparent)`,
    boxShadow: SHADOW_SMALL,
    color: LEVEL.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
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
    ...shade(color),
    borderRadius: themeVars.borderRadius.half,
    boxShadow: SHADOW_MEDIUM,
    fontSize: themeVars.fontSize.medium,
});

SkinUtils.define(
    shaded,
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
            ...shade(themeVars.color.primary),
            borderRadius: themeVars.borderRadius.half,
            paddingInline: themeVars.spacing.double,
            boxShadow: SHADOW_SMALL,
            fontWeight: "bold",
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    boxShadow: `inset 0 2px 2px rgb(0 0 0 / 75%), inset 0 4px 4px rgb(0 0 0 / 50%), inset 0 8px 8px rgb(0 0 0 / 25%)`,
                },
                [skinSelectors.hasError]: {
                    ...shade(themeVars.color.error),
                },
            }),
        },
        buttonSimple: {
            borderRadius: themeVars.borderRadius.half,
            backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
            boxShadow: SHADOW_SMALL,
            color: LEVEL.contrast,
            fontSize: themeVars.fontSize.small,
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
            color: themeVars.color.primary.main,
            fontSize: themeVars.fontSize.medium,
            fontWeight: "bold",
            [skinSelectors.hasErrorWithin]: {
                color: themeVars.color.error.main,
            },
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
        },
        input: {
            ...INPUT_SHELL,
            selectors: ObjectUtils.deepMerge(INPUT_STATES, {
                ...INPUT_STATES,
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
            ...shade(themeVars.color.layers.level0),
        },
        pageContainer: {
            ...surface(LEVEL),
        },
        panel: {
            borderRadius: themeVars.borderRadius.half,
            backgroundColor: `color-mix(in srgb, ${LEVEL.dark} 50%, transparent)`,
            boxShadow: SHADOW_SMALL,
            color: LEVEL.contrast,
        },
        progressFill: {
            ...shade(themeVars.color.primary, skinVars.barAngle),
            borderRadius: SkinUtils.PILL_RADIUS,
            selectors: {
                [skinSelectors.hasErrorWithin]: {
                    ...shade(themeVars.color.error, skinVars.barAngle),
                },
            },
        },
        progressTrack: {
            borderRadius: SkinUtils.PILL_RADIUS,
            backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
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
            backgroundColor: themeVars.color.primary.main,
            [skinSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
        rangeFill: ObjectUtils.deepMerge(SkinUtils.roundedFillEnds("20px"), {
            ...shade(themeVars.color.primary, skinVars.barAngle),
            borderRadius: SkinUtils.PILL_RADIUS,
            boxShadow: SHADOW_SMALL,
            selectors: {
                [skinSelectors.hasError]: {
                    ...shade(themeVars.color.error, skinVars.barAngle),
                },
            },
        }),
        rangeThumb: {
            borderRadius: "50%",
            border: `2px solid ${themeVars.color.primary.main}`,
            backgroundColor: themeVars.color.primary.contrast,
            boxShadow: SHADOW_SMALL,
            selectors: {
                [skinSelectors.isStart]: {
                    borderColor: themeVars.color.primary.dark,
                },
                [skinSelectors.hasError]: {
                    borderColor: themeVars.color.error.main,
                    backgroundColor: themeVars.color.error.contrast,
                },
            },
        },
        rangeTrack: {
            height: SHADED_RANGE_TRACK_THICKNESS,
            borderRadius: SkinUtils.PILL_RADIUS,
            backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
            boxShadow: SHADOW_SMALL,
            selectors: {
                [skinSelectors.isVertical]: {
                    width: SHADED_RANGE_TRACK_THICKNESS,
                },
            },
        },
        slideButtonFill: {
            ...shade(themeVars.color.primary, skinVars.barAngle),
            borderRadius: SkinUtils.PILL_RADIUS,
            backgroundColor: themeVars.color.primary.main,
            selectors: {
                [skinSelectors.hasError]: {
                    ...shade(themeVars.color.error, skinVars.barAngle),
                },
            },
        },
        slideButtonThumb: {
            borderRadius: "50%",
            border: `2px solid ${themeVars.color.primary.main}`,
            backgroundColor: themeVars.color.primary.contrast,
            boxShadow: SHADOW_SMALL,
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
            borderRadius: SkinUtils.PILL_RADIUS,
            backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 10%, transparent)`,
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
            borderRadius: themeVars.borderRadius.half,
            paddingInline: themeVars.spacing.full,
            backgroundColor: `color-mix(in srgb, ${LEVEL.contrast} 25%, transparent)`,
            boxShadow: SHADOW_SMALL,
            color: LEVEL.contrast,
            fontSize: themeVars.fontSize.xSmall,
            fontWeight: "bold",
            selectors: {
                ...SkinBaseUtils.INTERACTIBLE_STATES,
            },
        },
        toggleThumb: {
            borderRadius: "50%",
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
            borderRadius: SkinUtils.PILL_RADIUS,
            selectors: {
                ...SWITCH_STATES,
            },
        },
        tooltip: {
            borderRadius: themeVars.borderRadius.half,
            backgroundColor: `color-mix(in srgb, ${LEVEL.dark} 50%, transparent)`,
            backdropFilter: "blur(20px)",
            boxShadow: SHADOW_MEDIUM,
            backgroundOrigin: "border-box",
            color: LEVEL.contrast,
        },
    }),
);

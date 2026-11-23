import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinColorFamily } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";
import { SkinBaseUtils } from "../SkinBase.utils";

import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

const LEVEL = SkinUtils.computeLevelFamily(themeVars.color.layers);

export const shaded = style({});

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
        backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 10%)`],
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
    border: [`2px solid ${LEVEL.contrast}`, `2px solid rgb(from ${LEVEL.contrast} r g b / 25%)`],
    backgroundColor: [LEVEL.dark, `rgb(from ${LEVEL.dark} r g b / 75%)`],
    boxShadow: SHADOW_SMALL,
    color: LEVEL.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: [LEVEL.dark, `rgb(from ${LEVEL.dark} r g b / 50%)`],
    boxShadow: SHADOW_SMALL,
    color: LEVEL.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 25%)`],
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
            backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 25%)`],
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
        dropZone: {
            border: [`2px dashed ${LEVEL.contrast}`, `2px dashed rgb(from ${LEVEL.contrast} r g b / 25%)`],
            selectors: ObjectUtils.deepMerge(INPUT_STATES, {
                [skinSelectors.isCarrying]: {
                    borderColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 50%)`],
                },
                [skinSelectors.isReceiving]: {
                    borderColor: themeVars.color.primary.main,
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
                ...INPUT_STATES,
                [skinSelectors.fieldTextDisabled]: {
                    color: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / ${themeVars.disabled.opacity})`],
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
            backgroundColor: [LEVEL.dark, `rgb(from ${LEVEL.dark} r g b / 50%)`],
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
            backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 25%)`],
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
        rangeFill: {
            ...shade(themeVars.color.primary, skinVars.barAngle),
            borderRadius: SkinUtils.PILL_RADIUS,
            boxShadow: SHADOW_SMALL,
            selectors: {
                [skinSelectors.hasError]: {
                    ...shade(themeVars.color.error, skinVars.barAngle),
                },
            },
        },
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
            borderRadius: SkinUtils.PILL_RADIUS,
            backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 25%)`],
            boxShadow: SHADOW_SMALL,
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
            backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 10%)`],
            boxShadow: SHADOW_SMALL,
            fontWeight: "bold",
        },
        splitPaneFrame: {
            borderRadius: themeVars.borderRadius.full,
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
            borderBlockEnd: [`2px solid ${LEVEL.contrast}`, `2px solid rgb(from ${LEVEL.contrast} r g b / 10%)`],
            selectors: {
                [skinSelectors.isVertical]: {
                    borderBlockEnd: "none",
                    borderInlineStart: [
                        `2px solid ${LEVEL.contrast}`,
                        `2px solid rgb(from ${LEVEL.contrast} r g b / 10%)`,
                    ],
                },
            },
        },
        tag: {
            borderRadius: themeVars.borderRadius.half,
            paddingInline: themeVars.spacing.full,
            backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 25%)`],
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
            backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 75%)`],
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
            border: [`2px solid ${LEVEL.contrast}`, `2px solid rgb(from ${LEVEL.contrast} r g b / 25%)`],
            backgroundColor: LEVEL.main,
            boxShadow: SHADOW_SMALL,
            color: LEVEL.contrast,
        },
    }),
);

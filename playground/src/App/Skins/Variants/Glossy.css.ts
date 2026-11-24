import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinColorFamily } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";
import { SkinBaseUtils } from "../SkinBase.utils";

import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

const LEVEL = SkinUtils.computeLevelFamily(themeVars.color.layers);

export const glossy = style({
    vars: {
        [skinVars.rangeTrackThickness]: "20px",
    },
});

const SHADOW_GROOVE = [
    "inset 0 2px 4px 0 rgba(0, 0, 0, 0.75)",
    "inset 0 4px 16px 0 rgba(0, 0, 0, 0.5)",
    "inset 0 8px 32px 0 rgba(0, 0, 0, 0.25)",
    "0 1px 0 0 rgba(255, 255, 255, 0.25)",
    "0 2px 0 0 rgba(255, 255, 255, 0.25)",
].join(", ");
const SHADOW_PRESSED = [
    "inset 0 2px 2px 0 rgb(0 0 0 / 75%)",
    "inset 0 4px 4px 0 rgb(0 0 0 / 50%)",
    "inset 0 8px 8px 0 rgb(0 0 0 / 25%)",
].join(", ");
const SHADOW_SMALL = "0 2px 0 0 rgba(0, 0, 0, 0.75)";
const SHADOW_MEDIUM = `${SHADOW_SMALL}, 0 4px 8px 0 rgba(0, 0, 0, 0.5)`;
// const SHADOW_LARGE = `${SHADOW_MEDIUM}, 0 16px 64px 0 rgba(0, 0, 0, 0.25)`;

const sheen = (opts?: { sheenAlphaPercent?: number; outterShadow?: string }) =>
    [
        `inset 0 1px 0 0 rgba(255, 255, 255, ${(opts?.sheenAlphaPercent ?? 25) / 100})`,
        `inset 0 2px 0 0 rgba(255, 255, 255, ${(opts?.sheenAlphaPercent ?? 25) / 100})`,
        `inset 0 -1px 0 0 rgba(0, 0, 0, ${(opts?.sheenAlphaPercent ?? 25) / 200})`,
        `inset 0 -2px 0 0 rgba(0, 0, 0, ${(opts?.sheenAlphaPercent ?? 25) / 200})`,
        opts?.outterShadow,
    ]
        .filter(Boolean)
        .join(", ");

const gloss = (
    color: SkinColorFamily,
    opts?: {
        sheenAlphaPercent?: number;
        angle?: string;
        outterShadow?: string;
    },
): StyleRule => ({
    backgroundColor: color.main,
    backgroundImage: `linear-gradient(${opts?.angle ?? "0deg"}, ${color.dark}, ${color.light})`,
    boxShadow: sheen(opts),
    color: color.contrast,
});

const INPUT_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
    [skinSelectors.isReadOnly]: {
        backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 10%)`],
    },
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        boxShadow: [`0 0 0 2px ${themeVars.color.error.main}`, SHADOW_GROOVE].join(", "),
    },
});

const ITEM_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
    [skinSelectors.isHovered]: {
        filter: "none",
    },
    [skinSelectors.isSelected]: {
        color: themeVars.color.primary.contrast,
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
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: [LEVEL.dark, `rgb(from ${LEVEL.dark} r g b / 75%)`],
    boxShadow: SHADOW_GROOVE,
    color: LEVEL.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    ...gloss(LEVEL, { outterShadow: SHADOW_SMALL }),
    borderRadius: themeVars.borderRadius.full,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    borderRadius: themeVars.borderRadius.full,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 10%)`],
    boxShadow: sheen({ outterShadow: SHADOW_SMALL }),
};

const ITEM_FLOATER_SELECTED: StyleRule = {
    ...gloss(themeVars.color.primary, { outterShadow: SHADOW_SMALL }),
    borderRadius: themeVars.borderRadius.full,
};

const TAB_FLOATER_HOVER_HORIZ: StyleRule = {
    ...ITEM_FLOATER_HOVER,
};

const TAB_FLOATER_HOVER_VERT: StyleRule = {
    ...ITEM_FLOATER_HOVER,
};

const TAB_FLOATER_SELECTED_HORIZ: StyleRule = {
    ...ITEM_FLOATER_SELECTED,
};

const TAB_FLOATER_SELECTED_VERT: StyleRule = {
    ...ITEM_FLOATER_SELECTED,
};

const surface = (color: SkinColorFamily): StyleRule => ({
    ...gloss(color, { outterShadow: SHADOW_MEDIUM }),
    borderRadius: themeVars.borderRadius.full,
    fontSize: themeVars.fontSize.medium,
});

SkinUtils.define(
    glossy,
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
            ...gloss(themeVars.color.primary, { outterShadow: SHADOW_SMALL }),
            borderRadius: themeVars.borderRadius.full,
            paddingInline: themeVars.spacing.double,
            fontWeight: "bold",
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    ...gloss(themeVars.color.primary),
                    boxShadow: SHADOW_PRESSED,
                },
                [skinSelectors.hasError]: {
                    ...gloss(themeVars.color.error, { outterShadow: SHADOW_SMALL }),
                },
                [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
                    ...gloss(themeVars.color.error),
                    boxShadow: SHADOW_PRESSED,
                },
            }),
        },
        buttonSimple: {
            borderRadius: themeVars.borderRadius.full,
            backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 25%)`],
            boxShadow: sheen({ outterShadow: SHADOW_SMALL }),
            color: LEVEL.contrast,
            fontSize: themeVars.fontSize.small,
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    color: themeVars.color.primary.main,
                },
                [skinSelectors.hasError]: {
                    boxShadow: [
                        `inset 0 0 0 2px ${themeVars.color.error.main}`,
                        sheen({ outterShadow: SHADOW_SMALL }),
                    ].join(", "),
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
            ...gloss(themeVars.color.layers.level0, { sheenAlphaPercent: 0 }),
        },
        pageContainer: {
            ...surface(LEVEL),
        },
        panel: {
            ...gloss(LEVEL, { outterShadow: SHADOW_SMALL }),
            borderRadius: themeVars.borderRadius.full,
        },
        progressFill: {
            ...gloss(themeVars.color.primary, { angle: skinVars.barAngle }),
            borderRadius: SkinUtils.PILL_RADIUS,
            selectors: {
                [skinSelectors.hasErrorWithin]: {
                    ...gloss(themeVars.color.error, { angle: skinVars.barAngle }),
                },
            },
        },
        progressTrack: {
            backgroundColor: [LEVEL.dark, `rgb(from ${LEVEL.dark} r g b / 75%)`],
            boxShadow: SHADOW_GROOVE,
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
            ...gloss(themeVars.color.primary, { angle: skinVars.barAngle }),
            borderRadius: SkinUtils.PILL_RADIUS,
            selectors: {
                [skinSelectors.hasError]: {
                    ...gloss(themeVars.color.error, { angle: skinVars.barAngle }),
                },
            },
        },
        rangeThumb: {
            borderRadius: "50%",
            border: `2px solid ${themeVars.color.primary.main}`,
            backgroundColor: themeVars.color.primary.contrast,
            boxShadow: sheen({ outterShadow: SHADOW_SMALL }),
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
            backgroundColor: [LEVEL.dark, `rgb(from ${LEVEL.dark} r g b / 75%)`],
            boxShadow: SHADOW_GROOVE,
        },
        slideButtonFill: {
            ...gloss(themeVars.color.primary, { angle: skinVars.barAngle }),
            borderRadius: SkinUtils.PILL_RADIUS,
            backgroundColor: themeVars.color.primary.main,
            selectors: {
                [skinSelectors.hasError]: {
                    ...gloss(themeVars.color.error, { angle: skinVars.barAngle }),
                },
            },
        },
        slideButtonThumb: {
            borderRadius: "50%",
            border: `2px solid ${themeVars.color.primary.main}`,
            backgroundColor: themeVars.color.primary.contrast,
            boxShadow: sheen({ outterShadow: SHADOW_SMALL }),
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
            backgroundColor: [LEVEL.dark, `rgb(from ${LEVEL.dark} r g b / 75%)`],
            boxShadow: SHADOW_GROOVE,
            fontWeight: "bold",
        },
        splitPaneFrame: {
            borderRadius: themeVars.borderRadius.full,
            backgroundColor: [LEVEL.dark, `rgb(from ${LEVEL.dark} r g b / 75%)`],
            boxShadow: SHADOW_GROOVE,
            color: LEVEL.contrast,
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
            borderRadius: themeVars.borderRadius.full,
            backgroundColor: [LEVEL.dark, `rgb(from ${LEVEL.dark} r g b / 75%)`],
            boxShadow: SHADOW_GROOVE,
            color: LEVEL.contrast,
        },
        tag: {
            borderRadius: themeVars.borderRadius.half,
            paddingInline: themeVars.spacing.full,
            backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 25%)`],
            boxShadow: sheen({ outterShadow: SHADOW_SMALL }),
            color: LEVEL.contrast,
            fontSize: themeVars.fontSize.xSmall,
            fontWeight: "bold",
            selectors: {
                ...SkinBaseUtils.INTERACTIBLE_STATES,
            },
        },
        toggleThumb: {
            borderRadius: themeVars.borderRadius.half,
            backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 75%)`],
            boxShadow: sheen(),
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
            borderRadius: themeVars.borderRadius.full,
            selectors: {
                ...SWITCH_STATES,
            },
        },
        tooltip: {
            ...gloss(LEVEL, { outterShadow: SHADOW_MEDIUM }),
            borderRadius: themeVars.borderRadius.full,
            backgroundOrigin: "border-box",
        },
    }),
);

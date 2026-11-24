import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinColorFamily } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";
import { SkinBaseUtils } from "../SkinBase.utils";

import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

const LEVEL = SkinUtils.computeLevelFamily(themeVars.color.layers);

export const tek = style({
    vars: {
        [skinVars.rangeTrackThickness]: "20px",
    },
});

const SHADOW_SMALL = "0 2px 0 0 rgba(0, 0, 0, 0.75)";
const SHADOW_MEDIUM = `${SHADOW_SMALL}, 0 4px 8px 0 rgba(0, 0, 0, 0.5)`;
// const SHADOW_LARGE = `${SHADOW_MEDIUM}, 0 16px 64px 0 rgba(0, 0, 0, 0.25)`;

const insetGlow = (color: string, alphaPercent: number) =>
    [
        `inset 0 0 1px 1px hsl(from ${color} h s min(l * 1, 100) / ${alphaPercent * 0.9}%)`,
        `inset 0 0 4px 2px hsl(from ${color} h s min(l * 1, 100) / ${alphaPercent * 0.75}%)`,
        `inset 0 0 8px 4px hsl(from ${color} h s min(l * 1, 100) / ${alphaPercent * 0.5}%)`,
    ].join(", ");

const outsetGlow = (color: string, alphaPercent: number) =>
    [
        `0 0 16px 0 rgb(from ${color} r g b / ${alphaPercent * 0.5}%)`,
        `0 0 32px 0 rgb(from ${color} r g b / ${alphaPercent * 0.25}%)`,
    ].join(", ");

type DirTo = "top" | "right" | "bottom" | "left";

const sideGradient = (color: string, dirTo: DirTo, alphaPercent: number = 50) =>
    [
        `linear-gradient(to ${dirTo}, rgb(from ${color} r g b / 10%), rgb(from ${color} r g b / 0%) ${alphaPercent * 0.25}%)`,
        `linear-gradient(to ${dirTo}, rgb(from ${color} r g b / 10%), rgb(from ${color} r g b / 0%) ${alphaPercent * 0.5}%)`,
        `linear-gradient(to ${dirTo}, rgb(from ${color} r g b / 10%), rgb(from ${color} r g b / 0%) ${alphaPercent}%)`,
    ].join(", ");

const sideInsetShadow = (color: string, dirTo: DirTo) =>
    `inset ${dirTo === "left" ? -2 : dirTo === "right" ? 2 : 0}px ${dirTo === "bottom" ? 2 : dirTo === "top" ? -2 : 0}px 0 0 ${color}`;

const litBoard = (color: string, dirsTo: Set<DirTo>, alphaPercent: number = 50): StyleRule => ({
    // borderTopRightRadius: dirsTo.has("bottom") || dirsTo.has("left") ? 0 : themeVars.borderRadius.full,
    // borderBottomRightRadius: dirsTo.has("top") || dirsTo.has("left") ? 0 : themeVars.borderRadius.full,
    // borderBottomLeftRadius: dirsTo.has("top") || dirsTo.has("right") ? 0 : themeVars.borderRadius.full,
    // borderTopLeftRadius: dirsTo.has("bottom") || dirsTo.has("right") ? 0 : themeVars.borderRadius.full,
    backgroundColor: [color, `rgb(from ${color} r g b / ${alphaPercent * 0.25}%)`],
    backgroundImage: Array.from(dirsTo, (dirTo) => sideGradient(color, dirTo)).join(", "),
    boxShadow: [
        ...Array.from(dirsTo, (dirTo) => sideInsetShadow(color, dirTo)),
        dirsTo.size === 4 ? outsetGlow(color, alphaPercent) : null,
        SHADOW_SMALL,
    ]
        .filter(Boolean)
        .join(", "),
    color: color,
});

const unlitBoard = (color: string, alphaPercent: number): StyleRule => ({
    backgroundColor: [color, `rgb(from ${color} r g b / ${alphaPercent}%)`],
    boxShadow: [insetGlow(color, alphaPercent * 0.5), outsetGlow(color, alphaPercent), SHADOW_SMALL].join(", "),
    color: color,
});

const INPUT_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
    [skinSelectors.isReadOnly]: {
        ...litBoard(LEVEL.contrast, new Set(["top"])),
    },
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {},
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        ...litBoard(themeVars.color.error.main, new Set(["top"])),
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

const SWITCH_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
        ...unlitBoard(themeVars.color.primary.main, 25),
    },
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        ...unlitBoard(themeVars.color.error.main, 25),
    },
});

const INPUT_SHELL: StyleRule = {
    ...litBoard(LEVEL.contrast, new Set(["top"])),
} as const;

const SWITCH_SHELL: StyleRule = {
    ...unlitBoard(LEVEL.contrast, 25),
} as const;

const ACCORDION: StyleRule = {
    ...litBoard(LEVEL.dark, new Set(["top", "right", "bottom", "left"]), 100),
    borderRadius: themeVars.borderRadius.full,
    color: LEVEL.contrast,
} as const;

const ITEM: StyleRule = {
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    ...unlitBoard(LEVEL.contrast, 25),
};

const ITEM_FLOATER_SELECTED: StyleRule = {
    // ...unlitBoard(themeVars.color.primary.main, 25),
    color: themeVars.color.primary.main,
};

const TAB_FLOATER_HOVER: StyleRule = {
    ...litBoard(LEVEL.contrast, new Set(["top", "right", "bottom", "left"])),
    borderTopLeftRadius: themeVars.borderRadius.full,
    borderBottomRightRadius: themeVars.borderRadius.full,
};

const TAB_FLOATER_SELECTED: StyleRule = {
    ...litBoard(themeVars.color.primary.main, new Set(["top", "right", "bottom", "left"])),
    borderTopLeftRadius: themeVars.borderRadius.full,
    borderBottomRightRadius: themeVars.borderRadius.full,
};

const surface = (color: SkinColorFamily): StyleRule => {
    const base = litBoard(color.dark, new Set(["top", "right", "bottom", "left"]), 100);

    return {
        ...base,
        borderRadius: themeVars.borderRadius.full,
        boxShadow: [base.boxShadow, SHADOW_MEDIUM].join(", "),
        backdropFilter: "blur(20px)",
        color: color.contrast,
        fontSize: themeVars.fontSize.medium,
    };
};

SkinUtils.define(
    tek,
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
            ...litBoard(themeVars.color.primary.main, new Set(["top", "right", "bottom", "left"])),
            borderBottomLeftRadius: themeVars.borderRadius.full,
            borderTopRightRadius: themeVars.borderRadius.full,
            paddingInline: themeVars.spacing.double,
            fontWeight: "bold",
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    borderRadius: themeVars.borderRadius.full,
                },
                [skinSelectors.hasError]: {
                    ...litBoard(themeVars.color.error.main, new Set(["top", "right", "bottom", "left"])),
                    borderBottomLeftRadius: themeVars.borderRadius.full,
                    borderTopRightRadius: themeVars.borderRadius.full,
                },
                [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
                    borderRadius: themeVars.borderRadius.full,
                },
            }),
        },
        buttonSimple: {
            ...unlitBoard(LEVEL.contrast, 25),
            borderTopLeftRadius: themeVars.borderRadius.half,
            borderBottomRightRadius: themeVars.borderRadius.half,
            fontSize: themeVars.fontSize.small,
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    color: themeVars.color.primary.main,
                },
                [skinSelectors.hasError]: {
                    boxShadow: [
                        `inset 0 0 0 2px ${themeVars.color.error.main}`,
                        insetGlow(themeVars.color.error.main, 25 * 0.5),
                        outsetGlow(themeVars.color.error.main, 25),
                        SHADOW_SMALL,
                    ].join(", "),
                },
                [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
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
                ...SkinBaseUtils.INTERACTIBLE_STATES,
            },
        },
        drawer: {
            ...surface(LEVEL),
        },
        dropdown: {
            ...unlitBoard(LEVEL.contrast, 10),
            backdropFilter: "blur(20px)",
        },
        input: {
            ...INPUT_SHELL,
            selectors: ObjectUtils.deepMerge(INPUT_STATES, {
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
            backgroundColor: themeVars.color.layers.level0.light,
            backgroundImage: `linear-gradient(135deg, hsl(from ${themeVars.color.primary.light} h 100 l / 10%), transparent, hsl(from ${themeVars.color.primary.light} h 100 l / 10%))`,
            color: themeVars.color.layers.level0.contrast,
        },
        pageContainer: {
            ...surface(LEVEL),
        },
        panel: {
            ...litBoard(LEVEL.dark, new Set(["top", "right", "bottom", "left"]), 100),
            borderRadius: themeVars.borderRadius.full,
            color: LEVEL.contrast,
        },
        progressFill: {
            ...unlitBoard(themeVars.color.primary.main, 100),
            borderTopLeftRadius: themeVars.borderRadius.full,
            borderBottomRightRadius: themeVars.borderRadius.full,
            selectors: {
                [skinSelectors.hasErrorWithin]: {
                    ...unlitBoard(themeVars.color.error.main, 100),
                },
            },
        },
        progressTrack: {
            ...unlitBoard(LEVEL.contrast, 10),
            borderTopLeftRadius: themeVars.borderRadius.full,
            borderBottomRightRadius: themeVars.borderRadius.full,
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
            ...unlitBoard(themeVars.color.primary.main, 100),
            borderTopLeftRadius: themeVars.borderRadius.full,
            borderBottomRightRadius: themeVars.borderRadius.full,
            selectors: {
                [skinSelectors.hasError]: {
                    ...unlitBoard(themeVars.color.error.main, 100),
                },
            },
        },
        rangeThumb: {
            ...unlitBoard(themeVars.color.primary.main, 100),
            border: `2px solid ${themeVars.color.primary.main}`,
            borderTopLeftRadius: themeVars.borderRadius.full,
            borderBottomRightRadius: themeVars.borderRadius.full,
            backgroundColor: themeVars.color.primary.contrast,
            selectors: {
                [skinSelectors.hasError]: {
                    ...unlitBoard(themeVars.color.error.main, 100),
                    border: `2px solid ${themeVars.color.error.main}`,
                    backgroundColor: themeVars.color.error.contrast,
                },
            },
        },
        rangeTrack: {
            ...unlitBoard(LEVEL.contrast, 10),
            borderTopLeftRadius: themeVars.borderRadius.full,
            borderBottomRightRadius: themeVars.borderRadius.full,
        },
        slideButtonFill: {
            ...unlitBoard(themeVars.color.primary.contrast, 100),
            borderTopLeftRadius: themeVars.borderRadius.full,
            borderBottomRightRadius: themeVars.borderRadius.full,
            selectors: {
                [skinSelectors.hasError]: {
                    ...unlitBoard(themeVars.color.error.contrast, 100),
                },
            },
        },
        slideButtonThumb: {
            ...unlitBoard(themeVars.color.primary.main, 100),
            border: `2px solid ${themeVars.color.primary.main}`,
            borderTopLeftRadius: themeVars.borderRadius.full,
            borderBottomRightRadius: themeVars.borderRadius.full,
            backgroundColor: themeVars.color.primary.contrast,
            selectors: {
                [skinSelectors.hasError]: {
                    ...unlitBoard(themeVars.color.error.main, 100),
                    border: `2px solid ${themeVars.color.error.main}`,
                    backgroundColor: themeVars.color.error.contrast,
                },
            },
        },
        slideButtonTrack: {
            ...unlitBoard(LEVEL.contrast, 10),
            borderTopLeftRadius: themeVars.borderRadius.full,
            borderBottomRightRadius: themeVars.borderRadius.full,
            fontWeight: "bold",
        },
        splitPaneFrame: {
            border: `2px dashed rgb(from ${LEVEL.contrast} r g b / 25%)`,
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
            ...unlitBoard(LEVEL.contrast, 10),
            borderTopLeftRadius: themeVars.borderRadius.full,
            borderBottomRightRadius: themeVars.borderRadius.full,
        },
        tag: {
            ...unlitBoard(LEVEL.contrast, 25),
            borderTopLeftRadius: themeVars.borderRadius.half,
            borderBottomRightRadius: themeVars.borderRadius.half,
            paddingInline: themeVars.spacing.full,
            fontSize: themeVars.fontSize.xSmall,
            fontWeight: "bold",
            selectors: {
                ...SkinBaseUtils.INTERACTIBLE_STATES,
            },
        },
        toggleThumb: {
            ...unlitBoard(LEVEL.contrast, 100),
            borderTopLeftRadius: themeVars.borderRadius.half,
            borderBottomRightRadius: themeVars.borderRadius.half,
            selectors: {
                [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                    ...unlitBoard(themeVars.color.primary.main, 100),
                },
                [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
                    ...unlitBoard(themeVars.color.error.main, 100),
                },
            },
        },
        toggleTrack: {
            ...SWITCH_SHELL,
            borderTopLeftRadius: themeVars.borderRadius.full,
            borderBottomRightRadius: themeVars.borderRadius.full,
            selectors: {
                ...SWITCH_STATES,
            },
        },
        tooltip: {
            ...litBoard(LEVEL.dark, new Set(["top", "right", "bottom", "left"]), 100),
            borderRadius: themeVars.borderRadius.full,
            backdropFilter: "blur(20px)",
            backgroundOrigin: "border-box",
            color: LEVEL.contrast,
        },
    }),
);

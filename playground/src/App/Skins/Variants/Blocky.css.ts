import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinColorFamily } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";
import { SkinBaseUtils } from "../SkinBase.utils";

import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

const LEVEL = SkinUtils.computeLevelFamily(themeVars.color.layers);

export const blocky = style({
    vars: {
        [skinVars.rangeTrackThickness]: "20px",
    },
});

const OUTSET_SHADOW = "8px 8px 0 0 rgba(0, 0, 0, 0.35)";
const INSET_SHADOW_THICKNESS = 2;
const INSET_SHADOW_RAISED = [
    `inset -${INSET_SHADOW_THICKNESS}px -${INSET_SHADOW_THICKNESS}px 0 rgb(0 0 0 / 65%)`,
    `inset ${INSET_SHADOW_THICKNESS}px ${INSET_SHADOW_THICKNESS}px 0 rgb(255 255 255 / 65%)`,
].join(", ");
const INSET_SHADOW_LOWERED = [
    `inset ${INSET_SHADOW_THICKNESS}px ${INSET_SHADOW_THICKNESS}px 0 rgb(0 0 0 / 65%)`,
    `inset -${INSET_SHADOW_THICKNESS}px -${INSET_SHADOW_THICKNESS}px 0 rgb(255 255 255 / 65%)`,
].join(", ");

const blockRaised = (color: SkinColorFamily, outsetShadow?: string): StyleRule => ({
    backgroundColor: color.light,
    boxShadow: [INSET_SHADOW_RAISED, outsetShadow].filter(Boolean).join(", "),
    color: color.contrast,
});

const blockRaisedContrast = (color: SkinColorFamily, outsetShadow?: string): StyleRule => ({
    backgroundColor: color.contrast,
    boxShadow: INSET_SHADOW_RAISED,
    color: color.main,
});

const blockLowered = (color: SkinColorFamily, outsetShadow?: string): StyleRule => ({
    backgroundColor: color.dark,
    boxShadow: [INSET_SHADOW_LOWERED, outsetShadow].filter(Boolean).join(", "),
    color: color.contrast,
});

const INPUT_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
    [skinSelectors.isReadOnly]: {
        backgroundColor: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / 25%)`],
        boxShadow: INSET_SHADOW_LOWERED,
    },
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {},
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        ...blockLowered(themeVars.color.error),
    },
});

const ITEM_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
    [skinSelectors.isHovered]: {
        filter: "none",
    },
    [skinSelectors.isSelected]: {
        ...blockRaised(themeVars.color.primary),
        fontWeight: "bold",
    },
    [skinSelectors.isDisabled]: {
        backgroundColor: "transparent",
        boxShadow: "none",
    },
});

const SWITCH_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(INPUT_STATES, {
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
        ...blockLowered(themeVars.color.primary),
    },
});

const INPUT_SHELL: StyleRule = {
    ...blockLowered(LEVEL),
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    ...blockRaised(LEVEL),
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    ...blockRaised(LEVEL),
};

const ITEM_FLOATER_SELECTED: StyleRule = {
    ...blockRaised(themeVars.color.primary),
};

const TAB_FLOATER_HOVER: StyleRule = {
    ...ITEM_FLOATER_HOVER,
};

const TAB_FLOATER_SELECTED: StyleRule = {
    ...ITEM_FLOATER_SELECTED,
};

const surface = (color: SkinColorFamily): StyleRule => ({
    ...blockRaised(color, OUTSET_SHADOW),
    backgroundColor: color.main,
});

SkinUtils.define(
    blocky,
    SkinBaseUtils.merge(LEVEL, {
        accordionHeader: {
            selectors: ObjectUtils.deepMerge(SkinUtils.joinedCorners(), SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isExpanded]: {
                    ...blockRaised(themeVars.color.primary),
                    fontWeight: "bold",
                },
            }),
        },
        accordionWrapper: {
            ...ACCORDION,
        },
        button: {
            ...blockRaised(themeVars.color.primary),
            paddingInline: themeVars.spacing.double,
            fontWeight: "bold",
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    ...blockLowered(themeVars.color.primary),
                },
                [skinSelectors.hasError]: {
                    ...blockRaised(themeVars.color.error),
                },
                [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
                    ...blockLowered(themeVars.color.error),
                },
            }),
        },
        buttonSimple: {
            ...blockRaised(LEVEL),
            fontSize: themeVars.fontSize.small,
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.isPressed]: {
                    ...blockLowered(LEVEL),
                },
                [skinSelectors.hasError]: {
                    ...blockRaised(themeVars.color.error),
                },
                [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
                    ...blockLowered(themeVars.color.error),
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
            color: themeVars.color.primary.contrast,
            fontSize: themeVars.fontSize.medium,
            fontWeight: "bold",
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
                    color: [LEVEL.contrast, `rgb(from ${LEVEL.contrast} r g b / ${themeVars.disabled.opacity})`],
                },
                [skinSelectors.fieldTextError]: {
                    color: themeVars.color.error.contrast,
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
            ...blockRaised(LEVEL),
        },
        progressFill: {
            ...blockRaised(themeVars.color.primary),
            selectors: {
                [skinSelectors.hasErrorWithin]: {
                    ...blockRaised(themeVars.color.error),
                },
            },
        },
        progressTrack: {
            ...blockLowered(LEVEL),
        },
        radioBox: {
            ...SWITCH_SHELL,
            borderRadius: "50%",
            selectors: {
                ...SWITCH_STATES,
            },
        },
        radioDot: {
            ...blockRaisedContrast(themeVars.color.primary),
            borderRadius: "50%",
        },
        rangeFill: {
            ...blockRaised(themeVars.color.primary),
            selectors: {
                [skinSelectors.hasError]: {
                    ...blockRaised(themeVars.color.error),
                },
            },
        },
        rangeThumb: {
            ...blockRaisedContrast(themeVars.color.primary),
            selectors: {
                [skinSelectors.hasError]: {
                    ...blockRaisedContrast(themeVars.color.error),
                },
            },
        },
        rangeTrack: {
            ...blockLowered(LEVEL),
        },
        scrollerThumb: {
            selectors: {
                [skinSelectors.line]: {
                    ...blockRaised(themeVars.color.primary),
                },
            },
        },
        slideButtonFill: {
            ...blockRaised(themeVars.color.primary),
            selectors: {
                [skinSelectors.hasError]: {
                    ...blockRaised(themeVars.color.error),
                },
            },
        },
        slideButtonThumb: {
            ...blockRaised(themeVars.color.primary),
            selectors: {
                [skinSelectors.hasError]: {
                    ...blockRaised(themeVars.color.error),
                },
            },
        },
        slideButtonTrack: {
            ...blockLowered(LEVEL),
            fontWeight: "bold",
        },
        splitPaneFrame: {
            ...blockLowered(LEVEL),
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
            ...blockLowered(LEVEL),
        },
        tag: {
            ...blockRaised(LEVEL),
            paddingInline: themeVars.spacing.full,
            fontSize: themeVars.fontSize.xSmall,
            fontWeight: "bold",
            selectors: ObjectUtils.deepMerge(SkinBaseUtils.INTERACTIBLE_STATES, {
                [skinSelectors.hasError]: {
                    ...blockRaised(themeVars.color.error),
                },
            }),
        },
        toggleThumb: {
            ...blockRaisedContrast(LEVEL),
            selectors: {
                [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                    ...blockRaisedContrast(themeVars.color.primary),
                },
                [skinSelectors.hasErrorWithin]: {
                    ...blockRaisedContrast(themeVars.color.error),
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
            ...blockRaised(LEVEL),
        },
    }),
);

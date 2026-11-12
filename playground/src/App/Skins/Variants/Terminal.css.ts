import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinBaseColor } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

export const terminal = style({
    vars: {
        [skinVars.rangeTrackThickness]: "20px",
    },
});

const SEGMENT_WIDTH = 8;
const SEGMENT_GAP = 2;

const segments = (color: string) =>
    `repeating-linear-gradient(${skinVars.barAngle}, ${color} 0 ${SEGMENT_WIDTH}px, transparent ${SEGMENT_WIDTH}px ${SEGMENT_WIDTH + SEGMENT_GAP}px)`;

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
        borderColor: themeVars.color.error.main,
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
        borderColor: themeVars.color.primary.main,
        color: themeVars.color.primary.main,
    },
});

const INPUT_SHELL: StyleRule = {
    border: [`2px solid ${layerVars.contrast}`, `2px solid rgb( from ${layerVars.contrast} r g b / 25%)`],
    backgroundColor: layerVars.dark,
    color: layerVars.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    border: [`2px solid ${layerVars.contrast}`, `2px solid rgb( from ${layerVars.contrast} r g b / 25%)`],
    backgroundColor: layerVars.light,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    border: "2px solid transparent",
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
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

const surface = (color: SkinBaseColor): StyleRule => ({
    border: [`2px solid ${color.contrast}`, `2px solid rgb( from ${color.contrast} r g b / 25%)`],
    backgroundColor: color.main,
    color: color.contrast,
    fontSize: themeVars.fontSize.medium,
});

SkinUtils.define(terminal, {
    accordionHeader: {
        selectors: ObjectUtils.deepMerge(SkinUtils.joinedCorners(), INTERACTIBLE_STATES, {
            [skinSelectors.isExpanded]: {
                border: `2px solid ${themeVars.color.primary.main}`,
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
        border: `2px solid ${layerVars.contrast}`,
        color: layerVars.contrast,
        fontWeight: "bold",
        selectors: ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
            [skinSelectors.isPressed]: {
                borderColor: themeVars.color.primary.main,
                color: themeVars.color.primary.main,
            },
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
                color: themeVars.color.error.main,
            },
            [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
                borderColor: themeVars.color.error.main,
                color: themeVars.color.primary.main,
            },
        }),
    },
    buttonSimple: {
        border: `2px solid ${layerVars.contrast}`,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
            [skinSelectors.isPressed]: {
                borderColor: themeVars.color.primary.main,
                color: themeVars.color.primary.main,
            },
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
                color: themeVars.color.error.main,
            },
            [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
                borderColor: themeVars.color.error.main,
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
        ...surface(layerVars),
    },
    dropdown: {
        ...INPUT_SHELL,
    },
    dropZone: {
        border: [`2px dashed ${layerVars.contrast}`, `2px dashed rgb(from ${layerVars.contrast} r g b / 25%)`],
        selectors: ObjectUtils.deepMerge(INPUT_STATES, {
            [skinSelectors.isCarrying]: {
                borderColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 50%)`],
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
        backgroundColor: themeVars.color.layers.level0.main,
        color: themeVars.color.layers.level0.contrast,
        fontFamily: "monospace",
    },
    pageContainer: {
        ...surface(layerVars),
    },
    panel: {
        border: [`2px solid ${layerVars.contrast}`, `2px solid rgb( from ${layerVars.contrast} r g b / 25%)`],
        backgroundColor: layerVars.light,
        color: layerVars.contrast,
    },
    progressFill: {
        backgroundImage: segments(themeVars.color.primary.main),
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundImage: segments(themeVars.color.error.main),
            },
        },
    },
    progressTip: {},
    progressTrack: {
        border: [`2px solid ${layerVars.contrast}`, `2px solid rgb( from ${layerVars.contrast} r g b / 25%)`],
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
        border: [`2px solid ${layerVars.contrast}`, `2px solid rgb( from ${layerVars.contrast} r g b / 25%)`],
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
        border: [`2px solid ${layerVars.contrast}`, `2px solid rgb( from ${layerVars.contrast} r g b / 25%)`],
        fontWeight: "bold",
    },
    surface: {
        ...surface(layerVars),
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
        border: [`2px solid ${layerVars.contrast}`, `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`],
    },
    tag: {
        paddingInline: themeVars.spacing.full,
        border: [`2px solid ${layerVars.contrast}`, `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`],
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.xSmall,
        fontWeight: "bold",
        selectors: {
            ...INTERACTIBLE_STATES,
        },
    },
    toggleThumb: {
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 75%)`],
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
        border: [`2px solid ${layerVars.contrast}`, `2px solid rgb( from ${layerVars.contrast} r g b / 25%)`],
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
    },
});

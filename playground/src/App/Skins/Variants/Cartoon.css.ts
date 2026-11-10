import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinBaseColor } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

export const cartoon = style({
    vars: {
        [skinVars.rangeTrackThickness]: "20px",
    },
});

const SHADOW_SMALL = "4px 4px 0 0px rgba(0, 0, 0, 0.5)";
const SHADOW_MEDIUM = "8px 8px 0 0px rgba(0, 0, 0, 0.5)";

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
        backgroundColor: themeVars.color.primary.main,
        color: themeVars.color.primary.contrast,
    },
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        backgroundColor: themeVars.color.error.main,
        color: themeVars.color.error.contrast,
    },
});

const INPUT_SHELL: StyleRule = {
    border: [`2px solid ${layerVars.contrast}`, `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`],
    backgroundColor: layerVars.main,
    boxShadow: SHADOW_SMALL,
    color: layerVars.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    border: "2px solid black",
    backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
    boxShadow: SHADOW_SMALL,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    border: "2px solid transparent",
    fontSize: themeVars.fontSize.medium,
    selectors: {
        ...ITEM_STATES,
    },
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    border: `2px solid black`,
    backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
    boxShadow: SHADOW_SMALL,
};

const ITEM_FLOATER_SELECTED: StyleRule = {
    border: `2px solid black`,
    backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
    boxShadow: SHADOW_SMALL,
    color: themeVars.color.primary.main,
};

const TAB_FLOATER_HOVER: StyleRule = {
    ...ITEM_FLOATER_HOVER,
};

const TAB_FLOATER_SELECTED: StyleRule = {
    ...ITEM_FLOATER_SELECTED,
};

const surface = (color: SkinBaseColor): StyleRule => ({
    border: "2px solid black",
    backgroundColor: color.light,
    boxShadow: SHADOW_MEDIUM,
    color: color.contrast,
    fontSize: themeVars.fontSize.medium,
});

SkinUtils.define(cartoon, {
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
        border: "2px solid black",
        backgroundColor: themeVars.color.primary.main,
        boxShadow: SHADOW_SMALL,
        color: themeVars.color.primary.contrast,
        fontWeight: "bold",
        selectors: ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
            [skinSelectors.isPressed]: {
                boxShadow: `inset 4px 4px 0 rgb(0 0 0 / 50%)`,
            },
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                color: themeVars.color.error.contrast,
            },
        }),
    },
    buttonSimple: {
        border: "2px solid black",
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 25%)`],
        boxShadow: SHADOW_SMALL,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
            [skinSelectors.isPressed]: {
                boxShadow: `inset 2px 2px 0 rgb(0 0 0 / 50%)`,
            },
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                color: themeVars.color.error.contrast,
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
            ...INTERACTIBLE_STATES,
        },
    },
    drawer: {
        border: [
            `2px solid ${themeVars.color.surface.contrast}`,
            `2px solid rgb( from ${themeVars.color.surface.contrast} r g b / 25%)`,
        ],
        backgroundColor: themeVars.color.surface.main,
        color: themeVars.color.surface.contrast,
        boxShadow: SHADOW_MEDIUM,
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
        backgroundColor: themeVars.color.background.light,
        color: themeVars.color.background.contrast,
        fontFamily: "monospace",
    },
    pageContainer: {
        ...surface(SkinUtils.extendColor(layerVars)),
    },
    panel: {
        border: `2px solid black`,
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
        boxShadow: SHADOW_SMALL,
        color: layerVars.contrast,
    },
    progressFill: {
        backgroundColor: themeVars.color.primary.main,
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    progressTip: {},
    progressTrack: {
        border: `2px solid black`,
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
        boxShadow: SHADOW_SMALL,
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
        backgroundColor: themeVars.color.primary.contrast,
    },
    rangeFill: {
        backgroundColor: themeVars.color.primary.main,
        boxShadow: SHADOW_SMALL,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    rangeThumb: {
        border: `2px solid ${themeVars.color.primary.main}`,
        backgroundColor: themeVars.color.primary.contrast,
        boxShadow: SHADOW_SMALL,
        color: themeVars.color.primary.main,
        selectors: {
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
                backgroundColor: themeVars.color.error.contrast,
                color: themeVars.color.error.contrast,
            },
        },
    },
    rangeTrack: {
        border: `2px solid black`,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
        boxShadow: SHADOW_SMALL,
        selectors: {
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
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
        boxShadow: SHADOW_SMALL,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonThumb: {
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
        border: `2px solid black`,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
        boxShadow: SHADOW_SMALL,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
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
        border: `2px solid black`,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
        boxShadow: SHADOW_SMALL,
    },
    tag: {
        paddingInline: themeVars.spacing.full,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 25%)`],
        boxShadow: SHADOW_SMALL,
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
                backgroundColor: themeVars.color.primary.contrast,
            },
            [skinSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.contrast,
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
        boxShadow: SHADOW_SMALL,
        color: layerVars.contrast,
    },
});

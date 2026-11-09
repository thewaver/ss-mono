import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

export const shaded = style({});

const PILL_RADIUS = "9999px";

const SHADOW_SMALL = "0 2px 2px 0px rgba(0, 0, 0, 0.75)";
const SHADOW_MEDIUM = `${SHADOW_SMALL}, 0 4px 8px 0px rgba(0, 0, 0, 0.5)`;
const SHADOW_LARGE = `${SHADOW_MEDIUM}, 0 16px 64px 0px rgba(0, 0, 0, 0.25)`;

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
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        borderColor: themeVars.color.error.main,
    },
});

const ITEM_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
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
    border: [`2px solid ${layerVars.contrast}`, `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`],
    backgroundColor: layerVars.main,
    boxShadow: SHADOW_SMALL,
    color: layerVars.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
    boxShadow: SHADOW_SMALL,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.medium,
    selectors: {
        ...ITEM_STATES,
    },
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
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

const surface = (layer: "background" | "surface"): StyleRule => ({
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: themeVars.color[layer].main,
    backgroundImage: `linear-gradient(315deg, ${themeVars.color[layer].dark}, ${themeVars.color[layer].light})`,
    boxShadow: SHADOW_MEDIUM,
    color: themeVars.color[layer].contrast,
    fontSize: themeVars.fontSize.medium,
});

SkinUtils.define(shaded, {
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
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.double,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: `linear-gradient(315deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        boxShadow: SHADOW_SMALL,
        color: themeVars.color.primary.contrast,
        fontWeight: "bold",
        selectors: ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
            [skinSelectors.isPressed]: {
                boxShadow: `inset 0 2px 2px rgb(0 0 0 / 75%), inset 0 4px 4px rgb(0 0 0 / 50%), inset 0 8px 8px rgb(0 0 0 / 25%)`,
            },
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: `linear-gradient(315deg, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
                color: themeVars.color.error.contrast,
            },
        }),
    },
    buttonSimple: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 25%)`],
        boxShadow: SHADOW_SMALL,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
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
    },
    decoration: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        opacity: 0.75,
        selectors: {
            ...INTERACTIBLE_STATES,
        },
    },
    drawer: {
        backgroundColor: themeVars.color.surface.main,
        backgroundImage: `linear-gradient(45deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,
        boxShadow: SHADOW_LARGE,
        color: themeVars.color.surface.contrast,
    },
    dropdown: {
        ...INPUT_SHELL,
    },
    input: {
        ...INPUT_SHELL,
        selectors: ObjectUtils.deepMerge(INPUT_STATES, {
            ...INPUT_STATES,
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
    overlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
    },
    pageBackground: {
        backgroundColor: themeVars.color.background.main,
        backgroundImage: `linear-gradient(315deg, ${themeVars.color.background.dark}, ${themeVars.color.background.light})`,
        color: themeVars.color.background.contrast,
    },
    pageContainer: {
        ...surface("background"),
    },
    panel: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
        boxShadow: SHADOW_SMALL,
        color: layerVars.contrast,
    },
    progressFill: {
        borderRadius: PILL_RADIUS,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: `linear-gradient(${skinVars.barAngle}, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: `linear-gradient(${skinVars.barAngle}, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
            },
        },
    },
    progressTrack: {
        border: [layerVars.contrast, `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`],
        borderRadius: PILL_RADIUS,
        backgroundColor: layerVars.main,
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
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: `linear-gradient(45deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
    },
    rangeFill: {
        borderRadius: PILL_RADIUS,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: `linear-gradient(${skinVars.barAngle}, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        boxShadow: SHADOW_SMALL,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: `linear-gradient(${skinVars.barAngle}, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
            },
        },
    },
    rangeThumb: {
        borderRadius: "50%",
        border: `2px solid ${themeVars.color.primary.main}`,
        backgroundColor: layerVars.main,
        boxShadow: SHADOW_SMALL,
        selectors: {
            [skinSelectors.isStart]: {
                borderColor: themeVars.color.primary.dark,
            },
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    rangeTrack: {
        borderRadius: PILL_RADIUS,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 25%)`],
        boxShadow: SHADOW_SMALL,
    },
    scrollerThumb: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: SHADOW_SMALL,
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
        borderRadius: PILL_RADIUS,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: `linear-gradient(${skinVars.barAngle}, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: `linear-gradient(${skinVars.barAngle}, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
            },
        },
    },
    slideButtonThumb: {
        borderRadius: "50%",
        border: `2px solid ${themeVars.color.primary.main}`,
        backgroundColor: layerVars.main,
        boxShadow: SHADOW_SMALL,
        color: themeVars.color.primary.main,
        selectors: {
            [skinSelectors.hasError]: {
                color: themeVars.color.error.main,
                borderColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonTrack: {
        borderRadius: PILL_RADIUS,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
        boxShadow: SHADOW_SMALL,
        fontWeight: "bold",
    },
    surface: {
        ...surface("surface"),
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
        borderBlockEnd: [`2px solid ${layerVars.contrast}`, `2px solid rgb(from ${layerVars.contrast} r g b / 10%)`],
        selectors: {
            [skinSelectors.isVertical]: {
                borderBlockEnd: "none",
                borderInlineStart: [
                    `2px solid ${layerVars.contrast}`,
                    `2px solid rgb(from ${layerVars.contrast} r g b / 10%)`,
                ],
            },
        },
    },
    tag: {
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.full,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: `linear-gradient(45deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        boxShadow: SHADOW_SMALL,
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.xSmall,
        fontWeight: "bold",
        selectors: {
            ...INTERACTIBLE_STATES,
        },
    },
    toggleThumb: {
        borderRadius: "50%",
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 75%)`],
        selectors: {
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                backgroundColor: themeVars.color.primary.main,
            },
        },
    },
    toggleTrack: {
        ...SWITCH_SHELL,
        borderRadius: PILL_RADIUS,
        selectors: {
            ...SWITCH_STATES,
        },
    },
    tooltip: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: layerVars.main,
        boxShadow: SHADOW_SMALL,
        color: layerVars.contrast,
    },
});

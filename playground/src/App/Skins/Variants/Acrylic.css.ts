import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinBaseColor } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

export const acrylic = style({
    vars: {
        [skinVars.rangeFillThickness]: "8px",
    },
});

const PILL_RADIUS = "9999px";

const SHADOW_SMALL = "0 2px 2px 0px rgba(0, 0, 0, 0.75)";
const SHADOW_MEDIUM = `${SHADOW_SMALL}, 0 4px 8px 0px rgba(0, 0, 0, 0.5)`;
// const SHADOW_LARGE = `${SHADOW_MEDIUM}, 0 16px 64px 0px rgba(0, 0, 0, 0.25)`;

const sheen = (color: string, colorAlphaPercent: number, sheenAlphaPercent: number): StyleRule => ({
    backgroundColor: [color, `rgb(from ${color} r g b / ${colorAlphaPercent}%)`],
    backgroundImage: [
        `radial-gradient(100% 50% at top, rgb(255 255 255 / ${sheenAlphaPercent}%), transparent)`,
        `radial-gradient(100% 50% at bottom, rgb(0 0 0 / ${sheenAlphaPercent * 0.5}%), transparent)`,
        `linear-gradient(to bottom, rgb(255 255 255 / ${sheenAlphaPercent}%), rgb(0 0 0 / ${sheenAlphaPercent * 0.5}%))`,
    ].join(", "),
});

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
        backgroundImage: `linear-gradient(to bottom, rgb(from ${layerVars.main} r g b / 25%), rgb(from ${layerVars.main} r g b / 10%))`,
    },
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {},
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

const SWITCH_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(INPUT_STATES, {
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
        ...sheen(themeVars.color.primary.main, 100, 50),
        border: "none",
    },
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        ...sheen(themeVars.color.error.main, 100, 50),
        border: "none",
        color: themeVars.color.error.contrast,
    },
});

const INPUT_SHELL: StyleRule = {
    border: [`2px solid ${layerVars.contrast}`, `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`],
    backgroundImage: `linear-gradient(to bottom, rgb(from ${layerVars.main} r g b / 75%), rgb(from ${layerVars.main} r g b / 50%))`,
    backdropFilter: "blur(20px)",
    boxShadow: SHADOW_SMALL,
    color: layerVars.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    backgroundImage: `linear-gradient(to bottom, rgb(from ${layerVars.main} r g b / 25%), rgb(from ${layerVars.main} r g b / 50%))`,
    borderRadius: themeVars.borderRadius.half,
    boxShadow: SHADOW_SMALL,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM_FLOATER_HOVER: StyleRule = {
    ...sheen(layerVars.contrast, 10, 10),
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

const surface = (color: SkinBaseColor): StyleRule => ({
    ...sheen(color.dark, 25, 10),
    backdropFilter: "blur(20px)",
    borderRadius: themeVars.borderRadius.half,
    boxShadow: SHADOW_MEDIUM,
    color: color.contrast,
    fontSize: themeVars.fontSize.medium,
});

SkinUtils.define(acrylic, {
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
        ...sheen(themeVars.color.primary.main, 100, 50),
        borderRadius: PILL_RADIUS,
        paddingInline: themeVars.spacing.double,
        boxShadow: SHADOW_SMALL,
        color: themeVars.color.primary.contrast,
        fontWeight: "bold",
        selectors: ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
            [skinSelectors.isPressed]: {
                boxShadow: `inset 0 2px 2px rgb(0 0 0 / 100%), inset 0 2px 4px rgb(0 0 0 / 75%), inset 0 2px 8px rgb(0 0 0 / 50%)`,
            },
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                color: themeVars.color.error.contrast,
            },
        }),
    },
    buttonSimple: {
        ...sheen(layerVars.contrast, 25, 10),
        borderRadius: PILL_RADIUS,
        boxShadow: SHADOW_SMALL,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.xSmall,
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
        color: themeVars.color.primary.contrast,
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
        backgroundColor: themeVars.color.layers.level0.light,
        backgroundImage: `linear-gradient(135deg, hsl(from ${themeVars.color.primary.light} h 100 l / 10%), transparent, hsl(from ${themeVars.color.primary.light} h 100 l / 10%))`,
        color: themeVars.color.layers.level0.contrast,
    },
    pageContainer: {
        ...surface(layerVars),
    },
    panel: {
        backgroundImage: `linear-gradient(to bottom, rgb(from ${layerVars.main} r g b / 25%), rgb(from ${layerVars.main} r g b / 50%))`,
        boxShadow: SHADOW_SMALL,
        color: layerVars.contrast,
    },
    progressFill: {
        ...sheen(themeVars.color.primary.main, 100, 50),
        borderRadius: PILL_RADIUS,
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    progressTip: {},
    progressTrack: {
        borderRadius: PILL_RADIUS,
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
        boxShadow: SHADOW_SMALL,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: [themeVars.color.error.main, `rgb(from ${themeVars.color.error.main} r g b / 50%)`],
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
        ...sheen(themeVars.color.primary.main, 100, 50),
        borderRadius: PILL_RADIUS,
        boxShadow: SHADOW_SMALL,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    rangeThumb: {
        ...sheen(layerVars.main, 100, 25),
        borderRadius: "50%",
        border: `2px solid ${themeVars.color.primary.main}`,
        boxShadow: SHADOW_SMALL,
        selectors: {
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    rangeTrack: {
        ...sheen(layerVars.contrast, 25, 10),
        borderRadius: PILL_RADIUS,
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
        ...sheen(themeVars.color.primary.main, 100, 50),
        borderRadius: PILL_RADIUS,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonThumb: {
        ...sheen(layerVars.main, 100, 25),
        borderRadius: "50%",
        border: `2px solid ${themeVars.color.primary.main}`,
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
        ...sheen(layerVars.contrast, 25, 10),
        borderRadius: PILL_RADIUS,
        boxShadow: SHADOW_SMALL,
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
        ...sheen(layerVars.contrast, 25, 10),
        borderRadius: PILL_RADIUS,
        boxShadow: SHADOW_SMALL,
        paddingInline: themeVars.spacing.full,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.xSmall,
        fontWeight: "bold",
        selectors: {
            ...INTERACTIBLE_STATES,
        },
    },
    toggleThumb: {
        ...sheen(layerVars.contrast, 100, 50),
        borderRadius: "50%",
        selectors: {
            ...SWITCH_STATES,
        },
    },
    toggleTrack: {
        ...SWITCH_SHELL,
        borderRadius: PILL_RADIUS,
    },
    tooltip: {
        border: [`2px solid ${layerVars.contrast}`, `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`],
        backgroundColor: layerVars.main,
        boxShadow: SHADOW_SMALL,
        color: layerVars.contrast,
    },
});

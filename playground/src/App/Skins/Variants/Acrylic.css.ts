import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import type { SkinColorFamily } from "../Skin.types";
import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

export const acrylic = style({
    vars: {
        [skinVars.rangeTrackThickness]: "20px",
    },
});

const PILL_RADIUS = "9999px";

const SHADOW_SMALL = "0 2px 2px 0 rgba(0, 0, 0, 0.75)";
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
    border: [`2px solid ${layerVars.contrast}`, `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`],
    backgroundImage: `linear-gradient(to bottom, rgb(from ${layerVars.dark} r g b / 50%), rgb(from ${layerVars.light} r g b / 25%))`,
    boxShadow: SHADOW_SMALL,
    color: layerVars.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    backgroundImage: `linear-gradient(to bottom, rgb(from ${layerVars.dark} r g b / 50%), rgb(from ${layerVars.light} r g b / 25%))`,
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
    ...sheenFromColorString(layerVars.main, 25),
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
    ...sheenFromColorString(layerVars.main, 25),
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
        ...sheenFromColorSet(themeVars.color.primary, 100),
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
                ...sheenFromColorSet(themeVars.color.error, 100),
                color: themeVars.color.error.contrast,
            },
        }),
    },
    buttonSimple: {
        ...sheenFromColorString(layerVars.main, 25),
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
        backdropFilter: "blur(20px)",
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
        backgroundImage: `linear-gradient(to bottom, rgb(from ${layerVars.dark} r g b / 50%), rgb(from ${layerVars.light} r g b / 25%))`,
        boxShadow: SHADOW_SMALL,
        color: layerVars.contrast,
    },
    progressFill: {
        ...sheenFromColorSet(themeVars.color.primary, 100),
        borderRadius: PILL_RADIUS,
        selectors: {
            [skinSelectors.hasErrorWithin]: {
                ...sheenFromColorSet(themeVars.color.error, 100),
            },
        },
    },
    progressTip: {},
    progressTrack: {
        borderRadius: PILL_RADIUS,
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
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
    rangeFill: {
        ...sheenFromColorSet(themeVars.color.primary, 100),
        borderRadius: PILL_RADIUS,
        boxShadow: SHADOW_SMALL,
        selectors: {
            [skinSelectors.hasError]: {
                ...sheenFromColorSet(themeVars.color.error, 100),
            },
        },
    },
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
        ...sheenFromColorString(layerVars.main, 25),
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
        ...sheenFromColorSet(themeVars.color.primary, 100),
        borderRadius: PILL_RADIUS,
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
        ...sheenFromColorString(layerVars.main, 25),
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
        ...sheenFromColorString(layerVars.main, 25),
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
        ...sheenFromColorString(layerVars.contrast, 100),
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

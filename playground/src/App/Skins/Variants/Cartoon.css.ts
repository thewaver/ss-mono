import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors } from "../Skin.css";

export const cartoon = style({});

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

const INPUT_STATES: StyleRule["selectors"] = {
    [skinSelectors.isReadOnly]: {
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
    },
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {},
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        borderColor: themeVars.color.error.main,
        color: themeVars.color.error.main,
    },
    ...INTERACTIBLE_STATES,
} as const;

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
    border: "2px solid black",
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

const SURFACE: StyleRule = {
    border: "2px solid black",
    backgroundColor: themeVars.color.surface.light,
    boxShadow: SHADOW_MEDIUM,
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

SkinUtils.define(cartoon, {
    accordionHeader: {
        ...ACCORDION,
        selectors: {
            ...SkinUtils.joinedCorners(),
            ...INTERACTIBLE_STATES,
            [skinSelectors.isExpanded]: {
                backgroundColor: themeVars.color.primary.main,
                color: themeVars.color.primary.contrast,
            },
        },
    },
    accordionPanel: {
        ...ACCORDION,
        selectors: {
            ...SkinUtils.joinedCorners(),
        },
    },
    button: {
        paddingInline: themeVars.spacing.double,
        border: "2px solid black",
        backgroundColor: themeVars.color.primary.main,
        boxShadow: SHADOW_SMALL,
        color: themeVars.color.primary.contrast,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isPressed]: {
                boxShadow: `inset 4px 4px 0 rgb(0 0 0 / 50%)`,
            },
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                color: themeVars.color.error.contrast,
            },
            ...INTERACTIBLE_STATES,
        },
    },
    buttonSimple: {
        border: "2px solid black",
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 25%)`],
        boxShadow: SHADOW_SMALL,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [skinSelectors.isPressed]: {
                color: themeVars.color.primary.main,
            },
            [skinSelectors.hasError]: {
                boxShadow: `inset 0 0 0 2px ${themeVars.color.error.main}, ${SHADOW_SMALL}`,
            },
            ...INTERACTIBLE_STATES,
        },
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
    hollowSurface: SkinUtils.hollow(SURFACE),
    hoverFloater: {
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
        boxShadow: SHADOW_SMALL,
    },
    input: {
        ...INPUT_SHELL,
        selectors: {
            ...INPUT_STATES,
            [skinSelectors.fieldText]: {
                color: layerVars.contrast,
                caretColor: themeVars.color.primary.main,
                fontSize: themeVars.fontSize.medium,
            },
            [skinSelectors.fieldTextDisabled]: {
                color: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / ${themeVars.disabled.opacity})`],
            },
        },
    },
    itemWithFloater: {
        ...ITEM,
    },
    itemWithoutFloater: ObjectUtils.deepMerge(ITEM, {
        selectors: {
            [skinSelectors.isHovered]: {
                backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
                boxShadow: SHADOW_SMALL,
            },
        },
    }),
    overlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
    },
    pageBackground: {
        backgroundColor: themeVars.color.background.light,
        color: themeVars.color.background.contrast,
        fontFamily: "monospace",
    },
    panel: {
        border: [
            `2px solid ${themeVars.color.surface.contrast}`,
            `2px solid rgb( from ${themeVars.color.surface.contrast} r g b / 25%)`,
        ],
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
    progressTrack: {
        border: `2px solid ${themeVars.color.primary.main}`,
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
        border: `2px solid ${themeVars.color.primary.main}`,
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
    selectionFloater: {
        backgroundColor: [themeVars.color.primary.main, `rgb(from ${themeVars.color.primary.main} r g b / 10%)`],
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
        border: `2px solid ${themeVars.color.primary.main}`,
        boxShadow: SHADOW_SMALL,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    surface: SURFACE,
    tabsFloater: {
        border: `2px solid ${themeVars.color.primary.main}`,
        boxShadow: SHADOW_SMALL,
    },
    tabsGutter: {
        border: [`2px solid ${layerVars.contrast}`, `2px solid rgb( from ${layerVars.contrast} r g b / 25%)`],
        boxShadow: SHADOW_SMALL,
    },
    tabsItem: {
        paddingBlock: themeVars.spacing.full,
        paddingInline: themeVars.spacing.double,
        fontSize: themeVars.fontSize.small,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isVertical]: {
                paddingBlock: themeVars.spacing.full,
                paddingInline: themeVars.spacing.double,
            },
            [skinSelectors.isHovered]: {
                color: themeVars.color.primary.main,
            },
            [skinSelectors.isSelected]: {
                color: themeVars.color.primary.main,
            },
            ...INTERACTIBLE_STATES,
        },
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
    toggleHandle: {
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 75%)`],
        selectors: {
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                backgroundColor: themeVars.color.primary.contrast,
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

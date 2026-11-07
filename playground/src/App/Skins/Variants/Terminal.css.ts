import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

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
        color: themeVars.color.primary.main,
    },
});

const INPUT_SHELL: StyleRule = {
    border: [`2px solid ${layerVars.contrast}`, `2px solid rgb( from ${layerVars.contrast} r g b / 25%)`],
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    border: [`2px solid ${layerVars.contrast}`, `2px solid rgb( from ${layerVars.contrast} r g b / 25%)`],
    backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
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
    backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
};

const ITEM_FLOATER_SELECTED: StyleRule = {
    backgroundColor: [themeVars.color.primary.main, `rgb(from ${themeVars.color.primary.main} r g b / 10%)`],
    color: themeVars.color.primary.main,
};

const SURFACE: StyleRule = {
    border: [
        `2px solid ${themeVars.color.surface.contrast}`,
        `2px solid rgb( from ${themeVars.color.surface.contrast} r g b / 25%)`,
    ],
    backgroundColor: themeVars.color.surface.dark,
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

SkinUtils.define(terminal, {
    accordionHeader: {
        ...ACCORDION,
        selectors: {
            ...SkinUtils.joinedCorners(),
            ...INTERACTIBLE_STATES,
            [skinSelectors.isExpanded]: {
                border: `2px solid ${themeVars.color.primary.main}`,
                color: themeVars.color.primary.main,
                fontWeight: "bold",
            },
        },
    },
    accordionPanel: {
        ...ACCORDION,
        selectors: {
            ...SkinUtils.joinedCorners(),
        },
    },
    accordionWrapper: {},
    button: {
        paddingInline: themeVars.spacing.double,
        border: `2px solid ${layerVars.contrast}`,
        color: layerVars.contrast,
        fontWeight: "bold",
        selectors: {
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
            ...INTERACTIBLE_STATES,
        },
    },
    buttonSimple: {
        border: `2px solid ${layerVars.contrast}`,
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
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
        color: themeVars.color.primary.main,
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
    },
    dropdown: {
        ...INPUT_SHELL,
    },
    hollowSurface: SkinUtils.hollow(SURFACE),
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
    itemBase: ObjectUtils.deepMerge(ITEM, {
        selectors: {
            [skinSelectors.isHoveredWithoutFloater]: {
                ...ITEM_FLOATER_HOVER,
            },
            [skinSelectors.isSelectedWithoutFloater]: {
                ...ITEM_FLOATER_SELECTED,
            },
        },
    }),
    itemHoverFloater: {
        ...ITEM_FLOATER_HOVER,
    },
    itemSelectionFloater: {
        ...ITEM_FLOATER_SELECTED,
    },
    itemWithHoverFloater: {},
    itemWithSelectionFloater: {},
    overlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
    },
    pageBackground: {
        backgroundColor: themeVars.color.background.dark,
        color: themeVars.color.background.contrast,
        fontFamily: "monospace",
    },
    panel: {
        border: [
            `2px solid ${themeVars.color.surface.contrast}`,
            `2px solid rgb( from ${themeVars.color.surface.contrast} r g b / 25%)`,
        ],
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
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
    surface: SURFACE,
    tabsFloater: {
        border: `2px solid ${themeVars.color.primary.main}`,
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
    tabsTrack: {
        border: [`2px solid ${layerVars.contrast}`, `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`],
    },
    tag: {
        paddingInline: themeVars.spacing.full,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 25%)`],
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
        color: layerVars.contrast,
    },
});

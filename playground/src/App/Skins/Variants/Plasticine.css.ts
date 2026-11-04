import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

export const plasticine = style({});

const PILL_RADIUS = "9999px";

const SHADOW_SMALL = "0 2px 2px 0px rgba(0, 0, 0, 0.65)";
const SHADOW_MEDIUM = `${SHADOW_SMALL}, 0 4px 8px 0px rgba(0, 0, 0, 0.5)`;
const SHADOW_LARGE = `${SHADOW_MEDIUM}, 0 16px 64px 0px rgba(0, 0, 0, 0.35)`;

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
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
    },
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        borderColor: themeVars.color.error.main,
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
    },
});

const FIELD_SHELL: StyleRule = {
    border: `2px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    boxShadow: SHADOW_SMALL,
} as const;

const ACCORDION: StyleRule = {
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    borderRadius: themeVars.borderRadius.half,
    fontSize: themeVars.fontSize.medium,
    selectors: ITEM_STATES,
} as const;

const SURFACE: StyleRule = {
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: themeVars.color.surface.main,
    backgroundImage: `linear-gradient(315deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.medium,
    boxShadow: SHADOW_MEDIUM,
} as const;

SkinUtils.define(plasticine, {
    accordionHeader: {
        ...ACCORDION,
        selectors: {
            ...SkinUtils.joinedCorners(),
            ...INTERACTIBLE_STATES,
        },
    },
    accordionPanel: {
        ...ACCORDION,
        selectors: {
            ...SkinUtils.joinedCorners(),
        },
    },
    blurredOverlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
    },
    button: {
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.double,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: `linear-gradient(315deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        color: themeVars.color.primary.contrast,
        boxShadow: SHADOW_SMALL,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isPressed]: {
                boxShadow: `inset 0 1px 3px rgb(0 0 0 / 75%), inset 0 2px 6px rgb(0 0 0 / 50%)`,
            },
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: `linear-gradient(315deg, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
                color: themeVars.color.error.contrast,
            },
            ...INTERACTIBLE_STATES,
        },
    },
    buttonSimple: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 25%)`],
        color: layerVars.contrast,
        boxShadow: SHADOW_SMALL,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [skinSelectors.isPressed]: {
                color: themeVars.color.primary.main,
            },
            [skinSelectors.hasError]: {
                boxShadow: `inset 0 0 0 2px ${themeVars.color.error.main}`,
            },
            ...INTERACTIBLE_STATES,
        },
    },
    checkboxBox: {
        ...FIELD_SHELL,
        borderRadius: themeVars.borderRadius.half,
        selectors: INPUT_STATES,
    },
    checkboxMark: {
        color: themeVars.color.primary.main,
        fontSize: themeVars.fontSize.medium,
    },
    decoration: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: "transparent",
        color: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 75%)`],
        selectors: {
            ...INTERACTIBLE_STATES,
        },
    },
    drawer: {
        backgroundColor: themeVars.color.surface.main,
        backgroundImage: `linear-gradient(45deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,
        color: themeVars.color.surface.contrast,
        boxShadow: SHADOW_LARGE,
    },
    dropdown: {
        ...FIELD_SHELL,
    },
    hollowSurface: SkinUtils.hollow(SURFACE),
    hoverFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 25%)`],
    },
    input: {
        ...FIELD_SHELL,
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
                backgroundColor: `rgb(from ${layerVars.contrast} r g b / 25%)`,
            },
        },
    }),
    opaqueOverlay: {
        backgroundColor: "black",
    },
    pageBackground: {
        backgroundColor: themeVars.color.background.main,
        backgroundImage: `linear-gradient(315deg, ${themeVars.color.background.dark}, ${themeVars.color.background.light})`,
        color: themeVars.color.background.contrast,
    },
    panel: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
        color: layerVars.contrast,
        boxShadow: SHADOW_SMALL,
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
        ...FIELD_SHELL,
        borderRadius: "50%",
        selectors: INPUT_STATES,
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
    selectionFloater: {
        borderRadius: themeVars.borderRadius.half,
        backgroundColor: [themeVars.color.primary.main, `rgb(from ${themeVars.color.primary.main} r g b / 10%)`],
    },
    slideButtonArrow: {
        color: themeVars.color.primary.main,
        selectors: {
            [skinSelectors.hasError]: {
                color: themeVars.color.error.main,
            },
        },
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: `linear-gradient(${skinVars.barAngle}, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                backgroundImage: `linear-gradient(${skinVars.barAngle}, ${themeVars.color.error.dark}, ${themeVars.color.error.light})`,
            },
        },
    },
    slideButtonHint: {
        fontWeight: "bold",
    },
    slideButtonThumb: {
        borderRadius: "50%",
        border: `2px solid ${themeVars.color.primary.main}`,
        backgroundColor: layerVars.main,
        boxShadow: SHADOW_SMALL,
        selectors: {
            [skinSelectors.hasError]: {
                borderColor: themeVars.color.error.main,
            },
        },
    },
    slideButtonTrack: {
        borderRadius: PILL_RADIUS,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
        boxShadow: SHADOW_SMALL,
    },
    surface: SURFACE,
    tabsFloater: {
        borderBlockEnd: `2px solid ${themeVars.color.primary.main}`,
        selectors: {
            [skinSelectors.isVertical]: {
                borderBlockEnd: "none",
                borderInlineStart: `2px solid ${themeVars.color.primary.main}`,
            },
        },
    },
    tabsGutter: {
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
    tabsItem: {
        paddingBlock: themeVars.spacing.half,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.small,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isVertical]: {
                paddingBlock: themeVars.spacing.quarter,
                paddingInline: themeVars.spacing.double,
            },
            [SkinUtils.anyOf(skinSelectors.isHovered, skinSelectors.isSelected)]: {
                color: themeVars.color.primary.main,
            },
            [skinSelectors.isDisabled]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    tag: {
        borderRadius: themeVars.borderRadius.half,
        paddingInline: themeVars.spacing.full,
        backgroundColor: themeVars.color.primary.main,
        backgroundImage: `linear-gradient(45deg, ${themeVars.color.primary.dark}, ${themeVars.color.primary.light})`,
        color: themeVars.color.primary.contrast,
        fontSize: themeVars.fontSize.xSmall,
        selectors: {
            [skinSelectors.isHovered]: {
                filter: themeVars.hover.filter,
            },
            [skinSelectors.isDisabled]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
    toggleHandle: {
        borderRadius: "50%",
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 75%)`],
        selectors: {
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                backgroundColor: themeVars.color.primary.main,
            },
        },
    },
    toggleTrack: {
        ...FIELD_SHELL,
        borderRadius: PILL_RADIUS,
        selectors: INPUT_STATES,
    },
    tooltip: {
        borderRadius: themeVars.borderRadius.full,
        backgroundColor: layerVars.main,
        color: layerVars.contrast,
        boxShadow: SHADOW_SMALL,
    },
});

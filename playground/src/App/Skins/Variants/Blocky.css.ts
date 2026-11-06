import { ObjectUtils } from "@thewaver/ss-utils";
import { type StyleRule, style } from "@vanilla-extract/css";

import { SkinUtils } from "../Skin.utils";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { skinSelectors, skinVars } from "../Skin.css";

export const blocky = style({ vars: { [skinVars.rangeTrackThickness]: "16px" } });

const INSET_SHADOW_THICKNESS = 2;

const insetShadowRaised = (color: string) =>
    [
        `inset -${INSET_SHADOW_THICKNESS}px -${INSET_SHADOW_THICKNESS}px 0 rgb(0 0 0 / 65%)`,
        `inset ${INSET_SHADOW_THICKNESS}px ${INSET_SHADOW_THICKNESS}px 0 rgb(255 255 255 / 65%)`,
    ].join(", ");
const insetShadowLowered = (color: string) =>
    [
        `inset ${INSET_SHADOW_THICKNESS}px ${INSET_SHADOW_THICKNESS}px 0 rgb(0 0 0 / 65%)`,
        `inset -${INSET_SHADOW_THICKNESS}px -${INSET_SHADOW_THICKNESS}px 0 rgb(255 255 255 / 65%)`,
    ].join(", ");

const SEGMENT_WIDTH = 8;
const SEGMENT_GAP = 2;

const segments = (color: string) =>
    `repeating-linear-gradient(${skinVars.barAngle}, ${color} 0 ${SEGMENT_WIDTH}px, transparent ${SEGMENT_WIDTH}px ${SEGMENT_WIDTH + SEGMENT_GAP}px)`;

const SHADOW_MEDIUM = "8px 8px 0 0px rgba(0, 0, 0, 0.35)";

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
        boxShadow: insetShadowLowered(layerVars.contrast),
    },
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {},
    [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
        backgroundColor: themeVars.color.error.main,
        boxShadow: insetShadowLowered(themeVars.color.error.main),
    },
    ...INTERACTIBLE_STATES,
} as const;

const ITEM_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
    [skinSelectors.isSelected]: {
        backgroundColor: themeVars.color.primary.main,
        boxShadow: insetShadowRaised(themeVars.color.error.main),
        color: themeVars.color.primary.contrast,
        fontWeight: "bold",
    },
    [skinSelectors.isDisabled]: {
        backgroundColor: "transparent",
        boxShadow: "none",
    },
});

const SWITCH_STATES: StyleRule["selectors"] = ObjectUtils.deepMerge(INPUT_STATES, {
    [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
        backgroundColor: themeVars.color.primary.main,
        boxShadow: insetShadowLowered(themeVars.color.primary.main),
    },
});

const INPUT_SHELL: StyleRule = {
    backgroundColor: layerVars.main,
    boxShadow: insetShadowLowered(layerVars.main),
    color: layerVars.contrast,
} as const;

const SWITCH_SHELL: StyleRule = {
    ...INPUT_SHELL,
} as const;

const ACCORDION: StyleRule = {
    backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
    boxShadow: insetShadowRaised(layerVars.main),
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

const ITEM: StyleRule = {
    fontSize: themeVars.fontSize.medium,
    selectors: {
        ...ITEM_STATES,
    },
} as const;

const SURFACE: StyleRule = {
    backgroundColor: themeVars.color.surface.main,
    boxShadow: [insetShadowRaised(themeVars.color.surface.main), SHADOW_MEDIUM].join(","),
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.medium,
} as const;

SkinUtils.define(blocky, {
    accordionHeader: {
        ...ACCORDION,
        selectors: {
            ...SkinUtils.joinedCorners(),
            ...INTERACTIBLE_STATES,
            [skinSelectors.isExpanded]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: insetShadowRaised(themeVars.color.primary.main),
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
        backgroundColor: themeVars.color.primary.main,
        boxShadow: insetShadowRaised(themeVars.color.primary.main),
        color: themeVars.color.primary.contrast,
        fontWeight: "bold",
        selectors: {
            [skinSelectors.isPressed]: {
                boxShadow: insetShadowLowered(themeVars.color.primary.main),
            },
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                boxShadow: insetShadowRaised(themeVars.color.error.main),
                color: themeVars.color.error.contrast,
            },
            [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
                boxShadow: insetShadowLowered(themeVars.color.error.main),
            },
            ...INTERACTIBLE_STATES,
        },
    },
    buttonSimple: {
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 25%)`],
        boxShadow: insetShadowRaised(layerVars.contrast),
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.small,
        selectors: {
            [skinSelectors.isPressed]: {
                boxShadow: insetShadowLowered(layerVars.contrast),
            },
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                boxShadow: insetShadowRaised(themeVars.color.error.main),
                color: themeVars.color.error.contrast,
            },
            [SkinUtils.allOf(skinSelectors.isPressed, skinSelectors.hasError)]: {
                boxShadow: insetShadowLowered(themeVars.color.error.main),
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
        backgroundColor: themeVars.color.surface.main,
        boxShadow: [insetShadowRaised(themeVars.color.surface.main), SHADOW_MEDIUM].join(","),
        color: themeVars.color.surface.contrast,
    },
    dropdown: {
        ...INPUT_SHELL,
        border: "none",
    },
    hollowSurface: SkinUtils.hollow(SURFACE),
    hoverFloater: {
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
        boxShadow: insetShadowRaised(layerVars.contrast),
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
            [skinSelectors.fieldTextError]: {
                color: themeVars.color.error.contrast,
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
                boxShadow: insetShadowRaised(layerVars.contrast),
            },
        },
    }),
    overlay: {
        backdropFilter: "blur(10px) grayscale(75%)",
    },
    pageBackground: {
        backgroundColor: themeVars.color.background.main,
        color: themeVars.color.background.contrast,
        fontFamily: "monospace",
    },
    panel: {
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
        boxShadow: insetShadowRaised(layerVars.main),
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
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 50%)`],
        boxShadow: insetShadowLowered(layerVars.main),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: [themeVars.color.error.main, `rgb(from ${themeVars.color.error.main} r g b / 50%)`],
                boxShadow: insetShadowLowered(themeVars.color.error.main),
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
        boxShadow: insetShadowRaised(themeVars.color.primary.contrast),
    },
    rangeFill: {
        backgroundColor: themeVars.color.primary.main,
        boxShadow: insetShadowRaised(themeVars.color.primary.main),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                boxShadow: insetShadowRaised(themeVars.color.error.main),
            },
        },
    },
    rangeThumb: {
        backgroundColor: themeVars.color.primary.dark,
        boxShadow: insetShadowRaised(themeVars.color.primary.dark),
        color: themeVars.color.primary.contrast,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.dark,
                boxShadow: insetShadowRaised(themeVars.color.error.dark),
                color: themeVars.color.error.contrast,
            },
        },
    },
    rangeTrack: {
        backgroundColor: [layerVars.main, `rgb(from ${layerVars.main} r g b / 25%)`],
        boxShadow: insetShadowLowered(layerVars.main),
    },
    scrollerThumb: {
        selectors: {
            [skinSelectors.line]: {
                backgroundColor: themeVars.color.primary.main,
                boxShadow: insetShadowRaised(themeVars.color.primary.main),
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
                boxShadow: insetShadowLowered(layerVars.contrast),
            },
        },
    },
    selectionFloater: {
        backgroundColor: [themeVars.color.primary.main, `rgb(from ${themeVars.color.primary.main} r g b / 10%)`],
        boxShadow: insetShadowRaised(themeVars.color.primary.main),
    },
    slideButtonFill: {
        backgroundColor: themeVars.color.primary.main,
        boxShadow: insetShadowRaised(themeVars.color.primary.main),
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.main,
                boxShadow: insetShadowRaised(themeVars.color.error.main),
            },
        },
    },
    slideButtonThumb: {
        backgroundColor: themeVars.color.primary.dark,
        boxShadow: insetShadowRaised(themeVars.color.primary.dark),
        color: themeVars.color.primary.contrast,
        selectors: {
            [skinSelectors.hasError]: {
                backgroundColor: themeVars.color.error.dark,
                boxShadow: insetShadowRaised(themeVars.color.error.dark),
                color: themeVars.color.error.contrast,
            },
        },
    },
    slideButtonTrack: {
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
        boxShadow: insetShadowRaised(layerVars.contrast),
        fontWeight: "bold",
    },
    surface: SURFACE,
    tabsFloater: {
        backgroundColor: themeVars.color.primary.main,
        boxShadow: insetShadowRaised(themeVars.color.primary.main),
    },
    tabsGutter: {
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 10%)`],
        boxShadow: insetShadowRaised(layerVars.contrast),
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
                color: themeVars.color.primary.contrast,
            },
            ...INTERACTIBLE_STATES,
        },
    },
    tag: {
        paddingInline: themeVars.spacing.full,
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 25%)`],
        boxShadow: insetShadowRaised(layerVars.contrast),
        color: layerVars.contrast,
        fontSize: themeVars.fontSize.xSmall,
        fontWeight: "bold",
        selectors: {
            ...INTERACTIBLE_STATES,
            [skinSelectors.hasError]: {
                color: themeVars.color.error.contrast,
            },
        },
    },
    toggleHandle: {
        backgroundColor: [layerVars.contrast, `rgb(from ${layerVars.contrast} r g b / 75%)`],
        boxShadow: insetShadowRaised(layerVars.contrast),
        selectors: {
            [SkinUtils.anyOf(skinSelectors.isCheckedWithin, skinSelectors.isMixedWithin)]: {
                backgroundColor: themeVars.color.primary.contrast,
                boxShadow: insetShadowRaised(themeVars.color.primary.contrast),
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
        boxShadow: insetShadowRaised(layerVars.main),
        color: layerVars.contrast,
    },
});

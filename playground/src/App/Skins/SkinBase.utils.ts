import type { DeepPartial } from "@thewaver/ss-utils";
import { ObjectUtils } from "@thewaver/ss-utils";
import type { StyleRule } from "@vanilla-extract/css";

import type { SkinBaseRules, SkinColorFamily, SkinOwnRules, SkinRules } from "./Skin.types";
import { SkinUtils } from "./Skin.utils";

import { themeVars } from "../Theme.css";
import { skinSelectors } from "./Skin.css";

export namespace SkinBaseUtils {
    export const INTERACTIBLE_STATES: NonNullable<StyleRule["selectors"]> = {
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

    export const compute = (level: SkinColorFamily): SkinBaseRules => ({
        accordionPanel: {
            selectors: {
                ...SkinUtils.joinedCorners(),
            },
        },
        breadcrumb: {
            color: themeVars.color.primary.main,
            selectors: {
                [skinSelectors.isCurrent]: {
                    color: level.contrast,
                },
            },
        },
        breadcrumbSeparator: {
            color: `rgb(from ${level.contrast} r g b / 50%)`,
        },
        divider: {
            borderColor: `rgb(from ${level.contrast} r g b / 10%)`,
        },
        dropZone: {
            border: [`2px dashed ${level.contrast}`, `2px dashed rgb(from ${level.contrast} r g b / 25%)`],
            selectors: ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
                [skinSelectors.isCarrying]: {
                    borderColor: [level.contrast, `rgb(from ${level.contrast} r g b / 50%)`],
                },
                [skinSelectors.isReceiving]: {
                    borderColor: themeVars.color.primary.main,
                },
                [SkinUtils.anyOf(skinSelectors.hasErrorWithin, skinSelectors.hasError)]: {
                    borderColor: themeVars.color.error.main,
                },
            }),
        },
        grip: {
            color: `rgb(from ${level.contrast} r g b / 50%)`,
        },
        input: {
            selectors: {
                [skinSelectors.isInlineAtRest]: {
                    borderColor: "transparent",
                    background: "transparent",
                    boxShadow: "none",
                },
                [skinSelectors.fieldText]: {
                    color: level.contrast,
                    caretColor: themeVars.color.primary.main,
                    fontSize: themeVars.fontSize.medium,
                },
            },
        },
        itemGroup: {
            borderColor: `rgb(from ${level.contrast} r g b / 25%)`,
            backgroundColor: `rgb(from ${level.contrast} r g b / 10%)`,
        },
        itemGroupLabel: {
            color: `rgb(from ${level.contrast} r g b / 50%)`,
        },
        itemStatic: {
            selectors: {
                [skinSelectors.isHovered]: {
                    borderColor: `rgb(from ${level.contrast} r g b / 50%)`,
                },
                [skinSelectors.isCarried]: {
                    borderColor: themeVars.color.primary.main,
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    color: `rgb(from ${level.contrast} r g b / 50%)`,
                },
            },
        },
        overlay: {
            backdropFilter: "blur(20px) grayscale(75%)",
        },
        placeholder: {
            color: "color-mix(in srgb, currentColor 50%, transparent)",
        },
        progressTip: {},
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
                    backgroundColor: [level.contrast, `rgb(from ${level.contrast} r g b / 25%)`],
                },
            },
        },
        splitPaneGrip: {
            borderRadius: themeVars.borderRadius.half,
            color: `rgb(from ${level.contrast} r g b / 50%)`,
        },
        splitPaneGutter: {
            selectors: {
                [skinSelectors.isActive]: {
                    backgroundColor: themeVars.color.primary.main,
                },
            },
        },
        tableCell: {
            borderColor: `rgb(from ${level.contrast} r g b / 10%)`,
            selectors: {
                [skinSelectors.isHovered]: {
                    backgroundColor: `rgb(from ${level.contrast} r g b / 10%)`,
                },
                [skinSelectors.isSelected]: {
                    backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 25%)`,
                    color: themeVars.color.primary.light,
                },
                [SkinUtils.allOf(skinSelectors.isSelected, skinSelectors.isHovered)]: {
                    backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 35%)`,
                },
                [skinSelectors.isPinned]: {
                    backgroundColor: level.main,
                    borderInlineColor: `rgb(from ${level.contrast} r g b / 25%)`,
                },
                [SkinUtils.allOf(skinSelectors.isPinned, skinSelectors.isHovered)]: {
                    backgroundColor: level.main,
                    backgroundImage: `linear-gradient(rgb(from ${level.contrast} r g b / 10%), rgb(from ${level.contrast} r g b / 10%))`,
                },
                [SkinUtils.allOf(skinSelectors.isPinned, skinSelectors.isSelected)]: {
                    backgroundColor: level.main,
                    backgroundImage: `linear-gradient(rgb(from ${themeVars.color.primary.main} r g b / 25%), rgb(from ${themeVars.color.primary.main} r g b / 25%))`,
                },
                [SkinUtils.allOf(skinSelectors.isPinned, skinSelectors.isSelected, skinSelectors.isHovered)]: {
                    backgroundColor: level.main,
                    backgroundImage: `linear-gradient(rgb(from ${themeVars.color.primary.main} r g b / 35%), rgb(from ${themeVars.color.primary.main} r g b / 35%))`,
                },
            },
        },
        tableDetail: {
            borderColor: `rgb(from ${level.contrast} r g b / 10%)`,
            backgroundColor: `rgb(from ${level.contrast} r g b / 5%)`,
            selectors: {
                [skinSelectors.isSelected]: {
                    backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 25%)`,
                },
            },
        },
        tableHeader: {
            backgroundColor: level.main,
            borderColor: `rgb(from ${level.contrast} r g b / 25%)`,
            color: level.contrast,
            selectors: {
                [SkinUtils.allOf(skinSelectors.isSortable, skinSelectors.isHovered)]: {
                    backgroundImage: `linear-gradient(rgb(from ${level.contrast} r g b / 10%), rgb(from ${level.contrast} r g b / 10%))`,
                },
                [skinSelectors.isSorted]: {
                    color: themeVars.color.primary.main,
                },
            },
        },
        tabsItemBase: {
            selectors: {
                [skinSelectors.isVertical]: {
                    paddingBlock: themeVars.spacing.full,
                    paddingInline: themeVars.spacing.double,
                },
            },
        },
    });

    export const merge = (level: SkinColorFamily, rules: SkinOwnRules): SkinRules =>
        ObjectUtils.deepMerge<SkinRules>(compute(level) as SkinRules, rules as DeepPartial<SkinRules>);
}

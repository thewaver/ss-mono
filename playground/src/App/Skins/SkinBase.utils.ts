import type { DeepPartial } from "@thewaver/ss-utils";
import { ObjectUtils } from "@thewaver/ss-utils";
import type { StyleRule } from "@vanilla-extract/css";

import type { SkinBaseRules, SkinColorFamily, SkinOwnRules, SkinRules } from "./Skin.types";
import { SkinUtils } from "./Skin.utils";

import { themeVars } from "../Theme.css";
import { skinSelectors } from "./Skin.css";

const RANGE_THICKNESS = "20px";
const PROGRESS_THICKNESS = "8px";
const GRIP_THICKNESS = "2px";
const GRIP_LENGTH = "24px";

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
            color: `color-mix(in srgb, ${level.contrast} 50%, transparent)`,
        },
        divider: {
            borderColor: `color-mix(in srgb, ${level.contrast} 10%, transparent)`,
        },
        dropZone: {
            border: `2px dashed color-mix(in srgb, ${level.contrast} 25%, transparent)`,
            selectors: ObjectUtils.deepMerge(INTERACTIBLE_STATES, {
                [skinSelectors.isCarrying]: {
                    borderColor: `color-mix(in srgb, ${level.contrast} 50%, transparent)`,
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
            color: `color-mix(in srgb, ${level.contrast} 50%, transparent)`,
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
            borderColor: `color-mix(in srgb, ${level.contrast} 25%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${level.contrast} 10%, transparent)`,
        },
        itemGroupLabel: {
            color: `color-mix(in srgb, ${level.contrast} 50%, transparent)`,
        },
        itemStatic: {
            selectors: {
                [skinSelectors.isHovered]: {
                    borderColor: `color-mix(in srgb, ${level.contrast} 50%, transparent)`,
                },
                [skinSelectors.isCarried]: {
                    borderColor: themeVars.color.primary.main,
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    color: `color-mix(in srgb, ${level.contrast} 50%, transparent)`,
                },
            },
        },
        overlay: {
            backdropFilter: "blur(20px) grayscale(75%)",
        },
        placeholder: {
            color: "color-mix(in srgb, currentColor 50%, transparent)",
        },
        progressTip: {
            height: "100%",
            aspectRatio: "1",
            selectors: {
                [skinSelectors.isVertical]: {
                    width: "100%",
                    height: "auto",
                },
            },
        },
        progressTrack: {
            height: PROGRESS_THICKNESS,
            selectors: {
                [skinSelectors.isVertical]: {
                    width: PROGRESS_THICKNESS,
                },
            },
        },
        rangeFill: {
            height: RANGE_THICKNESS,
            selectors: {
                [skinSelectors.isVertical]: {
                    width: RANGE_THICKNESS,
                    height: "auto",
                },
            },
        },
        rangeThumb: {
            width: RANGE_THICKNESS,
            height: RANGE_THICKNESS,
        },
        rangeTrack: {
            height: RANGE_THICKNESS,
            selectors: {
                [skinSelectors.isVertical]: {
                    width: RANGE_THICKNESS,
                    height: "auto",
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
                    backgroundColor: `color-mix(in srgb, ${level.contrast} 25%, transparent)`,
                },
            },
        },
        splitPaneGrip: {
            width: GRIP_THICKNESS,
            height: GRIP_LENGTH,
            borderRadius: themeVars.borderRadius.half,
            color: `color-mix(in srgb, ${level.contrast} 50%, transparent)`,
            selectors: {
                [skinSelectors.isVertical]: {
                    width: GRIP_LENGTH,
                    height: GRIP_THICKNESS,
                },
            },
        },
        splitPaneGutter: {
            selectors: {
                [skinSelectors.isActive]: {
                    backgroundColor: themeVars.color.primary.main,
                },
            },
        },
        tableCell: {
            borderColor: `color-mix(in srgb, ${level.contrast} 10%, transparent)`,
            selectors: {
                [skinSelectors.isHovered]: {
                    backgroundColor: `color-mix(in srgb, ${level.contrast} 10%, transparent)`,
                },
                [skinSelectors.isSelected]: {
                    backgroundColor: `color-mix(in srgb, ${themeVars.color.primary.main} 25%, transparent)`,
                    color: themeVars.color.primary.light,
                },
                [SkinUtils.allOf(skinSelectors.isSelected, skinSelectors.isHovered)]: {
                    backgroundColor: `color-mix(in srgb, ${themeVars.color.primary.main} 35%, transparent)`,
                },
                [skinSelectors.isPinned]: {
                    backgroundColor: level.main,
                    borderInlineColor: `color-mix(in srgb, ${level.contrast} 25%, transparent)`,
                },
                [SkinUtils.allOf(skinSelectors.isPinned, skinSelectors.isHovered)]: {
                    backgroundColor: level.main,
                    backgroundImage: `linear-gradient(color-mix(in srgb, ${level.contrast} 10%, transparent), color-mix(in srgb, ${level.contrast} 10%, transparent))`,
                },
                [SkinUtils.allOf(skinSelectors.isPinned, skinSelectors.isSelected)]: {
                    backgroundColor: level.main,
                    backgroundImage: `linear-gradient(color-mix(in srgb, ${themeVars.color.primary.main} 25%, transparent), color-mix(in srgb, ${themeVars.color.primary.main} 25%, transparent))`,
                },
                [SkinUtils.allOf(skinSelectors.isPinned, skinSelectors.isSelected, skinSelectors.isHovered)]: {
                    backgroundColor: level.main,
                    backgroundImage: `linear-gradient(color-mix(in srgb, ${themeVars.color.primary.main} 35%, transparent), color-mix(in srgb, ${themeVars.color.primary.main} 35%, transparent))`,
                },
            },
        },
        tableDetail: {
            borderColor: `color-mix(in srgb, ${level.contrast} 10%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${level.contrast} 5%, transparent)`,
            selectors: {
                [skinSelectors.isSelected]: {
                    backgroundColor: `color-mix(in srgb, ${themeVars.color.primary.main} 25%, transparent)`,
                },
            },
        },
        tableHeader: {
            backgroundColor: level.main,
            borderColor: `color-mix(in srgb, ${level.contrast} 25%, transparent)`,
            color: level.contrast,
            selectors: {
                [SkinUtils.allOf(skinSelectors.isSortable, skinSelectors.isHovered)]: {
                    backgroundImage: `linear-gradient(color-mix(in srgb, ${level.contrast} 10%, transparent), color-mix(in srgb, ${level.contrast} 10%, transparent))`,
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

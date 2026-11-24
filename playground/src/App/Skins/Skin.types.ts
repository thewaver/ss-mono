import type { GlobalStyleRule } from "@vanilla-extract/css";

import type { ColorFamily } from "../Theme.const";

export type SkinEntry =
    | "accordionHeader"
    | "accordionPanel"
    | "accordionWrapper"
    | "breadcrumb"
    | "breadcrumbSeparator"
    | "button"
    | "buttonSimple"
    | "checkboxBox"
    | "checkboxMark"
    | "decoration"
    | "divider"
    | "drawer"
    | "dropdown"
    | "dropZone"
    | "grip"
    | "input"
    | "itemBase"
    | "itemGroup"
    | "itemGroupLabel"
    | "itemHoverFloater"
    | "itemSelectionFloater"
    | "itemStatic"
    | "overlay"
    | "pageBackground"
    | "pageContainer"
    | "panel"
    | "placeholder"
    | "progressFill"
    | "progressTip"
    | "progressTrack"
    | "radioBox"
    | "radioDot"
    | "rangeFill"
    | "rangeThumb"
    | "rangeTrack"
    | "scrollerThumb"
    | "scrollerTrack"
    | "slideButtonFill"
    | "slideButtonThumb"
    | "slideButtonTrack"
    | "splitPaneFrame"
    | "splitPaneGrip"
    | "splitPaneGutter"
    | "surface"
    | "tableCell"
    | "tableDetail"
    | "tableHeader"
    | "tabsItemBase"
    | "tabsItemHoverFloater"
    | "tabsItemSelectionFloater"
    | "tabsTrack"
    | "tag"
    | "toggleThumb"
    | "toggleTrack"
    | "tooltip";

export type SkinState =
    | "isHovered"
    | "isActive"
    | "isSelected"
    | "isExpanded"
    | "isPressed"
    | "isChecked"
    | "isCarrying"
    | "isReceiving"
    | "isMixed"
    | "isVertical"
    | "isStart"
    | "isEnd"
    | "isJoinedBlockStart"
    | "isJoinedBlockEnd"
    | "isJoinedInlineStart"
    | "isJoinedInlineEnd"
    | "isReadOnly"
    | "isDisabled"
    | "hasError"
    | "hasHoverFloater"
    | "hasSelectionFloater"
    | "isCurrent"
    | "isSortable"
    | "isSorted"
    | "isPinned"
    | "isCarried"
    | "isInline";

export type SkinRule = GlobalStyleRule & {
    selectors?: Record<string, GlobalStyleRule>;
};

export type SkinRules = Record<SkinEntry, SkinRule>;

export type SkinBaseEntry =
    | "accordionPanel"
    | "breadcrumb"
    | "breadcrumbSeparator"
    | "divider"
    | "dropZone"
    | "grip"
    | "itemGroup"
    | "itemGroupLabel"
    | "overlay"
    | "placeholder"
    | "progressTip"
    | "scrollerThumb"
    | "scrollerTrack"
    | "splitPaneGrip"
    | "splitPaneGutter"
    | "tableCell"
    | "tableDetail"
    | "tableHeader";

export type SkinBasePartEntry = "input" | "itemStatic" | "tabsItemBase";

export type SkinBaseRules = Record<SkinBaseEntry | SkinBasePartEntry, SkinRule>;

export type SkinOwnRules = Omit<SkinRules, SkinBaseEntry> & Partial<Pick<SkinRules, SkinBaseEntry>>;

export type SkinColorFamily = {
    [k in keyof ColorFamily]: string;
};

export type SkinLevelValues = { l0: string; l1?: string; l2?: string };

export type SkinLevelFamilies = Record<"level0" | "level1" | "level2", SkinColorFamily>;

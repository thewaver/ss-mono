import type { GlobalStyleRule } from "@vanilla-extract/css";

import type { ColorFamily } from "../Theme.const";

export type SkinEntry =
    | "accordionHeader"
    | "accordionPanel"
    | "accordionWrapper"
    | "button"
    | "buttonSimple"
    | "checkboxBox"
    | "checkboxMark"
    | "decoration"
    | "drawer"
    | "dropdown"
    | "dropZone"
    | "input"
    | "itemBase"
    | "itemHoverFloater"
    | "itemSelectionFloater"
    | "itemStatic"
    | "overlay"
    | "pageBackground"
    | "pageContainer"
    | "panel"
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
    | "surface"
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
    | "hasSelectionFloater";

export type SkinRule = GlobalStyleRule & {
    selectors?: Record<string, GlobalStyleRule>;
};

export type SkinRules = Record<SkinEntry, SkinRule>;

export type SkinBaseColor = {
    [k in keyof ColorFamily]: string;
};

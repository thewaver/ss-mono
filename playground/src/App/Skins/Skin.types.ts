import type { GlobalStyleRule } from "@vanilla-extract/css";

export type SkinEntry =
    | "accordionHeader"
    | "accordionPanel"
    | "button"
    | "buttonSimple"
    | "checkboxBox"
    | "checkboxMark"
    | "decoration"
    | "drawer"
    | "dropdown"
    | "hollowSurface"
    | "hoverFloater"
    | "input"
    | "itemWithFloater"
    | "itemWithoutFloater"
    | "overlay"
    | "pageBackground"
    | "panel"
    | "progressFill"
    | "progressTrack"
    | "radioBox"
    | "radioDot"
    | "rangeFill"
    | "rangeThumb"
    | "rangeTrack"
    | "scrollerThumb"
    | "scrollerTrack"
    | "selectionFloater"
    | "slideButtonFill"
    | "slideButtonThumb"
    | "slideButtonTrack"
    | "surface"
    | "tabsFloater"
    | "tabsGutter"
    | "tabsItem"
    | "tag"
    | "toggleHandle"
    | "toggleTrack"
    | "tooltip";

export type SkinState =
    | "isHovered"
    | "isActive"
    | "isSelected"
    | "isExpanded"
    | "isPressed"
    | "isChecked"
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
    | "hasError";

export type SkinRule = GlobalStyleRule & {
    selectors?: Record<string, GlobalStyleRule>;
};

export type SkinRules = Record<SkinEntry, SkinRule>;

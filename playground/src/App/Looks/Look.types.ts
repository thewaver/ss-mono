import type { GlobalStyleRule } from "@vanilla-extract/css";

export type LookEntry =
    | "accordionHeader"
    | "accordionPanel"
    | "blurredOverlay"
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
    | "opaqueOverlay"
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
    | "slideButtonArrow"
    | "slideButtonFill"
    | "slideButtonHint"
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

export type LookState =
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
    | "isReadOnly"
    | "isDisabled"
    | "hasError";

export type LookRule = GlobalStyleRule & {
    selectors?: Record<string, GlobalStyleRule>;
};

export type LookRules = Record<LookEntry, LookRule>;

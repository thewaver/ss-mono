import type { GlobalStyleRule } from "@vanilla-extract/css";

export type LookEntry =
    | "accordionHeader"
    | "blurredOverlay"
    | "button"
    | "buttonSimple"
    | "checkboxBox"
    | "checkboxMark"
    | "decoration"
    | "drawer"
    | "dropdown"
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
    | "surface"
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
    | "isReadOnly"
    | "isDisabled"
    | "hasError";

export type LookRule = GlobalStyleRule & {
    selectors?: Record<string, GlobalStyleRule>;
};

export type LookRules = Record<LookEntry, LookRule>;

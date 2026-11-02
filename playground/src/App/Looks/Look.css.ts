import { layer, style } from "@vanilla-extract/css";

import type { LookEntry, LookState } from "./Look.types";

export const lookLayer = layer("look");

export const lookEntries: Record<LookEntry, string> = {
    accordionHeader: style({}),
    blurredOverlay: style({}),
    button: style({}),
    buttonSimple: style({}),
    checkboxBox: style({}),
    checkboxMark: style({}),
    decoration: style({}),
    drawer: style({}),
    dropdown: style({}),
    hoverFloater: style({}),
    input: style({}),
    itemWithFloater: style({}),
    itemWithoutFloater: style({}),
    opaqueOverlay: style({}),
    pageBackground: style({}),
    panel: style({}),
    progressFill: style({}),
    progressTrack: style({}),
    radioBox: style({}),
    radioDot: style({}),
    rangeFill: style({}),
    rangeThumb: style({}),
    rangeTrack: style({}),
    scrollerThumb: style({}),
    scrollerTrack: style({}),
    selectionFloater: style({}),
    surface: style({}),
    tag: style({}),
    toggleHandle: style({}),
    toggleTrack: style({}),
    tooltip: style({}),
};

export const lookStates: Record<LookState, string> = {
    isHovered: style({}),
    isActive: style({}),
    isSelected: style({}),
    isExpanded: style({}),
    isPressed: style({}),
    isChecked: style({}),
    isMixed: style({}),
    isReadOnly: style({}),
    isDisabled: style({}),
    hasError: style({}),
};

const PRESSABLE = ":is(button, [role='button'])";

export const lookSelectors = {
    isHovered: `&.${lookStates.isHovered}`,
    isActive: `&.${lookStates.isActive}`,
    isSelected: `&.${lookStates.isSelected}`,
    isExpanded: `&.${lookStates.isExpanded}`,
    isPressed: `&.${lookStates.isPressed}`,
    isChecked: `&.${lookStates.isChecked}`,
    isMixed: `&.${lookStates.isMixed}`,
    isReadOnly: `&.${lookStates.isReadOnly}`,
    isDisabled: `&.${lookStates.isDisabled}`,
    hasError: `&.${lookStates.hasError}`,
    withinChecked: `.${lookStates.isChecked} &`,
    withinMixed: `.${lookStates.isMixed} &`,
    withinError: `.${lookStates.hasError} &`,
    isHoveredPressable: `${PRESSABLE} &.${lookStates.isHovered}, &.${lookStates.isHovered}${PRESSABLE}`,
    rightToLeft: "&:dir(rtl)",
    withinErrorRightToLeft: `.${lookStates.hasError} &:dir(rtl)`,
    fieldText: ":has(> &)",
    fieldTextDisabled: `:has(> &.${lookStates.isDisabled})`,
    line: "&::before",
    lineActive: `&.${lookStates.isActive}::before`,
} as const;

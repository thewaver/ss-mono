import { createVar, fallbackVar, layer, style } from "@vanilla-extract/css";

import type { SkinEntry, SkinState } from "./Skin.types";

export const skinLayer = layer("skin");

const barAngle = createVar();

export const skinSizeVars = {
    rangeTrackThickness: createVar(),
    rangeFillThickness: createVar(),
    rangeThumbWidth: createVar(),
    rangeThumbHeight: createVar(),
    progressTrackThickness: createVar(),
};

export const skinVars = {
    barAngle: fallbackVar(barAngle, "90deg"),
    ...skinSizeVars,
};

export const skinBoundary = style({});

export const skinEntries: Record<SkinEntry, string> = {
    accordionHeader: style({}),
    accordionPanel: style({}),
    accordionWrapper: style({}),
    button: style({}),
    buttonSimple: style({}),
    checkboxBox: style({}),
    checkboxMark: style({}),
    decoration: style({}),
    drawer: style({}),
    dropdown: style({}),
    input: style({}),
    itemBase: style({}),
    itemHoverFloater: style({}),
    itemSelectionFloater: style({}),
    overlay: style({}),
    pageBackground: style({}),
    pageContainer: style({}),
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
    slideButtonFill: style({}),
    slideButtonThumb: style({}),
    slideButtonTrack: style({}),
    surface: style({}),
    tabsItemBase: style({}),
    tabsItemHoverFloater: style({}),
    tabsItemSelectionFloater: style({}),
    tabsTrack: style({}),
    tag: style({}),
    toggleThumb: style({}),
    toggleTrack: style({}),
    tooltip: style({}),
};

export const skinStates: Record<SkinState, string> = {
    isHovered: style({}),
    isActive: style({}),
    isSelected: style({}),
    isExpanded: style({}),
    isPressed: style({}),
    isChecked: style({}),
    isMixed: style({}),
    isVertical: style({ vars: { [barAngle]: "0deg" } }),
    isStart: style({}),
    isEnd: style({}),
    isJoinedBlockStart: style({}),
    isJoinedBlockEnd: style({}),
    isJoinedInlineStart: style({}),
    isJoinedInlineEnd: style({}),
    isReadOnly: style({}),
    isDisabled: style({}),
    hasError: style({}),
    hasHoverFloater: style({}),
    hasSelectionFloater: style({}),
};

export const skinSelectors = {
    isActive: `&.${skinStates.isActive}`,
    isHovered: `&.${skinStates.isHovered}`,
    isHoveredWithFloater: `&.${skinStates.isHovered}.${skinStates.hasHoverFloater}`,
    isHoveredWithoutFloater: `&.${skinStates.isHovered}:not(&.${skinStates.hasHoverFloater})`,
    isSelected: `&.${skinStates.isSelected}`,
    isSelectedWithFloater: `&.${skinStates.isSelected}.${skinStates.hasSelectionFloater}`,
    isSelectedWithoutFloater: `&.${skinStates.isSelected}:not(&.${skinStates.hasSelectionFloater})`,
    isExpanded: `&.${skinStates.isExpanded}`,
    isPressed: `&.${skinStates.isPressed}`,
    isChecked: `&.${skinStates.isChecked}`,
    isMixed: `&.${skinStates.isMixed}`,
    isReadOnly: `&.${skinStates.isReadOnly}`,
    isDisabled: `&.${skinStates.isDisabled}`,
    hasError: `&.${skinStates.hasError}`,
    hasHoverFloater: `&.${skinStates.hasHoverFloater}`,
    hasSelectionFloater: `&.${skinStates.hasSelectionFloater}`,
    isCheckedWithin: `.${skinStates.isChecked} &`,
    isMixedWithin: `.${skinStates.isMixed} &`,
    hasErrorWithin: `.${skinStates.hasError} &`,
    isVertical: `&.${skinStates.isVertical}`,
    isStart: `&.${skinStates.isStart}`,
    isEnd: `&.${skinStates.isEnd}`,
    isJoinedBlockStart: `&.${skinStates.isJoinedBlockStart}`,
    isJoinedBlockEnd: `&.${skinStates.isJoinedBlockEnd}`,
    isJoinedInlineStart: `&.${skinStates.isJoinedInlineStart}`,
    isJoinedInlineEnd: `&.${skinStates.isJoinedInlineEnd}`,
    fieldText: ":has(> &)",
    fieldTextDisabled: `:has(> &.${skinStates.isDisabled})`,
    fieldTextError: `:has(> &.${skinStates.hasError})`,
    line: "&::before",
    lineActive: `&.${skinStates.isActive}::before`,
} as const;

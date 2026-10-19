import type { BracketOrientation, BracketPlacement, BracketRootSide } from "./Bracket.types";

export const BRACKET_DEFAULTS = {
    layerGap: 40,
    crossGap: 12,
    orientation: "horizontal" as BracketOrientation,
    rootSide: "end" as BracketRootSide,
    layerHeaderSize: 24,
    transitionDurationMs: 450,
    isPannable: true,
    isZoomable: true,
    maxScale: 1,
    isFollowingFamily: false,
    isSnappingToFamily: false,
    familyMargin: 0,
};

export const BRACKET_ORIENTATIONS: readonly BracketOrientation[] = ["horizontal", "vertical"];

export const BRACKET_ROOT_SIDES: readonly BracketRootSide[] = ["end", "start"];

export const BRACKET_MISSING_PLACEMENT: BracketPlacement = {
    id: "",
    parentId: undefined,
    childIds: [],
    layer: 0,
    cross: 0,
    isDisabled: true,
};

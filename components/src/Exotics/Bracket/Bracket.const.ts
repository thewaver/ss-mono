import type { BracketOrientation, BracketRootSide } from "./Bracket.types";

export const BRACKET_DEFAULTS = {
    layerGap: 40,
    crossGap: 12,
    orientation: "horizontal" as BracketOrientation,
    rootSide: "end" as BracketRootSide,
    layerHeaderSize: 24,
};

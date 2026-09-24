import type { BracketOrientation, BracketRootSide } from "./Bracket.types";

export const BRACKET_DEFAULTS = {
    layerGap: 40,
    crossGap: 12,
    orientation: "horizontal" as BracketOrientation,
    rootSide: "end" as BracketRootSide,
    layerHeaderSize: 24,
};

export const BRACKET_ORIENTATIONS: readonly BracketOrientation[] = ["horizontal", "vertical"];

export const BRACKET_ROOT_SIDES: readonly BracketRootSide[] = ["end", "start"];

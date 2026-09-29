import type { BracketConnectorDefs } from "../../../Exotics/Bracket/Bracket.types";

export type BracketConnectorPathFn = (defs: BracketConnectorDefs, radius: number) => string;

export type BracketConnectorPaintDefs = {
    defs: BracketConnectorDefs;
    radius: number;
    width: number;
    fromColor: string;
    toColor: string;
};

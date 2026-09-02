import type { JSX } from "solid-js";

import type { BracketConnectorDefs } from "../../../Exotics/Bracket/Bracket.types";

export type BracketConnectorPathFn = (defs: BracketConnectorDefs, radius: number) => string;

export type BracketConnectorPaintDefs = {
    defs: BracketConnectorDefs;
    radius: number;
    width: number;
    fromColor: string;
    toColor: string;
};

export type BracketConnectorFn = (paint: BracketConnectorPaintDefs) => JSX.Element;

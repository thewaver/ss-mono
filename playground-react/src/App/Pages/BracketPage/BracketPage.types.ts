import type { ReactNode } from "react";

import type {
    BracketConnectorDefs,
    BracketConnectors,
    BracketOrientation,
    BracketPlacement,
    BracketRootSide,
} from "@thewaver/ss-components-react";

export type BracketExampleProps = {
    layerGap: number;
    crossGap: number;
    orientation: BracketOrientation;
    rootSide: BracketRootSide;
    onActivate: (value: string, placement: BracketPlacement) => void;
    renderConnector: (defs: BracketConnectorDefs) => ReactNode;
};

export type BracketBeamsExampleProps = BracketExampleProps & {
    connector: BracketConnectors.SampleKey;
    connectorRadius: number;
};

export type BracketFamilyExampleProps = BracketExampleProps & {
    transitionDurationMs: number;
    onFamilyChange: (family: string) => void;
};

import type { ReactNode } from "react";

import type {
    BracketConnectorDefs,
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

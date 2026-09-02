import type { Accessor, JSX } from "solid-js";

import type { AccessorProps, BracketConnectorDefs, BracketOrientation, BracketRootSide } from "@thewaver/ss-components";

export type BracketExampleProps = AccessorProps<{
    layerGap: number;
    crossGap: number;
    orientation: BracketOrientation;
    rootSide: BracketRootSide;
    onActivate: (value: string) => void;
}> & {
    renderConnector: (getDefs: Accessor<BracketConnectorDefs>) => JSX.Element;
};

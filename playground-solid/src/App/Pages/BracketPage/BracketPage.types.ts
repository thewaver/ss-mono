import type { Accessor, JSX } from "solid-js";

import type {
    AccessorProps,
    BracketConnectorDefs,
    BracketOrientation,
    BracketPlacement,
    BracketRootSide,
} from "@thewaver/ss-components-solid";

export type BracketExampleProps = AccessorProps<{
    layerGap: number;
    crossGap: number;
    orientation: BracketOrientation;
    rootSide: BracketRootSide;
    onActivate: (value: string, placement: BracketPlacement) => void;
}> & {
    renderConnector: (getDefs: Accessor<BracketConnectorDefs>) => JSX.Element;
};

export type BracketFamilyExampleProps = BracketExampleProps &
    AccessorProps<{
        transitionDurationMs: number;
        onFamilyChange: (family: string) => void;
    }>;

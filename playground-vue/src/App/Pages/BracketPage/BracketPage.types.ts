import type { VNodeChild } from "vue";

import type {
    BracketConnectorDefs,
    BracketConnectors,
    BracketNode,
    BracketNodeState,
    BracketOrientation,
    BracketPlacement,
    BracketRootSide,
} from "@thewaver/ss-components-vue";

export type BracketExampleProps = {
    layerGap: number;
    crossGap: number;
    orientation: BracketOrientation;
    rootSide: BracketRootSide;
    onActivate: (value: string, placement: BracketPlacement) => void;
    renderConnector: (defs: BracketConnectorDefs) => VNodeChild;
};

export type BracketBeamsExampleProps = BracketExampleProps & {
    connector: BracketConnectors.SampleKey;
    connectorRadius: number;
};

export type BracketFamilyExampleProps = BracketExampleProps & {
    transitionDurationMs: number;
    onFamilyChange: (family: string) => void;
};

export type PageBracketNodeProps = {
    node: BracketNode<string>;
    state: BracketNodeState;
};

export type PageBracketLayerHeaderProps = {
    names: string[];
    layer: number;
};

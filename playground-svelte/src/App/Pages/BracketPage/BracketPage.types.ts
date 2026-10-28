import type { Snippet } from "svelte";

import type {
    BracketConnectorDefs,
    BracketOrientation,
    BracketPlacement,
    BracketRootSide,
} from "@thewaver/ss-components-svelte";

export type BracketExampleProps = {
    layerGap: number;
    crossGap: number;
    orientation: BracketOrientation;
    rootSide: BracketRootSide;
    onActivate: (value: string, placement: BracketPlacement) => void;
    renderConnector: Snippet<[defs: BracketConnectorDefs]>;
};

export type BracketFamilyExampleProps = BracketExampleProps & {
    transitionDurationMs: number;
    isSnappingToFamily: boolean;
    onFamilyChange: (family: string) => void;
};

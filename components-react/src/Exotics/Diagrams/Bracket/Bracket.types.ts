import type { ReactNode } from "react";

import type {
    BaseBracketProps,
    BracketConnectorDefs,
    BracketLayerHeaderState,
    BracketNode,
    BracketNodeState,
} from "@thewaver/ss-components";

export type BracketProps<T> = BaseBracketProps<T> & {
    /**
     * Draws the header above one layer, handed the layer counting from the root, so `0` is the final, and whether
     * it is the current round, so the round a camera is framing can be marked. Given, each layer becomes its own list
     * named by its header, and a strip opens along the board's leading edge that follows `orientation` and
     * `rootSide` with the layers.
     */
    renderLayerHeader?: (layer: number, state: BracketLayerHeaderState) => ReactNode;
    /** Draws one node, and is told where it sits in the bracket. */
    renderNode: (node: BracketNode<T>, state: BracketNodeState) => ReactNode;
    /** Draws the line between a node and the one it feeds. */
    renderConnector?: (defs: BracketConnectorDefs) => ReactNode;
    /**
     * Which family the family view shows, named by the node its middle row feeds: that node, its children and theirs.
     * `undefined` is the root's own family, the root and the nodes that feed it. Both sides write it: the board when
     * focus moves, the consumer to move the family from outside — which is how buttons beside the board page through
     * it without taking focus. `BracketUtils.computeFamilyStep` finds the family a step away. Leave it out and the
     * board keeps it itself. A node that is not in the tree shows the root's own family. The tree view folds nothing
     * but still writes it as focus moves, so a consumer framing part of a large tree can follow the focused node's
     * family with a camera of its own.
     */
    family?: readonly [BracketNode<T> | undefined, (value: BracketNode<T> | undefined) => void];
};

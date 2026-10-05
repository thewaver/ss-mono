import type { VNodeChild } from "vue";

import type {
    BracketConnectorDefs,
    BracketLayerHeaderState,
    BracketNode,
    BracketNodeState,
    BracketOrientation,
    BracketPlacement,
    BracketRootSide,
    BracketView,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

export type BracketProps<T> = {
    /** How large one node is. */
    "nodeSize": Size2d;
    /** The space between one round and the next. */
    "layerGap"?: number;
    /** The space between two nodes in the same round. */
    "crossGap"?: number;
    /** Whether the rounds run across the page or down it. */
    "orientation"?: BracketOrientation;
    /** Which end the final holds, and so which way the rounds read. */
    "rootSide"?: BracketRootSide;
    /** Names the bracket for assistive technology. */
    "ariaLabel": string;
    /**
     * How thick the strip holding the layer headers is: its height when the rounds run across, its width when they
     * run down. Ignored without `renderLayerHeader`.
     */
    "layerHeaderSize"?: number;
    /**
     * `"tree"` draws every node. `"family"` draws one family at a time and follows focus: the node the focused one
     * feeds, the focused node with all its siblings, and every node that feeds those siblings. Focusing the root shows
     * the root and the nodes that feed it, and so does the board before anything has been focused. Focus leaving the
     * board leaves the family where it was. Every other node folds onto the family member it hangs from, unseen and
     * out of reach of Tab and a screen reader, and the board keeps the size of the largest family so the page around
     * it never shifts. Which family shows is `family`.
     */
    "view"?: BracketView;
    /**
     * How long the board takes to glide from one family to the next, and between the family view and the tree view
     * when `view` changes, the board growing or shrinking with it — a consumer scaling the board to fit a frame of
     * its own gets a zoom. `0` jumps, which is the reduced-motion route.
     */
    "transitionDurationMs"?: number;
    /** The final, with the rounds that feed it hanging off it as children. */
    "root": BracketNode<T>;
    /**
     * Runs when a node is activated, handed its value and where it sits, so two nodes with the same value can be told
     * apart.
     */
    "onActivate"?: (value: T, placement: BracketPlacement) => void;
    /**
     * Which family the family view shows, named by the node its middle row feeds: that node, its children and theirs.
     * `undefined` is the root's own family, the root and the nodes that feed it. Both sides write it: the board when
     * focus moves, the consumer to move the family from outside — which is how buttons beside the board page through
     * it without taking focus. `BracketUtils.computeFamilyStep` finds the family a step away. Leave it out and the
     * board keeps it itself. A node that is not in the tree shows the root's own family. The tree view folds nothing
     * but still writes it as focus moves, so a consumer framing part of a large tree can follow the focused node's
     * family with a camera of its own. Bind it with `v-model:family`.
     */
    "family"?: BracketNode<T> | undefined;
    /** Receives the board's own family changes, which is what `v-model:family` binds. */
    "onUpdate:family"?: (family: BracketNode<T> | undefined) => void;
};

export type BracketSlots<T> = {
    /**
     * Draws the header above one layer, handed the layer counting from the root, so `0` is the final, and whether
     * it is the current round, so the round a camera is framing can be marked. Given, each layer becomes its own list
     * named by its header, and a strip opens along the board's leading edge that follows `orientation` and
     * `rootSide` with the layers.
     */
    renderLayerHeader?: (props: { layer: number; state: BracketLayerHeaderState }) => VNodeChild;
    /** Draws one node, and is told where it sits in the bracket. */
    renderNode: (props: { node: BracketNode<T>; state: BracketNodeState }) => VNodeChild;
    /** Draws the line between a node and the one it feeds. */
    renderConnector?: (defs: BracketConnectorDefs) => VNodeChild;
};

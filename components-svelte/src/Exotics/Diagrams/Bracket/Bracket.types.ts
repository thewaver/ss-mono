import type { Snippet } from "svelte";

import type {
    BracketConnectorDefs,
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
    nodeSize: Size2d;
    /** The space between one round and the next. */
    layerGap?: number;
    /** The space between two nodes in the same round. */
    crossGap?: number;
    /** Whether the rounds run across the page or down it. */
    orientation?: BracketOrientation;
    /** Which end the final holds, and so which way the rounds read. */
    rootSide?: BracketRootSide;
    /** Names the bracket for assistive technology. */
    ariaLabel: string;
    /**
     * How thick the strip holding the layer headers is: its height when the rounds run across, its width when they
     * run down. Ignored without `renderLayerHeader`.
     */
    layerHeaderSize?: number;
    /**
     * Draws the header above one layer, handed the layer counting from the root, so `0` is the final. Given,
     * each layer becomes its own list named by its header, and a strip opens along the board's leading edge
     * that follows `orientation` and `rootSide` with the layers.
     */
    renderLayerHeader?: Snippet<[layer: number]>;
    /**
     * `"tree"` draws every node. `"family"` draws one family at a time and follows focus: the node the focused one
     * feeds, the focused node with all its siblings, and every node that feeds those siblings. Focusing the root, or
     * nothing, shows the root and the nodes that feed it. Every other node folds onto the family member it hangs from,
     * unseen and out of reach of Tab and a screen reader, and the board keeps the size of the largest family so the
     * page around it never shifts.
     */
    view?: BracketView;
    /**
     * How long the family view takes to glide from one family to the next. `0` jumps, which is the reduced-motion
     * route. Ignored in the tree view.
     */
    transitionDurationMs?: number;
    /** The final, with the rounds that feed it hanging off it as children. */
    root: BracketNode<T>;
    /** Draws one node, and is told where it sits in the bracket. */
    renderNode: Snippet<[node: BracketNode<T>, state: BracketNodeState]>;
    /** Draws the line between a node and the one it feeds. */
    renderConnector?: Snippet<[defs: BracketConnectorDefs]>;
    /**
     * Runs when a node is activated, handed its value and where it sits, so two nodes with the same value can be told
     * apart.
     */
    onActivate?: (value: T, placement: BracketPlacement) => void;
    /**
     * Runs in the family view when it first shows a family and whenever it moves to another, handed the value and
     * placement of the node the family's middle row feeds. Both are `undefined` while the root's own family shows.
     */
    onFamilyChange?: (value: T | undefined, placement: BracketPlacement | undefined) => void;
};

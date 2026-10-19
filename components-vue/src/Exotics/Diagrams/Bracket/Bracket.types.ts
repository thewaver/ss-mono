import type { VNodeChild } from "vue";

import type {
    BaseBracketProps,
    BracketConnectorDefs,
    BracketLayerHeaderState,
    BracketNode,
    BracketNodeState,
    PanZoomController,
    PanZoomView,
} from "@thewaver/ss-components";

export type BracketProps<T> = BaseBracketProps<T> & {
    /**
     * Which family is current, named by the node its middle row feeds: that node, its children and theirs.
     * `undefined` is the root's own family, the root and the nodes that feed it. Both sides write it: the board when
     * focus moves, the consumer to move the family from outside — which is how buttons beside the board page through
     * it without taking focus. `BracketUtils.computeFamilyStep` finds the family a step away, and
     * `BracketUtils.computeFamilyView` the view that frames it. Leave it out and the board keeps it itself. A node
     * that is not in the tree is read as the root's own family. Bind it with `v-model:family`.
     */
    "family"?: BracketNode<T> | undefined;
    /** Receives the board's own family changes, which is what `v-model:family` binds. */
    "onUpdate:family"?: (family: BracketNode<T> | undefined) => void;
    /**
     * The part of the board the window shows, in board pixels. Given, the board is drawn inside a window that fills
     * its container, scaled and moved so the area fits it; the area is widened one way to the window's shape and
     * held inside the board, so any area can be asked for. Both sides write it: the consumer to move the window,
     * gliding over `transitionDurationMs`, and a drag, the wheel or a pinch at once. A node taking focus outside it
     * moves it just far enough to show the node. `BracketUtils.computeWholeView` and
     * `BracketUtils.computeFamilyView` work out the two areas most often wanted. Leave it out and the board is drawn
     * whole, at its own size, with no window. Bind it with `v-model:view`.
     */
    "view"?: PanZoomView;
    /** Receives the view as the window is panned or zoomed, which is what `v-model:view` binds. */
    "onUpdate:view"?: (view: PanZoomView) => void;
    /**
     * Hands the consumer a controller once the board is up, for zooming and panning the window from buttons — the
     * route for anyone who cannot drag or pinch. It does nothing without a view.
     */
    "onMount"?: (controller: PanZoomController) => void;
};

export type BracketSlots<T> = {
    /**
     * Draws the header above one layer, handed the layer counting from the root, so `0` is the final, and whether
     * it is the current round, so the round the window is framing can be marked. Given, each layer becomes its own list
     * named by its header, and a strip opens along the board's leading edge that follows `orientation` and
     * `rootSide` with the layers. With a view, the strip stays pinned to the window's edge as the view moves, and
     * lets a press through to the node under it.
     */
    renderLayerHeader?: (props: { layer: number; state: BracketLayerHeaderState }) => VNodeChild;
    /** Draws one node, and is told where it sits in the bracket. */
    renderNode: (props: { node: BracketNode<T>; state: BracketNodeState }) => VNodeChild;
    /** Draws the line between a node and the one it feeds. */
    renderConnector?: (defs: BracketConnectorDefs) => VNodeChild;
};

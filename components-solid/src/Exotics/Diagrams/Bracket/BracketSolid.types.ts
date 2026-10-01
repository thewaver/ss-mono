import type { Accessor, JSX } from "solid-js";

import type {
    BracketConnectorDefs,
    BracketNode,
    BracketNodeState,
    BracketOrientation,
    BracketPlacement,
    BracketRootSide,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor } from "../../../Utils/typeUtils";

export type BracketProps<T> = AccessorProps<{
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
    /** How thick the strip holding the layer headers is: its height when the rounds run across, its width when they run down. Ignored without `renderLayerHeader`. */
    layerHeaderSize?: number;
    /**
     * Draws the header above one layer, handed the layer counting from the root, so `0` is the final. Given,
     * each layer becomes its own list named by its header, and a strip opens along the board's leading edge
     * that follows `orientation` and `rootSide` with the layers.
     */
    renderLayerHeader?: (layer: number) => JSX.Element;
}> & {
    /** The final, with the rounds that feed it hanging off it as children. */
    root: MaybeAccessor<BracketNode<T>>;
    /** Draws one node, and is told where it sits in the bracket. */
    renderNode: (getNode: Accessor<BracketNode<T>>, getState: Accessor<BracketNodeState>) => JSX.Element;
    /** Draws the line between a node and the one it feeds. */
    renderConnector?: (getDefs: Accessor<BracketConnectorDefs>) => JSX.Element;
    /** Runs when a node is activated, handed its value and where it sits, so two nodes with the same value can be told apart. */
    onActivate?: (value: T, placement: BracketPlacement) => void;
};

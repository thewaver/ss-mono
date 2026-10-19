import type { Snippet } from "svelte";

import type {
    BasePatchBoardProps,
    InteractionFlags,
    PanZoomController,
    PanZoomView,
    PatchBoardCableDefs,
    PatchBoardLink,
    PatchBoardNode,
    PatchBoardNodeFlags,
    PatchBoardSocket,
    PatchBoardSocketFlags,
} from "@thewaver/ss-components";

export type PatchBoardProps<T> = BasePatchBoardProps<T> & {
    /**
     * The nodes and where they sit. Bind it with `bind:nodes`: it is the only thing that moves them, and the board
     * writes it when a node is moved.
     */
    nodes: PatchBoardNode<T>[];
    /**
     * The cables currently wired. Bind it with `bind:links`: it is the only thing that adds or removes one, and the
     * board writes it when a cable is made or pulled out.
     */
    links: PatchBoardLink[];
    /** Draws one node. */
    renderNode: Snippet<[node: PatchBoardNode<T>, flags: InteractionFlags<PatchBoardNodeFlags>]>;
    /** Draws one socket. */
    renderSocket?: Snippet<[socket: PatchBoardSocket, flags: InteractionFlags<PatchBoardSocketFlags>]>;
    /** Draws one cable, and is told where both ends are. */
    renderCable: Snippet<[defs: PatchBoardCableDefs]>;
    /**
     * The part of the board the window shows, in the board's own units: fractions of its width across, and down as
     * far as `heightRatio`. Given, the board is drawn inside a window of its own shape, scaled and moved so the area
     * fits it; the area is widened one way to that shape and held inside the board, so any area can be asked for.
     * Both sides write it: the consumer to move the window, gliding over `transitionDurationMs`, and a drag on empty
     * board, the wheel or a pinch at once. A node or socket taking focus outside it, or carried out of it from the
     * keyboard, moves it just far enough to show it. Bind it with `bind:view` to drive or follow it. Leave it out and
     * the board is drawn whole with no window.
     */
    view?: PanZoomView;
    /**
     * Hands the consumer a controller once the board is up, for zooming and panning the window from buttons — the
     * route for anyone who cannot drag or pinch. It does nothing without a view.
     */
    onMount?: (controller: PanZoomController) => void;
};

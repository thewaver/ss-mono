import type { Snippet } from "svelte";

import type {
    BasePatchBoardProps,
    InteractionFlags,
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
};

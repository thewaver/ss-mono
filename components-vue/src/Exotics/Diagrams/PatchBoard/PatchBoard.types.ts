import type { VNodeChild } from "vue";

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
    /** The nodes and where they sit. It is the only thing that moves them. */
    "nodes": PatchBoardNode<T>[];
    /** Receives the nodes as one is moved, which is what `v-model:nodes` binds. */
    "onUpdate:nodes"?: (nodes: PatchBoardNode<T>[]) => void;
    /** The cables currently wired. It is the only thing that adds or removes one. */
    "links": PatchBoardLink[];
    /** Receives the cables as one is made or pulled out, which is what `v-model:links` binds. */
    "onUpdate:links"?: (links: PatchBoardLink[]) => void;
};

export type PatchBoardSlots<T> = {
    /** Draws one node. */
    renderNode: (props: { node: PatchBoardNode<T>; flags: InteractionFlags<PatchBoardNodeFlags> }) => VNodeChild;
    /** Draws one socket. */
    renderSocket?: (props: { socket: PatchBoardSocket; flags: InteractionFlags<PatchBoardSocketFlags> }) => VNodeChild;
    /** Draws one cable, and is told where both ends are. */
    renderCable: (defs: PatchBoardCableDefs) => VNodeChild;
};

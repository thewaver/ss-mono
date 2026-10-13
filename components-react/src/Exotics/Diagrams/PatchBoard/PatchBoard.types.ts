import type { ReactNode } from "react";

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
    nodes: readonly [PatchBoardNode<T>[], (nodes: PatchBoardNode<T>[]) => void];
    /** The cables currently wired. It is the only thing that adds or removes one. */
    links: readonly [PatchBoardLink[], (links: PatchBoardLink[]) => void];
    /** Draws one node. */
    renderNode: (node: PatchBoardNode<T>, flags: InteractionFlags<PatchBoardNodeFlags>) => ReactNode;
    /** Draws one socket. */
    renderSocket?: (socket: PatchBoardSocket, flags: InteractionFlags<PatchBoardSocketFlags>) => ReactNode;
    /** Draws one cable, and is told where both ends are. */
    renderCable: (defs: PatchBoardCableDefs) => ReactNode;
};

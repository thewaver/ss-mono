import type { Accessor, JSX } from "solid-js";

import type {
    BasePatchBoardCbs,
    BasePatchBoardValues,
    InteractionFlags,
    PatchBoardCableDefs,
    PatchBoardLink,
    PatchBoardNode,
    PatchBoardNodeFlags,
    PatchBoardSocket,
    PatchBoardSocketFlags,
} from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type PatchBoardProps<T> = AccessorValues<BasePatchBoardValues> &
    BasePatchBoardCbs<T> & {
        /** The cables currently wired. It is the only thing that adds or removes one. */
        links: SignalSource<PatchBoardLink[]>;
        /** Draws one socket. */
        renderSocket?: (
            getSocket: Accessor<PatchBoardSocket>,
            getFlags: () => InteractionFlags<PatchBoardSocketFlags>,
        ) => JSX.Element;
        /** Draws one cable, and is told where both ends are. */
        renderCable: (getDefs: Accessor<PatchBoardCableDefs>) => JSX.Element;
        /** The nodes and where they sit. It is the only thing that moves them. */
        nodes: SignalSource<PatchBoardNode<T>[]>;
        /** Draws one node. */
        renderNode: (
            getNode: Accessor<PatchBoardNode<T>>,
            getFlags: () => InteractionFlags<PatchBoardNodeFlags>,
        ) => JSX.Element;
    };

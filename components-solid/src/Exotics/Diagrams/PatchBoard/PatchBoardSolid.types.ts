import type { Accessor, JSX } from "solid-js";

import type {
    BasePatchBoardCbs,
    BasePatchBoardValues,
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
        /**
         * The part of the board the window shows, in the board's own units: fractions of its width across, and down as
         * far as `heightRatio`. Given, the board is drawn inside a window of its own shape, scaled and moved so the area
         * fits it; the area is widened one way to that shape and held inside the board, so any area can be asked for.
         * Both sides write it: the consumer to move the window, gliding over `transitionDurationMs`, and a drag on empty
         * board, the wheel or a pinch at once. A node or socket taking focus outside it, or carried out of it from the
         * keyboard, moves it just far enough to show it. Leave it out and the board is drawn whole with no window.
         */
        view?: SignalSource<PanZoomView>;
        /**
         * Hands the consumer a controller once the board is up, for zooming and panning the window from buttons — the
         * route for anyone who cannot drag or pinch. It does nothing without a view.
         */
        onMount?: (controller: PanZoomController) => void;
    };

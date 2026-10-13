import type { Accessor, JSX } from "solid-js";

import type {
    BaseTileBoardCbs,
    BaseTileBoardValues,
    InteractionFlags,
    TileBoardRenderProps,
} from "@thewaver/ss-components";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues } from "../../Utils/typeUtils";

export type TileBoardTileRenderer = (
    getTile: Accessor<Index2d>,
    getRenderProps: () => InteractionFlags<TileBoardRenderProps>,
) => JSX.Element;

export type TileBoardTileProps = AccessorProps<
    Omit<InteractionControlProps<TileBoardRenderProps>, "renderContent"> & {
        /** Which column this tile sits in. */
        colIndex: number;
        /** The contour the tile is cut to. */
        clipPath: string;
        /** How large the tile is. */
        size: Size2d;
        /** Draws the tile body. */
        renderContent: (getRenderProps: () => InteractionFlags<TileBoardRenderProps>) => JSX.Element;
        /** Runs when this tile is activated. */
        onActivate: () => void;
        /** Receives the layer that takes the pointer, so the board can tell which tile is under a sweeping press. */
        hitRef?: (element: HTMLElement) => void;
    }
>;

export type TileBoardProps = AccessorValues<BaseTileBoardValues> &
    BaseTileBoardCbs & {
        /** Draws one tile. */
        renderTile: TileBoardTileRenderer;
    };

import type { Accessor, JSX } from "solid-js";

import type { Index2d, Point2d, ShapeConst, Size2d } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { InteractionControlProps } from "../../Fundamentals/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type TileBoardTileFlip = "none" | "topToBottom" | "leftToRight";

export type TileBoardNeighbourhood =
    "orthogonal" | "diagonal" | "diagonalAndAcross" | "diagonalAndDown" | "uprightTriangle" | "sidewaysTriangle";

export type TileBoardTiling = {
    pitch: Size2d;
    hasOffsetRows: boolean;
    tileFlip: TileBoardTileFlip;
    neighbourhood: TileBoardNeighbourhood;
};

export type TileBoardLayout = TileBoardTiling & {
    shape: ShapeConst.DefaultShape;
    count: Index2d;
    tileSize: Size2d;
    hasShortFirstRow: boolean;
};

export type TileBoardRenderProps = {
    tile: Index2d;
    size: Size2d;
    points: Point2d[];
    isFlipped: boolean;
    isHighlighted: boolean;
};

export type TileBoardTileRenderer = (
    getTile: Accessor<Index2d>,
    getRenderProps: () => InteractionFlags<TileBoardRenderProps>,
) => JSX.Element;

export type TileBoardTileProps = AccessorProps<
    Omit<InteractionControlProps<TileBoardRenderProps>, "renderContent"> & {
        colIndex: number;
        clipPath: string;
        size: Size2d;
        renderContent: (getRenderProps: () => InteractionFlags<TileBoardRenderProps>) => JSX.Element;
        onActivate: () => void;
    }
>;

export type TileBoardProps = AccessorProps<{
    ariaLabel?: string;
    tileCount: Index2d;
    tileSize: Size2d;
    tileShape?: ShapeConst.DefaultShape;
    gap?: number;
    hasShortFirstRow?: boolean;
    isDisabled?: boolean;
    computeIsTileDisabled?: (tile: Index2d) => boolean;
    computeTileAriaLabel?: (tile: Index2d) => string;
    renderTile: TileBoardTileRenderer;
    onTileActivate: (tile: Index2d) => void;
}>;

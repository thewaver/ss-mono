import type { Accessor, JSX } from "solid-js";

import type { Count2d, Point2d, ShapeConst, Size2d } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { InteractionControlProps } from "../../Fundamentals/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type TileBoardTiling = {
    pitch: Size2d;
    hasOffsetRows: boolean;
    hasFlippedTiles: boolean;
};

export type TileBoardLayout = TileBoardTiling & {
    shape: ShapeConst.DefaultShape;
    count: Count2d;
    tileSize: Size2d;
    hasShortFirstRow: boolean;
};

export type TileBoardRenderProps = {
    tile: Count2d;
    size: Size2d;
    points: Point2d[];
    isFlipped: boolean;
    isHighlighted: boolean;
};

export type TileBoardTileRenderer = (
    getTile: Accessor<Count2d>,
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
    tileCount: Count2d;
    tileSize: Size2d;
    tileShape?: ShapeConst.DefaultShape;
    gap?: number;
    hasShortFirstRow?: boolean;
    isDisabled?: boolean;
    computeIsTileDisabled?: (tile: Count2d) => boolean;
    computeTileAriaLabel?: (tile: Count2d) => string;
    renderTile: TileBoardTileRenderer;
    onTileActivate: (tile: Count2d) => void;
}>;

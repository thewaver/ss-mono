import type { TileBoardTilingKind } from "@thewaver/ss-components";
import type { Index2d, Index2dString, Size2d } from "@thewaver/ss-utils";

export type TileBoardExampleProps = {
    ariaLabel: string;
    tileCount: Index2d;
    tileSize: Size2d;
    gap: number;
    shape: TileBoardTilingKind;
    hasShortFirstRow: boolean;
    taper: number;
    isDisabled: boolean;
    marked: Index2dString[];
    computeIsTileDisabled?: (tile: Index2d) => boolean;
    onTileActivate: (tile: Index2d) => void;
    onTileSweep?: (tile: Index2d) => void;
};

export type TileBoardMeepleExampleProps = Omit<TileBoardExampleProps, "marked"> & {
    piece: Index2d;
    marked?: Index2dString[];
};

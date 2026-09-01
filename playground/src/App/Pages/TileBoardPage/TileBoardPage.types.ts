import type { AccessorProps, MaybeAccessor } from "@thewaver/ss-components";
import type { Index2d, Index2dString, ShapeConst, Size2d } from "@thewaver/ss-utils";

export type TileBoardExampleProps = AccessorProps<{
    ariaLabel: string;
    tileCount: Index2d;
    tileSize: Size2d;
    gap: number;
    shape: ShapeConst.DefaultShape;
    hasShortFirstRow: boolean;
    isDisabled: boolean;
    marked: Index2dString[];
    computeIsTileDisabled?: (tile: Index2d) => boolean;
    onTileActivate: (tile: Index2d) => void;
}>;

export type TileBoardMeepleExampleProps = Omit<TileBoardExampleProps, "marked"> & { piece: MaybeAccessor<Index2d> };

import type { AccessorProps, MaybeAccessor } from "@thewaver/ss-components";
import type { Count2d, Count2dString, ShapeConst, Size2d } from "@thewaver/ss-utils";

export type TileBoardExampleProps = AccessorProps<{
    ariaLabel: string;
    tileCount: Count2d;
    tileSize: Size2d;
    gap: number;
    shape: ShapeConst.DefaultShape;
    hasShortFirstRow: boolean;
    isDisabled: boolean;
    marked: Count2dString[];
    computeIsTileDisabled?: (tile: Count2d) => boolean;
    onTileActivate: (tile: Count2d) => void;
}>;

export type TileBoardMeepleExampleProps = Omit<TileBoardExampleProps, "marked"> & { piece: MaybeAccessor<Count2d> };

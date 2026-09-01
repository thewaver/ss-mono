import type { AccessorProps, InteractionFlags, TileBoardRenderProps } from "@thewaver/ss-components";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type PageTileBoardTileProps = AccessorProps<{
    renderProps: InteractionFlags<TileBoardRenderProps>;
    isMarked: boolean;
}>;

export type PageTileBoardMeepleProps = AccessorProps<{
    center: Point2d;
    tileSize: Size2d;
}>;

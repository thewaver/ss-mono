import type { InteractionFlags, TileBoardRenderProps } from "@thewaver/ss-components";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type BasePageTileBoardTileValues = {
    renderProps: InteractionFlags<TileBoardRenderProps>;
    isMarked: boolean;
};

export type BasePageTileBoardTileProps = BasePageTileBoardTileValues;

export type BasePageTileBoardMeepleValues = {
    center: Point2d;
    scale: number;
    tileSize: Size2d;
};

export type BasePageTileBoardMeepleProps = BasePageTileBoardMeepleValues;

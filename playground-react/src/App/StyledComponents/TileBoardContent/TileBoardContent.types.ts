import type { InteractionFlags, TileBoardRenderProps } from "@thewaver/ss-components-react";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type PageTileBoardTileProps = {
    renderProps: InteractionFlags<TileBoardRenderProps>;
    isMarked: boolean;
};

export type PageTileBoardMeepleProps = {
    center: Point2d;
    scale: number;
    tileSize: Size2d;
};

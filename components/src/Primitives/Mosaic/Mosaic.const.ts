import type { MosaicSizeAnchor } from "./Mosaic.types";

export const MOSAIC_DEFAULTS = {
    sizeAnchor: "width" as MosaicSizeAnchor,
    gap: 0,
    transitionDurationMs: 0,
};

export const MOSAIC_SIZE_ANCHORS: readonly MosaicSizeAnchor[] = ["width", "height"];

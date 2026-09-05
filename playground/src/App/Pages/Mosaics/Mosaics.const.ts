import type { MosaicSizeAnchor } from "@thewaver/ss-components";

import type { PageMosaicTileDefs } from "./Mosaics.types";

export const MIN_ITEM_COUNT = 1;
export const MAX_ITEM_COUNT = 12;
export const ITEM_COUNT_STEP = 1;
export const MIN_GAP = 0;
export const MAX_GAP = 24;
export const GAP_STEP = 2;
export const FIELD_WIDTH = 130;
export const MOSAIC_EXTENT = 380;

export const SIZE_ANCHORS: MosaicSizeAnchor[] = ["width", "height"];

export const STARTING_ITEM_COUNT = 9;
export const STARTING_GAP = 8;
export const STARTING_SIZE_ANCHOR: MosaicSizeAnchor = "width";

export const TILES: PageMosaicTileDefs[] = [
    { name: "Aurora", width: 150, height: 90 },
    { name: "Basalt", width: 90, height: 140 },
    { name: "Cinder", width: 120, height: 60 },
    { name: "Drift", width: 70, height: 70 },
    { name: "Ember", width: 190, height: 50 },
    { name: "Fathom", width: 100, height: 110 },
    { name: "Glimmer", width: 60, height: 160 },
    { name: "Hollow", width: 140, height: 80 },
    { name: "Iris", width: 80, height: 100 },
    { name: "Jetty", width: 110, height: 130 },
    { name: "Kelp", width: 160, height: 70 },
    { name: "Loam", width: 50, height: 90 },
];

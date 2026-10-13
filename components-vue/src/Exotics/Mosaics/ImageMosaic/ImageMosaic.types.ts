import type { VNodeChild } from "vue";

import type { BaseImageMosaicProps, MosaicItemState } from "@thewaver/ss-components";

import type { MosaicState, MosaicWalkProps } from "../../../Primitives/Mosaic/Mosaic.types";

export type ImageMosaicProps = MosaicWalkProps & MosaicState & BaseImageMosaicProps;

export type ImageMosaicSlots = {
    /**
     * Draws one tile. The picture is handed in rather than built, so the consumer decides what surrounds it. Left
     * out, the tile is the picture alone.
     */
    renderItem: (props: { renderImage: () => VNodeChild; state: MosaicItemState }) => VNodeChild;
};

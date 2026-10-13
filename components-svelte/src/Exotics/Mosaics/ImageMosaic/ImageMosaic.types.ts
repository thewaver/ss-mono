import type { Snippet } from "svelte";

import type { BaseImageMosaicProps, MosaicItemState } from "@thewaver/ss-components";

import type { MosaicState, MosaicWalkProps } from "../../../Primitives/Mosaic/Mosaic.types.js";

export type ImageMosaicProps = MosaicWalkProps &
    MosaicState &
    BaseImageMosaicProps & {
        /** Draws one tile. The picture is handed in rather than built, so the consumer decides what surrounds it. */
        renderItem?: Snippet<[renderImage: Snippet, state: MosaicItemState]>;
    };

import type { Snippet } from "svelte";

import type { MosaicImageSource, MosaicItemState } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { MosaicState, MosaicWalkProps } from "../../../Primitives/Mosaic/Mosaic.types.js";

export type ImageMosaicProps = MosaicWalkProps &
    MosaicState & {
        /**
         * The pictures to pack. A tile is known by its picture's address, so taking one out moves the others
         * rather than handing each the next one's picture.
         */
        sources: MosaicImageSource[];
        /** The shape the mosaic aims to come out as. */
        targetAspectRatio?: Size2d;
        /** Draws one tile. The picture is handed in rather than built, so the consumer decides what surrounds it. */
        renderItem?: Snippet<[renderImage: Snippet, state: MosaicItemState]>;
    };

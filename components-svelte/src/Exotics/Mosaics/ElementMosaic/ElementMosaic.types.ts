import type { Snippet } from "svelte";

import type { BaseElementMosaicProps, MosaicItemState } from "@thewaver/ss-components";

import type { MosaicState, MosaicWalkProps } from "../../../Primitives/Mosaic/Mosaic.types.js";

export type ElementMosaicProps<T> = MosaicState &
    MosaicWalkProps &
    BaseElementMosaicProps<T> & {
        /** Draws one item, and is told how it was placed. */
        renderItem: Snippet<[item: T, state: MosaicItemState]>;
    };

import type { VNodeChild } from "vue";

import type { BaseElementMosaicProps, MosaicItemState } from "@thewaver/ss-components";

import type { MosaicState, MosaicWalkProps } from "../../../Primitives/Mosaic/Mosaic.types";

export type ElementMosaicProps<T> = MosaicState & MosaicWalkProps & BaseElementMosaicProps<T>;

export type ElementMosaicSlots<T> = {
    /** Draws one item, and is told how it was placed. */
    renderItem: (props: { item: T; state: MosaicItemState }) => VNodeChild;
};

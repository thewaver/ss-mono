import type { VNodeChild } from "vue";

import type { BaseMosaicProps, BaseMosaicWalkProps, MosaicItemState, MosaicState } from "@thewaver/ss-components";

export type { MosaicState };

export type MosaicWalkProps = BaseMosaicWalkProps;

export type MosaicProps = BaseMosaicProps;

export type MosaicSlots = {
    /** Draws one tile, and is told which item it is and how it was placed. */
    renderItem: (props: { index: number; state: MosaicItemState }) => VNodeChild;
};

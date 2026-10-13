import type { ReactNode } from "react";

import type { BaseMosaicProps, BaseMosaicWalkProps, MosaicItemState, MosaicState } from "@thewaver/ss-components";

export type { MosaicState };

export type MosaicWalkProps = BaseMosaicWalkProps;

export type MosaicProps = BaseMosaicProps & {
    /** Draws one tile, and is told which item it is and how it was placed. */
    renderItem: (index: number, state: MosaicItemState) => ReactNode;
};

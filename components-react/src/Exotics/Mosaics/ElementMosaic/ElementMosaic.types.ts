import type { ReactNode } from "react";

import type { BaseElementMosaicProps, MosaicItemState } from "@thewaver/ss-components";

import type { MosaicState, MosaicWalkProps } from "../../../Primitives/Mosaic/Mosaic.types";

export type ElementMosaicProps<T> = MosaicState &
    MosaicWalkProps &
    BaseElementMosaicProps<T> & {
        /** Draws one item, and is told how it was placed. */
        renderItem: (item: T, state: MosaicItemState) => ReactNode;
    };

import type { ReactNode } from "react";

import type { MosaicItemState } from "@thewaver/ss-components";

import type { MosaicState, MosaicWalkProps } from "../../../Primitives/Mosaic/Mosaic.types";

export type ElementMosaicProps<T> = MosaicState &
    MosaicWalkProps & {
        /**
         * The items to pack. Each one keeps its own element for as long as it is in the list, so taking one out
         * moves the others rather than handing each the next one's contents.
         */
        items: T[];
        /** Draws one item, and is told how it was placed. */
        renderItem: (item: T, state: MosaicItemState) => ReactNode;
    };

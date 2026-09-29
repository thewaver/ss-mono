import { useState } from "react";

import { MOSAIC_DEFAULTS, type MosaicSizeAnchor } from "@thewaver/ss-components-react";
import { MosaicKnobs } from "@thewaver/ss-playground/App/Knobs/Mosaics.const";

import type { MosaicsControls } from "./Mosaics.types";

export const useMosaicsControls = (): MosaicsControls => {
    const itemCountState = useState(MosaicKnobs.STARTING_ITEM_COUNT);
    const gapState = useState(MosaicKnobs.STARTING_GAP);
    const sizeAnchorState = useState<MosaicSizeAnchor>(MOSAIC_DEFAULTS.sizeAnchor);
    const transitionDurationMsState = useState(MOSAIC_DEFAULTS.transitionDurationMs);

    const sharedProps = {
        itemCount: itemCountState[0],
        gap: gapState[0],
        sizeAnchor: sizeAnchorState[0],
        transitionDurationMs: transitionDurationMsState[0],
    };

    return { itemCount: itemCountState, gap: gapState, sizeAnchor: sizeAnchorState, transitionDurationMs: transitionDurationMsState, sharedProps };
};

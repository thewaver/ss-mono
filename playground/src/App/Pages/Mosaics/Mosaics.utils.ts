import { createMemo, createSignal } from "solid-js";

import { MOSAIC_DEFAULTS, type MosaicSizeAnchor } from "@thewaver/ss-components";

import { MosaicKnobs } from "../../Knobs/Mosaics.const";
import type { MosaicsControls } from "./Mosaics.types";

export const createMosaicsControls = (): MosaicsControls => {
    const itemCountSignal = createSignal(MosaicKnobs.STARTING_ITEM_COUNT);
    const gapSignal = createSignal(MosaicKnobs.STARTING_GAP);
    const sizeAnchorSignal = createSignal<MosaicSizeAnchor>(MOSAIC_DEFAULTS.sizeAnchor);
    const transitionDurationMsSignal = createSignal(MOSAIC_DEFAULTS.transitionDurationMs);

    const getSharedProps = createMemo(() => ({
        itemCount: itemCountSignal[0],
        gap: gapSignal[0],
        sizeAnchor: sizeAnchorSignal[0],
        transitionDurationMs: transitionDurationMsSignal[0],
    }));

    return { itemCountSignal, gapSignal, sizeAnchorSignal, transitionDurationMsSignal, getSharedProps };
};

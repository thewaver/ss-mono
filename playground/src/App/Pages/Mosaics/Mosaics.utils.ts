import { createMemo, createSignal } from "solid-js";

import { MOSAIC_DEFAULTS, type MosaicSizeAnchor } from "@thewaver/ss-components";

import { STARTING_GAP, STARTING_ITEM_COUNT, STARTING_SIZE_ANCHOR } from "./Mosaics.const";
import type { MosaicsControls } from "./Mosaics.types";

export const createMosaicsControls = (): MosaicsControls => {
    const itemCountSignal = createSignal(STARTING_ITEM_COUNT);
    const gapSignal = createSignal(STARTING_GAP);
    const sizeAnchorSignal = createSignal<MosaicSizeAnchor>(STARTING_SIZE_ANCHOR);
    const transitionDurationMsSignal = createSignal(MOSAIC_DEFAULTS.transitionDurationMs);

    const getSharedProps = createMemo(() => ({
        itemCount: itemCountSignal[0],
        gap: gapSignal[0],
        sizeAnchor: sizeAnchorSignal[0],
        transitionDurationMs: transitionDurationMsSignal[0],
    }));

    return { itemCountSignal, gapSignal, sizeAnchorSignal, transitionDurationMsSignal, getSharedProps };
};

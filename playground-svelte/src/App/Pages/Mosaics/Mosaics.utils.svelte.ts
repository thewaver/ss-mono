import { MOSAIC_DEFAULTS, type MosaicSizeAnchor } from "@thewaver/ss-components-svelte";
import { MosaicKnobs } from "@thewaver/ss-playground/App/Knobs/Mosaics.const";

import type { MosaicsControls } from "./Mosaics.types";

export const createMosaicsControls = (): MosaicsControls => {
    let itemCount = $state(MosaicKnobs.STARTING_ITEM_COUNT);
    let gap = $state(MosaicKnobs.STARTING_GAP);
    let sizeAnchor = $state<MosaicSizeAnchor>(MOSAIC_DEFAULTS.sizeAnchor);
    let transitionDurationMs = $state(MOSAIC_DEFAULTS.transitionDurationMs);

    const sharedProps = $derived({ itemCount, gap, sizeAnchor, transitionDurationMs });

    return {
        itemCount: [() => itemCount, (value) => (itemCount = value)],
        gap: [() => gap, (value) => (gap = value)],
        sizeAnchor: [() => sizeAnchor, (value) => (sizeAnchor = value)],
        transitionDurationMs: [() => transitionDurationMs, (value) => (transitionDurationMs = value)],
        getSharedProps: () => sharedProps,
    };
};

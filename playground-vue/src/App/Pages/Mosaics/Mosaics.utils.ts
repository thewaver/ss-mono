import { computed, shallowRef } from "vue";

import { MOSAIC_DEFAULTS, type MosaicSizeAnchor } from "@thewaver/ss-components-vue";
import { MosaicKnobs } from "@thewaver/ss-playground/App/Knobs/Mosaics.const";

import type { MosaicsControls } from "./Mosaics.types";

export const useMosaicsControls = (): MosaicsControls => {
    const itemCount = shallowRef(MosaicKnobs.STARTING_ITEM_COUNT);
    const gap = shallowRef(MosaicKnobs.STARTING_GAP);
    const sizeAnchor = shallowRef<MosaicSizeAnchor>(MOSAIC_DEFAULTS.sizeAnchor);
    const transitionDurationMs = shallowRef(MOSAIC_DEFAULTS.transitionDurationMs);

    const sharedProps = computed(() => ({
        itemCount: itemCount.value,
        gap: gap.value,
        sizeAnchor: sizeAnchor.value,
        transitionDurationMs: transitionDurationMs.value,
    }));

    return { itemCount, gap, sizeAnchor, transitionDurationMs, sharedProps };
};

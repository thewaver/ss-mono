import type { ComputedRef, Ref } from "vue";

import type { MosaicSizeAnchor } from "@thewaver/ss-components-vue";

export type MosaicSharedProps = {
    itemCount: number;
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
};

export type MosaicsControls = {
    itemCount: Ref<number>;
    gap: Ref<number>;
    sizeAnchor: Ref<MosaicSizeAnchor>;
    transitionDurationMs: Ref<number>;
    sharedProps: ComputedRef<MosaicSharedProps>;
};

export type MosaicsPanelProps = {
    controls: MosaicsControls;
};

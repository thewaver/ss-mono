import type { ComputedRef, Ref } from "vue";

import type { MosaicSizeAnchor } from "@thewaver/ss-components-vue";
import type { BaseMosaicSharedProps } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.types";

export type MosaicSharedProps = BaseMosaicSharedProps;

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

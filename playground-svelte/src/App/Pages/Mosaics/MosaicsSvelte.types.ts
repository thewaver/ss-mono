import type { MosaicSizeAnchor, ValuePair } from "@thewaver/ss-components-svelte";
import type { BaseMosaicSharedProps } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.types";

export type MosaicSharedProps = BaseMosaicSharedProps;

export type MosaicsControls = {
    itemCount: ValuePair<number>;
    gap: ValuePair<number>;
    sizeAnchor: ValuePair<MosaicSizeAnchor>;
    transitionDurationMs: ValuePair<number>;
    getSharedProps: () => MosaicSharedProps;
};

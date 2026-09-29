import type { MosaicSizeAnchor, ValuePair } from "@thewaver/ss-components-svelte";

export type MosaicSharedProps = {
    itemCount: number;
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
};

export type MosaicsControls = {
    itemCount: ValuePair<number>;
    gap: ValuePair<number>;
    sizeAnchor: ValuePair<MosaicSizeAnchor>;
    transitionDurationMs: ValuePair<number>;
    getSharedProps: () => MosaicSharedProps;
};

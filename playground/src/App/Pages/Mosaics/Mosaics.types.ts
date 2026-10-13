import type { MosaicSizeAnchor } from "@thewaver/ss-components";

export type BaseMosaicSharedValues = {
    itemCount: number;
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
};

export type BaseMosaicSharedProps = BaseMosaicSharedValues;

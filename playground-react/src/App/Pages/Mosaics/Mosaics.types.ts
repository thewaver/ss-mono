import type { MosaicSizeAnchor } from "@thewaver/ss-components-react";

export type MosaicSharedProps = {
    itemCount: number;
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
};

export type MosaicsControls = {
    itemCountState: readonly [number, (value: number) => void];
    gapState: readonly [number, (value: number) => void];
    sizeAnchorState: readonly [MosaicSizeAnchor, (value: MosaicSizeAnchor) => void];
    transitionDurationMsState: readonly [number, (value: number) => void];
    sharedProps: MosaicSharedProps;
};

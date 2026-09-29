import type { MosaicSizeAnchor } from "@thewaver/ss-components-react";

export type MosaicSharedProps = {
    itemCount: number;
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
};

export type MosaicsControls = {
    itemCount: readonly [number, (value: number) => void];
    gap: readonly [number, (value: number) => void];
    sizeAnchor: readonly [MosaicSizeAnchor, (value: MosaicSizeAnchor) => void];
    transitionDurationMs: readonly [number, (value: number) => void];
    sharedProps: MosaicSharedProps;
};

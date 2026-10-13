import type { MosaicSizeAnchor } from "@thewaver/ss-components-react";
import type { BaseMosaicSharedProps } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.types";

export type MosaicSharedProps = BaseMosaicSharedProps;

export type MosaicsControls = {
    itemCount: readonly [number, (value: number) => void];
    gap: readonly [number, (value: number) => void];
    sizeAnchor: readonly [MosaicSizeAnchor, (value: MosaicSizeAnchor) => void];
    transitionDurationMs: readonly [number, (value: number) => void];
    sharedProps: MosaicSharedProps;
};

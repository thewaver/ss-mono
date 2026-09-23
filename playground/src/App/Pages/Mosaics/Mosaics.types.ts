import type { Accessor, Signal } from "solid-js";

import type { AccessorProps, MosaicSizeAnchor } from "@thewaver/ss-components";

export type PageMosaicTileDefs = {
    name: string;
    width: number;
    height: number;
};

export type MosaicSharedProps = AccessorProps<{
    itemCount: number;
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
}>;

export type MosaicsControls = {
    itemCountSignal: Signal<number>;
    gapSignal: Signal<number>;
    sizeAnchorSignal: Signal<MosaicSizeAnchor>;
    transitionDurationMsSignal: Signal<number>;
    getSharedProps: Accessor<MosaicSharedProps>;
};

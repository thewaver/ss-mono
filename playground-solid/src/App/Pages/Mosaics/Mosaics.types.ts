import type { Accessor, Signal } from "solid-js";

import type { AccessorProps, MosaicSizeAnchor } from "@thewaver/ss-components-solid";

export type MosaicSharedProps = AccessorProps<{
    itemCount: number;
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
}>;

export type MosaicsControls = {
    itemCount: Signal<number>;
    gap: Signal<number>;
    sizeAnchor: Signal<MosaicSizeAnchor>;
    transitionDurationMs: Signal<number>;
    getSharedProps: Accessor<MosaicSharedProps>;
};

import type { Accessor, Signal } from "solid-js";

import type { AccessorValues, MosaicSizeAnchor } from "@thewaver/ss-components-solid";
import type { BaseMosaicSharedValues } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.types";

export type MosaicSharedProps = AccessorValues<BaseMosaicSharedValues>;

export type MosaicsControls = {
    itemCount: Signal<number>;
    gap: Signal<number>;
    sizeAnchor: Signal<MosaicSizeAnchor>;
    transitionDurationMs: Signal<number>;
    getSharedProps: Accessor<MosaicSharedProps>;
};

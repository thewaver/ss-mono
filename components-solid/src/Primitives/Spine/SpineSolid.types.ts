import type { Accessor, JSX } from "solid-js";

import type { BaseSpineCbs, BaseSpineValues, SpineSide } from "@thewaver/ss-components";

import type { AccessorValues } from "../../Utils/typeUtils";

export type SpineProps<T> = AccessorValues<BaseSpineValues<T>> &
    BaseSpineCbs & {
        /** Draws one face, and is told whether it is the front or the back. The face is the whole box. */
        renderFace: (getFace: Accessor<T>, index: number, side: SpineSide) => JSX.Element;
    };

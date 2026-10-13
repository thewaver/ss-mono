import type { Accessor, JSX } from "solid-js";

import type { BarrelFace, BaseBarrelCbs, BaseBarrelValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../Utils/typeUtils";

export type BarrelProps<T> = AccessorValues<BaseBarrelValues<T>> &
    BaseBarrelCbs & {
        /** Draws one face, and is told whether it is the front or the back. */
        renderFace: (getFace: Accessor<T>, index: number, face: BarrelFace) => JSX.Element;
    };

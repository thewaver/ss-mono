import type { Snippet } from "svelte";

import type { BaseSpineProps, SpineSide } from "@thewaver/ss-components";

export type SpineProps<T> = BaseSpineProps<T> & {
    /** Draws one face, and is told whether it is the front or the back. The face is the whole box. */
    renderFace: Snippet<[item: T, index: number, side: SpineSide]>;
};

import type { Snippet } from "svelte";

import type { BarrelFace, BaseBarrelProps } from "@thewaver/ss-components";

export type BarrelProps<T> = BaseBarrelProps<T> & {
    /** Draws one face, and is told whether it is the front or the back. */
    renderFace: Snippet<[item: T, index: number, face: BarrelFace]>;
};

import type { ReactNode } from "react";

import type { BarrelFace, BaseBarrelProps } from "@thewaver/ss-components";

export type BarrelProps<T> = BaseBarrelProps<T> & {
    /** Draws one face, and is told whether it is the front or the back. */
    renderFace: (item: T, index: number, face: BarrelFace) => ReactNode;
};

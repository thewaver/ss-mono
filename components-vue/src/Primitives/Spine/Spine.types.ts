import type { VNodeChild } from "vue";

import type { BaseSpineProps, SpineSide } from "@thewaver/ss-components";

export type SpineProps<T> = BaseSpineProps<T>;

export type SpineSlots<T> = {
    /** Draws one face, and is told whether it is the front or the back. The face is the whole box. */
    renderFace: (props: { item: T; index: number; side: SpineSide }) => VNodeChild;
};

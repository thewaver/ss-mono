import type { VNodeChild } from "vue";

import type { BaseScrambleTextProps, ScrambleTextController } from "@thewaver/ss-components";

export type { ScrambleTextController };

export type ScrambleTextProps = BaseScrambleTextProps;

export type ScrambleTextSlots = {
    /** A drawer such as `PaintedText`, which draws the scramble in place of the component's own text. */
    default?: () => VNodeChild;
};

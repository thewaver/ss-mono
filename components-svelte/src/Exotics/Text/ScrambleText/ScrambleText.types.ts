import type { Snippet } from "svelte";

import type { BaseScrambleTextProps, ScrambleTextController } from "@thewaver/ss-components";

export type { ScrambleTextController };

export type ScrambleTextProps = BaseScrambleTextProps & {
    /** A drawer such as `PaintedText`, which draws the scramble in place of the component's own text. */
    children?: Snippet;
};

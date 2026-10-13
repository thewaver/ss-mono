import type { BasePaintedTextValues, PaintedTextController } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefsSolid.types";
import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type PaintedTextProps = AccessorValues<BasePaintedTextValues> & {
    /**
     * The paint for the letters, which may build its own SVG definitions. `getSize` is the whole text block, so a
     * gradient runs across every line as one. Leave it out alongside `computeStrokeDefs` for letters in the current
     * text color, or give only `computeStrokeDefs` for hollow letters.
     */
    computeFillDefs?: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
    /** The paint for the stroke around the letters, which may build its own SVG definitions. */
    computeStrokeDefs?: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
    /**
     * How far the text has slid along its path, `0` to `1`, as a share of the path's length. Text that slides past
     * the end comes round from the start, so the path never shows a gap. Does nothing off a path.
     */
    progress?: SignalSource<number>;
    /**
     * Whether the text slides along its path, a lap every `lapDurationMs`, going round for as long as it is on. Off
     * when left out, so text on a path stands still until asked to move. Anything moving for more than five seconds
     * needs a way to pause it under WCAG 2.2.2, which is a control writing this.
     */
    playback?: SignalSource<boolean>;
    /**
     * Hands the consumer a controller once the text is up, for laying it out again after a change it cannot see,
     * such as a style on an element around it.
     */
    onMount?: (controller: PaintedTextController) => void;
};

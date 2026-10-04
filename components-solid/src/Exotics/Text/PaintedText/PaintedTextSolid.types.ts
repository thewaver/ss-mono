import type { PaintedTextController, PaintedTextStrokeAlignment } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefsSolid.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type PaintedTextProps = AccessorProps<{
    /**
     * The paint for the letters, which may build its own SVG definitions. `getSize` is the whole text block, so a
     * gradient runs across every line as one. Leave it out alongside `computeStrokeDefs` for letters in the current
     * text color, or give only `computeStrokeDefs` for hollow letters.
     */
    computeFillDefs?: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
    /** The paint for the stroke around the letters, which may build its own SVG definitions. */
    computeStrokeDefs?: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
    /** How wide the stroke is, in pixels, as it appears whatever its alignment. */
    strokeWidth?: number;
    /**
     * Where the stroke sits against the edge of each letter: `outside` keeps the letters their full shape, `inside`
     * keeps the text its overall size, and `center` straddles the edge as SVG and CSS strokes do.
     */
    strokeAlignment?: PaintedTextStrokeAlignment;
    /**
     * Sets the text along a path rather than in lines, as SVG path data in pixels, drawn as it is written. The text
     * is one line that never wraps and starts at the path's start; `PaintedTextUtils.computeCirclePath` builds a
     * circle. Line breaks and whole elements such as images are not drawn on a path, and a warning names them.
     * The component's box is the path's own box grown on every side by as far as the letters reach from their
     * baseline, so the letters stay inside it wherever they slide. Leave it out for text laid out in lines.
     */
    path?: string;
    /**
     * Stretches or squeezes the spacing between letters on a path so the text runs the path's whole length exactly
     * once. On a closed path the end of the text then meets its own start, so end the text with a space or a
     * separator to keep a gap there. Does nothing off a path.
     */
    isFittedToPath?: boolean;
    /** How long the text takes to slide once round the whole length of its path, while `playback` is on. */
    lapDurationMs?: number;
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
}>;

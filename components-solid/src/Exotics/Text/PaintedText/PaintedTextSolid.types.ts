import type { PaintedTextController, PaintedTextStrokeAlignment } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefsSolid.types";
import type { AccessorProps } from "../../../Utils/typeUtils";

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
     * Hands the consumer a controller once the text is up, for laying it out again after a change it cannot see,
     * such as a style on an element around it.
     */
    onMount?: (controller: PaintedTextController) => void;
}>;

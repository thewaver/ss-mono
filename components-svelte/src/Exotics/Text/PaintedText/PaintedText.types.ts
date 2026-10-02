import type { Snippet } from "svelte";

import type { PaintedTextStrokeAlignment } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefs.types.js";

export type PaintedTextController = {
    /**
     * Lays the text out again, for a change the component cannot see for itself: a style on an element around it,
     * such as a class that makes the text bolder, changes where every glyph sits without changing any box size. The
     * measurement is taken once Svelte has applied the update the call arrives in, so a consumer may change the
     * style and ask for this in the same breath.
     *
     * @returns `false` when there is nothing to measure yet, `true` when the measurement is on its way.
     */
    update: () => boolean;
};

export type PaintedTextProps = {
    /** The text to paint, which may carry inline elements, links, images and icons. It is measured, then redrawn. */
    children?: Snippet;
    /**
     * The paint for the letters, which may build its own SVG definitions. `size` is the whole text block, so a
     * gradient runs across every line as one, and `element` is `undefined` until the text has mounted. Leave it out
     * alongside `computeStrokeDefs` for letters in the current text color, or give only `computeStrokeDefs` for
     * hollow letters.
     */
    computeFillDefs?: (size: Size2d, element: HTMLElement | undefined) => SVGDefs[];
    /** The paint for the stroke around the letters, which may build its own SVG definitions. */
    computeStrokeDefs?: (size: Size2d, element: HTMLElement | undefined) => SVGDefs[];
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
};

import type { ReactNode } from "react";

import type { BasePaintedTextProps } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefs.types";

export type PaintedTextController = {
    /**
     * Lays the text out again, for a change the component cannot see for itself: a style on an element around it,
     * such as a class that makes the text bolder, changes where every glyph sits without changing any box size. The
     * measurement is taken once React has applied the update the call arrives in, so a consumer may change the
     * style and ask for this in the same breath.
     *
     * @returns `false` when there is nothing to measure yet, `true` when the measurement is on its way.
     */
    update: () => boolean;
};

export type PaintedTextProps = BasePaintedTextProps & {
    /**
     * The paint for the letters, which may build its own SVG definitions. `size` is the whole text block, so a
     * gradient runs across every line as one, and `element` is `undefined` until the text has mounted. Leave it out
     * alongside `computeStrokeDefs` for letters in the current text color, or give only `computeStrokeDefs` for
     * hollow letters.
     */
    computeFillDefs?: (size: Size2d, element: HTMLElement | undefined) => SVGDefs[];
    /** The paint for the stroke around the letters, which may build its own SVG definitions. */
    computeStrokeDefs?: (size: Size2d, element: HTMLElement | undefined) => SVGDefs[];
    /**
     * How far the text has slid along its path, `0` to `1`, as a share of the path's length. Text that slides past
     * the end comes round from the start, so the path never shows a gap. Does nothing off a path.
     */
    progress?: readonly [number, (value: number) => void];
    /**
     * Whether the text slides along its path, a lap every `lapDurationMs`, going round for as long as it is on. Off
     * when left out, so text on a path stands still until asked to move. Anything moving for more than five seconds
     * needs a way to pause it under WCAG 2.2.2, which is a control writing this.
     */
    playback?: readonly [boolean, (value: boolean) => void];
    /**
     * Hands the consumer a controller once the text is up, for laying it out again after a change it cannot see,
     * such as a style on an element around it.
     */
    onMount?: (controller: PaintedTextController) => void;
    /** The text, which may carry inline elements, links, images and icons. */
    children?: ReactNode;
};

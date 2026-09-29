import type { SVGAnimationDefs } from "@thewaver/ss-components";
export type SVGAnimateTrack = {
    /** The attribute the `animate` element drives, such as `x1`, `r` or `stop-color`. */
    attributeName: string;
    /** The values it steps through, joined with `;`. */
    values: string;
    /** The element it drives, as `#id`, when that is not the element it sits inside. */
    href?: string;
};
export type SVGAnimateGroupProps = {
    /** One entry per `animate` element, drawn in order. */
    tracks: SVGAnimateTrack[];
    /**
     * The schedule every element shares: how long one iteration lasts and the script of patterns. A change to either
     * rebuilds the elements and starts them again; a new record describing the same animation leaves them running.
     */
    defs: SVGAnimationDefs;
};
export type SVGAnimatedPathProps = {
    /** The path's shape at each step. The first is the shape it holds before the animation begins. */
    paths: string[];
    /** The schedule the path's animation runs on, as {@link SVGAnimateGroupProps.defs}. */
    defs: SVGAnimationDefs;
};

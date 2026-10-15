import type { SVGPatternCellCount, SVGPatternCellIndex } from "@thewaver/ss-components";

import type { SVGAnimationDefsSvelteUtils } from "../../Generators/SVGDefs/SVGAnimations/SVGAnimationDefsSvelte.utils.svelte.js";
import type { SvelteMarkup } from "../../Utils/typeUtils.js";

export type SVGPatternCellRenderer = (
    id: string,
    index: SVGPatternCellIndex,
    cellCount: SVGPatternCellCount,
    isSplit: boolean,
) => SvelteMarkup;

export type SVGPatternTrackedCellRenderer = (
    id: string,
    index: SVGPatternCellIndex,
    isSplit: boolean,
    level: number,
) => SvelteMarkup;

export type SVGPatternCircleCellProps = {
    /** The circle's id, which a cell takes from the pattern so it never collides with a neighbor. */
    id: string;
    /** The circle's radius, in the pattern's user units. */
    r: number;
    /** The circle's center across the cell. */
    cx: number;
    /** The circle's center down the cell. */
    cy: number;
    /** The circle's color. */
    fill: string;
    /** The radii it steps through in one pass, joined with `;`. */
    values: string;
    /**
     * The schedule the animation runs on, from {@link SVGAnimationDefsSvelteUtils.createAnimateDefs}: how long one pass
     * takes and how the passes repeat. The pattern makes it once and hands the same one to every cell, so all of them
     * repeat, pause and stop together.
     */
    animate: ReturnType<typeof SVGAnimationDefsSvelteUtils.createAnimateDefs>;
};

export type SVGPatternUseCellProps = {
    /** The cell's id, which a cell takes from the pattern so it never collides with a neighbor. */
    id: string;
    /** The shape the cell draws, as `#id` of an element defined beside the pattern. */
    href: string;
    /** The shape's color. */
    fill: string;
    /** The opacities it steps through in one pass, joined with `;`. */
    values: string;
    /** The schedule the animation runs on, as {@link SVGPatternCircleCellProps.animate}. */
    animate: ReturnType<typeof SVGAnimationDefsSvelteUtils.createAnimateDefs>;
};

export type SVGPatternTrackedCircleCellProps = {
    /** The circle's id, which a cell takes from the pattern so it never collides with a neighbor. */
    id: string;
    /** The circle's radius, in the pattern's user units, already scaled by how near the pointer is. */
    r: number;
    /** The circle's center across the cell. */
    cx: number;
    /** The circle's center down the cell. */
    cy: number;
    /** The circle's color. */
    fill: string;
};

export type SVGPatternTrackedUseCellProps = {
    /** The cell's id, which a cell takes from the pattern so it never collides with a neighbor. */
    id: string;
    /** The shape the cell draws, as `#id` of an element defined beside the pattern. */
    href: string;
    /** The shape's color. */
    fill: string;
    /** How opaque the shape is, `0`–`1`, from how near the pointer is. */
    fillOpacity: number;
};

export type SVGPatternTrackedRectCellProps = {
    /** The square's id, which a cell takes from the pattern so it never collides with a neighbor. */
    id: string;
    /** How wide the square is, in the pattern's user units. */
    width: number;
    /** How tall the square is, in the pattern's user units. */
    height: number;
    /** The square's color. */
    fill: string;
    /** How opaque the square is, `0`–`1`, from how near the pointer is and how recently it passed. */
    fillOpacity: number;
};

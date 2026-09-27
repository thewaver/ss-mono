import { MathUtils } from "@thewaver/ss-utils";

import type { NavigatorDirection } from "../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type {
    SplitPaneCollapsedBoundaries,
    SplitPaneEntry,
    SplitPaneKeyAction,
    SplitPaneOrientation,
} from "./SplitPane.types";

const computeRatioBounds = (pane: SplitPaneEntry, available: number) => {
    if (available <= 0) return { min: 0, max: 1 };

    return {
        min: (pane.minPx ?? 0) / available,
        max: pane.maxPx === undefined ? 1 : pane.maxPx / available,
    };
};

/**
 * The parts of a split pane that are not about any framework: the grid template, where each boundary sits and how
 * far it may go, where a pointer lands, and what a key does.
 *
 * Boundaries are counted from zero: boundary `index` is the one between pane `index` and pane `index + 1`, and it
 * sits at the sum of the ratios up to and including pane `index`.
 */
export namespace SplitPaneUtils {
    /** Where a boundary goes when its pane is collapsed, and where Home sends it. */
    export const SMALLEST_BOUNDARY = 0;

    /** Where End sends a boundary. */
    export const LARGEST_BOUNDARY = 1;

    /**
     * How much room all the gutters take together.
     *
     * @param gutterSize One gutter's size, in pixels.
     * @param paneCount How many panes there are.
     * @returns The gutters' combined size, in pixels.
     */
    export const computeTotalGutterSize = (gutterSize: number, paneCount: number) =>
        gutterSize * Math.max(paneCount - 1, 0);

    /**
     * Each pane's share of the room, with a pane the stored ratios do not cover given an even share.
     *
     * @param paneCount How many panes there are.
     * @param stored The consumer's ratios.
     * @returns One ratio per pane.
     */
    export const computeRatios = (paneCount: number, stored: number[]) =>
        Array.from({ length: paneCount }, (_, index) => stored[index] ?? 1 / paneCount);

    /**
     * The grid template that lays the panes and gutters out.
     *
     * A pane is its share of the room left after the gutters, and a pane with pixel bounds is that share inside a
     * `clamp()`, so a container resize is recomputed by the browser with no code. Gutters are fixed tracks between
     * the panes.
     *
     * @param panes The panes.
     * @param ratios One ratio per pane.
     * @param gutterSize One gutter's size, in pixels.
     * @returns A `grid-template-columns` or `grid-template-rows` value.
     */
    export const computeTemplate = (panes: SplitPaneEntry[], ratios: number[], gutterSize: number) => {
        const totalGutterSize = computeTotalGutterSize(gutterSize, panes.length);

        return panes
            .map((pane, index) => {
                const size = `calc(${ratios[index]} * (100% - ${totalGutterSize}px))`;

                if (pane.minPx === undefined && pane.maxPx === undefined) return size;

                const max = pane.maxPx === undefined ? "100%" : `${pane.maxPx}px`;

                return `clamp(${pane.minPx ?? 0}px, ${size}, ${max})`;
            })
            .join(` ${gutterSize}px `);
    };

    /**
     * Where a boundary sits, as a ratio of the whole.
     *
     * @param ratios One ratio per pane.
     * @param index The boundary.
     * @returns The sum of the ratios up to and including pane `index`.
     */
    export const computeBoundary = (ratios: number[], index: number) =>
        ratios.slice(0, index + 1).reduce((total, ratio) => total + ratio, 0);

    /**
     * How far a boundary may move.
     *
     * A boundary moves its two neighbors and nothing else, so it stays within their combined span, and each
     * neighbor's pixel bounds are converted to ratios against the room actually available so a drag cannot push a
     * pane past a floor or ceiling the grid would refuse. When the floors cannot all fit, the window is empty and the
     * ceiling pins to the floor, as `clamp()` does.
     *
     * @param params The ratios, the boundary, the panes, and the room left after the gutters, in layout pixels.
     * @returns Where the span starts, how wide it is, and the lowest and highest the boundary may go.
     */
    export const computeBoundaryLimits = (params: {
        ratios: number[];
        index: number;
        panes: SplitPaneEntry[];
        availablePx: number;
    }) => {
        const { ratios, index, panes, availablePx } = params;
        const before = computeBoundary(ratios, index) - ratios[index];
        const span = ratios[index] + ratios[index + 1];
        const start = computeRatioBounds(panes[index], availablePx);
        const end = computeRatioBounds(panes[index + 1], availablePx);
        const floor = Math.max(before, before + start.min, before + span - end.max);
        const ceiling = Math.min(before + span, before + start.max, before + span - end.min);

        return { before, span, floor, ceiling: Math.max(ceiling, floor) };
    };

    /**
     * The ratios after a boundary is moved.
     *
     * The target is clamped to {@link SplitPaneUtils.computeBoundaryLimits}, and the two neighbors trade the
     * difference, so the ratios keep summing to what they summed to before.
     *
     * @param params The ratios, the boundary, where it is asked to go, the panes, and the room available.
     * @returns A new array of ratios.
     */
    export const computeMovedRatios = (params: {
        ratios: number[];
        index: number;
        boundary: number;
        panes: SplitPaneEntry[];
        availablePx: number;
    }) => {
        const ratios = [...params.ratios];
        const { before, span, floor, ceiling } = computeBoundaryLimits(params);
        const next = MathUtils.clamp(params.boundary, floor, ceiling);

        ratios[params.index] = next - before;
        ratios[params.index + 1] = before + span - next;

        return ratios;
    };

    /**
     * How far along an element's box a pointer is, along the split's axis and in reading order.
     *
     * @param point The pointer's client position.
     * @param rect The box it is measured against.
     * @param orientation The split's orientation.
     * @param direction The layout direction, which reverses a horizontal split in right-to-left.
     * @returns The offset from the box's start edge, in client pixels.
     */
    export const computePointerOffset = (
        point: { clientX: number; clientY: number },
        rect: DOMRect,
        orientation: SplitPaneOrientation,
        direction: NavigatorDirection | undefined,
    ) => {
        if (orientation !== "horizontal") return point.clientY - rect.top;

        return direction === "rtl" ? rect.right - point.clientX : point.clientX - rect.left;
    };

    /**
     * Where a boundary would sit under the pointer.
     *
     * Measured against the root's client rect on both sides of the division, so a scale applied above the split
     * cancels out. The pointer is read as the middle of the gutter being dragged.
     *
     * @param params The pointer, the root's client rect, the boundary, the orientation, the direction, and the
     * gutter size.
     * @returns The boundary as a ratio, or `undefined` when there is no room to divide.
     */
    export const computePointerBoundary = (params: {
        point: { clientX: number; clientY: number };
        rootRect: DOMRect;
        index: number;
        orientation: SplitPaneOrientation;
        direction: NavigatorDirection | undefined;
        gutterSize: number;
        paneCount: number;
    }) => {
        const { point, rootRect, index, orientation, direction, gutterSize, paneCount } = params;
        const total = orientation === "horizontal" ? rootRect.width : rootRect.height;
        const available = total - computeTotalGutterSize(gutterSize, paneCount);

        if (available <= 0) return undefined;

        const offset = computePointerOffset(point, rootRect, orientation, direction);

        return (offset - gutterSize * (index + 0.5)) / available;
    };

    /**
     * Where a press on a gutter that did not become a drag sends its boundary: one step towards the half of the
     * gutter it landed on, which is the single-pointer route WCAG 2.5.7 asks for.
     *
     * @param params The pointer, the gutter's client rect, the orientation, the direction, the boundary's current
     * position, and the step.
     * @returns The boundary to move to.
     */
    export const computePressBoundary = (params: {
        point: { clientX: number; clientY: number };
        gutterRect: DOMRect;
        orientation: SplitPaneOrientation;
        direction: NavigatorDirection | undefined;
        boundary: number;
        step: number;
    }) => {
        const { point, gutterRect, orientation, direction, boundary, step } = params;
        const offset = computePointerOffset(point, gutterRect, orientation, direction);
        const extent = orientation === "horizontal" ? gutterRect.width : gutterRect.height;

        return boundary + (offset < extent * 0.5 ? -step : step);
    };

    /**
     * What a key pressed on a gutter does.
     *
     * Enter collapses the pane before the gutter and restores it, Home and End send the boundary to either end, and
     * the arrows on the split's own axis step it — with left and right read in reading order.
     *
     * @param key The `key` of the keyboard event.
     * @param orientation The split's orientation.
     * @param direction The layout direction.
     * @returns The action, or `undefined` for a key the gutter leaves alone.
     */
    export const computeKeyAction = (
        key: string,
        orientation: SplitPaneOrientation,
        direction: NavigatorDirection | undefined,
    ): SplitPaneKeyAction | undefined => {
        if (key === "Enter") return "toggle";
        if (key === "Home") return "home";
        if (key === "End") return "end";

        const isHorizontal = orientation === "horizontal";
        const logicalKey = NavigatorUtils.computeLogicalKey(key, direction);

        if (logicalKey === (isHorizontal ? "ArrowLeft" : "ArrowUp")) return "decrease";
        if (logicalKey === (isHorizontal ? "ArrowRight" : "ArrowDown")) return "increase";

        return undefined;
    };

    /**
     * The remembered collapses that still hold.
     *
     * A collapsed boundary remembers where it came from only while it still sits where it collapsed to; any other
     * move — a drag, a key, or the consumer writing the ratios from outside — forgets it, so a restore can never put
     * the divider back somewhere it has since moved away from.
     *
     * @param collapsed The remembered collapses, by boundary.
     * @param ratios The ratios as they now are.
     * @returns The collapses whose boundary has not moved.
     */
    export const pruneCollapsed = (
        collapsed: SplitPaneCollapsedBoundaries,
        ratios: number[],
    ): SplitPaneCollapsedBoundaries =>
        Object.fromEntries(
            Object.entries(collapsed).filter(
                ([index, entry]) => computeBoundary(ratios, Number(index)) === entry.collapsedAt,
            ),
        );

    /**
     * The remembered collapses with one boundary's taken out.
     *
     * @param collapsed The remembered collapses, by boundary.
     * @param index The boundary to forget.
     * @returns The rest.
     */
    export const forgetCollapsed = (collapsed: SplitPaneCollapsedBoundaries, index: number) => {
        const { [index]: _unused, ...rest } = collapsed;

        return rest;
    };
}

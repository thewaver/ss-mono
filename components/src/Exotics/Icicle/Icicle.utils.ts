import type { Rect, Size2d } from "@thewaver/ss-utils";

import type { IcicleNode, IcicleSpan, IcicleStep } from "./Icicle.types";

/** Zero, as a weight, a count or an index. */
const NOTHING = 0;
/** One: a whole column's height, or one step along a column or between them. */
const SINGLE = 1;

/**
 * Lays out an icicle, and walks a cursor around the part of it in view.
 *
 * A layout is written in shares and columns rather than pixels: how far down the icicle a cell starts and ends, as a
 * fraction of its whole height, and which column it is in, counting the root as column nought. Zooming is then a
 * matter of re-reading every span against the node in view, and the size of the icicle only enters at the end.
 */
export namespace IcicleUtils {
    /**
     * Places every node of a tree in columns.
     *
     * @param root The whole tree.
     * @param weights How much every node weighs — a leaf its own weight, a branch the total of its children.
     * @returns A span per node. The root covers the whole height in column nought; each node's children share its
     * height in proportion to their weights, in the next column. Children with deeper trees under them come first,
     * then heavier ones, so the tallest structures sit at the top. A node weighing nothing gets a span with no height.
     */
    export const computeSpans = <T>(root: IcicleNode<T>, weights: Map<IcicleNode<T>, number>) => {
        const heights = new Map<IcicleNode<T>, number>();

        const measure = (node: IcicleNode<T>): number => {
            const height = (node.children ?? []).reduce(
                (tallest, child) => Math.max(tallest, measure(child) + SINGLE),
                0,
            );

            heights.set(node, height);

            return height;
        };

        measure(root);

        const spans = new Map<IcicleNode<T>, IcicleSpan>();

        const place = (node: IcicleNode<T>, span: IcicleSpan) => {
            spans.set(node, span);

            const total = weights.get(node) ?? NOTHING;
            const children = [...(node.children ?? [])].sort(
                (first, second) =>
                    (heights.get(second) ?? NOTHING) - (heights.get(first) ?? NOTHING) ||
                    (weights.get(second) ?? NOTHING) - (weights.get(first) ?? NOTHING),
            );

            let start = span.start;

            children.forEach((child) => {
                const share = total > NOTHING ? (weights.get(child) ?? NOTHING) / total : NOTHING;
                const end = start + (span.end - span.start) * share;

                place(child, { start, end, column: span.column + SINGLE });

                start = end;
            });
        };

        place(root, { start: NOTHING, end: SINGLE, column: NOTHING });

        return spans;
    };

    /**
     * Re-reads a span as it sits once another node is in view.
     *
     * @param span The span to re-read, from {@link computeSpans}.
     * @param focus The span of the node in view.
     * @returns The span with the focus stretched to the whole height and moved to column nought. Nothing is clamped:
     * a span above or below the focus lands above nought or below one, and a column left of the focus goes negative,
     * so a zoom slides them out of view rather than squashing them.
     */
    export const computeView = (span: IcicleSpan, focus: IcicleSpan): IcicleSpan => {
        const height = focus.end - focus.start;

        return {
            start: height > NOTHING ? (span.start - focus.start) / height : NOTHING,
            end: height > NOTHING ? (span.end - focus.start) / height : NOTHING,
            column: span.column - focus.column,
        };
    };

    /**
     * Whether a span has any part inside the icicle.
     *
     * @param span A span as {@link computeView} answers it.
     * @param columnCount How many columns fit across the icicle.
     */
    export const getIsVisible = (span: IcicleSpan, columnCount: number) =>
        span.end > span.start &&
        span.end > NOTHING &&
        span.start < SINGLE &&
        span.column >= NOTHING &&
        span.column < columnCount;

    /**
     * A span part of the way from one place to another.
     *
     * @param from Where it starts.
     * @param to Where it ends.
     * @param progress How far along, `0` at `from` and `1` at `to`.
     */
    export const interpolateSpan = (from: IcicleSpan, to: IcicleSpan, progress: number): IcicleSpan => ({
        start: from.start + (to.start - from.start) * progress,
        end: from.end + (to.end - from.end) * progress,
        column: from.column + (to.column - from.column) * progress,
    });

    /**
     * Turns a span into a rectangle in the icicle.
     *
     * @param span The span, in shares of the height and columns.
     * @param size The icicle's box, in pixels.
     * @param columnCount How many columns fit across it.
     */
    export const toRect = (span: IcicleSpan, size: Size2d, columnCount: number): Rect => {
        const columnWidth = columnCount > NOTHING ? size.width / columnCount : NOTHING;

        return {
            x: span.column * columnWidth,
            y: span.start * size.height,
            width: columnWidth,
            height: (span.end - span.start) * size.height,
        };
    };

    /**
     * Which cell a keyboard step moves to.
     *
     * @param step `"up"` and `"down"` move within a column, `"first"` and `"last"` jump to its ends, `"toParent"` moves
     * one column left to the cell this one sits beside, and `"toChildren"` one column right to the topmost of the cells
     * beside it.
     * @param from The cell the cursor is on.
     * @param cells The cells the walk may land on, each with its span as {@link computeView} answers it.
     * @param getParent Answers a node's parent, or `undefined` for the root.
     * @returns The node to move to, or `undefined` when there is none that way — the ends of a column do not wrap.
     */
    export const computeStep = <T>(
        step: IcicleStep,
        from: IcicleNode<T>,
        cells: { node: IcicleNode<T>; span: IcicleSpan }[],
        getParent: (node: IcicleNode<T>) => IcicleNode<T> | undefined,
    ): IcicleNode<T> | undefined => {
        const origin = cells.find((cell) => cell.node === from);

        if (!origin) return undefined;

        if (step === "toParent") {
            const parent = getParent(from);

            return cells.find((cell) => cell.node === parent)?.node;
        }

        const byStart = (first: { span: IcicleSpan }, second: { span: IcicleSpan }) =>
            first.span.start - second.span.start;

        if (step === "toChildren") {
            return cells.filter((cell) => getParent(cell.node) === from).sort(byStart)[NOTHING]?.node;
        }

        const column = cells.filter((cell) => cell.span.column === origin.span.column).sort(byStart);
        const at = column.indexOf(origin);

        if (step === "first") return column[NOTHING]?.node;
        if (step === "last") return column[column.length - SINGLE]?.node;

        return column[step === "down" ? at + SINGLE : at - SINGLE]?.node;
    };
}

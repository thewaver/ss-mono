import type { OverflowCut, OverflowCutDefs } from "./Overflow.types";

/** Zero, as a width or a total. */
const NOTHING = 0;
/** One item or one gap. */
const SINGLE = 1;

/**
 * Decides which items of a row fit and which collapse into an overflow control, for any row that keeps what does not
 * fit behind a "more" control.
 *
 * It knows nothing about what the items are or how the row is walked: `Toolbar` collapses its actions into an
 * overflow menu with it, and `FlyoutMenu` its entries into an overflow panel.
 */
export namespace OverflowUtils {
    /**
     * Whether a row has measured enough to be drawn.
     *
     * A row is hidden until its own width and every item's have arrived, so the first paint does not show every item
     * at full width before the cut lands. A laid-out row measures nothing and is drawn at once.
     *
     * @param isPlaced Whether the row is laid out rather than run in a line.
     * @param rootWidth The row's measured width.
     * @param measuredCount How many items have been measured.
     * @param itemCount How many items there are.
     */
    export const computeHasMeasured = (
        isPlaced: boolean,
        rootWidth: number,
        measuredCount: number,
        itemCount: number,
    ) => isPlaced || (rootWidth > NOTHING && measuredCount === itemCount);

    /**
     * Splits the items into those shown and those collapsed.
     *
     * Items are taken in order until the next one would not fit, so the row collapses from the end and never leaves a
     * hole. Two things get reserved before anything is fitted: the items that must never collapse, and the overflow
     * control itself — because as soon as one item collapses, the control appears and takes room that was being
     * counted as free.
     *
     * Where nothing is forced to collapse and everything fits, the overflow control is not accounted for at all, which
     * is what lets a row with room to spare use the whole of it.
     *
     * @param defs.widths Each item's measured width, in the order they are drawn.
     * @param defs.collapses Each item's rule: `"never"` to always show it, `"always"` to always collapse it, `"auto"`
     * to let it fit if it can. `"auto"` when not given.
     * @param defs.gap The space between items.
     * @param defs.available The room the row has.
     * @param defs.overflowWidth The overflow control's width.
     * @returns The indices shown, in drawing order, and the indices collapsed.
     */
    export const computeCut = (defs: OverflowCutDefs): OverflowCut => {
        const indexes = defs.widths.map((_unused, index) => index);
        const collapseOf = (index: number) => defs.collapses[index] ?? "auto";
        const widthOf = (index: number) => defs.widths[index] ?? NOTHING;

        const wholeRow =
            defs.widths.reduce((total, width) => total + width, NOTHING) +
            defs.gap * Math.max(defs.widths.length - SINGLE, NOTHING);

        if (!indexes.some((index) => collapseOf(index) === "always") && wholeRow <= defs.available) {
            return { shownIndexes: indexes, collapsedIndexes: [] };
        }

        const kept = indexes.filter((index) => collapseOf(index) === "never");
        const budget = defs.available - defs.overflowWidth;

        let used = kept.reduce((total, index) => total + widthOf(index) + defs.gap, NOTHING);

        const fitted: number[] = [];

        for (const index of indexes) {
            if (collapseOf(index) !== "auto") continue;

            const next = used + widthOf(index) + defs.gap;

            if (next > budget) break;

            used = next;
            fitted.push(index);
        }

        const shownIndexes = [...kept, ...fitted].sort((first, second) => first - second);

        return {
            shownIndexes,
            collapsedIndexes: indexes.filter((index) => !shownIndexes.includes(index)),
        };
    };

    /**
     * The cut of a row that is laid out rather than run in a line: a layout sizes the row itself, so there is no width
     * to run out of and every item shows.
     *
     * @param count How many items there are.
     */
    export const computeUncut = (count: number): OverflowCut => ({
        shownIndexes: Array.from({ length: count }, (_unused, index) => index),
        collapsedIndexes: [],
    });
}

import type { ToolbarCut, ToolbarCutDefs } from "./Toolbar.types";

/** Zero, as a width or a total. */
const NOTHING = 0;
/** One item or one gap. */
const SINGLE = 1;

/** Decides which toolbar items fit and which go into the overflow menu. */
export namespace ToolbarUtils {
    /**
     * Splits the items into those shown and those collapsed.
     *
     * Items are taken in order until the next one would not fit, so the toolbar collapses from the right
     * and never leaves a hole. Two things get reserved before anything is fitted: the items that must
     * never collapse, and the overflow button itself — because as soon as one item collapses, the button
     * appears and takes room that was being counted as free.
     *
     * Where nothing is forced to collapse and everything fits, the overflow button is not accounted for
     * at all, which is what lets a toolbar with room to spare use the whole of it.
     *
     * @param defs.widths Each item's measured width, in the order they are drawn.
     * @param defs.collapses Each item's rule: `"never"` to always show it, `"always"` to always collapse
     * it, `"auto"` to let it fit if it can. `"auto"` when not given.
     * @param defs.gap The space between items.
     * @param defs.available The room the toolbar has.
     * @param defs.overflowWidth The overflow button's width.
     * @returns The indices shown, in drawing order, and the indices collapsed.
     */
    export const computeCut = (defs: ToolbarCutDefs): ToolbarCut => {
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
}

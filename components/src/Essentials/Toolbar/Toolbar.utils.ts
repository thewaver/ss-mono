import type { ToolbarCut, ToolbarCutDefs } from "./Toolbar.types";

const NOTHING = 0;
const SINGLE = 1;

export namespace ToolbarUtils {
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

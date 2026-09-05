import { describe, expect, it } from "vitest";

import type { ToolbarCollapse, ToolbarCutDefs } from "./Toolbar.types";
import { ToolbarUtils } from "./Toolbar.utils";

const cut = (
    widths: number[],
    available: number,
    opts?: Partial<Pick<ToolbarCutDefs, "collapses" | "overflowWidth" | "gap">>,
) =>
    ToolbarUtils.computeCut({
        widths,
        collapses: opts?.collapses ?? widths.map((): ToolbarCollapse => "auto"),
        available,
        overflowWidth: opts?.overflowWidth ?? 30,
        gap: opts?.gap ?? 0,
    });

describe("computeCut", () => {
    it("keeps the whole row when it fits, and asks for no overflow at all", () => {
        expect(cut([40, 40, 40], 120)).toEqual({ shownIndexes: [0, 1, 2], collapsedIndexes: [] });
    });

    it("counts the gaps between the actions when it asks whether the row fits", () => {
        expect(cut([40, 40, 40], 140, { gap: 10 }).collapsedIndexes, "three actions and two gaps is 140").toEqual([]);
        expect(cut([40, 40, 40], 139, { gap: 10 }).collapsedIndexes.length).toBeGreaterThan(0);
    });

    it("pays for the overflow button out of the same width, so the last action that fitted comes off with it", () => {
        expect(cut([40, 40, 40], 119).shownIndexes, "two actions and the button come to 110").toEqual([0, 1]);
        expect(cut([40, 40, 40], 109).shownIndexes, "one pixel under that and the second one goes too").toEqual([0]);
    });

    it("drops from the end rather than skipping to a narrower action further along", () => {
        expect(cut([40, 90, 20], 100).shownIndexes, "the 20 would have fitted, and taking it would reorder").toEqual([
            0,
        ]);
    });

    it("asks the two questions once each rather than iterating, so a one-pixel resize cannot oscillate", () => {
        const widths = [40, 40, 40];

        expect(cut(widths, 120).collapsedIndexes, "at exactly the row's width nothing collapses").toEqual([]);
        expect(cut(widths, 119).shownIndexes, "one pixel less and the answer is the greedy fill, once").toEqual([0, 1]);
        expect(cut(widths, 120).collapsedIndexes, "and going back up returns the same answer as before").toEqual([]);
    });

    it("keeps an action that refuses to collapse, whatever it costs the ones around it", () => {
        const collapses: ToolbarCollapse[] = ["auto", "auto", "never"];

        expect(cut([40, 40, 40], 115, { collapses }).shownIndexes).toEqual([0, 2]);
        expect(
            cut([40, 40, 40], 100, { collapses }).shownIndexes,
            "and it is the last one standing when the room runs out",
        ).toEqual([2]);
    });

    it("shows a refusing action even when there is no room for it at all", () => {
        const collapses: ToolbarCollapse[] = ["never", "auto"];

        expect(cut([200, 40], 50, { collapses }).shownIndexes).toEqual([0]);
    });

    it("collapses an action that always collapses, even when the whole row would have fitted", () => {
        const collapses: ToolbarCollapse[] = ["auto", "always", "auto"];

        expect(cut([10, 10, 10], 500, { collapses })).toEqual({ shownIndexes: [0, 2], collapsedIndexes: [1] });
    });

    it("puts the actions back in their given order rather than in the order they were decided", () => {
        const collapses: ToolbarCollapse[] = ["auto", "never", "auto"];

        expect(cut([30, 30, 30], 89, { collapses, overflowWidth: 20 }).shownIndexes).toEqual([0, 1]);
    });

    it("collapses everything when the overflow button is all there is room for", () => {
        expect(cut([40, 40], 30).shownIndexes).toEqual([]);
    });

    it("has nothing to decide about a toolbar with no actions", () => {
        expect(cut([], 100)).toEqual({ shownIndexes: [], collapsedIndexes: [] });
    });
});

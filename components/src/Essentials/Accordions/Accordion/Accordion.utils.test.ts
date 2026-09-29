import { describe, expect, it } from "vitest";

import { AccordionUtils } from "./Accordion.utils";

const ITEMS = [
    { value: "a" },
    { value: "b", isDisabled: true },
    { value: "c", isDisabled: true, isReachableWhenDisabled: true },
    { value: "d" },
];

describe("computeNavigableIndexes", () => {
    it("skips a disabled section unless it asked to stay reachable", () => {
        expect(AccordionUtils.computeNavigableIndexes(ITEMS)).toEqual([0, 2, 3]);
    });
});

describe("computeToggled", () => {
    it("opens a closed section and closes an open one, leaving the rest", () => {
        expect(AccordionUtils.computeToggled(["a"], "d", {})).toEqual(["a", "d"]);
        expect(AccordionUtils.computeToggled(["a", "d"], "a", {})).toEqual(["d"]);
    });

    it("closes the rest when only one may be open", () => {
        expect(AccordionUtils.computeToggled(["a"], "d", { isSingleExpand: true })).toEqual(["d"]);
        expect(AccordionUtils.computeToggled(["a"], "a", { isSingleExpand: true })).toEqual([]);
    });

    it("refuses to close the last open section when one is required, and answers the same list", () => {
        const expanded = ["a"];

        expect(AccordionUtils.computeToggled(expanded, "a", { isExpandRequired: true })).toBe(expanded);
        expect(AccordionUtils.computeToggled(["a", "d"], "a", { isExpandRequired: true })).toEqual(["d"]);
    });
});

describe("computeFocusTarget", () => {
    const headers = [{}, {}, {}, {}] as HTMLElement[];
    const navigable = AccordionUtils.computeNavigableIndexes(ITEMS);

    it("walks the reachable headers and wraps at the ends", () => {
        expect(AccordionUtils.computeFocusTarget("ArrowDown", headers, navigable, headers[0])).toBe(2);
        expect(AccordionUtils.computeFocusTarget("ArrowDown", headers, navigable, headers[3])).toBe(0);
        expect(AccordionUtils.computeFocusTarget("End", headers, navigable, headers[0])).toBe(3);
    });

    it("answers nothing when focus is not on a header, or for a key that is not a walk", () => {
        expect(AccordionUtils.computeFocusTarget("ArrowDown", headers, navigable, null)).toBeUndefined();
        expect(AccordionUtils.computeFocusTarget("a", headers, navigable, headers[0])).toBeUndefined();
    });

    it("does not take a missing header for the focused one when nothing is focused", () => {
        expect(AccordionUtils.computeFocusTarget("ArrowDown", [null, null], [0, 1], null)).toBeUndefined();
    });
});

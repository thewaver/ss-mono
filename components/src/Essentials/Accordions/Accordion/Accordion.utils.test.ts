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

describe("computeMoveDirection", () => {
    it("compares the section that opened with the one that closed", () => {
        expect(AccordionUtils.computeMoveDirection([1], [3])).toBe("forward");
        expect(AccordionUtils.computeMoveDirection([3], [1])).toBe("backward");
    });

    it("compares with the nearest open section when nothing closed", () => {
        expect(AccordionUtils.computeMoveDirection([0, 4], [0, 3, 4])).toBe("backward");
        expect(AccordionUtils.computeMoveDirection([0, 4], [0, 1, 4])).toBe("forward");
    });

    it("says nothing when nothing opened, or nothing was open to move from", () => {
        expect(AccordionUtils.computeMoveDirection([2], [])).toBeUndefined();
        expect(AccordionUtils.computeMoveDirection([], [2])).toBeUndefined();
    });
});

describe("computeFocusTarget", () => {
    const headers = [{}, {}, {}] as HTMLElement[];

    it("walks a row with the left and right arrows, reversed for right-to-left text", () => {
        expect(
            AccordionUtils.computeFocusTarget("ArrowRight", headers, [0, 1, 2], headers[0], {
                orientation: "horizontal",
            }),
        ).toBe(1);
        expect(
            AccordionUtils.computeFocusTarget("ArrowDown", headers, [0, 1, 2], headers[0], {
                orientation: "horizontal",
            }),
        ).toBeUndefined();
        expect(
            AccordionUtils.computeFocusTarget("ArrowRight", headers, [0, 1, 2], headers[1], {
                orientation: "horizontal",
                direction: "rtl",
            }),
        ).toBe(0);
    });

    it("walks a column with the up and down arrows", () => {
        expect(AccordionUtils.computeFocusTarget("ArrowDown", headers, [0, 1, 2], headers[0])).toBe(1);
        expect(AccordionUtils.computeFocusTarget("ArrowRight", headers, [0, 1, 2], headers[0])).toBeUndefined();
    });
});

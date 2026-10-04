import { describe, expect, it } from "vitest";

import type { PlacementLayout } from "../../../Abstracts/Placement/Placement.types";
import type { RadioGroupEntry } from "./RadioGroup.context.types";
import { RadioGroupUtils } from "./RadioGroup.utils";

const entry = (value: string, opts?: { isDisabled?: boolean; isReachable?: boolean }): RadioGroupEntry => ({
    getElementRef: () => undefined,
    getIsDisabled: () => opts?.isDisabled ?? false,
    getIsReachable: () => opts?.isReachable ?? false,
    getValue: () => value,
});

const SMALL = entry("small");
const MEDIUM = entry("medium", { isDisabled: true, isReachable: true });
const LARGE = entry("large");
const HIDDEN = entry("hidden", { isDisabled: true });

describe("orderEntries", () => {
    it("keeps the registration order while any radio has no element", () => {
        const entries = [LARGE, SMALL];

        expect(RadioGroupUtils.orderEntries(entries)).toBe(entries);
    });
});

describe("computeNavigableEntries", () => {
    it("walks the enabled radios and the reachable disabled ones", () => {
        expect(RadioGroupUtils.computeNavigableEntries([SMALL, MEDIUM, HIDDEN, LARGE])).toEqual([SMALL, MEDIUM, LARGE]);
    });
});

describe("computeRovingEntry", () => {
    it("puts the tab stop on the picked radio, or else the first walkable one", () => {
        expect(RadioGroupUtils.computeRovingEntry([SMALL, LARGE], "large")).toBe(LARGE);
        expect(RadioGroupUtils.computeRovingEntry([SMALL, LARGE], "hidden")).toBe(SMALL);
        expect(RadioGroupUtils.computeRovingEntry([], "small")).toBeUndefined();
    });
});

describe("computeSelectedEntry", () => {
    it("finds the picked radio, disabled or not", () => {
        expect(RadioGroupUtils.computeSelectedEntry([SMALL, HIDDEN], "hidden")).toBe(HIDDEN);
    });
});

describe("computeKeyTarget", () => {
    const navigable = [SMALL, MEDIUM, LARGE];

    it("walks forward and wraps from the radio holding the tab stop", () => {
        const opts = { focusedElement: null, rovingEntry: LARGE, direction: "ltr" as const };

        expect(RadioGroupUtils.computeKeyTarget("ArrowRight", navigable, opts)).toBe(SMALL);
        expect(RadioGroupUtils.computeKeyTarget("ArrowUp", navigable, opts)).toBe(MEDIUM);
    });

    it("turns the horizontal arrows under right-to-left and leaves the vertical ones", () => {
        const opts = { focusedElement: null, rovingEntry: SMALL, direction: "rtl" as const };

        expect(RadioGroupUtils.computeKeyTarget("ArrowLeft", navigable, opts)).toBe(MEDIUM);
        expect(RadioGroupUtils.computeKeyTarget("ArrowDown", navigable, opts)).toBe(MEDIUM);
    });

    it("answers the edge keys and nothing else", () => {
        const opts = { focusedElement: null, rovingEntry: SMALL, direction: "ltr" as const };

        expect(RadioGroupUtils.computeKeyTarget("End", navigable, opts)).toBe(LARGE);
        expect(RadioGroupUtils.computeKeyTarget("a", navigable, opts)).toBeUndefined();
        expect(RadioGroupUtils.computeKeyTarget("End", [], opts)).toBeUndefined();
    });
});

describe("computePlacement and computeFloaterBounds", () => {
    const placement = { leftShare: 0.5, topShare: 0.25, widthShare: 0.2, heightShare: 0.1, angle: 30 };
    const layout = { heightRatio: 0.5, placements: [placement, placement] } as unknown as PlacementLayout;

    it("hands each radio the placement at its position, and none to a stranger", () => {
        expect(RadioGroupUtils.computePlacement([SMALL, LARGE], layout, LARGE)).toBe(placement);
        expect(RadioGroupUtils.computePlacement([SMALL, LARGE], layout, MEDIUM)).toBeUndefined();
        expect(RadioGroupUtils.computePlacement([SMALL, LARGE], undefined, SMALL)).toBeUndefined();
    });
});

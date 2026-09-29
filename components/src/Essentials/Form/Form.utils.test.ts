import { describe, expect, it } from "vitest";

import type { FormEntry } from "./Form.context.types";
import { FormUtils } from "./Form.utils";

const entry = (hasError: boolean, target?: HTMLElement): FormEntry => ({
    getHasError: () => hasError,
    getFocusTarget: target === undefined ? undefined : () => target,
});

const first = { id: "first" } as unknown as HTMLElement;
const second = { id: "second" } as unknown as HTMLElement;

describe("computeIsValid", () => {
    it("is valid while nothing reports an error, an empty collection included", () => {
        expect(FormUtils.computeIsValid([])).toBe(true);
        expect(FormUtils.computeIsValid([entry(false), entry(false)])).toBe(true);
    });

    it("is invalid the moment one entry reports an error", () => {
        expect(FormUtils.computeIsValid([entry(false), entry(true)])).toBe(false);
    });
});

describe("findErrorFocusTarget", () => {
    it("names the control of the first entry in error, in the order they were drawn", () => {
        expect(FormUtils.findErrorFocusTarget([entry(false, first), entry(true, second), entry(true, first)])).toBe(
            second,
        );
    });

    it("names nothing when nothing is in error", () => {
        expect(FormUtils.findErrorFocusTarget([entry(false, first)])).toBeUndefined();
    });

    it("names nothing when the first entry in error has no control, rather than skipping to the next", () => {
        expect(FormUtils.findErrorFocusTarget([entry(true), entry(true, second)])).toBeUndefined();
    });
});

describe("findSectionFocusTarget", () => {
    it("names the first entry in error", () => {
        expect(FormUtils.findSectionFocusTarget([entry(false, first), entry(true, second)])).toBe(second);
    });

    it("falls back to the first entry when none is in error, for a rule belonging to no single field", () => {
        expect(FormUtils.findSectionFocusTarget([entry(false, first), entry(false, second)])).toBe(first);
    });

    it("names nothing for an empty section", () => {
        expect(FormUtils.findSectionFocusTarget([])).toBeUndefined();
    });
});

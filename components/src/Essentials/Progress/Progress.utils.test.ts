import { describe, expect, it } from "vitest";

import { ProgressUtils } from "./Progress.utils";

const BASE = { min: 0, max: 1, role: "progressbar" as const, hasError: false };

describe("ProgressUtils.computeState", () => {
    it("hands over the value's share of the range", () => {
        expect(ProgressUtils.computeState({ ...BASE, value: 0.4 }).ratio).toBe(0.4);
        expect(ProgressUtils.computeState({ ...BASE, value: 50, min: 0, max: 200 }).ratio).toBe(0.25);
    });

    it("clamps the ratio but passes the value on as given", () => {
        const state = ProgressUtils.computeState({ ...BASE, value: 5 });

        expect(state.ratio).toBe(1);
        expect(state.value).toBe(5);
        expect(ProgressUtils.computeState({ ...BASE, value: -3 }).ratio).toBe(0);
    });

    it("reads a missing value as indeterminate under progressbar", () => {
        const state = ProgressUtils.computeState({ ...BASE, value: undefined });

        expect(state.value).toBeUndefined();
        expect(state.ratio).toBeUndefined();
    });

    it("reads a missing value as min under meter", () => {
        const state = ProgressUtils.computeState({ ...BASE, role: "meter", value: undefined, min: 2, max: 4 });

        expect(state.value).toBe(2);
        expect(state.ratio).toBe(0);
    });

    it("reads an empty range as complete", () => {
        expect(ProgressUtils.computeState({ ...BASE, value: 0, min: 1, max: 1 }).ratio).toBe(1);
    });

    it("carries the error flag through", () => {
        expect(ProgressUtils.computeState({ ...BASE, value: 0, hasError: true }).hasError).toBe(true);
    });
});

import { describe, expect, it } from "vitest";

import type { CheckboxGroupEntry } from "./CheckboxGroup.context.types";
import { CheckboxGroupUtils } from "./CheckboxGroup.utils";

const member = (value: string, isDisabled = false): CheckboxGroupEntry => ({
    getValue: () => value,
    getIsDisabled: () => isDisabled,
});

describe("toggleValue", () => {
    it("appends a ticked value and removes a cleared one", () => {
        expect(CheckboxGroupUtils.toggleValue(["a"], "b", true)).toEqual(["a", "b"]);
        expect(CheckboxGroupUtils.toggleValue(["a", "b"], "a", false)).toEqual(["b"]);
    });
});

describe("computeCheckedState", () => {
    it("reads every, none and mixed across the enabled members", () => {
        const members = [member("a"), member("b")];

        expect(CheckboxGroupUtils.computeCheckedState(["a", "b"], members)).toBe(true);
        expect(CheckboxGroupUtils.computeCheckedState([], members)).toBe(false);
        expect(CheckboxGroupUtils.computeCheckedState(["a"], members)).toBe("mixed");
    });

    it("leaves a disabled member out of the count while any member is enabled", () => {
        expect(CheckboxGroupUtils.computeCheckedState(["a"], [member("a"), member("b", true)])).toBe(true);
    });

    it("counts every member once all of them are disabled", () => {
        expect(CheckboxGroupUtils.computeCheckedState(["a"], [member("a", true), member("b", true)])).toBe("mixed");
    });

    it("reads an empty group as unticked", () => {
        expect(CheckboxGroupUtils.computeCheckedState([], [])).toBe(false);
    });
});

describe("computeChangedValues and applyChangedValues", () => {
    const members = [member("a"), member("b"), member("c", true)];

    it("ticks only the enabled members not yet ticked, and leaves a disabled one as it was", () => {
        const changed = CheckboxGroupUtils.computeChangedValues(["a"], members, true);

        expect(changed).toEqual(["b"]);
        expect(CheckboxGroupUtils.applyChangedValues(["a"], changed, true)).toEqual(["a", "b"]);
    });

    it("clears only the enabled members, keeping a disabled member's value", () => {
        const changed = CheckboxGroupUtils.computeChangedValues(["a", "c"], members, false);

        expect(changed).toEqual(["a"]);
        expect(CheckboxGroupUtils.applyChangedValues(["a", "c"], changed, false)).toEqual(["c"]);
    });

    it("finds nothing to change when the press would change nothing", () => {
        expect(CheckboxGroupUtils.computeChangedValues(["a", "b"], members, true)).toEqual([]);
    });
});

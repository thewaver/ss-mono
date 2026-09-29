import { describe, expect, it } from "vitest";

import { BinarySwitchUtils } from "./BinarySwitch.utils";

describe("computeRole", () => {
    it("announces a switch as one", () => {
        expect(BinarySwitchUtils.computeRole(true, false)).toBe("switch");
    });

    it("drops the role while mixed, because a switch has no mixed state to announce", () => {
        expect(BinarySwitchUtils.computeRole(true, true)).toBeUndefined();
    });

    it("leaves a checkbox or a radio to its native role", () => {
        expect(BinarySwitchUtils.computeRole(false, false)).toBeUndefined();
        expect(BinarySwitchUtils.computeRole(false, true)).toBeUndefined();
    });
});

describe("computeCheckedState", () => {
    it("reads mixed ahead of checked", () => {
        expect(BinarySwitchUtils.computeCheckedState(true, true)).toBe("mixed");
        expect(BinarySwitchUtils.computeCheckedState(false, true)).toBe("mixed");
    });

    it("reads whether it is on otherwise", () => {
        expect(BinarySwitchUtils.computeCheckedState(true, false)).toBe(true);
        expect(BinarySwitchUtils.computeCheckedState(false, false)).toBe(false);
    });
});

describe("syncElement", () => {
    it("writes both properties, whatever the input held before", () => {
        const element = { checked: false, indeterminate: true } as HTMLInputElement;

        BinarySwitchUtils.syncElement(element, true, false);

        expect(element.checked).toBe(true);
        expect(element.indeterminate).toBe(false);
    });
});

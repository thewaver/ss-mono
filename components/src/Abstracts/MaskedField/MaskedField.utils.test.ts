import { describe, expect, it } from "vitest";

import { MaskedFieldUtils } from "./MaskedField.utils";

const FOUR_DIGIT_DEFS = {
    getDigitCount: () => 4,
    getHasImpossibleDigits: (digits: string) => digits.startsWith("9"),
    fromDigits: (digits: string) => (digits.length === 4 && digits !== "0000" ? Number(digits) : undefined),
};

describe("computeHasIssue", () => {
    it("never calls an empty field wrong", () => {
        expect(MaskedFieldUtils.computeHasIssue("", true, FOUR_DIGIT_DEFS)).toBe(false);
    });

    it("calls digits no value could start with wrong at once, left or not", () => {
        expect(MaskedFieldUtils.computeHasIssue("9", false, FOUR_DIGIT_DEFS)).toBe(true);
    });

    it("leaves a short entry alone until the field has been left", () => {
        expect(MaskedFieldUtils.computeHasIssue("12", false, FOUR_DIGIT_DEFS)).toBe(false);
        expect(MaskedFieldUtils.computeHasIssue("12", true, FOUR_DIGIT_DEFS)).toBe(true);
    });

    it("calls a full entry wrong only when it makes no value", () => {
        expect(MaskedFieldUtils.computeHasIssue("1234", true, FOUR_DIGIT_DEFS)).toBe(false);
        expect(MaskedFieldUtils.computeHasIssue("0000", false, FOUR_DIGIT_DEFS)).toBe(true);
    });
});

describe("computeTypedValue", () => {
    it("commits nothing for a half-finished entry, so the last good value stays", () => {
        expect(MaskedFieldUtils.computeTypedValue("12", FOUR_DIGIT_DEFS)).toBeUndefined();
    });

    it("commits the value a complete entry makes", () => {
        expect(MaskedFieldUtils.computeTypedValue("1234", FOUR_DIGIT_DEFS)).toEqual({ value: 1234 });
    });

    it("commits no value for an emptied field, which is different from committing nothing", () => {
        expect(MaskedFieldUtils.computeTypedValue("", FOUR_DIGIT_DEFS)).toEqual({ value: undefined });
    });
});

describe("computeText", () => {
    it("spells a value through its digits, and no value as nothing", () => {
        const defs = { toDigits: (value: number) => String(value), formatDigits: (digits: string) => `#${digits}` };

        expect(MaskedFieldUtils.computeText(42, defs)).toBe("#42");
        expect(MaskedFieldUtils.computeText(undefined, defs)).toBe("");
    });
});

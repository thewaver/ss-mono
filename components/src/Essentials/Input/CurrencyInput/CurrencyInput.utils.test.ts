import { describe, expect, it } from "vitest";

import { MaskedFieldUtils } from "../../../Abstracts/MaskedField/MaskedField.utils";
import type { TextSyncGroupDefs } from "../../../Abstracts/TextSync/TextSync.types";
import { TextSyncUtils } from "../../../Abstracts/TextSync/TextSync.utils";
import { CurrencyInputUtils } from "./CurrencyInput.utils";

const BRITISH = CurrencyInputUtils.computeGroupDefs({ locale: "en-GB", decimals: 2, hasSign: false });
const SIGNED = CurrencyInputUtils.computeGroupDefs({ locale: "en-GB", decimals: 2, hasSign: true });

const rulesFor = (groupDefs: TextSyncGroupDefs, range: { min?: number; max?: number } = {}) =>
    CurrencyInputUtils.createFieldRules({
        getGroupDefs: () => groupDefs,
        getDecimals: () => groupDefs.decimals,
        getHasSign: () => groupDefs.hasSign ?? false,
        getMin: () => range.min,
        getMax: () => range.max,
    });

describe("computeGroupDefs", () => {
    it("takes the separators and the grouping from the locale", () => {
        expect(CurrencyInputUtils.computeGroupDefs({ locale: "de-DE", decimals: 2, hasSign: false })).toEqual({
            groupSeparator: ".",
            decimalSeparator: ",",
            groupSizes: [3],
            decimals: 2,
            hasSign: false,
        });
        expect(
            CurrencyInputUtils.computeGroupDefs({ locale: "en-IN", decimals: 2, hasSign: false }).groupSizes,
        ).toEqual([3, 2]);
    });

    it("lets a grouping given outright override the locale's", () => {
        expect(
            CurrencyInputUtils.computeGroupDefs({ locale: "en-IN", groupSizes: [3], decimals: 2, hasSign: false })
                .groupSizes,
        ).toEqual([3]);
    });
});

describe("computeHint", () => {
    it("writes a zero with the full fraction in the field's own separators", () => {
        expect(CurrencyInputUtils.computeHint(BRITISH)).toBe("0.00");
        expect(
            CurrencyInputUtils.computeHint(
                CurrencyInputUtils.computeGroupDefs({ locale: "de-DE", decimals: 3, hasSign: false }),
            ),
        ).toBe("0,000");
    });
});

describe("createFieldRules", () => {
    it("fills the fraction from the right", () => {
        const rules = rulesFor(BRITISH);

        expect(rules.fromDigits("123")).toBe(1.23);
        expect(rules.formatDigits("123456")).toBe("1,234.56");
    });

    it("writes an amount back as the digits it came from", () => {
        const rules = rulesFor(BRITISH);

        expect(rules.toDigits(1234.56)).toBe("123456");
        expect(rules.fromDigits(rules.toDigits(1234.56))).toBe(1234.56);
    });

    it("reads a leading minus as the sign only where the field takes one", () => {
        expect(rulesFor(SIGNED).readDigits!("-1,234.56")).toBe("-123456");
        expect(rulesFor(BRITISH).readDigits!("-1,234.56")).toBe("123456");
        expect(rulesFor(SIGNED).fromDigits("-12345")).toBe(-123.45);
        expect(rulesFor(SIGNED).toDigits(-250.5)).toBe("-25050");
        expect(rulesFor(BRITISH).toDigits(-250.5), "a held negative keeps its minus where none may be typed").toBe(
            "-25050",
        );
    });

    it("shows a held negative where no sign is allowed, and reads it back as a different amount", () => {
        const rules = rulesFor(BRITISH);
        const text = MaskedFieldUtils.computeText(-250.5, rules);

        expect(text.startsWith(TextSyncUtils.MASK_MINUS), "the minus is shown, not dropped").toBe(true);
        expect(MaskedFieldUtils.getIsUnheld(-250.5, text, rules), "so the field marks it as wrong").toBe(true);
        expect(MaskedFieldUtils.getIsUnheld(-250.5, text, rulesFor(SIGNED)), "and not where a sign is allowed").toBe(
            false,
        );
    });

    it("keeps an amount outside the bounds as typed, and settles it to the nearest bound", () => {
        const rules = rulesFor(BRITISH, { min: 100, max: 5000 });

        expect(rules.fromDigits("600000"), "a bound does not make an amount wrong").toBe(6000);
        expect(rules.getHasImpossibleDigits("600000")).toBe(false);
        expect(rules.settleValue!(6000), "leaving the field pulls it back to the bound").toBe(5000);
        expect(rules.settleValue!(50)).toBe(100);
        expect(rules.settleValue!(4000), "and leaves one inside the bounds alone").toBe(4000);
    });

    it("has no fixed length and compares amounts by value", () => {
        const rules = rulesFor(BRITISH);

        expect(rules.getDigitCount()).toBeUndefined();
        expect(rules.getIsSame(1.5, 1.5)).toBe(true);
        expect(rules.getIsSame(1.5, undefined)).toBe(false);
    });

    it("reads its definitions afresh on every call", () => {
        let groupDefs = BRITISH;
        const rules = CurrencyInputUtils.createFieldRules({
            getGroupDefs: () => groupDefs,
            getDecimals: () => groupDefs.decimals,
            getHasSign: () => false,
            getMin: () => undefined,
            getMax: () => undefined,
        });

        expect(rules.formatDigits("123456")).toBe("1,234.56");

        groupDefs = CurrencyInputUtils.computeGroupDefs({ locale: "de-DE", decimals: 2, hasSign: false });

        expect(rules.formatDigits("123456")).toBe("1.234,56");
    });
});

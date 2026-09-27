import { describe, expect, it } from "vitest";

import { DecimalUtils } from "../../src/Abstracts/decimal.js";

describe("getSeparators", () => {
    it("reads both separators out of the locale rather than being told them", () => {
        expect(DecimalUtils.getSeparators("en-US")).toEqual({ groupSeparator: ",", decimalSeparator: "." });
        expect(DecimalUtils.getSeparators("de-DE")).toEqual({ groupSeparator: ".", decimalSeparator: "," });
    });

    it("reports a separator for a locale that groups differently, even where the grouping itself is uniform", () => {
        const separators = DecimalUtils.getSeparators("fr-FR");

        expect(separators.decimalSeparator).toBe(",");
        expect(separators.groupSeparator.length).toBeGreaterThan(0);
    });
});

describe("toDigits and fromDigits", () => {
    it("treats the digits as the value in its smallest unit", () => {
        expect(DecimalUtils.toDigits(1234.56, 2)).toBe("123456");
        expect(DecimalUtils.toDigits(0.07, 2)).toBe("7");
        expect(DecimalUtils.toDigits(1234, 0)).toBe("1234");
    });

    it("round-trips a value that binary floating point cannot hold exactly", () => {
        for (const value of [12.3, 0.07, 1.1, 19.99, 1234.56, 0.29, 8.11]) {
            expect(DecimalUtils.fromDigits(DecimalUtils.toDigits(value, 2), 2), `${value}`).toBe(value);
        }
    });

    /**
     * The halfway cases are the whole reason the shift is done on the decimal spelling: multiplying by 100 puts
     * `1.005` at `100.49999999999999` and `8.115` at `811.4999999999999`, so a rounded product loses the penny
     * that the number the consumer actually wrote is entitled to.
     */
    it("rounds a halfway value up rather than on its binary approximation", () => {
        expect(DecimalUtils.toDigits(1.005, 2)).toBe("101");
        expect(DecimalUtils.toDigits(8.115, 2)).toBe("812");
        expect(DecimalUtils.toDigits(2.675, 2)).toBe("268");
        expect(Math.round(1.005 * 100), "which is what multiplying would have given").toBe(100);
    });

    it("rounds a value carrying more precision than the field shows", () => {
        expect(DecimalUtils.fromDigits(DecimalUtils.toDigits(1.005, 2), 2)).toBe(1.01);
        expect(DecimalUtils.fromDigits(DecimalUtils.toDigits(1.004, 2), 2)).toBe(1);
        expect(DecimalUtils.fromDigits(DecimalUtils.toDigits(2.675, 2), 2)).toBe(2.68);
    });

    it("keeps a whole number whole, and a zero fraction from becoming a digit", () => {
        expect(DecimalUtils.toDigits(5, 2)).toBe("500");
        expect(DecimalUtils.toDigits(0, 2)).toBe("0");
        expect(DecimalUtils.toDigits(1000000, 0)).toBe("1000000");
    });

    it("has no value for an empty digit run", () => {
        expect(DecimalUtils.fromDigits("", 2)).toBe(undefined);
    });

    it("reads a digit run shorter than the fraction as a fraction of one", () => {
        expect(DecimalUtils.fromDigits("7", 2)).toBe(0.07);
        expect(DecimalUtils.fromDigits("70", 2)).toBe(0.7);
    });
});

describe("formatSI", () => {
    it("shows as many decimals as asked for, dropping trailing zeros unless padded", () => {
        expect(DecimalUtils.formatSI(10000, 2, false, "en-US")).toBe("10k");
        expect(DecimalUtils.formatSI(10002, 3, false, "en-US")).toBe("10.002k");
        expect(DecimalUtils.formatSI(10002, 2, false, "en-US")).toBe("10k");
        expect(DecimalUtils.formatSI(10000, 2, true, "en-US")).toBe("10.00k");
    });

    it("uses the SI prefixes in both directions, keeping the sign", () => {
        expect(DecimalUtils.formatSI(4_200_000, 1, false, "en-US")).toBe("4.2M");
        expect(DecimalUtils.formatSI(3e9, 0, false, "en-US")).toBe("3G");
        expect(DecimalUtils.formatSI(0.0025, 1, false, "en-US")).toBe("2.5m");
        expect(DecimalUtils.formatSI(4.7e-6, 1, false, "en-US")).toBe("4.7μ");
        expect(DecimalUtils.formatSI(-1500, 1, false, "en-US")).toBe("-1.5k");
        expect(DecimalUtils.formatSI(512, 0, false, "en-US")).toBe("512");
    });

    it("moves to the next prefix when rounding reaches a thousand", () => {
        expect(DecimalUtils.formatSI(999_999, 1, false, "en-US")).toBe("1M");
        expect(DecimalUtils.formatSI(999.96, 1, false, "en-US")).toBe("1k");
        expect(DecimalUtils.formatSI(0.9999999, 2, false, "en-US")).toBe("1");
    });

    it("keeps the outermost prefix past either end of the table", () => {
        expect(DecimalUtils.formatSI(5e33, 0, false, "en-US")).toBe("5,000Q");
        expect(DecimalUtils.formatSI(5e-33, 0, false, "en-US")).toBe("0q");
    });

    it("gives no prefix to zero or a value that is not finite", () => {
        expect(DecimalUtils.formatSI(0, 2, true, "en-US")).toBe("0.00");
        expect(DecimalUtils.formatSI(Infinity, 2, false, "en-US")).toBe("∞");
    });

    it("formats the number for the locale while the prefix stays the same", () => {
        expect(DecimalUtils.formatSI(10500, 1, false, "de-DE")).toBe("10,5k");
    });
});

describe("formatLetters", () => {
    it("uses K, M, B and T before any letters", () => {
        expect(DecimalUtils.formatLetters(10002, 3, "counting", false, "en-US")).toBe("10.002K");
        expect(DecimalUtils.formatLetters(10000, 2, "counting", true, "en-US")).toBe("10.00K");
        expect(DecimalUtils.formatLetters(2.5e6, 1, "counting", false, "en-US")).toBe("2.5M");
        expect(DecimalUtils.formatLetters(7e9, 0, "counting", false, "en-US")).toBe("7B");
        expect(DecimalUtils.formatLetters(-3e12, 0, "counting", false, "en-US")).toBe("-3T");
    });

    it("counts like spreadsheet columns under the counting scheme", () => {
        expect(DecimalUtils.formatLetters(1e15, 0, "counting", false, "en-US")).toBe("1AA");
        expect(DecimalUtils.formatLetters(1e18, 0, "counting", false, "en-US")).toBe("1AB");
        expect(DecimalUtils.formatLetters(1e15 * 1000 ** 26, 0, "counting", false, "en-US")).toBe("1BA");
    });

    it("reaches the largest number with a suffix to spare", () => {
        expect(DecimalUtils.formatLetters(Number.MAX_VALUE, 0, "counting", false, "en-US")).toBe("180DT");
    });

    it("repeats one letter and grows the run under the repeated scheme", () => {
        expect(DecimalUtils.formatLetters(1e15, 0, "repeated", false, "en-US")).toBe("1AA");
        expect(DecimalUtils.formatLetters(1e18, 0, "repeated", false, "en-US")).toBe("1BB");
        expect(DecimalUtils.formatLetters(1e15 * 1000 ** 25, 0, "repeated", false, "en-US")).toBe("1ZZ");
        expect(DecimalUtils.formatLetters(1e15 * 1000 ** 26, 0, "repeated", false, "en-US")).toBe("1AAA");
        expect(DecimalUtils.formatLetters(1e15 * 1000 ** 52, 0, "repeated", false, "en-US")).toBe("1AAAA");
    });

    it("moves to the next suffix when rounding reaches a thousand", () => {
        expect(DecimalUtils.formatLetters(999_999, 1, "counting", false, "en-US")).toBe("1M");
        expect(DecimalUtils.formatLetters(999.99e12, 1, "counting", false, "en-US")).toBe("1AA");
    });

    it("gives no suffix below a thousand, fractions included", () => {
        expect(DecimalUtils.formatLetters(512, 0, "counting", false, "en-US")).toBe("512");
        expect(DecimalUtils.formatLetters(0.25, 2, "counting", false, "en-US")).toBe("0.25");
        expect(DecimalUtils.formatLetters(0, 1, "counting", true, "en-US")).toBe("0.0");
    });
});

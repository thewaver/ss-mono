import { describe, expect, it } from "vitest";

import { FormValueUtils } from "./FormValue.utils";

describe("computeText", () => {
    it("sends a string exactly as it is", () => {
        expect(FormValueUtils.computeText("red")).toBe("red");
        expect(FormValueUtils.computeText("")).toBe("");
        expect(FormValueUtils.computeText('say "hi"')).toBe('say "hi"');
    });

    it("sends a number, a boolean or a big integer as its plain spelling", () => {
        expect(FormValueUtils.computeText(42)).toBe("42");
        expect(FormValueUtils.computeText(-0.5)).toBe("-0.5");
        expect(FormValueUtils.computeText(true)).toBe("true");
        expect(FormValueUtils.computeText(10n)).toBe("10");
    });

    it("sends a record as JSON that reads back as the same record", () => {
        const record = { code: "LIS", city: "Lisbon", terminals: [1, 2] };
        const text = FormValueUtils.computeText(record);

        expect(JSON.parse(text!)).toEqual(record);
    });

    it("lets the caller's own writer replace every default", () => {
        const record = { code: "LIS", city: "Lisbon" };

        expect(FormValueUtils.computeText(record, (value) => value.code)).toBe("LIS");
        expect(FormValueUtils.computeText("red", (value) => value.toUpperCase())).toBe("RED");
        expect(FormValueUtils.computeText(7, (value) => `#${value}`)).toBe("#7");
    });

    it("answers nothing for a value JSON has no spelling for", () => {
        expect(FormValueUtils.computeText(undefined)).toBeUndefined();
        expect(FormValueUtils.computeText(() => 1)).toBeUndefined();
        expect(FormValueUtils.computeText(Symbol("x"))).toBeUndefined();
    });

    it("refuses a value JSON cannot write rather than approximating it", () => {
        const circular: Record<string, unknown> = {};

        circular.self = circular;

        expect(() => FormValueUtils.computeText(circular)).toThrow();
        expect(() => FormValueUtils.computeText({ big: 10n })).toThrow();
    });
});

describe("computeTexts", () => {
    it("writes one text per value, in the order given", () => {
        expect(FormValueUtils.computeTexts(["b", "a", "c"])).toEqual(["b", "a", "c"]);
        expect(FormValueUtils.computeTexts([3, 1, 2])).toEqual(["3", "1", "2"]);
    });

    it("answers an empty list for no values", () => {
        expect(FormValueUtils.computeTexts([])).toEqual([]);
    });

    it("leaves out a value with no spelling instead of sending an empty entry", () => {
        expect(FormValueUtils.computeTexts(["a", undefined, "b"])).toEqual(["a", "b"]);
    });

    it("keeps a genuinely empty string, which is a value", () => {
        expect(FormValueUtils.computeTexts(["a", "", "b"])).toEqual(["a", "", "b"]);
    });

    it("hands each value to the caller's own writer", () => {
        const records = [{ id: 1 }, { id: 2 }];

        expect(FormValueUtils.computeTexts(records, (record) => `id-${record.id}`)).toEqual(["id-1", "id-2"]);
    });
});

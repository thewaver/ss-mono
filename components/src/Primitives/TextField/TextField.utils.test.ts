import { describe, expect, it } from "vitest";

import { TextFieldUtils } from "./TextField.utils";

describe("resolvePadding", () => {
    it("spreads one number over every side", () => {
        expect(TextFieldUtils.resolvePadding(4)).toEqual({
            paddingTop: 4,
            paddingRight: 4,
            paddingBottom: 4,
            paddingLeft: 4,
        });
    });

    it("keeps four sides as given", () => {
        const padding = { paddingTop: 1, paddingRight: 2, paddingBottom: 3, paddingLeft: 4 };

        expect(TextFieldUtils.resolvePadding(padding)).toEqual(padding);
    });
});

describe("computeInset", () => {
    it("adds what is drawn on that side and the gap after it", () => {
        expect(TextFieldUtils.computeInset(8, 20, 4)).toBe(32);
    });

    it("leaves the padding alone when nothing is drawn there, rather than adding a stray gap", () => {
        expect(TextFieldUtils.computeInset(8, 0, 4)).toBe(8);
    });
});

describe("computeType", () => {
    it("gives a textarea no type at all", () => {
        expect(TextFieldUtils.computeType("textarea", "email")).toBeUndefined();
    });

    it("gives an input the type asked for, or plain text", () => {
        expect(TextFieldUtils.computeType("input", "number")).toBe("number");
        expect(TextFieldUtils.computeType("input", undefined)).toBe("text");
    });
});

describe("computeIsAutoSizing", () => {
    it("lets only a textarea grow", () => {
        expect(TextFieldUtils.computeIsAutoSizing("textarea", true)).toBe(true);
        expect(TextFieldUtils.computeIsAutoSizing("input", true)).toBe(false);
        expect(TextFieldUtils.computeIsAutoSizing("textarea", undefined)).toBe(false);
    });
});

describe("computeSpinValue", () => {
    it("reads the text with Number when the caller gives no reading of their own", () => {
        expect(TextFieldUtils.computeSpinValue("12.5")).toBe(12.5);
    });

    it("announces no value for empty text or text that is not a number, rather than a wrong one", () => {
        expect(TextFieldUtils.computeSpinValue("")).toBeUndefined();
        expect(TextFieldUtils.computeSpinValue("12,5")).toBeUndefined();
    });

    it("hands the text to the caller's own reading when there is one", () => {
        expect(TextFieldUtils.computeSpinValue("12,5", (text) => Number(text.replace(",", ".")))).toBe(12.5);
    });
});

describe("computeOverflowY", () => {
    it("leaves an input to the browser", () => {
        expect(TextFieldUtils.computeOverflowY("input", false, undefined)).toBeUndefined();
    });

    it("hides the scrollbar of a textarea that grows without a ceiling", () => {
        expect(TextFieldUtils.computeOverflowY("textarea", true, undefined)).toBe("hidden");
    });

    it("scrolls a fixed textarea, and one that has reached its ceiling", () => {
        expect(TextFieldUtils.computeOverflowY("textarea", false, undefined)).toBe("auto");
        expect(TextFieldUtils.computeOverflowY("textarea", true, 5)).toBe("auto");
    });
});

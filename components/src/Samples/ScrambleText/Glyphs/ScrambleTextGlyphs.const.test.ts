import { describe, expect, it } from "vitest";

import { ScrambleTextGlyphs } from "./ScrambleTextGlyphs.const";

const { matched } = ScrambleTextGlyphs.SAMPLE_GLYPHS;

const isAll = (set: string, test: (glyph: string) => boolean) => Array.from(set).every(test);

describe("matched", () => {
    it("churns a digit among digits", () => {
        expect(isAll(matched("7"), (glyph) => /[0-9]/.test(glyph))).toBe(true);
    });

    it("churns a capital among capitals and a small letter among small letters", () => {
        expect(isAll(matched("Q"), (glyph) => /[A-Z]/.test(glyph))).toBe(true);
        expect(isAll(matched("q"), (glyph) => /[a-z]/.test(glyph))).toBe(true);
    });

    it("keeps an accented letter's case, even though its set is plain Latin", () => {
        expect(matched("É")).toBe(matched("E"));
        expect(matched("é")).toBe(matched("e"));
    });

    it("gives anything that is neither a letter nor a digit a set holding neither", () => {
        expect(isAll(matched("#"), (glyph) => !/[0-9A-Za-z]/.test(glyph))).toBe(true);
    });

    it("hands every position a set with something other than its own character in it", () => {
        expect(Array.from("Az9#").every((character) => Array.from(matched(character)).length > 1)).toBe(true);
    });
});

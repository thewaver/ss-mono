import { describe, expect, it } from "vitest";

import { TypeaheadUtils } from "./Typeahead.utils";

const CITIES = ["London", "Lisbon", "Los Angeles", "Madrid", "Manchester"];

const computeText = (index: number) => CITIES[index];

const key = (value: string, modifiers?: Partial<KeyboardEvent>) => ({ key: value, ...modifiers }) as KeyboardEvent;

describe("Typeahead.getIsQueryKey", () => {
    it("takes a single printable character", () => {
        expect(TypeaheadUtils.getIsQueryKey(key("a"), false)).toBe(true);
        expect(TypeaheadUtils.getIsQueryKey(key("7"), false)).toBe(true);
        expect(TypeaheadUtils.getIsQueryKey(key("é"), false)).toBe(true);
    });

    it("leaves the named keys alone, so activation and the walk still work", () => {
        expect(TypeaheadUtils.getIsQueryKey(key("Enter"), true)).toBe(false);
        expect(TypeaheadUtils.getIsQueryKey(key("ArrowDown"), true)).toBe(false);
        expect(TypeaheadUtils.getIsQueryKey(key("Escape"), true)).toBe(false);
    });

    it("leaves a shortcut alone", () => {
        expect(TypeaheadUtils.getIsQueryKey(key("a", { ctrlKey: true }), false)).toBe(false);
        expect(TypeaheadUtils.getIsQueryKey(key("a", { metaKey: true }), false)).toBe(false);
    });

    it("takes a space only while something is already being typed", () => {
        expect(TypeaheadUtils.getIsQueryKey(key(" "), false)).toBe(false);
        expect(TypeaheadUtils.getIsQueryKey(key(" "), true)).toBe(true);
    });
});

describe("Typeahead.computeNextIndex", () => {
    it("finds the next item starting with the query, wrapping past the end", () => {
        expect(TypeaheadUtils.computeNextIndex("m", 0, CITIES.length, computeText)).toBe(3);
        expect(TypeaheadUtils.computeNextIndex("l", 3, CITIES.length, computeText)).toBe(0);
    });

    it("matches without regard to case", () => {
        expect(TypeaheadUtils.computeNextIndex("LIS", 0, CITIES.length, computeText)).toBe(1);
    });

    it("holds the current item while a longer query still matches it", () => {
        expect(TypeaheadUtils.computeNextIndex("li", 1, CITIES.length, computeText)).toBe(1);
    });

    it("cycles through the items sharing a letter when that letter is repeated", () => {
        expect(TypeaheadUtils.computeNextIndex("l", 0, CITIES.length, computeText)).toBe(1);
        expect(TypeaheadUtils.computeNextIndex("ll", 1, CITIES.length, computeText)).toBe(2);
        expect(TypeaheadUtils.computeNextIndex("lll", 2, CITIES.length, computeText)).toBe(0);
    });

    it("reports nothing when no item matches, so the caller leaves the highlight alone", () => {
        expect(TypeaheadUtils.computeNextIndex("z", 0, CITIES.length, computeText)).toBeUndefined();
        expect(TypeaheadUtils.computeNextIndex("lo", 0, 0, computeText)).toBeUndefined();
        expect(TypeaheadUtils.computeNextIndex("", 0, CITIES.length, computeText)).toBeUndefined();
    });

    it("starts from the beginning when nothing is highlighted yet", () => {
        expect(TypeaheadUtils.computeNextIndex("ma", -1, CITIES.length, computeText)).toBe(3);
    });
});

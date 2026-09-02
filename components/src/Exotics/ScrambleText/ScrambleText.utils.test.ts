import { describe, expect, it } from "vitest";

import { ScrambleTextUtils } from "./ScrambleText.utils";

const GLYPHS = ["A", "B", "C", "D"];

describe("resolveWeights", () => {
    it("spreads a default run from the first character to the last", () => {
        expect(ScrambleTextUtils.resolveWeights(5, undefined)).toEqual([0, 0.25, 0.5, 0.75, 1]);
    });

    it("gives a lone character the start of the run rather than the end of it", () => {
        expect(ScrambleTextUtils.resolveWeights(1, undefined)).toEqual([0]);
    });

    it("takes the caller's weights where they gave one, and fills where they did not", () => {
        expect(ScrambleTextUtils.resolveWeights(3, [1, 0])).toEqual([1, 0, 1]);
    });

    it("holds the 0..1 guarantee whatever the caller returns", () => {
        expect(ScrambleTextUtils.resolveWeights(3, [-4, 0.5, 12])).toEqual([0, 0.5, 1]);
    });
});

describe("getSettleTimes", () => {
    it("turns a weight into the moment its character stops churning", () => {
        expect(ScrambleTextUtils.getSettleTimes([0, 0.5, 1], 100, 800)).toEqual([100, 500, 900]);
    });

    it("settles everything at once when the run has no duration", () => {
        expect(ScrambleTextUtils.getSettleTimes([0, 0.5, 1], 0, 0)).toEqual([0, 0, 0]);
    });
});

describe("getStartTimes", () => {
    it("starts every position at once when no churn length is given, which is the whole-line churn", () => {
        expect(ScrambleTextUtils.getStartTimes([0, 400, 800], undefined)).toEqual([0, 0, 0]);
    });

    it("gives each position its own churn window ending where it settles", () => {
        expect(ScrambleTextUtils.getStartTimes([0, 400, 800], 100)).toEqual([-100, 300, 700]);
    });

    it("hands the next position a start of exactly where the one before it settled, when the two match", () => {
        const settleTimes = ScrambleTextUtils.getSettleTimes([0, 0.5, 1], 0, 800);

        expect(ScrambleTextUtils.getStartTimes(settleTimes, 400)).toEqual([-400, 0, 400]);
    });
});

describe("pickGlyph", () => {
    it("never offers the character the position is going to settle on", () => {
        const picks = Array.from({ length: 20 }, (_unused, index) =>
            ScrambleTextUtils.pickGlyph(GLYPHS, "B", index / 20),
        );

        expect(picks).not.toContain("B");
    });

    it("reaches every other glyph in the set", () => {
        const picks = new Set(
            Array.from({ length: 30 }, (_unused, index) => ScrambleTextUtils.pickGlyph(GLYPHS, "B", index / 30)),
        );

        expect([...picks].sort()).toEqual(["A", "C", "D"]);
    });

    it("stays inside the set when the roll lands on its far edge", () => {
        expect(GLYPHS).toContain(ScrambleTextUtils.pickGlyph(GLYPHS, "B", 1));
    });

    it("has nothing to offer but the character itself when the set holds only that", () => {
        expect(ScrambleTextUtils.pickGlyph(["B"], "B", 0.5)).toBe("B");
    });
});

describe("getSegments", () => {
    const spell = (text: string) =>
        ScrambleTextUtils.getSegments(Array.from(text))
            .map(
                (segment) =>
                    `${segment.startIndex}:${segment.isWhitespace ? "gap" : "word"}(${segment.characters.join("")})`,
            )
            .join(" ");

    it("groups a word so that nothing can break inside it, and leaves the gap between two on its own", () => {
        expect(spell("ab cd")).toBe("0:word(ab) 2:gap( ) 3:word(cd)");
    });

    it("keeps a run of spaces together rather than making one segment each", () => {
        expect(spell("a  b")).toBe("0:word(a) 1:gap(  ) 3:word(b)");
    });

    it("numbers every character from the start of the text, so a weight still reaches the right one", () => {
        expect(spell(" a b ")).toBe("0:gap( ) 1:word(a) 2:gap( ) 3:word(b) 4:gap( )");
    });

    it("has nothing to say about an empty string", () => {
        expect(ScrambleTextUtils.getSegments([])).toEqual([]);
    });
});

describe("getIsWhitespace", () => {
    it("separates the characters that churn from the gaps that do not", () => {
        expect(["a", " ", "\n", "-", "\t"].map(ScrambleTextUtils.getIsWhitespace)).toEqual([
            false,
            true,
            true,
            false,
            true,
        ]);
    });
});

import { describe, expect, it } from "vitest";

import { ScrambleTextWeights } from "./ScrambleTextWeights.const";

const COUNTS = [1, 2, 7, 12];

describe("ScrambleTextWeights", () => {
    it.each(ScrambleTextWeights.SAMPLE_KEYS)("gives %s one weight per character, inside 0..1", (key) => {
        for (const count of COUNTS) {
            const weights = ScrambleTextWeights.SAMPLE_WEIGHTS[key](count);

            expect(weights).toHaveLength(count);
            expect(weights.every((weight) => weight >= 0 && weight <= 1)).toBe(true);
        }
    });

    it("has nothing to say about an empty text", () => {
        expect(ScrambleTextWeights.SAMPLE_KEYS.map((key) => ScrambleTextWeights.SAMPLE_WEIGHTS[key](0))).toEqual(
            ScrambleTextWeights.SAMPLE_KEYS.map(() => []),
        );
    });
});

import { describe, expect, it } from "vitest";

import { SVGAnimationDefsUtils } from "./SVGAnimationDefs.utils";

describe("SVGAnimationDefsUtils", () => {
    it("unrolls a pattern that follows itself into a pair that follow each other, leaving the rest in place", () => {
        const patterns = [
            { count: 1, nextIndex: 1 },
            { count: 2, nextIndex: 1 },
        ];

        expect(SVGAnimationDefsUtils.unrollSelfReferencingPatterns(patterns)).toEqual([
            { count: 1, nextIndex: 1 },
            { count: 2, nextIndex: 2 },
            { count: 2, nextIndex: 1 },
        ]);
        expect(patterns[1].nextIndex, "the caller's patterns are not modified").toBe(1);
    });

    it("repeats forever with no pattern or an infinite one, and the pattern's count otherwise", () => {
        expect(SVGAnimationDefsUtils.computeRepeatCount(undefined)).toBe("indefinite");
        expect(SVGAnimationDefsUtils.computeRepeatCount({ count: Infinity })).toBe("indefinite");
        expect(SVGAnimationDefsUtils.computeRepeatCount({ count: 3 })).toBe(3);
    });

    it("names two records alike when they play the same animation, and apart when anything differs", () => {
        const identity = (animationDurationMs: number, count: number) =>
            SVGAnimationDefsUtils.computeIdentity({
                animationDurationMs,
                animationIterationPatterns: [{ count, nextIndex: 0 }],
            });

        expect(identity(1000, 1)).toBe(identity(1000, 1));
        expect(identity(1000, 1)).not.toBe(identity(2000, 1));
        expect(identity(1000, 1)).not.toBe(identity(1000, 2));
    });
});

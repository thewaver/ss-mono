import { describe, expect, it } from "vitest";

import { SlotTextReels } from "./SlotTextReels.const";

const WHEEL_COUNTS = [1, 2, 3, 6];

describe("SlotTextReels", () => {
    it("gives every column of every length a whole, non-negative number of turns and a real duration", () => {
        for (const key of SlotTextReels.SAMPLE_KEYS) {
            for (const wheelCount of WHEEL_COUNTS) {
                for (let wheelIndex = 0; wheelIndex < wheelCount; wheelIndex++) {
                    const reel = SlotTextReels.SAMPLE_REELS[key](wheelIndex, wheelCount);

                    expect(Number.isInteger(reel.extraTurns), `${key} turns whole times`).toBe(true);
                    expect(reel.extraTurns, `${key} never turns backward`).toBeGreaterThanOrEqual(0);
                    expect(reel.durationMs, `${key} takes some time`).toBeGreaterThan(0);
                }
            }
        }
    });

    it("stops the columns one after another from the left, the way a slot machine does", () => {
        const durations = [0, 1, 2].map((index) => SlotTextReels.SAMPLE_REELS.leftToRight(index, 3).durationMs);

        expect([...durations].sort((first, second) => first - second)).toEqual(durations);
        expect(new Set(durations).size).toBe(3);
    });
});

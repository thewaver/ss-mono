import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MorphTextUtils } from "./MorphText.utils";

describe("MorphTextUtils.computeFrame", () => {
    it("starts with the outgoing copy whole and the incoming one gone, and ends the other way round", () => {
        const start = MorphTextUtils.computeFrame(0, 8);
        const end = MorphTextUtils.computeFrame(1, 8);

        expect(start.outgoing).toEqual({ blurPx: 0, opacity: 1 });
        expect(start.incoming.opacity).toBe(0);
        expect(end.incoming).toEqual({ blurPx: 0, opacity: 1 });
        expect(end.outgoing.opacity).toBe(0);
    });

    it("blurs both copies across the middle, never past the cap", () => {
        const middle = MorphTextUtils.computeFrame(0.5, 8);

        expect(middle.incoming.blurPx).toBeGreaterThan(0);
        expect(middle.outgoing.blurPx).toBeGreaterThan(0);

        for (let step = 0; step <= 10; step++) {
            const frame = MorphTextUtils.computeFrame(step / 10, 8);

            expect(frame.incoming.blurPx).toBeLessThanOrEqual(8);
            expect(frame.outgoing.blurPx).toBeLessThanOrEqual(8);
        }
    });
});

describe("MorphTextUtils.createMorpher", () => {
    it("puts the text straight on when a morph takes no time, and asking for the same text does nothing", () => {
        const ended: string[] = [];
        const morpher = MorphTextUtils.createMorpher("one", {
            getMorphDurationMs: () => 0,
            onMorphEnd: (text) => ended.push(text),
        });

        morpher.morphTo("one");
        morpher.morphTo("two");

        expect(morpher.get()).toEqual({ current: "two", previous: undefined, progress: 1 });
        expect(ended).toEqual(["two"]);
    });
});

describe("MorphTextUtils.createMorpher on a page that is not painting", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal("requestAnimationFrame", () => 1);
        vi.stubGlobal("cancelAnimationFrame", () => undefined);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it("still ends the morph on time, once", () => {
        const ended: string[] = [];
        const morpher = MorphTextUtils.createMorpher("one", {
            getMorphDurationMs: () => 400,
            onMorphEnd: (text) => ended.push(text),
        });

        morpher.morphTo("two");
        vi.advanceTimersByTime(399);

        expect(ended).toEqual([]);

        vi.advanceTimersByTime(1);

        expect(ended).toEqual(["two"]);
        expect(morpher.get()).toEqual({ current: "two", previous: undefined, progress: 1 });

        vi.advanceTimersByTime(5000);

        expect(ended).toEqual(["two"]);
    });
});

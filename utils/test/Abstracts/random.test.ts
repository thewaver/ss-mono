import { afterEach, describe, expect, it, vi } from "vitest";

import { RandomUtils } from "../../src/Abstracts/random.js";

describe("RandomUtils.get01ValueString", () => {
    afterEach(() => vi.restoreAllMocks());

    it("starts at 0 or 1 depending on the draw", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.6);
        expect(RandomUtils.get01ValueString(3)).toBe("0;1;0;1;0");

        vi.spyOn(Math, "random").mockReturnValue(0.2);
        expect(RandomUtils.get01ValueString(3)).toBe("1;0;1");
    });

    it("always produces at least one flip pair", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);

        expect(RandomUtils.get01ValueString(0)).toBe("1;0;1");
    });

    it("ends on the value it started with, keeping the loop seamless", () => {
        for (let i = 0; i < 50; i++) {
            const values = RandomUtils.get01ValueString(5).split(";");

            expect(values.at(-1)).toBe(values[0]);
        }
    });

    it("only ever contains 0 and 1, alternating", () => {
        for (let i = 0; i < 50; i++) {
            const result = RandomUtils.get01ValueString(5);

            expect(result).toMatch(/^(0;1;|1;0;)+[01]$/);
        }
    });

    it("never grows beyond the requested number of flip pairs", () => {
        for (let i = 0; i < 50; i++) {
            const pairs = (RandomUtils.get01ValueString(4).match(/;/g) ?? []).length / 2;

            expect(pairs).toBeGreaterThanOrEqual(1);
            expect(pairs).toBeLessThanOrEqual(4);
        }
    });
});

describe("RandomUtils.hash", () => {
    it("answers the same for the same numbers, from 0 up to 1", () => {
        expect(RandomUtils.hash(7, 3, 42)).toBe(RandomUtils.hash(7, 3, 42));
        expect(RandomUtils.hash(7, 3, 42)).toBeGreaterThanOrEqual(0);
        expect(RandomUtils.hash(7, 3, 42)).toBeLessThan(1);
    });

    it("spreads evenly, so the share under a chance is about that chance", () => {
        const hashes = Array.from({ length: 10000 }, (_, key) => RandomUtils.hash(7, 0, key));
        const share = hashes.filter((value) => value < 0.3).length / hashes.length;

        expect(Math.abs(share - 0.3)).toBeLessThan(0.02);
    });

    it("changes with the order of the numbers", () => {
        expect(RandomUtils.hash(1, 2)).not.toBe(RandomUtils.hash(2, 1));
    });
});

describe("RandomUtils.createSeeded", () => {
    it("gives the same run for the same seed and a different run for another", () => {
        const first = RandomUtils.createSeeded(5);
        const again = RandomUtils.createSeeded(5);
        const other = RandomUtils.createSeeded(6);
        const run = [first(), first(), first()];

        expect([again(), again(), again()]).toEqual(run);
        expect([other(), other(), other()]).not.toEqual(run);
    });
});

describe("RandomUtils.shuffle", () => {
    it("keeps every value and leaves the list given alone", () => {
        const values = [1, 2, 3, 4, 5];
        const shuffled = RandomUtils.shuffle(values, RandomUtils.createSeeded(1));

        expect([...shuffled].sort()).toEqual(values);
        expect(values).toEqual([1, 2, 3, 4, 5]);
    });

    it("shuffles the same way for the same source", () => {
        expect(RandomUtils.shuffle([1, 2, 3, 4, 5], RandomUtils.createSeeded(9))).toEqual(
            RandomUtils.shuffle([1, 2, 3, 4, 5], RandomUtils.createSeeded(9)),
        );
    });
});

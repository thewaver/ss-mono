import { describe, expect, it } from "vitest";

import { AngleUtils } from "../../src/Abstracts/angle.js";

describe("AngleUtils.RADIANS_PER_DEGREE / DEGREES_PER_RADIAN", () => {
    it("converts the landmark angles", () => {
        expect(180 * AngleUtils.RADIANS_PER_DEGREE).toBeCloseTo(Math.PI, 10);
        expect(90 * AngleUtils.RADIANS_PER_DEGREE).toBeCloseTo(Math.PI / 2, 10);
        expect(Math.PI * AngleUtils.DEGREES_PER_RADIAN).toBeCloseTo(180, 10);
    });

    it("undoes itself when applied both ways", () => {
        expect(AngleUtils.fromRadians(AngleUtils.toRadians(37))).toBeCloseTo(37, 10);
    });
});

describe("AngleUtils.wrap", () => {
    it("leaves a bearing already in range alone", () => {
        expect(AngleUtils.wrap(0)).toBe(0);
        expect(AngleUtils.wrap(-179)).toBe(-179);
        expect(AngleUtils.wrap(180)).toBe(180);
    });

    it("brings a bearing back however many turns it has accumulated", () => {
        expect(AngleUtils.wrap(190)).toBe(-170);
        expect(AngleUtils.wrap(-190)).toBe(170);
        expect(AngleUtils.wrap(360 * 3 + 45)).toBe(45);
        expect(AngleUtils.wrap(-360 * 3 - 45)).toBe(-45);
    });

    it("puts the two ends of the range on the same side, so the form is one form", () => {
        expect(AngleUtils.wrap(-180), "the seam belongs to the positive end").toBe(180);
        expect(AngleUtils.wrap(180)).toBe(180);
    });
});

describe("AngleUtils.getTurn", () => {
    it("takes the shorter way round, which plain subtraction does not", () => {
        expect(AngleUtils.getTurn(350, 10), "twenty degrees clockwise, not three hundred and forty back").toBe(20);
        expect(AngleUtils.getTurn(10, 350)).toBe(-20);
    });

    it("is signed, clockwise being positive", () => {
        expect(AngleUtils.getTurn(0, 90)).toBe(90);
        expect(AngleUtils.getTurn(0, -90)).toBe(-90);
    });

    it("answers a half turn for two bearings facing exactly away from each other", () => {
        expect(AngleUtils.getTurn(0, 180), "there being no shorter way to prefer").toBe(180);
        expect(AngleUtils.getTurn(90, -90)).toBe(180);
    });

    it("does not care how many turns either bearing has accumulated", () => {
        expect(AngleUtils.getTurn(350 + 720, 10 - 360)).toBe(20);
    });
});

describe("AngleUtils.getSeparation", () => {
    it("is the same whichever way round the two are given", () => {
        expect(AngleUtils.getSeparation(350, 10)).toBe(20);
        expect(AngleUtils.getSeparation(10, 350)).toBe(20);
    });

    it("never exceeds a half turn", () => {
        expect(AngleUtils.getSeparation(0, 190)).toBe(170);
        expect(AngleUtils.getSeparation(0, 180)).toBe(180);
    });
});

describe("AngleUtils.add", () => {
    it("advances a bearing and brings it back into range", () => {
        expect(AngleUtils.add(170, 20)).toBe(-170);
        expect(AngleUtils.add(-170, -20)).toBe(170);
    });

    it("undoes a turn when given its opposite", () => {
        expect(AngleUtils.add(AngleUtils.add(45, 200), -200)).toBeCloseTo(45, 10);
    });
});

describe("AngleUtils.lerp", () => {
    it("goes the shorter way round rather than through the middle of the number line", () => {
        expect(AngleUtils.lerp(350, 10, 0.5), "halfway from 350 to 10 is 0, not 180").toBe(0);
    });

    it("lands on each end at each end", () => {
        expect(AngleUtils.lerp(30, 100, 0)).toBe(30);
        expect(AngleUtils.lerp(30, 100, 1)).toBe(100);
    });

    it("carries on past the ends, which is what an overshooting curve needs", () => {
        expect(AngleUtils.lerp(0, 90, 2)).toBe(180);
    });
});

describe("AngleUtils.getMidpoint", () => {
    it("is the bearing between two, the shorter way round", () => {
        expect(AngleUtils.getMidpoint(350, 10)).toBe(0);
        expect(AngleUtils.getMidpoint(0, 90)).toBe(45);
    });
});

describe("AngleUtils.unwarp", () => {
    it("leaves a bearing alone in a square box", () => {
        expect(AngleUtils.unwarp(45, { width: 100, height: 100 })).toBeCloseTo(45, 10);
    });

    it("returns the bearing untouched when the box has no area", () => {
        expect(AngleUtils.unwarp(45, { width: 0, height: 10 })).toBe(45);
        expect(AngleUtils.unwarp(45, { width: 10, height: 0 })).toBe(45);
    });

    it("corrects for a stretched box", () => {
        // Twice as wide as it is tall, so a line that should look like 45 degrees has to
        // be drawn shallower than that in the box's own coordinates.
        expect(AngleUtils.unwarp(45, { width: 200, height: 100 })).toBeCloseTo(26.5651, 3);
    });

    it("keeps results within the one form", () => {
        for (const angle of [-170, -45, 0, 45, 170]) {
            const result = AngleUtils.unwarp(angle, { width: 300, height: 50 });

            expect(result).toBeGreaterThan(-180);
            expect(result).toBeLessThanOrEqual(180);
        }
    });
});

describe("AngleUtils.wrapPositive", () => {
    it("writes an amount of turning without a negative form", () => {
        expect(AngleUtils.wrapPositive(370)).toBe(10);
        expect(AngleUtils.wrapPositive(-10)).toBe(350);
        expect(AngleUtils.wrapPositive(0)).toBe(0);
    });

    it("puts a whole turn at nothing, a sweep all the way round having come back", () => {
        expect(AngleUtils.wrapPositive(360)).toBe(0);
        expect(AngleUtils.wrapPositive(-360)).toBe(0);
    });

    it("differs from wrap only in where the form starts", () => {
        for (const degrees of [-350, -181, -180, -1, 0, 1, 180, 181, 359]) {
            expect(AngleUtils.wrapPositive(degrees) % 360).toBeCloseTo(((AngleUtils.wrap(degrees) % 360) + 360) % 360);
        }
    });
});

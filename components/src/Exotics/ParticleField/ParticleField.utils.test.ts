import { describe, expect, it } from "vitest";

import { ParticleFieldUtils } from "./ParticleField.utils";

const SQUARE = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
];

const NOTCHED = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 5, y: 5 },
    { x: 0, y: 10 },
];

const ROLL_SAMPLE_SIZE = 10000;
const ROLL_TOLERANCE = 0.02;

describe("ParticleFieldUtils", () => {
    it("finds a box's center", () => {
        expect(ParticleFieldUtils.toCenter({ x: 10, y: 20, width: 4, height: 6 })).toEqual({ x: 12, y: 23 });
    });

    it("tells a point inside an outline from one outside it", () => {
        expect(ParticleFieldUtils.isPointInPolygon({ x: 5, y: 5 }, SQUARE)).toBe(true);
        expect(ParticleFieldUtils.isPointInPolygon({ x: 15, y: 5 }, SQUARE)).toBe(false);
    });

    it("leaves the notch of a concave outline outside", () => {
        expect(ParticleFieldUtils.isPointInPolygon({ x: 5, y: 8 }, NOTCHED)).toBe(false);
        expect(ParticleFieldUtils.isPointInPolygon({ x: 1, y: 8 }, NOTCHED)).toBe(true);
    });

    it("treats fewer than three corners as enclosing nothing", () => {
        expect(ParticleFieldUtils.isPointInPolygon({ x: 0, y: 0 }, SQUARE.slice(0, 2))).toBe(false);
    });

    it("spawns the heaviest cell first and the lightest so it finishes with the pass", () => {
        expect(ParticleFieldUtils.computeBatchSpawnMs(1, 2000, 500)).toBe(0);
        expect(ParticleFieldUtils.computeBatchSpawnMs(0, 2000, 500)).toBe(1500);
    });

    it("spawns every cell at the start when a lifetime fills the pass", () => {
        expect(ParticleFieldUtils.computeBatchSpawnMs(0, 500, 800)).toBe(0);
    });

    it("rolls the same way every time it is asked about the same cell in the same pass", () => {
        expect(ParticleFieldUtils.computeRoll(7, 3, 42)).toBe(ParticleFieldUtils.computeRoll(7, 3, 42));
    });

    it("rolls between 0 and 1, and a chance lets through about that share of cells", () => {
        const rolls = Array.from({ length: ROLL_SAMPLE_SIZE }, (_, key) => ParticleFieldUtils.computeRoll(7, 0, key));
        const share = rolls.filter((roll) => roll < 0.3).length / ROLL_SAMPLE_SIZE;

        expect(rolls.every((roll) => roll >= 0 && roll < 1)).toBe(true);
        expect(Math.abs(share - 0.3)).toBeLessThan(ROLL_TOLERANCE);
    });

    it("decides a cell afresh in the next pass", () => {
        const passes = [0, 1].map((pass) =>
            Array.from({ length: ROLL_SAMPLE_SIZE }, (_, key) => ParticleFieldUtils.computeRoll(7, pass, key) < 0.5),
        );
        const agreeing = passes[0].filter((isSpawned, key) => isSpawned === passes[1][key]).length / ROLL_SAMPLE_SIZE;

        expect(Math.abs(agreeing - 0.5)).toBeLessThan(ROLL_TOLERANCE);
    });

    it("holds a particle's life between 0 and 1", () => {
        expect(ParticleFieldUtils.computeLife(50, 100, 200)).toBe(0);
        expect(ParticleFieldUtils.computeLife(200, 100, 200)).toBe(0.5);
        expect(ParticleFieldUtils.computeLife(400, 100, 200)).toBe(1);
        expect(ParticleFieldUtils.computeLife(100, 100, 0)).toBe(1);
    });
});

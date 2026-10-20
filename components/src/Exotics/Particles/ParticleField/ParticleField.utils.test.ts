import { describe, expect, it } from "vitest";

import { ParticleFieldUtils } from "./ParticleField.utils";

const SQUARE = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
];

describe("ParticleFieldUtils", () => {
    it("spawns the heaviest cell first and the lightest so it finishes with the pass", () => {
        expect(ParticleFieldUtils.computeBatchSpawnMs(1, 2000, 500)).toBe(0);
        expect(ParticleFieldUtils.computeBatchSpawnMs(0, 2000, 500)).toBe(1500);
    });

    it("spawns every cell at the start when a lifetime fills the pass", () => {
        expect(ParticleFieldUtils.computeBatchSpawnMs(0, 500, 800)).toBe(0);
    });

    it("holds a particle's life between 0 and 1", () => {
        expect(ParticleFieldUtils.computeLife(50, 100, 200)).toBe(0);
        expect(ParticleFieldUtils.computeLife(200, 100, 200)).toBe(0.5);
        expect(ParticleFieldUtils.computeLife(400, 100, 200)).toBe(1);
        expect(ParticleFieldUtils.computeLife(100, 100, 0)).toBe(1);
    });

    it("keeps to the cells whose centers are inside the contour", () => {
        const cells = ParticleFieldUtils.computeCells({ col: 2, row: 1 }, { width: 20, height: 10 }, [[1]], SQUARE);

        expect(
            cells.map((cell) => cell.pos),
            "only the left cell's center is inside",
        ).toEqual([{ col: 0, row: 0 }]);
        expect(cells[0].weight).toBe(1);
        expect(
            ParticleFieldUtils.computeCells({ col: 2, row: 1 }, { width: 20, height: 10 }, [], undefined),
        ).toHaveLength(2);
    });

    it("shows the same particles each time a point in the pass is revisited, and a list unchanged is the same list", () => {
        const count = { col: 4, row: 4 };
        const cells = ParticleFieldUtils.computeCells(count, { width: 40, height: 40 }, [], undefined);
        const roster = ParticleFieldUtils.createRoster(7);
        const at = (clockMs: number) =>
            roster.refresh({
                count,
                cells,
                clockMs,
                durationMs: 1000,
                lifetimeMs: 300,
                spawnChance: 0.5,
                pass: 0,
                hasEnded: false,
            });

        const first = at(750);

        expect(first.particles.length, "some cells won their roll").toBeGreaterThan(0);
        expect(at(800).particles, "a live particle is kept rather than spawned again").toBe(first.particles);
        expect(at(100).particles, "before the unweighted cells' moment nothing is alive").toEqual([]);
        expect(at(750).particles.map((particle) => particle.cell.pos)).toEqual(
            first.particles.map((particle) => particle.cell.pos),
        );
    });

    it("drops every particle for a grid of another size, and leaves nobody once the passes are done", () => {
        const roster = ParticleFieldUtils.createRoster(7);
        const refresh = (count: { col: number; row: number }, hasEnded = false) =>
            roster.refresh({
                count,
                cells: ParticleFieldUtils.computeCells(count, { width: 40, height: 40 }, [], undefined),
                clockMs: 0,
                durationMs: 1000,
                lifetimeMs: 1000,
                spawnChance: 1,
                pass: 0,
                hasEnded,
            }).particles;

        const small = refresh({ col: 2, row: 2 });
        const large = refresh({ col: 3, row: 3 });

        expect(
            large.some((particle) => small.includes(particle)),
            "nothing is carried across",
        ).toBe(false);
        expect(refresh({ col: 3, row: 3 }, true)).toEqual([]);
    });
});

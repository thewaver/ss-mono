import { describe, expect, it, vi } from "vitest";

import { ParticleSpawnerUtils } from "./ParticleSpawner.utils";

describe("ParticleSpawnerUtils", () => {
    it("rounds a requested count and treats a negative one as none", () => {
        expect(ParticleSpawnerUtils.toParticleCount(2.6)).toBe(3);
        expect(ParticleSpawnerUtils.toParticleCount(-4)).toBe(0);
    });

    it("picks no target when there are none to pick from", () => {
        expect(ParticleSpawnerUtils.pickRandomTarget(0)).toBeUndefined();
    });

    it("picks an index within range", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);

        expect(ParticleSpawnerUtils.pickRandomTarget(4)).toBe(2);

        vi.restoreAllMocks();
    });

    it("measures a box's center relative to another box's own origin", () => {
        const rect = { x: 110, y: 220, width: 20, height: 10 };
        const rootRect = { x: 100, y: 200, width: 0, height: 0 };

        expect(ParticleSpawnerUtils.toRelativeCenter(rect, rootRect)).toEqual({ x: 20, y: 25 });
    });

    it("settles a round's area around the spawner's box, padded by a particle's reach and one block", () => {
        const placement = {
            origin: { x: 50, y: 25 },
            rootSize: { width: 100, height: 50 },
            targets: [],
            modMarkers: [],
            prefersReducedMotion: false,
        };

        expect(ParticleSpawnerUtils.settleArea(placement, { width: 6, height: 8 })).toEqual({
            x: -128,
            y: -128,
            width: 320,
            height: 256,
        });
    });

    it("widens a round's area to take in every target and marker, and skips one not on the page", () => {
        const placement = {
            origin: { x: 50, y: 25 },
            rootSize: { width: 100, height: 50 },
            targets: [{ x: 400, y: 25 }, undefined],
            modMarkers: [{ x: 50, y: -300 }],
            prefersReducedMotion: false,
        };

        expect(ParticleSpawnerUtils.settleArea(placement, { width: 6, height: 8 })).toEqual({
            x: -128,
            y: -384,
            width: 640,
            height: 512,
        });
    });

    it("leaves a round's area to its first particle before anything was measured", () => {
        expect(ParticleSpawnerUtils.settleArea(undefined, { width: 6, height: 8 })).toBeUndefined();
    });

    it("keeps a settled area while a particle stays inside it", () => {
        const placement = {
            origin: { x: 50, y: 25 },
            rootSize: { width: 100, height: 50 },
            targets: [{ x: 400, y: 25 }],
            modMarkers: [],
            prefersReducedMotion: false,
        };
        const size = { width: 6, height: 8 };
        const area = ParticleSpawnerUtils.settleArea(placement, size);
        const direct = { scaleX: 1, scaleY: 1, rotate: 0, opacity: 1, shiftX: 0, shiftY: 0 };

        expect(ParticleSpawnerUtils.growArea(area, { x: 400, y: 25 }, size, direct)).toEqual(area);
    });

    it("writes a centering translate followed by the position", () => {
        const el = { style: {} } as HTMLElement;

        ParticleSpawnerUtils.assignParticlePos(el, { x: 12, y: 34 });

        expect(el.style.transform).toBe("translate(12px, 34px) translate(-50%, -50%)");
    });
});

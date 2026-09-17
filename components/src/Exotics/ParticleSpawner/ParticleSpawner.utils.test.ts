import { describe, expect, it, vi } from "vitest";

import { ParticleSpawnerUtils } from "./ParticleSpawner.utils";

describe("ParticleSpawnerUtils", () => {
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

    it("writes a centering translate followed by the position", () => {
        const el = { style: {} } as HTMLElement;

        ParticleSpawnerUtils.assignParticlePos(el, { x: 12, y: 34 });

        expect(el.style.transform).toBe("translate(12px, 34px) translate(-50%, -50%)");
    });
});

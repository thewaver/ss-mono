import { describe, expect, it } from "vitest";

import { SVGDefsUtils } from "./SVGDefs.utils";

const FRAME_MS = 1000 / 60;

describe("stepSpring", () => {
    it("closes on its target and comes to rest there", () => {
        let position = { x: 0, y: 0 };
        let velocity = { x: 0, y: 0 };

        for (let frame = 0; frame < 600; frame++) {
            const step = SVGDefsUtils.stepSpring(position, velocity, { x: 1, y: 0.5 }, FRAME_MS, 0.1, 0.7);

            position = step.position;
            velocity = step.velocity;
        }

        expect(position.x).toBeCloseTo(1, 3);
        expect(position.y).toBeCloseTo(0.5, 3);
    });

    it("covers the same ground over the same time on a slow screen as on a fast one, near enough", () => {
        const run = (frameMs: number, frames: number) => {
            let position = { x: 0, y: 0 };
            let velocity = { x: 0, y: 0 };

            for (let frame = 0; frame < frames; frame++) {
                const step = SVGDefsUtils.stepSpring(position, velocity, { x: 1, y: 0 }, frameMs, 0.05, 0.6);

                position = step.position;
                velocity = step.velocity;
            }

            return position.x;
        };

        expect(Math.abs(run(FRAME_MS, 60) - run(FRAME_MS * 2, 30))).toBeLessThan(0.15);
    });
});

describe("computeSwarmTarget", () => {
    it("keeps every spot within the wander of the point, each on a path of its own", () => {
        const point = { x: 0.5, y: 0.5 };
        const targets = Array.from({ length: 6 }, (_unused, index) =>
            SVGDefsUtils.computeSwarmTarget(point, index, 6, 1234, 0.2, 3000),
        );

        for (const target of targets) {
            expect(Math.hypot(target.x - point.x, target.y - point.y)).toBeLessThanOrEqual(0.2 + 1e-9);
        }

        expect(new Set(targets.map((target) => `${target.x.toFixed(4)},${target.y.toFixed(4)}`)).size).toBe(6);
    });
});

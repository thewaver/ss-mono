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

describe("computePixelTrailCells", () => {
    it("lays down only the square under the pointer on a first reading", () => {
        expect(SVGDefsUtils.computePixelTrailCells(undefined, { x: 45, y: 12 }, 20)).toEqual([{ row: 0, col: 2 }]);
    });

    it("lays down nothing while the pointer stays inside one square", () => {
        expect(SVGDefsUtils.computePixelTrailCells({ x: 41, y: 1 }, { x: 59, y: 19 }, 20)).toEqual([]);
    });

    it("leaves an unbroken run of neighboring squares across a fast movement", () => {
        const cells = SVGDefsUtils.computePixelTrailCells({ x: 5, y: 5 }, { x: 95, y: 47 }, 20);

        expect(cells.at(-1)).toEqual({ row: 2, col: 4 });

        [{ row: 0, col: 0 }, ...cells].reduce((previous, cell) => {
            expect(Math.abs(cell.row - previous.row) + Math.abs(cell.col - previous.col)).toBe(1);

            return cell;
        });
    });

    it("walks backwards as well as forwards", () => {
        expect(SVGDefsUtils.computePixelTrailCells({ x: 65, y: 10 }, { x: 5, y: 10 }, 20)).toEqual([
            { row: 0, col: 2 },
            { row: 0, col: 1 },
            { row: 0, col: 0 },
        ]);
    });

    it("lays down nothing for a square smaller than a pixel", () => {
        expect(SVGDefsUtils.computePixelTrailCells(undefined, { x: 5, y: 5 }, 0)).toEqual([]);
    });
});

describe("computePixelTrailAlpha", () => {
    it("fades in a straight line from new to gone", () => {
        expect(SVGDefsUtils.computePixelTrailAlpha(0, 500)).toBe(1);
        expect(SVGDefsUtils.computePixelTrailAlpha(250, 500)).toBe(0.5);
        expect(SVGDefsUtils.computePixelTrailAlpha(800, 500)).toBe(0);
        expect(SVGDefsUtils.computePixelTrailAlpha(0, 0)).toBe(0);
    });
});

describe("followChain", () => {
    it("puts the head where it is told and eases every point toward the one ahead", () => {
        const chain = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
        ];
        const next = SVGDefsUtils.followChain(chain, { x: 1, y: 0 }, 0.5);

        expect(next).toEqual([
            { x: 1, y: 0 },
            { x: 0.5, y: 0 },
            { x: 0.25, y: 0 },
        ]);
    });
});

describe("computeTracerColor", () => {
    const colors = { primary: "#ff0000", secondary: "#00ff00", tertiary: "#0000ff", background: "#000000" };

    it("hands the run's colors out in turn while the tracers keep their color", () => {
        expect(
            [0, 1, 2, 3].map((index) =>
                SVGDefsUtils.computeTracerColor(colors, ["primary", "secondary"], index, 4, 0, undefined),
            ),
        ).toEqual(["#ff0000", "#00ff00", "#ff0000", "#00ff00"]);
    });

    it("moves every tracer through the run over time, each from its own place in it", () => {
        const first = SVGDefsUtils.computeTracerColor(colors, ["primary", "secondary", "tertiary"], 0, 3, 0, 3000);
        const second = SVGDefsUtils.computeTracerColor(colors, ["primary", "secondary", "tertiary"], 1, 3, 0, 3000);
        const later = SVGDefsUtils.computeTracerColor(colors, ["primary", "secondary", "tertiary"], 0, 3, 1000, 3000);

        expect(first.toLowerCase()).toBe("#ff0000");
        expect(second.toLowerCase()).toBe("#00ff00");
        expect(later.toLowerCase()).toBe("#00ff00");
    });
});

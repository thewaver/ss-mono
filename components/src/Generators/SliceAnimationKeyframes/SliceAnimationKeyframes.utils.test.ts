import { describe, expect, it } from "vitest";

import { Matrix3dUtils } from "@thewaver/ss-utils";

import type { SliceAnimationFn, SliceStop } from "./SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils as Utils } from "./SliceAnimationKeyframes.utils";

const toDefs = (pos = { col: 0, row: 0 }, size = { width: 100, height: 100 }) => ({
    pos,
    count: { colCount: 4, rowCount: 4 },
    weight: 0.5,
    size,
    origin: { col: 0, row: 0 },
});

const FADE: SliceStop[] = [
    { at: 0, opacity: 0, scaleX: 50 },
    { at: 0.5, opacity: 100 },
    { at: 1, scaleX: 100 },
];

const handWritten: SliceAnimationFn = (timeline) => ({ opacity: timeline * 100 });

describe("SliceAnimationKeyframeUtils.compileStops", () => {
    it("tracks each property only between the stops that name it", () => {
        const compiled = Utils.compileStops(FADE);

        expect(compiled.opacity).toEqual([
            { at: 0, value: 0 },
            { at: 0.5, value: 100 },
        ]);
        expect(compiled.scaleX).toEqual([
            { at: 0, value: 50 },
            { at: 1, value: 100 },
        ]);
        expect(compiled.at).toBeUndefined();
    });
});

describe("SliceAnimationKeyframeUtils.sampleTrack", () => {
    const TRACK = [
        { at: 0.2, value: 10 },
        { at: 0.6, value: 30 },
    ];

    it("holds the first value before the first stop and the last after the last", () => {
        expect(Utils.sampleTrack(TRACK, 0)).toBe(10);
        expect(Utils.sampleTrack(TRACK, 1)).toBe(30);
    });

    it("moves in a straight line between stops", () => {
        expect(Utils.sampleTrack(TRACK, 0.4)).toBeCloseTo(20);
    });

    it("jumps at two stops on the same point rather than dividing by nothing", () => {
        const jump = [
            { at: 0.5, value: 0 },
            { at: 0.5, value: 100 },
        ];

        expect(Utils.sampleTrack(jump, 0.5)).toBe(0);
        expect(Utils.sampleTrack(jump, 0.51)).toBe(100);
    });

    it("never leaves the range its stops cover", () => {
        for (let step = 0; step <= 20; step++) {
            const value = Utils.sampleTrack(TRACK, step * 0.05);

            expect(value).toBeGreaterThanOrEqual(10);
            expect(value).toBeLessThanOrEqual(30);
        }
    });
});

describe("SliceAnimationKeyframeUtils.fromStops", () => {
    it("interpolates every property it was given, rounded for a style", () => {
        const animation = Utils.fromStops(FADE);

        expect(animation(0.25, toDefs())).toEqual({ opacity: 50, scaleX: 62.5 });
        expect(animation(1 / 3, toDefs()).opacity).toBe(66.667);
    });

    it("turns a cell about the point the stops name, which stays where it was", () => {
        const animation = Utils.fromStops([{ at: 0, rotate: 90, originX: 0, originY: 0 }]);
        const size = { width: 100, height: 60 };
        const result = animation(0, toDefs(undefined, size));
        const corner = { x: -size.width * 0.5, y: -size.height * 0.5, z: 0 };
        const turned = Matrix3dUtils.apply(Matrix3dUtils.rotationZ(90), corner);

        expect(turned.x + (Number(result.translateX ?? 0) * size.width) / 100).toBeCloseTo(corner.x, 1);
        expect(turned.y + (Number(result.translateY ?? 0) * size.height) / 100).toBeCloseTo(corner.y, 1);
    });

    it("adds no translation for a cell turned about its own center", () => {
        const result = Utils.fromStops([{ at: 0, rotate: 45, originX: 0.5, originY: 0.5 }])(0, toDefs());

        expect(result.translateX).toBe(0);
        expect(result.translateY).toBe(0);
    });

    it("pushes a cell toward the viewer by its depth, as a share of its larger side", () => {
        const result = Utils.fromStops([{ at: 0, depth: 10 }])(0, toDefs(undefined, { width: 200, height: 50 }));

        expect(result.translateZ).toBe(20);
    });

    it("records what it was built from", () => {
        expect(Utils.getDefinition(Utils.fromStops(FADE))).toEqual({ kind: "stops", stops: FADE });
        expect(Utils.getDefinition(handWritten)).toBeUndefined();
    });
});

describe("SliceAnimationKeyframeUtils.fromZones and resolveStops", () => {
    const inner = Utils.fromStops([{ at: 0, opacity: 10 }]);
    const fallback = Utils.fromStops([{ at: 0, opacity: 90 }]);

    it("lets the first zone a cell is in decide, and the fallback take the rest", () => {
        expect(Utils.fromZones([{ zone: "all", animation: inner }], fallback)(0, toDefs()).opacity).toBe(10);
        expect(Utils.fromZones([], fallback)(0, toDefs()).opacity).toBe(90);
    });

    it("follows zones down to the stops a cell plays", () => {
        const zoned = Utils.fromZones([{ zone: "all", animation: inner }], fallback);

        expect(Utils.resolveStops(zoned, toDefs())).toEqual([{ at: 0, opacity: 10 }]);
        expect(Utils.resolveStops(Utils.fromZones([], fallback), toDefs())).toEqual([{ at: 0, opacity: 90 }]);
    });

    it("resolves nothing once a step on the way was written by hand", () => {
        expect(Utils.resolveStops(handWritten, toDefs())).toBeUndefined();
        expect(Utils.resolveStops(Utils.fromZones([], handWritten), toDefs())).toBeUndefined();
    });
});

describe("SliceAnimationKeyframeUtils.fromSlices", () => {
    it("plays each cell the stops worked out for it", () => {
        const byColumn = [[{ at: 0, opacity: 0 }], [{ at: 0, opacity: 100 }]];
        const animation = Utils.fromSlices((defs) => byColumn[defs.pos.col]);

        expect(animation(0, toDefs({ col: 0, row: 0 })).opacity).toBe(0);
        expect(animation(0, toDefs({ col: 1, row: 0 })).opacity).toBe(100);
        expect(Utils.resolveStops(animation, toDefs({ col: 1, row: 0 }))).toBe(byColumn[1]);
    });
});

describe("SliceAnimationKeyframeUtils.createEnvelope", () => {
    const RISE = Utils.fromStops([
        { at: 0, opacity: 0 },
        { at: 1, opacity: 100 },
    ]);

    it("plays forwards, holds the end, and plays back", () => {
        const envelope = Utils.createEnvelope(RISE, 0.5);

        expect(envelope(0, toDefs()).opacity).toBe(0);
        expect(envelope(0.25, toDefs()).opacity).toBe(100);
        expect(envelope(0.5, toDefs()).opacity).toBe(100);
        expect(envelope(0.75, toDefs()).opacity).toBe(100);
        expect(envelope(1, toDefs()).opacity).toBe(0);
    });

    it("goes straight back with no hold, and holds the end throughout with a whole one", () => {
        expect(Utils.createEnvelope(RISE, 0)(0.5, toDefs()).opacity).toBe(100);
        expect(Utils.createEnvelope(RISE, 0)(0.25, toDefs()).opacity).toBe(50);

        const held = Utils.createEnvelope(RISE, 1);

        for (const timeline of [0, 0.3, 1]) expect(held(timeline, toDefs()).opacity).toBe(100);
    });

    it("plays nothing for a source written by hand", () => {
        expect(Utils.createEnvelope(handWritten, 0.5)(0.5, toDefs())).toEqual({});
    });
});

describe("SliceAnimationKeyframeUtils.computeAnimation", () => {
    const RISE = Utils.fromStops([
        { at: 0, opacity: 0 },
        { at: 1, opacity: 100 },
    ]);

    it("holds a cell at its first frame before its window and at its last after it", () => {
        const window: [number, number, number] = [0.4, 0.5, 0.6];

        expect(Utils.computeAnimation(RISE, window, toDefs(), 0.1).opacity).toBe(0);
        expect(Utils.computeAnimation(RISE, window, toDefs(), 0.5).opacity).toBe(50);
        expect(Utils.computeAnimation(RISE, window, toDefs(), 0.9).opacity).toBe(100);
    });
});

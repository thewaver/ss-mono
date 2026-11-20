import { afterEach, describe, expect, it, vi } from "vitest";

import { SliceAnimationKeyframeUtils } from "../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { SliceAnimationUtils } from "./SliceAnimation.utils";

describe("SliceAnimationUtils.runPasses", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    it("stays stopped when stopped from inside onIterationEnd", () => {
        const frames: FrameRequestCallback[] = [];

        vi.useFakeTimers();
        vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => frames.push(callback));
        vi.stubGlobal("cancelAnimationFrame", () => undefined);

        let progress = 0;
        let iteration = 0;
        let stop = () => {};

        stop = SliceAnimationUtils.runPasses({
            getProgress: () => progress,
            setProgress: (next) => {
                progress = next;
            },
            getCurrentIteration: () => iteration,
            setCurrentIteration: (next) => {
                iteration = next;
            },
            getDurationMs: () => 0,
            getIterationCount: () => 3,
            getIterationDelayMs: () => 0,
            onIterationEnd: () => stop(),
        });

        frames.shift()?.(performance.now());
        vi.runAllTimers();

        expect(frames, "no frame is asked for after the stop").toHaveLength(0);
        expect(iteration, "and no further pass is counted").toBe(0);
    });
});

describe("SliceAnimationUtils.runPasses", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    it("runs as many passes as asked, reporting each, and ends once, before the last is counted", () => {
        const frames: FrameRequestCallback[] = [];
        const events: string[] = [];

        vi.useFakeTimers();
        vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => frames.push(callback));
        vi.stubGlobal("cancelAnimationFrame", () => undefined);

        let progress = 0;
        let iteration = 0;

        SliceAnimationUtils.runPasses({
            getProgress: () => progress,
            setProgress: (next) => {
                progress = next;
            },
            getCurrentIteration: () => iteration,
            setCurrentIteration: (next) => {
                iteration = next;
            },
            getDurationMs: () => 0,
            getIterationCount: () => 3,
            getIterationDelayMs: () => 0,
            onIterationEnd: () => events.push(`pass ${iteration}`),
            onAnimationEnd: () => events.push(`end at ${iteration}`),
        });

        for (let guard = 0; guard < 20 && (frames.length > 0 || vi.getTimerCount() > 0); guard++) {
            frames.shift()?.(performance.now());
            vi.runAllTimers();
        }

        expect(events).toEqual(["pass 0", "pass 1", "pass 2", "end at 2"]);
        expect(iteration).toBe(3);
    });
});

describe("SliceAnimationUtils.assignAnimationProps", () => {
    const createElement = () => {
        const writes: string[] = [];
        const values: Record<string, string> = {};
        const style = new Proxy(values, {
            set: (target, key: string, value: string) => {
                writes.push(key);
                target[key] = value;

                return true;
            },
        });

        return { element: { style } as unknown as HTMLElement, writes, values };
    };

    it("writes the values it is given as transform, filter and opacity", () => {
        const { element, values } = createElement();

        SliceAnimationUtils.assignAnimationProps(element, { opacity: 50, translateX: 10, blur: 2 });

        expect(values.opacity).not.toBe("");
        expect(values.transform).toContain("translateX");
        expect(values.filter).toContain("blur");
    });

    it("writes nothing again for values equal to the last ones", () => {
        const { element, writes } = createElement();

        SliceAnimationUtils.assignAnimationProps(element, { opacity: 50, translateX: 10 });

        const count = writes.length;

        SliceAnimationUtils.assignAnimationProps(element, { opacity: 50, translateX: 10 });

        expect(writes).toHaveLength(count);
    });

    it("rewrites only the property whose text changed", () => {
        const { element, writes } = createElement();

        SliceAnimationUtils.assignAnimationProps(element, { opacity: 50, translateX: 10 });
        writes.length = 0;
        SliceAnimationUtils.assignAnimationProps(element, { opacity: 60, translateX: 10 });

        expect(writes).toEqual(["opacity"]);
    });

    it("stops applying a function that stops being produced", () => {
        const { element, values } = createElement();

        SliceAnimationUtils.assignAnimationProps(element, { opacity: 50, blur: 2 });
        SliceAnimationUtils.assignAnimationProps(element, { opacity: 50 });

        expect(values.filter ?? "").not.toContain("blur");
    });
});

describe("SliceAnimationUtils timing", () => {
    const RISE = SliceAnimationKeyframeUtils.fromStops([
        { at: 0, opacity: 0 },
        { at: 1, opacity: 100 },
    ]);

    const toSlice = (weight: number, col = 0) => ({
        pos: { col, row: 0 },
        count: { colCount: 2, rowCount: 1 },
        weight,
        size: { width: 10, height: 10 },
        origin: { col: 0, row: 0 },
    });

    it("hands every slice the origin and keeps the rest of it", () => {
        const slices = [toSlice(1), toSlice(0, 1)].map(({ origin: _, ...slice }) => slice);
        const withOrigin = SliceAnimationUtils.withOrigin(slices, { col: 1, row: 0 });

        expect(withOrigin.map(({ origin, ...slice }) => ({ origin, slice }))).toEqual(
            slices.map((slice) => ({ origin: { col: 1, row: 0 }, slice })),
        );
    });

    it("clamps a progress outside the loop", () => {
        expect(SliceAnimationUtils.computeTiming(2, 1000, undefined, undefined)).toEqual(
            SliceAnimationUtils.computeTiming(1, 1000, undefined, undefined),
        );
        expect(SliceAnimationUtils.computeTiming(-1, 1000, undefined, undefined)).toEqual(
            SliceAnimationUtils.computeTiming(0, 1000, undefined, undefined),
        );
    });

    it("plays a heavy slice ahead of a light one", () => {
        const timing = SliceAnimationUtils.computeTiming(0.5, 1000, undefined, undefined);
        const heavy = Number(SliceAnimationUtils.computeValues(RISE, toSlice(1), timing).opacity ?? 0);
        const light = Number(SliceAnimationUtils.computeValues(RISE, toSlice(0), timing).opacity ?? 0);

        expect(heavy).toBeGreaterThan(light);
    });

    it("says which way the weights run in the shared window", () => {
        const ascending = SliceAnimationUtils.computeTiming(0.5, 1000, { dir: "asc" }, undefined);
        const descending = SliceAnimationUtils.computeTiming(0.5, 1000, { dir: "desc" }, undefined);

        expect(SliceAnimationUtils.computeWindow(ascending).isDescending).toBe(false);
        expect(SliceAnimationUtils.computeWindow(descending).isDescending).toBe(true);
    });
});

describe("SliceAnimationUtils.resolveTables", () => {
    const toSlice = (col: number) => ({
        pos: { col, row: 0 },
        count: { colCount: 3, rowCount: 1 },
        weight: 0,
        size: { width: 10, height: 10 },
        origin: { col: 0, row: 0 },
    });

    it("lists each distinct table once and points every slice at its own", () => {
        const even = [{ at: 0, opacity: 0 }];
        const odd = [{ at: 0, opacity: 100 }];
        const animation = SliceAnimationKeyframeUtils.fromSlices((defs) => (defs.pos.col % 2 === 0 ? even : odd));
        const resolved = SliceAnimationUtils.resolveTables(animation, [toSlice(0), toSlice(1), toSlice(2)]);

        expect(resolved?.tables).toEqual([even, odd]);
        expect(resolved?.tableIndices).toEqual([0, 1, 0]);
    });

    it("resolves nothing for a sample written by hand", () => {
        expect(SliceAnimationUtils.resolveTables(() => ({}), [toSlice(0)])).toBeUndefined();
    });
});

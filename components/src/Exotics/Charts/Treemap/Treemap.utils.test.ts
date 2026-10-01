import { afterEach, describe, expect, it, vi } from "vitest";

import type { Rect } from "@thewaver/ss-utils";

import type { TreemapNode } from "./Treemap.types";
import { TreemapUtils } from "./Treemap.utils";

const leaf = (value: string, weight: number): TreemapNode<string> => ({ value, weight });

const branch = (value: string, ...children: TreemapNode<string>[]): TreemapNode<string> => ({ value, children });

const SIZE = { width: 400, height: 300 };
const FULL: Rect = { x: 0, y: 0, ...SIZE };

const area = (rect: Rect) => rect.width * rect.height;

const overlaps = (first: Rect, second: Rect) =>
    first.x < second.x + second.width &&
    second.x < first.x + first.width &&
    first.y < second.y + second.height &&
    second.y < first.y + first.height;

const DEEP = leaf("deep", 6);
const INNER = branch("inner", DEEP, leaf("shallow", 2));
const OUTER = branch("outer", INNER, leaf("side", 8));
const ROOT = branch("root", OUTER, leaf("big", 16), leaf("empty", 0));

describe("computeWeights", () => {
    it("gives a branch the total of everything under it and ignores a weight set on it", () => {
        const weights = TreemapUtils.computeWeights({ ...ROOT, weight: 999 });

        expect(weights.get(INNER)).toBe(8);
        expect(weights.get(OUTER)).toBe(16);
        expect([...weights.values()].sort((first, second) => second - first)[0], "the root holds the lot").toBe(32);
    });

    it("reads a missing or negative weight on a leaf as nothing", () => {
        const weights = TreemapUtils.computeWeights(branch("root", { value: "missing" }, leaf("negative", -4)));

        expect([...weights.values()]).toEqual([0, 0, 0]);
    });
});

describe("partition", () => {
    const WEIGHTS = [5, 3, 2, 1, 1];

    it("covers the frame exactly, with every part in proportion to its weight and none overlapping", () => {
        const rects = TreemapUtils.partition(WEIGHTS, FULL);
        const total = WEIGHTS.reduce((sum, weight) => sum + weight, 0);

        rects.forEach((rect, index) => {
            expect(area(rect), `part ${index} takes its share of the area`).toBeCloseTo(
                (area(FULL) * WEIGHTS[index]) / total,
                6,
            );

            rects.slice(index + 1).forEach((other) => expect(overlaps(rect, other)).toBe(false));
        });
    });

    it("cuts across the longer side first, so a wide frame is split into a left and a right", () => {
        const [first, second] = TreemapUtils.partition([1, 1], FULL);

        expect(first).toEqual({ x: 0, y: 0, width: 200, height: 300 });
        expect(second).toEqual({ x: 200, y: 0, width: 200, height: 300 });
    });

    it("gives a single weight the whole frame and no weights nothing", () => {
        expect(TreemapUtils.partition([7], FULL)).toEqual([FULL]);
        expect(TreemapUtils.partition([], FULL)).toEqual([]);
    });
});

describe("computeTiles", () => {
    it("tiles only the children that weigh something, heaviest first", () => {
        const tiles = TreemapUtils.computeTiles(ROOT, TreemapUtils.computeWeights(ROOT), SIZE);

        expect(tiles.map((tile) => tile.node.value)).toEqual(["outer", "big"]);
    });

    it("tiles every level across the whole box, however deep it is", () => {
        const tiles = TreemapUtils.computeTiles(INNER, TreemapUtils.computeWeights(ROOT), SIZE);

        expect(tiles.reduce((sum, tile) => sum + area(tile.rect), 0)).toBeCloseTo(area(FULL), 6);
    });
});

describe("projectRect", () => {
    const TILE: Rect = { x: 100, y: 50, width: 200, height: 150 };

    it("shrinks the full box into a tile and blows the tile back up to the full box", () => {
        expect(TreemapUtils.projectRect(FULL, FULL, TILE)).toEqual(TILE);
        expect(TreemapUtils.projectRect(TILE, TILE, FULL)).toEqual(FULL);
    });

    it("carries a rectangle there and back to where it started", () => {
        const rect: Rect = { x: 40, y: 30, width: 80, height: 60 };
        const there = TreemapUtils.projectRect(rect, FULL, TILE);

        expect(TreemapUtils.projectRect(there, TILE, FULL)).toEqual(rect);
    });

    it("answers the target itself when the source has no area", () => {
        expect(TreemapUtils.projectRect(TILE, { x: 0, y: 0, width: 0, height: 10 }, FULL)).toEqual(FULL);
    });
});

describe("findPath", () => {
    it("lists the root first and the node last, with every branch between", () => {
        expect(TreemapUtils.findPath(ROOT, DEEP)?.map((node) => node.value)).toEqual([
            "root",
            "outer",
            "inner",
            "deep",
        ]);
    });

    it("finds nothing for a node outside the tree", () => {
        expect(TreemapUtils.findPath(ROOT, leaf("stranger", 1))).toBeUndefined();
    });
});

describe("getIsBranch", () => {
    it("is a branch only while one of its children weighs something", () => {
        const weights = TreemapUtils.computeWeights(ROOT);

        expect(TreemapUtils.getIsBranch(OUTER, weights)).toBe(true);
        expect(TreemapUtils.getIsBranch(DEEP, weights)).toBe(false);
        expect(TreemapUtils.getIsBranch(branch("hollow", leaf("empty", 0)), weights)).toBe(false);
    });
});

describe("computeDescendantRect", () => {
    const weights = TreemapUtils.computeWeights(ROOT);

    it("answers a child's own tile", () => {
        const tile = TreemapUtils.computeTiles(ROOT, weights, SIZE).find((candidate) => candidate.node === OUTER)!;

        expect(TreemapUtils.computeDescendantRect([ROOT, OUTER], weights, SIZE)).toEqual(tile.rect);
    });

    it("finds a grandchild inside its parent's tile, in proportion to its weight", () => {
        const outer = TreemapUtils.computeDescendantRect([ROOT, OUTER], weights, SIZE)!;
        const inner = TreemapUtils.computeDescendantRect([ROOT, OUTER, INNER], weights, SIZE)!;

        expect(overlaps(inner, outer) && inner.x >= outer.x && inner.y >= outer.y).toBe(true);
        expect(area(inner), "inner is half of outer by weight").toBeCloseTo(area(outer) * 0.5, 6);
    });

    it("answers the whole box for a path of one", () => {
        expect(TreemapUtils.computeDescendantRect([ROOT], weights, SIZE)).toEqual(FULL);
    });
});

describe("toBox", () => {
    it("rounds the edges rather than the size, so neighbors still meet", () => {
        const first = TreemapUtils.toBox({ x: 0.4, y: 0, width: 10.2, height: 5 });
        const second = TreemapUtils.toBox({ x: 10.6, y: 0, width: 10.2, height: 5 });

        expect(first).toEqual({ left: "0px", top: "0px", width: "11px", height: "5px" });
        expect(parseFloat(first.left) + parseFloat(first.width)).toBe(parseFloat(second.left));
    });
});

describe("resolveBranch", () => {
    const weights = TreemapUtils.computeWeights(ROOT);

    it("keeps a branch of the tree", () => {
        expect(TreemapUtils.resolveBranch(INNER, ROOT, weights)).toBe(INNER);
    });

    it("falls back to the root for a leaf or a node from another tree", () => {
        expect(TreemapUtils.resolveBranch(DEEP, ROOT, weights)).toBe(ROOT);
        expect(TreemapUtils.resolveBranch(branch("stranger", leaf("a", 1)), ROOT, weights)).toBe(ROOT);
    });
});

describe("resolveStop", () => {
    it("keeps a candidate that is still a stop and otherwise takes the first", () => {
        expect(TreemapUtils.resolveStop("b", ["a", "b"])).toBe("b");
        expect(TreemapUtils.resolveStop("c", ["a", "b"])).toBe("a");
        expect(TreemapUtils.resolveStop(undefined, ["a", "b"])).toBe("a");
        expect(TreemapUtils.resolveStop("a", [])).toBeUndefined();
    });
});

describe("findParent", () => {
    it("answers the node one level up, and nothing for the root", () => {
        expect(TreemapUtils.findParent(ROOT, INNER)).toBe(OUTER);
        expect(TreemapUtils.findParent(ROOT, ROOT)).toBeUndefined();
    });
});

describe("computeKeyAction", () => {
    const STOPS = ["a", "b", "c"];

    it("zooms into the stop on an activation key", () => {
        expect(TreemapUtils.computeKeyAction("Enter", "b", STOPS)).toEqual({ kind: "zoom", node: "b" });
        expect(TreemapUtils.computeKeyAction(" ", "b", STOPS)).toEqual({ kind: "zoom", node: "b" });
    });

    it("moves along the stops both ways without wrapping", () => {
        expect(TreemapUtils.computeKeyAction("ArrowRight", "a", STOPS)).toEqual({ kind: "move", node: "b" });
        expect(TreemapUtils.computeKeyAction("ArrowUp", "b", STOPS)).toEqual({ kind: "move", node: "a" });
        expect(TreemapUtils.computeKeyAction("End", "a", STOPS)).toEqual({ kind: "move", node: "c" });
        expect(TreemapUtils.computeKeyAction("ArrowRight", "c", STOPS)).toBeUndefined();
    });

    it("leaves every other key alone", () => {
        expect(TreemapUtils.computeKeyAction("x", "a", STOPS)).toBeUndefined();
    });
});

describe("computeTransition", () => {
    const weights = TreemapUtils.computeWeights(ROOT);

    it("zooms in towards a descendant and out towards an ancestor", () => {
        const inward = TreemapUtils.computeTransition(OUTER, ROOT, weights, SIZE, 100)!;
        const outward = TreemapUtils.computeTransition(ROOT, OUTER, weights, SIZE, 100)!;

        expect(inward.zoom).toBe("in");
        expect(outward.zoom).toBe("out");
        expect(inward.focusRect).toEqual(outward.focusRect);
        expect(inward.leavingTiles.map((tile) => tile.node.value)).toEqual(["outer", "big"]);
    });

    it("draws nothing without time, without a box, or between unrelated branches", () => {
        expect(TreemapUtils.computeTransition(OUTER, ROOT, weights, SIZE, 0)).toBeUndefined();
        expect(TreemapUtils.computeTransition(OUTER, ROOT, weights, { width: 0, height: 0 }, 100)).toBeUndefined();
        expect(
            TreemapUtils.computeTransition(INNER, branch("other", leaf("x", 1)), weights, SIZE, 100),
        ).toBeUndefined();
    });

    it("starts the entering tiles where the leaving ones end, in both directions", () => {
        const inward = TreemapUtils.computeTransition(OUTER, ROOT, weights, SIZE, 100)!;
        const tile: Rect = { x: 10, y: 20, width: 30, height: 40 };

        expect(TreemapUtils.computeEnteringStart(FULL, SIZE, inward)).toEqual(inward.focusRect);
        expect(TreemapUtils.computeLeavingEnd(inward.focusRect, SIZE, inward)).toEqual(FULL);

        const outward = TreemapUtils.computeTransition(ROOT, OUTER, weights, SIZE, 100)!;
        const there = TreemapUtils.computeLeavingEnd(tile, SIZE, outward);

        expect(TreemapUtils.computeEnteringStart(there, SIZE, inward)).toEqual(
            TreemapUtils.projectRect(there, FULL, inward.focusRect),
        );
    });
});

describe("easeZoom", () => {
    it("runs from nothing to all of it, through the middle at the middle", () => {
        expect(TreemapUtils.easeZoom(0)).toBe(0);
        expect(TreemapUtils.easeZoom(0.5)).toBe(0.5);
        expect(TreemapUtils.easeZoom(1)).toBe(1);
        expect(TreemapUtils.easeZoom(0.25)).toBeLessThan(0.25);
    });
});

describe("createZoomClock", () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    const stubFrames = () => {
        const frames = new Map<number, FrameRequestCallback>();

        let next = 0;

        vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
            frames.set(++next, callback);

            return next;
        });
        vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));

        return (now: number) => {
            const pending = [...frames.values()];

            frames.clear();
            pending.forEach((callback) => callback(now));
        };
    };

    it("rests at the end, and jumps there when started with no time", () => {
        const clock = TreemapUtils.createZoomClock();

        expect(clock.get()).toBe(1);

        clock.start(0);
        expect(clock.get()).toBe(1);
    });

    it("runs from the start to the end a frame at a time", () => {
        vi.useFakeTimers();

        const tick = stubFrames();
        const clock = TreemapUtils.createZoomClock();
        const startedAt = performance.now();

        clock.start(100);
        expect(clock.get()).toBe(0);

        tick(startedAt + 50);
        expect(clock.get()).toBeCloseTo(0.5, 1);

        tick(startedAt + 200);
        expect(clock.get()).toBe(1);
    });

    it("settles on its own when no frames come", () => {
        vi.useFakeTimers();
        stubFrames();

        const clock = TreemapUtils.createZoomClock();

        clock.start(100);
        vi.advanceTimersByTime(250);

        expect(clock.get()).toBe(1);
    });

    it("stops where it stands, and can be started again", () => {
        vi.useFakeTimers();

        const tick = stubFrames();
        const clock = TreemapUtils.createZoomClock();

        clock.start(100);
        clock.stop();
        vi.advanceTimersByTime(250);

        expect(clock.get(), "the stop cancelled the timer too").toBe(0);

        clock.start(0);
        tick(performance.now());
        expect(clock.get()).toBe(1);
    });
});

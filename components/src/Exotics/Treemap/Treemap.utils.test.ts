import { describe, expect, it } from "vitest";

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

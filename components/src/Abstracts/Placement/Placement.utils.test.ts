import { describe, expect, it } from "vitest";

import type { PlacementLayout, PlacementRect } from "./Placement.types";
import { PlacementUtils } from "./Placement.utils";

const RING: PlacementLayout = {
    heightRatio: 1,
    pickRule: "angle",
    placements: [
        { left: 0.5, top: 0.1, width: 0.2, height: 0.2 },
        { left: 0.9, top: 0.5, width: 0.2, height: 0.2 },
        { left: 0.5, top: 0.9, width: 0.2, height: 0.2 },
        { left: 0.1, top: 0.5, width: 0.2, height: 0.2 },
    ],
};

const SCATTER: PlacementLayout = {
    heightRatio: 0.5,
    placements: [
        { left: 0.1, top: 0.1, width: 0.1, height: 0.1 },
        { left: 0.9, top: 0.4, width: 0.1, height: 0.1 },
        { left: 0.5, top: 0.25, width: 0.1, height: 0.1 },
    ],
};

describe("toLayoutPoint", () => {
    it("keeps the horizontal share as it is and scales the vertical one by the layout's own height", () => {
        expect(PlacementUtils.toLayoutPoint({ x: 0.25, y: 0.5 }, 0.5)).toEqual({ x: 0.25, y: 0.25 });
    });

    it("leaves a square layout's point untouched, since its height is already one width", () => {
        expect(PlacementUtils.toLayoutPoint({ x: 0.25, y: 0.75 }, 1)).toEqual({ x: 0.25, y: 0.75 });
    });
});

describe("getSpacing", () => {
    it("is the distance between items that follow one another", () => {
        expect(PlacementUtils.getSpacing(RING), "a quarter turn around a ring of radius 0.4").toBeCloseTo(0.5657);
    });

    it("takes the middle distance rather than the average, so one long jump does not drag it", () => {
        const run = {
            heightRatio: 1,
            placements: [
                { left: 0, top: 0, width: 0.1, height: 0.1 },
                { left: 0.1, top: 0, width: 0.1, height: 0.1 },
                { left: 0.2, top: 0, width: 0.1, height: 0.1 },
                { left: 0.9, top: 0, width: 0.1, height: 0.1 },
            ],
        };

        expect(PlacementUtils.getSpacing(run), "two steps of 0.1 and one of 0.7").toBeCloseTo(0.1);
    });

    it("has no spacing to report for one item, so it answers with that item's own width", () => {
        expect(PlacementUtils.getSpacing({ heightRatio: 1, placements: [SCATTER.placements[0]] })).toBe(0.1);
    });

    it("answers nothing for an empty layout rather than reaching into it", () => {
        expect(PlacementUtils.getSpacing({ heightRatio: 1, placements: [] })).toBe(0);
    });
});

describe("getOrigin", () => {
    it("is the middle of the box when the layout names none", () => {
        expect(PlacementUtils.getOrigin(RING)).toEqual({ x: 0.5, y: 0.5 });
        expect(PlacementUtils.getOrigin(SCATTER), "half a width across, half the height down").toEqual({
            x: 0.5,
            y: 0.25,
        });
    });

    it("is whatever the layout named when it named one, which is what a fan hinging off a corner needs", () => {
        expect(PlacementUtils.getOrigin({ ...RING, origin: { x: 0.5, y: 1.4 } })).toEqual({ x: 0.5, y: 1.4 });
    });
});

describe("pickIndex, by angle", () => {
    const pick = (x: number, y: number) => PlacementUtils.pickIndex({ layout: RING, point: { x, y } });

    it("picks the item the pointer is aimed at, not the one it is over", () => {
        expect(pick(0.5, 0.3), "a little way up from the middle is still aimed at the top item").toBe(0);
        expect(pick(0.5, 0.05), "and so is the far side of it").toBe(0);
    });

    it("picks from a gap, which is the whole reason it does not hit-test", () => {
        expect(pick(0.95, 0.05), "up and to the right, between two items and over neither").toBeDefined();
        expect([0, 1], "and it is one of the two it lies between").toContain(pick(0.95, 0.05));
    });

    it("picks from outside the box entirely, since only the direction matters", () => {
        expect(pick(0.5, -3), "far above the menu is still aimed at its top item").toBe(0);
    });

    it("crosses the wrap without noticing it", () => {
        const justBelowLeft = pick(0.05, 0.52);
        const justAboveLeft = pick(0.05, 0.48);

        expect(justBelowLeft, "either side of nine o'clock picks the item at nine o'clock").toBe(3);
        expect(justAboveLeft).toBe(3);
    });

    it("has nothing to pick when the pointer is on the origin itself, because there is no direction", () => {
        expect(pick(0.5, 0.5)).toBeUndefined();
    });

    it("passes over an item sitting on the origin, because it is the one place with no direction to aim at", () => {
        const withCenter: PlacementLayout = {
            ...RING,
            placements: [...RING.placements, { left: 0.5, top: 0.5, width: 0.4, height: 0.4 }],
        };
        const pickWithCenter = (x: number, y: number) =>
            PlacementUtils.pickIndex({ layout: withCenter, point: { x, y } });

        expect(pickWithCenter(0.9, 0.5), "aimed straight at the three o'clock item").toBe(1);
        expect(pickWithCenter(0.7, 0.48), "and just off it, where a center item scoring zero would have won").toBe(1);
    });

    it("skips what it was told is not pickable, rather than picking it and being refused later", () => {
        const picked = PlacementUtils.pickIndex({
            layout: RING,
            point: { x: 0.5, y: 0.1 },
            isPickable: (index) => index !== 0,
        });

        expect(picked, "the top item is out, so the nearest direction that is left wins").not.toBe(0);
        expect(picked).toBeDefined();
    });
});

describe("pickIndex, by nearest", () => {
    const pick = (x: number, y: number) => PlacementUtils.pickIndex({ layout: SCATTER, point: { x, y } });

    it("picks whichever item's center is closest", () => {
        expect(pick(0.12, 0.12)).toBe(0);
        expect(pick(0.85, 0.38)).toBe(1);
        expect(pick(0.48, 0.24)).toBe(2);
    });

    it("still picks something from a point that is over nothing at all", () => {
        expect(pick(0.7, 0.05)).toBeDefined();
    });

    it("is the default, so a layout that says nothing about picking still works", () => {
        expect(SCATTER.pickRule).toBeUndefined();
        expect(pick(0.12, 0.12)).toBe(0);
    });
});

describe("pickIndex, with nothing to pick", () => {
    it("has no answer for a layout with no placements in it", () => {
        expect(
            PlacementUtils.pickIndex({
                layout: { placements: [], heightRatio: 1 },
                point: { x: 0.5, y: 0.5 },
            }),
        ).toBeUndefined();
    });

    it("has no answer when everything has been ruled out", () => {
        expect(
            PlacementUtils.pickIndex({ layout: SCATTER, point: { x: 0.5, y: 0.25 }, isPickable: () => false }),
        ).toBeUndefined();
    });
});

describe("getGapPlacement", () => {
    const box = (left: number, top: number, angle?: number): PlacementRect => ({
        left,
        top,
        width: 0.2,
        height: 0.1,
        angle,
    });

    it("sits midway between the two borders rather than midway between the two centers", () => {
        const gap = PlacementUtils.getGapPlacement([box(0.2, 0.5), box(0.8, 0.5)], 1)!;

        expect(gap.left, "the centers are level, so the gap is level with them").toBeCloseTo(0.5);
        expect(gap.top).toBeCloseTo(0.5);
        expect(gap.width, "and it is as wide as what is left between the two facing edges").toBeCloseTo(0.4);
    });

    it("measures a smaller gap when the neighbors are wider, the centers being unmoved", () => {
        const narrow = PlacementUtils.getGapPlacement([box(0.2, 0.5), box(0.8, 0.5)], 1)!;
        const wide = PlacementUtils.getGapPlacement(
            [
                { ...box(0.2, 0.5), width: 0.4 },
                { ...box(0.8, 0.5), width: 0.4 },
            ],
            1,
        )!;

        expect(wide.left, "the gap is still between the same two centers").toBeCloseTo(narrow.left);
        expect(wide.width, "but there is less room left between them").toBeLessThan(narrow.width);
    });

    it("lies across the line joining the two, so a mark reads as a mark", () => {
        const level = PlacementUtils.getGapPlacement([box(0.2, 0.5), box(0.8, 0.5)], 1)!;
        const stacked = PlacementUtils.getGapPlacement([box(0.5, 0.2), box(0.5, 0.8)], 1)!;

        expect(level.angle, "two side by side are joined along the horizontal").toBeCloseTo(0);
        expect(stacked.angle, "and two stacked along the vertical, a quarter turn from it").toBeCloseTo(90);
    });

    it("reads a turned neighbor's own edge rather than the upright box it would have had", () => {
        const upright = PlacementUtils.getGapPlacement([box(0.2, 0.5), box(0.8, 0.5)], 1)!;
        const turned = PlacementUtils.getGapPlacement([box(0.2, 0.5, 90), box(0.8, 0.5)], 1)!;

        expect(
            turned.width,
            "turned a quarter, the box presents its short side to the join, so more room is left",
        ).toBeGreaterThan(upright.width);
    });

    it("puts the ends outside the outermost item, carrying a straight run straight on", () => {
        const placements = [box(0.2, 0.5), box(0.5, 0.5), box(0.8, 0.5)];
        const before = PlacementUtils.getGapPlacement(placements, 0)!;
        const after = PlacementUtils.getGapPlacement(placements, placements.length)!;

        expect(before.left, "the gap before the first sits on its far side").toBeLessThan(placements[0].left);
        expect(after.left, "and the one after the last on its far side").toBeGreaterThan(
            placements[placements.length - 1].left,
        );
        expect(after.angle, "a run in a line continues along it").toBeCloseTo(before.angle!);
    });

    it("carries a curved run round its own curve, not along its last straight line", () => {
        const ring = [box(0.5, 0.1), box(0.9, 0.5), box(0.5, 0.9), box(0.1, 0.5)];
        const after = PlacementUtils.getGapPlacement(ring, ring.length)!;
        const joinToFirst = PlacementUtils.getAngle(
            { x: ring[3].left, y: ring[3].top },
            { x: ring[0].left, y: ring[0].top },
        );

        expect(after.angle, "the last gap is aimed at where the ring comes back round to").toBeCloseTo(joinToFirst);
        expect(
            Math.abs(after.left - 0.3) + Math.abs(after.top - 0.3),
            "so it sits north-west of the box, between nine o'clock and twelve",
        ).toBeLessThan(0.1);
    });

    it("agrees with itself at the two ends of a closed run, both being the same gap", () => {
        const ring = [box(0.5, 0.1), box(0.9, 0.5), box(0.5, 0.9), box(0.1, 0.5)];
        const before = PlacementUtils.getGapPlacement(ring, 0)!;
        const after = PlacementUtils.getGapPlacement(ring, ring.length)!;

        expect(before.left, "before the first and after the last are one place on a ring").toBeCloseTo(after.left);
        expect(before.top).toBeCloseTo(after.top);
        expect(before.angle).toBeCloseTo(after.angle!);
    });

    it("carries the ends of a run of exactly two straight on, there being no third item to curve through", () => {
        const placements = [box(0.2, 0.5), box(0.8, 0.5)];
        const before = PlacementUtils.getGapPlacement(placements, 0)!;
        const after = PlacementUtils.getGapPlacement(placements, placements.length)!;

        expect(before.left, "the gap before the first sits on its far side").toBeLessThan(placements[0].left);
        expect(after.left, "and the one after the last on its far side").toBeGreaterThan(placements[1].left);
        expect(before.angle, "both lie across the line the two describe").toBeCloseTo(0);
        expect(after.angle).toBeCloseTo(0);
    });

    it("has nothing to say about a list with no direction in it", () => {
        expect(
            PlacementUtils.getGapPlacement([box(0.5, 0.5)], 0),
            "one item leaves no gap to describe",
        ).toBeUndefined();
        expect(
            PlacementUtils.getGapPlacement([box(0.5, 0.5), box(0.5, 0.5)], 1),
            "and two in the same place leave no line to lie across",
        ).toBeUndefined();
    });
});

describe("getSectorPath", () => {
    const SECTOR = { innerRadius: 20, outerRadius: 50, fromAngle: -90, toAngle: -45 };

    const arcCount = (path: string) => path.split(" A ").length - 1;

    it("draws a band out along one edge and back along the other", () => {
        expect(arcCount(PlacementUtils.getSectorPath(SECTOR)), "an annulus needs both of its arcs").toBe(2);
    });

    it("closes a holeless wedge on the center instead of drawing an inner arc", () => {
        expect(
            arcCount(PlacementUtils.getSectorPath({ ...SECTOR, innerRadius: 0 })),
            "with no hole there is no near edge to come back along",
        ).toBe(1);
    });

    it("asks for the long way round only once the wedge is past a half turn", () => {
        const LARGE_ARC_FLAG = / A [\d.]+ [\d.]+ 0 1 /;

        expect(LARGE_ARC_FLAG.test(PlacementUtils.getSectorPath({ ...SECTOR, toAngle: 90 }))).toBe(false);
        expect(LARGE_ARC_FLAG.test(PlacementUtils.getSectorPath({ ...SECTOR, toAngle: 180 }))).toBe(true);
    });
});

describe("getReachDistance", () => {
    const ROW = { reachRule: "horizontal" } as const;
    const COLUMN = { reachRule: "vertical" } as const;
    const RING = { reachRule: "arc", origin: { x: 0.5, y: 0.5 } } as const;

    it("counts only the horizontal gap in a row, so drifting off it does not make the row go quiet", () => {
        expect(PlacementUtils.getReachDistance(ROW, { x: 0.2, y: 0.5 }, { x: 0.3, y: 0.9 })).toBeCloseTo(0.1);
    });

    it("counts only the vertical gap in a column", () => {
        expect(PlacementUtils.getReachDistance(COLUMN, { x: 0.2, y: 0.5 }, { x: 0.9, y: 0.6 })).toBeCloseTo(0.1);
    });

    it("counts the arc swept in a ring, so the far side of it reads as far rather than as one width across", () => {
        const quarterTurn = PlacementUtils.getReachDistance(RING, { x: 0.5, y: 0.1 }, { x: 0.9, y: 0.5 });
        const halfTurn = PlacementUtils.getReachDistance(RING, { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.9 });

        expect(quarterTurn, "a quarter of the way round a circle of radius 0.4").toBeCloseTo(0.4 * (Math.PI * 0.5));
        expect(halfTurn, "and the far side is twice that, not the 0.8 the straight line would say").toBeCloseTo(
            0.4 * Math.PI,
        );
    });

    it("ignores the radius entirely, which is what lets a wheel answer a pointer outside its ring", () => {
        expect(PlacementUtils.getReachDistance(RING, { x: 0.5, y: 0.1 }, { x: 2.5, y: 0.5 })).toBeCloseTo(
            0.4 * (Math.PI * 0.5),
        );
    });

    it("falls back to the straight line where a turn has no meaning", () => {
        expect(PlacementUtils.getReachDistance(RING, { x: 0.5, y: 0.5 }, { x: 0.5, y: 0.9 })).toBeCloseTo(0.4);
        expect(PlacementUtils.getReachDistance({}, { x: 0, y: 0 }, { x: 0.3, y: 0.4 })).toBeCloseTo(0.5);
    });
});

describe("getNearestReach", () => {
    const COLUMN: PlacementLayout = {
        heightRatio: 1,
        reachRule: "vertical",
        placements: [
            { left: 0.5, top: 0.2, width: 0.2, height: 0.1 },
            { left: 0.5, top: 0.4, width: 0.2, height: 0.1 },
            { left: 0.5, top: 0.6, width: 0.2, height: 0.1 },
        ],
    };

    it("is whichever item's own reach distance is smallest, not the straight line to any of them", () => {
        expect(
            PlacementUtils.getNearestReach(COLUMN, { x: 5, y: 0.4 }),
            "closest to the middle item along the axis the column reaches by, however far off to the side",
        ).toBeCloseTo(0);
    });

    it("grows once every item has moved past the point, rather than staying pinned to the first one", () => {
        expect(PlacementUtils.getNearestReach(COLUMN, { x: 0.5, y: 5 })).toBeCloseTo(4.4);
    });

    it("answers with no limit for a layout with nothing in it, there being no item to be near", () => {
        expect(PlacementUtils.getNearestReach({ heightRatio: 1, placements: [] }, { x: 0.5, y: 0.5 })).toBe(Infinity);
    });
});

describe("getRunOverreach", () => {
    const COLUMN: PlacementLayout = {
        heightRatio: 1,
        reachRule: "vertical",
        placements: [
            { left: 0.5, top: 0.2, width: 0.2, height: 0.1 },
            { left: 0.5, top: 0.4, width: 0.2, height: 0.1 },
            { left: 0.5, top: 0.6, width: 0.2, height: 0.1 },
        ],
    };

    it("is nothing anywhere between the run's own two ends, however far off to the side", () => {
        expect(
            PlacementUtils.getRunOverreach(COLUMN, { x: 5, y: 0.4 }),
            "level with the middle item, however far across",
        ).toBe(0);
        expect(
            PlacementUtils.getRunOverreach(COLUMN, { x: 5, y: 0.3 }),
            "in the real gap between the first two items, not past either of them",
        ).toBe(0);
    });

    it("grows past whichever end the point has gone beyond", () => {
        expect(PlacementUtils.getRunOverreach(COLUMN, { x: 0.5, y: 0.05 }), "above the first item").toBeCloseTo(0.15);
        expect(PlacementUtils.getRunOverreach(COLUMN, { x: 0.5, y: 0.7 }), "below the last item").toBeCloseTo(0.1);
    });

    it("reads the same way in a row, along the horizontal axis instead", () => {
        const row: PlacementLayout = {
            heightRatio: 1,
            reachRule: "horizontal",
            placements: [
                { left: 0.2, top: 0.5, width: 0.1, height: 0.1 },
                { left: 0.4, top: 0.5, width: 0.1, height: 0.1 },
            ],
        };

        expect(PlacementUtils.getRunOverreach(row, { x: 0.3, y: 9 }), "between the two, however far up or down").toBe(
            0,
        );
        expect(PlacementUtils.getRunOverreach(row, { x: 0.9, y: 0.5 })).toBeCloseTo(0.5);
    });

    const turning = (spread: number, itemCount: number): PlacementLayout => {
        const radius = 0.4;
        const step = itemCount > 1 ? spread / itemCount : 0;

        return {
            heightRatio: 1,
            reachRule: "arc",
            origin: { x: 0.5, y: 0.5 },
            placements: Array.from({ length: itemCount }, (_unused, index) => {
                const radians = (step * index * Math.PI) / 180;

                return {
                    left: 0.5 + Math.cos(radians) * radius,
                    top: 0.5 + Math.sin(radians) * radius,
                    width: 0.1,
                    height: 0.1,
                };
            }),
        };
    };

    it("is nothing anywhere for a ring that comes back round to itself, there being no end to be past", () => {
        const ring = turning(360, 10);

        expect(PlacementUtils.getRunOverreach(ring, { x: 0.9, y: 0.5 })).toBe(0);
        expect(PlacementUtils.getRunOverreach(ring, { x: 0.1, y: 0.9 })).toBe(0);
    });

    it("grows past whichever end of an open arc the point has turned beyond", () => {
        const arc = turning(90, 4);

        expect(
            PlacementUtils.getRunOverreach(arc, { x: 0.5 + Math.cos(0) * 0.4, y: 0.5 + Math.sin(0) * 0.4 }),
            "exactly on the first item",
        ).toBeCloseTo(0);

        const beyondRadians = (-45 * Math.PI) / 180;
        const beyond = { x: 0.5 + Math.cos(beyondRadians) * 0.4, y: 0.5 + Math.sin(beyondRadians) * 0.4 };

        expect(
            PlacementUtils.getRunOverreach(arc, beyond),
            "a quarter of the way further round than the arc reaches",
        ).toBeCloseTo(0.4 * (Math.PI / 4));
    });

    it("falls back to the nearest item where a layout names no reach rule to have an end at all", () => {
        const scatter: PlacementLayout = {
            heightRatio: 1,
            placements: [{ left: 0.5, top: 0.5, width: 0.1, height: 0.1 }],
        };

        expect(PlacementUtils.getRunOverreach(scatter, { x: 0.5, y: 0.6 })).toBeCloseTo(
            PlacementUtils.getNearestReach(scatter, { x: 0.5, y: 0.6 }),
        );
    });
});

describe("getReachBearing", () => {
    const ROW = { reachRule: "horizontal" } as const;
    const RING = { reachRule: "arc", origin: { x: 0.5, y: 0.5 } } as const;

    it("points along the run and nowhere else, however far off it the other point is", () => {
        expect(PlacementUtils.getReachBearing(ROW, { x: 0.2, y: 0.5 }, { x: 0.4, y: 0.9 })).toEqual({ x: 1, y: 0 });
    });

    it("turns about the pivot rather than heading across it, which is what keeps a ring a ring", () => {
        const bearing = PlacementUtils.getReachBearing(RING, { x: 0.5, y: 0.1 }, { x: 0.9, y: 0.5 });

        expect(bearing.x, "the item is at the top and the other point is round to the right").toBeCloseTo(1);
        expect(bearing.y, "so it travels sideways, not down toward the middle").toBeCloseTo(0);
    });

    it("is the straight line where the arrangement names no rule", () => {
        expect(PlacementUtils.getReachBearing({}, { x: 0, y: 0 }, { x: 0.3, y: 0.4 })).toEqual({ x: 0.6, y: 0.8 });
    });
});

describe("getIsWithinReach", () => {
    const box = (reachRule: "horizontal" | "vertical" | "arc" | "plane") => ({
        heightRatio: 0.25,
        placements: [],
        reachRule,
    });

    it("reads the axis a row throws away as a yes or a no, so the row stops at its own edge", () => {
        expect(PlacementUtils.getIsWithinReach(box("horizontal"), { x: 5, y: 0.1 }), "far off to the side").toBe(true);
        expect(PlacementUtils.getIsWithinReach(box("horizontal"), { x: 0.5, y: 0.4 }), "and below the row").toBe(false);
    });

    it("does the same the other way round for a column", () => {
        expect(PlacementUtils.getIsWithinReach(box("vertical"), { x: 0.5, y: 5 })).toBe(true);
        expect(PlacementUtils.getIsWithinReach(box("vertical"), { x: 1.4, y: 0.1 })).toBe(false);
    });

    it("gates neither axis for a rule that reads both at once, distance already limiting it in every direction", () => {
        expect(PlacementUtils.getIsWithinReach(box("plane"), { x: 0.5, y: 0.1 })).toBe(true);
        expect(PlacementUtils.getIsWithinReach(box("plane"), { x: 9, y: 0.1 }), "far to the side").toBe(true);
        expect(PlacementUtils.getIsWithinReach(box("plane"), { x: 0.5, y: 9 }), "far below").toBe(true);
    });

    it("gates nothing at all for a layout that names no rule either, the same as naming plane", () => {
        expect(PlacementUtils.getIsWithinReach({ heightRatio: 0.25, placements: [] }, { x: 9, y: 9 })).toBe(true);
    });
});

describe("getIsWithinReach, around a pivot", () => {
    const ring = (radius: number) => ({
        heightRatio: 1,
        reachRule: "arc" as const,
        origin: { x: 0.5, y: 0.5 },
        placements: [
            { left: 0.5, top: 0.5 - radius, width: 0.1, height: 0.1 },
            { left: 0.5 + radius, top: 0.5, width: 0.1, height: 0.1 },
            { left: 0.5, top: 0.5 + radius, width: 0.1, height: 0.1 },
        ],
    });

    it("lets the pointer out as far past the items as the pivot is inside them, so the two sides match", () => {
        expect(PlacementUtils.getIsWithinReach(ring(0.3), { x: 0.5, y: 0.5 }), "on the pivot, 0.3 in").toBe(true);
        expect(
            PlacementUtils.getIsWithinReach(ring(0.3), { x: 0.5, y: 1.1 }),
            "0.3 beyond the items, and outside the box besides",
        ).toBe(true);
        expect(PlacementUtils.getIsWithinReach(ring(0.3), { x: 0.5, y: 1.2 }), "further than that").toBe(false);
    });
});

describe("getRunFacing", () => {
    it("is the direction an open run faces", () => {
        const arch = {
            heightRatio: 1,
            origin: { x: 0.5, y: 0.5 },
            placements: [
                { left: 0.1, top: 0.5, width: 0.1, height: 0.1 },
                { left: 0.5, top: 0.1, width: 0.1, height: 0.1 },
                { left: 0.9, top: 0.5, width: 0.1, height: 0.1 },
            ],
        };

        expect(PlacementUtils.getRunFacing(arch), "straight up, which is where an arch opens to").toBeCloseTo(-90);
    });

    it("is nothing in particular for a run that closes, its items canceling out", () => {
        const ring = {
            heightRatio: 1,
            origin: { x: 0.5, y: 0.5 },
            placements: [
                { left: 0.5, top: 0.1, width: 0.1, height: 0.1 },
                { left: 0.9, top: 0.5, width: 0.1, height: 0.1 },
                { left: 0.5, top: 0.9, width: 0.1, height: 0.1 },
                { left: 0.1, top: 0.5, width: 0.1, height: 0.1 },
            ],
        };

        expect(PlacementUtils.getRunFacing(ring)).toBeCloseTo(0);
    });
});

describe("getRunSlack", () => {
    const turning = (spread: number, itemCount: number) => {
        const radius = 0.4;
        const step = itemCount > 1 ? spread / itemCount : 0;

        return {
            heightRatio: 1,
            reachRule: "arc" as const,
            origin: { x: 0.5, y: 0.5 },
            placements: Array.from({ length: itemCount }, (_unused, index) => {
                const radians = ((index * step) / 180) * Math.PI;

                return {
                    left: 0.5 + Math.cos(radians) * radius,
                    top: 0.5 + Math.sin(radians) * radius,
                    width: 0.1,
                    height: 0.1,
                };
            }),
        };
    };

    it("is nothing for a run that comes back round to itself, whatever is asked of it", () => {
        expect(PlacementUtils.getRunSlack(turning(360, 10)), "ten items evenly round a circle").toBeCloseTo(0);
    });

    it("is the rest of the circle for a run that does not close", () => {
        expect(
            PlacementUtils.getRunSlack(turning(180, 10)),
            "half a circle of radius 0.4 taken up, so half its circumference is what is left",
        ).toBeCloseTo(Math.PI * 0.4);
    });

    it("shrinks as the run widens, which is what makes the answer a clamp rather than a switch", () => {
        expect(PlacementUtils.getRunSlack(turning(300, 10))).toBeLessThan(PlacementUtils.getRunSlack(turning(180, 10)));
    });

    it("is unbounded where the run does not turn, a row having the page to grow into", () => {
        expect(PlacementUtils.getRunSlack({ heightRatio: 1, reachRule: "horizontal", placements: [] })).toBe(Infinity);
    });
});

import { describe, expect, it } from "vitest";

import { AngleUtils } from "@thewaver/ss-utils";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { SizedLayout } from "./PlacementLayouts.types";
import { PlacementLayoutUtils } from "./PlacementLayouts.utils";

const ITEM_COUNT = 5;
const ROOT = { itemCount: ITEM_COUNT, path: [], parentExtent: 0 };

const toPixels = (layout: SizedLayout, share: number) => share * layout.extent;

const innerRadiusOf = (layout: SizedLayout) => toPixels(layout, layout.placements[0].sector!.innerRadius);

const outerRadiusOf = (layout: SizedLayout) => toPixels(layout, layout.placements[0].sector!.outerRadius);

const midAngleOf = (layout: SizedLayout, index: number) => {
    const { fromAngle, toAngle } = layout.placements[index].sector!;

    return (fromAngle + toAngle) * 0.5;
};

const spanOf = (layout: SizedLayout, index: number) => {
    const { fromAngle, toAngle } = layout.placements[index].sector!;

    return toAngle - fromAngle;
};

describe("createRing over half a turn", () => {
    it("is the same band, laid symmetrically about straight up", () => {
        const layout = PlacementLayoutUtils.createRing({ spreadDegrees: 180 })(ROOT);
        const last = layout.placements.length - 1;

        expect(
            midAngleOf(layout, 0) + midAngleOf(layout, last),
            "the first and last wedges are mirror images about the top",
        ).toBeCloseTo(2 * -90);
        expect(
            layout.placements[last].sector!.toAngle - layout.placements[0].sector!.fromAngle,
            "and the wedges fill half a turn, less the one gap that has nowhere to wrap to",
        ).toBeCloseTo(180 - 3);
        expect(
            innerRadiusOf(layout),
            "and the hole is the one every band starts from, since the spread is a knob rather than a preset",
        ).toBeCloseTo(innerRadiusOf(PlacementLayoutUtils.ring(ROOT)));
    });

    it("takes the same defs as a full turn, since it is the same band", () => {
        const half = PlacementLayoutUtils.createRing({ spreadDegrees: 180, holeRatio: 0.4 })(ROOT);
        const whole = PlacementLayoutUtils.createRing({ holeRatio: 0.4 })(ROOT);

        expect(innerRadiusOf(half), "the hole is where the same ratio put it on a whole turn").toBeCloseTo(
            innerRadiusOf(whole),
        );
        expect(outerRadiusOf(half), "and so is the outer edge").toBeCloseTo(outerRadiusOf(whole));
    });
});

describe("createArc", () => {
    const CIRCLE = { curveHeightRatio: 1, spreadDegrees: 180, itemWidthRatio: 0.1, itemHeightRatio: 1 };
    const FLAT = { ...CIRCLE, curveHeightRatio: 0.4 };
    const CURVE_WIDTH = 1;

    const stepsOf = (layout: SizedLayout) =>
        layout.placements.slice(1).map((placement, index) => {
            const previous = layout.placements[index];

            return Math.hypot(placement.left - previous.left, placement.top - previous.top);
        });

    const spread = (values: number[]) => Math.max(...values) / Math.min(...values);

    const evenAngleSteps = (radiusX: number, radiusY: number) => {
        const points = Array.from({ length: ITEM_COUNT }, (_unused, index) => {
            const radians = AngleUtils.toRadians(-180 + (180 * index) / (ITEM_COUNT - 1));

            return { x: Math.cos(radians) * radiusX, y: Math.sin(radians) * radiusY };
        });

        return points.slice(1).map((point, index) => Math.hypot(point.x - points[index].x, point.y - points[index].y));
    };

    it("spaces items evenly along the curve, which equal angles only manage on a circle", () => {
        expect(
            spread(stepsOf(PlacementLayoutUtils.createArc(CIRCLE)(ROOT))),
            "a circle comes out exactly even",
        ).toBeCloseTo(1);
        expect(
            spread(evenAngleSteps(CURVE_WIDTH * 0.5, CIRCLE.curveHeightRatio * 0.5)),
            "and equal angles agree with it there, which is why the fault hides until something is stretched",
        ).toBeCloseTo(1);

        const unevenness = (values: number[]) => spread(values) - 1;

        expect(
            unevenness(stepsOf(PlacementLayoutUtils.createArc(FLAT)(ROOT))),
            "flattened, what unevenness is left is a small fraction of what equal angles would leave",
        ).toBeLessThan(unevenness(evenAngleSteps(CURVE_WIDTH * 0.5, FLAT.curveHeightRatio * 0.5)) / 5);
    });

    it("stretches only the curve, never the items on it", () => {
        const round = PlacementLayoutUtils.createArc(CIRCLE)(ROOT);
        const flat = PlacementLayoutUtils.createArc(FLAT)(ROOT);

        expect(flat.heightRatio, "a flattened arc is a shallower box").toBeLessThan(round.heightRatio);
        expect(
            flat.placements[0].height * flat.extent,
            "while an item keeps the size it was given, in pixels",
        ).toBeCloseTo(round.placements[0].height * round.extent);
    });

    it("hands a painter the curve rather than a radius, so a run between two items can follow it", () => {
        const flat = PlacementLayoutUtils.createArc(FLAT)(ROOT);

        expect(flat.radii!.x / flat.radii!.y, "the two axes are as far apart as the arc was asked to be").toBeCloseTo(
            CURVE_WIDTH / FLAT.curveHeightRatio,
        );
    });

    it("centers every run on the facing direction, and stops short of closing the one it is asked to close", () => {
        const open = PlacementLayoutUtils.createArc(CIRCLE)(ROOT);
        const whole = PlacementLayoutUtils.createArc({ ...CIRCLE, spreadDegrees: 360 })(ROOT);
        const beyond = PlacementLayoutUtils.createArc({ ...CIRCLE, spreadDegrees: 450 })(ROOT);

        const seamOf = (layout: SizedLayout) => {
            const first = layout.placements[0];
            const last = layout.placements[ITEM_COUNT - 1];

            return Math.hypot(first.left - last.left, first.top - last.top);
        };

        expect(open.placements[0].left - open.origin!.x, "a run is symmetrical about the facing").toBeCloseTo(
            -(open.placements[ITEM_COUNT - 1].left - open.origin!.x),
        );
        expect(spread(stepsOf(whole)), "asked for a whole turn, the steps it does take are even").toBeCloseTo(1);
        expect(
            seamOf(whole),
            "and the room left between last and first is one more step, so the ring closes without the run having to",
        ).toBeCloseTo(Math.max(...stepsOf(whole)));
        expect(
            whole.placements[0].left,
            "asking for more than a whole turn cannot carry the run any further round",
        ).toBeCloseTo(beyond.placements[0].left);
        expect(whole.placements[0].top).toBeCloseTo(beyond.placements[0].top);
    });
});

describe("createRing", () => {
    it("with nothing asked for, builds the ready-made ring rather than something near it", () => {
        expect(PlacementLayoutUtils.createRing()(ROOT)).toEqual(PlacementLayoutUtils.ring(ROOT));
    });

    it("centers the whole turn on straight up and closes it", () => {
        const layout = PlacementLayoutUtils.createRing()(ROOT);
        const first = layout.placements[0].sector!;
        const last = layout.placements[ITEM_COUNT - 1].sector!;

        expect(
            (first.fromAngle + last.toAngle) * 0.5,
            "the run is laid symmetrically about twelve o'clock, whatever the spread",
        ).toBeCloseTo(-90);
        expect(
            midAngleOf(layout, 1) - midAngleOf(layout, 0),
            "and every item takes an equal share of the whole turn",
        ).toBeCloseTo(360 / ITEM_COUNT);
    });

    it("puts the inner edge of every wedge at the share of the radius the hole was given", () => {
        const layout = PlacementLayoutUtils.createRing({ holeRatio: 0.6 })(ROOT);

        expect(innerRadiusOf(layout) / outerRadiusOf(layout), "the hole ends six tenths of the way out").toBeCloseTo(
            0.6,
        );
    });

    it("spends the rest of the radius on the band, so the box is the outer edge whatever the hole", () => {
        const thin = PlacementLayoutUtils.createRing({ holeRatio: 0.7 })(ROOT);
        const fat = PlacementLayoutUtils.createRing({ holeRatio: 0.3 })(ROOT);

        expect(outerRadiusOf(fat), "the outer edge is the box either way").toBeCloseTo(outerRadiusOf(thin));
        expect(fat.extent, "so the box itself never moves").toBeCloseTo(thin.extent);
        expect(outerRadiusOf(fat) - innerRadiusOf(fat), "and a smaller hole is exactly the wider band").toBeGreaterThan(
            outerRadiusOf(thin) - innerRadiusOf(thin),
        );
    });

    it("spends the gap it is given between one wedge and the next", () => {
        const tight = PlacementLayoutUtils.createRing({ wedgeGapDegrees: 0 })(ROOT);
        const loose = PlacementLayoutUtils.createRing({ wedgeGapDegrees: 10 })(ROOT);

        expect(spanOf(tight, 0), "with no gap the wedges meet, so each one is a whole share of the turn").toBeCloseTo(
            360 / ITEM_COUNT,
        );
        expect(
            spanOf(tight, 0) - spanOf(loose, 0),
            "and a gap comes out of the wedge, not out of the circle",
        ).toBeCloseTo(10);
        expect(
            loose.placements[1].sector!.fromAngle - loose.placements[0].sector!.toAngle,
            "leaving exactly that much bare between neighbors",
        ).toBeCloseTo(10);
    });

    it("centers its run on the facing it is given, whatever the spread", () => {
        const aimed = PlacementLayoutUtils.createRing({ spreadDegrees: 120, facingDegrees: 40 })(ROOT);
        const first = aimed.placements[0].sector!;
        const last = aimed.placements[ITEM_COUNT - 1].sector!;

        expect((first.fromAngle + last.toAngle) * 0.5, "the block's middle lands on the facing").toBeCloseTo(40);
        expect(
            last.toAngle - first.fromAngle,
            "and the run is as wide as the spread, less the gap at each end",
        ).toBeCloseTo(120 - 3);
    });

    it("gives a wedge the arc it asks for and shares what is left among the rest", () => {
        const layout = PlacementLayoutUtils.createRing({ computeItemArcs: () => [180] })(ROOT);
        const wide = spanOf(layout, 0);
        const narrow = spanOf(layout, 1);

        expect(wide, "the one that asked takes half the turn").toBeCloseTo(180 - 3);
        expect(narrow, "and the other four split the rest evenly").toBeCloseTo(180 / (ITEM_COUNT - 1) - 3);
    });
});

describe("createHoneycomb", () => {
    const HEX_HEIGHT_RATIO = 2 / Math.sqrt(3);

    const rowOf = (layout: SizedLayout, index: number) => layout.placements[index].top;

    it("fills a row before starting the next, and steps down by less than a whole cell", () => {
        const layout = PlacementLayoutUtils.createHoneycomb({ perRow: 3, gapRatio: 0 })({ itemCount: 6 });

        expect(rowOf(layout, 0), "the first three share a row").toBeCloseTo(rowOf(layout, 2));
        expect(rowOf(layout, 3), "and the next three sit below them").toBeGreaterThan(rowOf(layout, 0));
        expect(
            rowOf(layout, 3) - rowOf(layout, 0),
            "by three quarters of a cell, which is what makes the rows interlock rather than stack",
        ).toBeCloseTo(layout.placements[0].height * 3 * 0.25);
    });

    it("staggers every other row by half a cell, so a cell sits in the notch between two", () => {
        const layout = PlacementLayoutUtils.createHoneycomb({ perRow: 2 })({ itemCount: 4 });
        const step = layout.placements[1].left - layout.placements[0].left;

        expect(
            layout.placements[2].left - layout.placements[0].left,
            "the second row starts half a step in",
        ).toBeCloseTo(step * 0.5);
    });

    it("keeps its cells regular hexagons, whatever it is asked for", () => {
        const tight = PlacementLayoutUtils.createHoneycomb({ perRow: 2 })({ itemCount: 6 });
        const loose = PlacementLayoutUtils.createHoneycomb({ perRow: 5, gapRatio: 0.5 })({ itemCount: 6 });

        for (const layout of [tight, loose]) {
            expect(
                layout.placements[0].height / layout.placements[0].width,
                "a hexagon across the points is taller than it is across the flats, by a fixed amount",
            ).toBeCloseTo(HEX_HEIGHT_RATIO);
        }

        expect(
            loose.placements[0].width,
            "and a cell is a smaller share of a box that holds more of them",
        ).toBeLessThan(tight.placements[0].width);
    });

    it("picks by nearest rather than by bearing, there being no center to take a bearing from", () => {
        expect(PlacementLayoutUtils.createHoneycomb()({ itemCount: 4 }).pickRule).toBe("nearest");
    });
});

describe("createWhorl", () => {
    const HALF = 0.5;

    const lowestEdge = (placements: PlacementRect[], from: number, count: number) =>
        placements.slice(from, from + count).reduce((low, box) => Math.max(low, box.top + box.height * HALF), 0);

    const highestEdge = (placements: PlacementRect[], from: number, count: number) =>
        placements
            .slice(from, from + count)
            .reduce((high, box) => Math.min(high, box.top - box.height * HALF), Infinity);

    const withinWhorl = (placements: PlacementRect[]) => highestEdge(placements, 1, 2) - lowestEdge(placements, 0, 1);

    const betweenWhorls = (placements: PlacementRect[]) => highestEdge(placements, 3, 1) - lowestEdge(placements, 1, 2);

    it("means the same thing by a step of one wherever the step is taken", () => {
        const { placements } = PlacementLayoutUtils.createWhorl({ itemStepRatio: 1, whorlStepRatio: 1 })({
            itemCount: 6,
        });

        expect(withinWhorl(placements), "a whorl's own items meet edge to edge").toBeCloseTo(0);
        expect(betweenWhorls(placements), "and so do two neighboring whorls").toBeCloseTo(0);
    });

    it("overlaps below one and parts above it, on both steps alike", () => {
        const tight = PlacementLayoutUtils.createWhorl({ itemStepRatio: 0.5, whorlStepRatio: 0.5 })({ itemCount: 6 });
        const loose = PlacementLayoutUtils.createWhorl({ itemStepRatio: 1.5, whorlStepRatio: 1.5 })({ itemCount: 6 });

        expect(withinWhorl(tight.placements), "half a step overlaps within a whorl").toBeLessThan(0);
        expect(betweenWhorls(tight.placements), "and between two of them").toBeLessThan(0);
        expect(withinWhorl(loose.placements), "half a step again parts them within a whorl").toBeGreaterThan(0);
        expect(betweenWhorls(loose.placements), "and between two of them").toBeGreaterThan(0);
    });

    it("carries a taller whorl down rather than into the one below", () => {
        const { placements } = PlacementLayoutUtils.createWhorl({ itemStepRatio: 2, whorlStepRatio: 1 })({
            itemCount: 6,
        });

        expect(
            betweenWhorls(placements),
            "spreading a whorl's own items leaves the step between them alone",
        ).toBeCloseTo(0);
    });
});

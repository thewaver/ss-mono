import { describe, expect, it } from "vitest";

import type { SizedLayout } from "./PlacementLayouts.types";
import { PlacementLayoutUtils } from "./PlacementLayouts.utils";

const ITEM_COUNT = 5;
const ROOT = { itemCount: ITEM_COUNT, path: [], parentExtent: 0 };

const toPixels = (layout: SizedLayout, share: number) => share * layout.extent;

const innerRadiusOf = (layout: SizedLayout) => toPixels(layout, layout.placements[0].sector!.innerRadius);

const outerRadiusOf = (layout: SizedLayout) => toPixels(layout, layout.placements[0].sector!.outerRadius);

const midAngleOf = (layout: SizedLayout, index: number) => {
    const { fromAngle, toAngle } = layout.placements[index].sector!;

    return (fromAngle + toAngle) / 2;
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
        const layout = PlacementLayoutUtils.createRing({ spreadDegrees: 180, holeRadius: 20, bandWidth: 30 })(ROOT);

        expect(innerRadiusOf(layout)).toBeCloseTo(20);
        expect(outerRadiusOf(layout)).toBeCloseTo(50);
    });
});

describe("createArc", () => {
    const CIRCLE = { width: 200, height: 200, spreadDegrees: 180, itemWidth: 20, itemHeight: 20 };
    const FLAT = { ...CIRCLE, height: 80 };

    const stepsOf = (layout: SizedLayout) =>
        layout.placements.slice(1).map((placement, index) => {
            const previous = layout.placements[index];

            return Math.hypot(placement.left - previous.left, placement.top - previous.top);
        });

    const spread = (values: number[]) => Math.max(...values) / Math.min(...values);

    const evenAngleSteps = (radiusX: number, radiusY: number) => {
        const points = Array.from({ length: ITEM_COUNT }, (_unused, index) => {
            const radians = (-180 + (180 * index) / (ITEM_COUNT - 1)) / (180 / Math.PI);

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
            spread(evenAngleSteps(CIRCLE.width / 2, CIRCLE.height / 2)),
            "and equal angles agree with it there, which is why the fault hides until something is stretched",
        ).toBeCloseTo(1);

        const unevenness = (values: number[]) => spread(values) - 1;

        expect(
            unevenness(stepsOf(PlacementLayoutUtils.createArc(FLAT)(ROOT))),
            "flattened, what unevenness is left is a small fraction of what equal angles would leave",
        ).toBeLessThan(unevenness(evenAngleSteps(FLAT.width / 2, FLAT.height / 2)) / 5);
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
            FLAT.width / FLAT.height,
        );
    });

    it("puts the first item straight up when it closes, and centres the run on straight up when it does not", () => {
        const closed = PlacementLayoutUtils.createArc({ ...CIRCLE, spreadDegrees: 360 })(ROOT);
        const open = PlacementLayoutUtils.createArc(CIRCLE)(ROOT);

        expect(closed.placements[0].left, "twelve o'clock is straight above the centre").toBeCloseTo(closed.origin!.x);
        expect(closed.placements[0].top).toBeLessThan(closed.origin!.y);
        expect(open.placements[0].left - open.origin!.x, "and an open run is symmetrical about it").toBeCloseTo(
            -(open.placements[ITEM_COUNT - 1].left - open.origin!.x),
        );
    });
});

describe("createRing", () => {
    it("with nothing asked for, builds the ready-made ring rather than something near it", () => {
        expect(PlacementLayoutUtils.createRing()(ROOT)).toEqual(PlacementLayoutUtils.ring(ROOT));
    });

    it("centres its first wedge straight up and closes the turn", () => {
        const layout = PlacementLayoutUtils.createRing()(ROOT);

        expect(midAngleOf(layout, 0), "the first wedge sits at twelve o'clock").toBeCloseTo(-90);
        expect(
            midAngleOf(layout, 1) - midAngleOf(layout, 0),
            "and every item takes an equal share of the whole turn",
        ).toBeCloseTo(360 / ITEM_COUNT);
    });

    it("puts the inner edge of every wedge where the hole was asked to end", () => {
        const layout = PlacementLayoutUtils.createRing({ holeRadius: 120 })(ROOT);

        expect(innerRadiusOf(layout)).toBeCloseTo(120);
    });

    it("adds the band outside the hole, so a fatter band grows the wheel and never eats the middle", () => {
        const thin = PlacementLayoutUtils.createRing({ holeRadius: 100, bandWidth: 40 })(ROOT);
        const fat = PlacementLayoutUtils.createRing({ holeRadius: 100, bandWidth: 90 })(ROOT);

        expect(innerRadiusOf(fat), "the hole is untouched").toBeCloseTo(innerRadiusOf(thin));
        expect(outerRadiusOf(fat) - outerRadiusOf(thin), "and the whole of the difference lands outside").toBeCloseTo(
            50,
        );
        expect(fat.extent - thin.extent, "which the box has to grow by twice, being a diameter").toBeCloseTo(100);
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
            "leaving exactly that much bare between neighbours",
        ).toBeCloseTo(10);
    });

    it("puts the last item in the hole when one is asked for, and shares the arc among the rest", () => {
        const layout = PlacementLayoutUtils.createRing({ holeRadius: 90, centreRadius: 30, hasCentreItem: true })({
            ...ROOT,
            itemCount: ITEM_COUNT + 1,
        });
        const centre = layout.placements[layout.placements.length - 1];

        expect(centre.sector, "the centre item is not on the arc at all").toBeUndefined();
        expect(toPixels(layout, centre.width), "it is the size the defs asked for").toBeCloseTo(60);
        expect(
            layout.placements.filter((placement) => placement.sector !== undefined),
            "and the wedges are what is left over",
        ).toHaveLength(ITEM_COUNT);
    });

    it("ignores the hole below the root, where the level above is what has to be cleared", () => {
        const parent = PlacementLayoutUtils.createRing({ holeRadius: 40, levelGap: 12 })(ROOT);
        const child = PlacementLayoutUtils.createRing({ holeRadius: 40, levelGap: 12 })({
            itemCount: 3,
            path: [0],
            parentExtent: parent.extent,
            parentPlacement: parent.placements[0],
        });

        expect(innerRadiusOf(child), "a band starts a gap outside the box the level above filled").toBeCloseTo(
            parent.extent / 2 + 12,
        );
    });

    it("aims a deeper band at the wedge that opened it rather than at the whole spread", () => {
        const parent = PlacementLayoutUtils.createRing()(ROOT);
        const opener = parent.placements[2];
        const child = PlacementLayoutUtils.createRing()({
            itemCount: 2,
            path: [2],
            parentExtent: parent.extent,
            parentPlacement: opener,
        });
        const openerAngle = (opener.sector!.fromAngle + opener.sector!.toAngle) / 2;
        const blockAngle = (child.placements[0].sector!.fromAngle + child.placements[1].sector!.toAngle) / 2;

        expect(blockAngle, "the block's middle lands on the middle of its opener").toBeCloseTo(openerAngle, 0);
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
        const layout = PlacementLayoutUtils.createHoneycomb({ perRow: 3, gap: 0 })({ itemCount: 6 });

        expect(rowOf(layout, 0), "the first three share a row").toBeCloseTo(rowOf(layout, 2));
        expect(rowOf(layout, 3), "and the next three sit below them").toBeGreaterThan(rowOf(layout, 0));
        expect(
            rowOf(layout, 3) - rowOf(layout, 0),
            "by three quarters of a cell, which is what makes the rows interlock rather than stack",
        ).toBeCloseTo((layout.placements[0].height * 3) / 4);
    });

    it("staggers every other row by half a cell, so a cell sits in the notch between two", () => {
        const layout = PlacementLayoutUtils.createHoneycomb({ perRow: 2 })({ itemCount: 4 });
        const step = layout.placements[1].left - layout.placements[0].left;

        expect(
            layout.placements[2].left - layout.placements[0].left,
            "the second row starts half a step in",
        ).toBeCloseTo(step / 2);
    });

    it("keeps its cells regular hexagons, whatever width they are asked for", () => {
        const narrow = PlacementLayoutUtils.createHoneycomb({ cellWidth: 40 })({ itemCount: 3 });
        const wide = PlacementLayoutUtils.createHoneycomb({ cellWidth: 90 })({ itemCount: 3 });

        for (const layout of [narrow, wide]) {
            expect(
                layout.placements[0].height / layout.placements[0].width,
                "a hexagon across the points is taller than it is across the flats, by a fixed amount",
            ).toBeCloseTo(HEX_HEIGHT_RATIO);
        }

        expect(wide.extent, "and a wider cell makes a wider box").toBeGreaterThan(narrow.extent);
    });

    it("picks by nearest rather than by bearing, there being no centre to take a bearing from", () => {
        expect(PlacementLayoutUtils.createHoneycomb()({ itemCount: 4 }).pickRule).toBe("nearest");
    });
});

import { describe, expect, it } from "vitest";

import { createHemisphere, createHoneycomb, createRing, ring } from "./PlacementLayouts.const";
import type { SizedLayout } from "./PlacementLayouts.types";

const ITEM_COUNT = 5;
const ROOT = { itemCount: ITEM_COUNT, path: [], parentWidth: 0 };

// every radius the layout works in comes back as a share of the box, so a spec reads it in pixels again
const toPixels = (layout: SizedLayout, share: number) => share * layout.width;

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

describe("createHemisphere", () => {
    it("is the same band over half a turn, laid symmetrically about straight up", () => {
        const layout = createHemisphere()(ROOT);
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
            "and it starts from a wider hole than a ring does, since half a turn leaves each wedge half the angle",
        ).toBeGreaterThan(innerRadiusOf(ring(ROOT)));
    });

    it("takes the same defs as a ring, since it is the same band", () => {
        const layout = createHemisphere({ holeRadiusPx: 20, bandWidthPx: 30 })(ROOT);

        expect(innerRadiusOf(layout)).toBeCloseTo(20);
        expect(outerRadiusOf(layout)).toBeCloseTo(50);
    });
});

describe("arc fit", () => {
    /**
     * A band round a whole turn fills the square it is given, so there is nothing to snap and both fits
     * agree. Half a turn draws in the top half only, and what the two fits disagree about is whether the
     * empty half is reserved — which matters the moment an arc sits in a page's flow rather than floating
     * over it as a popup.
     */
    it("reserves the whole turn by default and snaps to what is drawn when asked", () => {
        const reserved = createHemisphere()(ROOT);
        const snapped = createHemisphere({ fit: "content" })(ROOT);

        expect(reserved.heightRatio, "a reserved arc is as tall as it is wide, drawn or not").toBeCloseTo(1);
        expect(
            snapped.heightRatio * 2,
            "a snapped half turn keeps the half it draws in and gives back the other",
        ).toBeCloseTo(reserved.heightRatio);
        expect(snapped.width, "the width is untouched, a half turn being as wide as a whole one").toBeCloseTo(
            reserved.width,
        );
    });

    it("gives a whole turn back nothing in height, there being no unused half to reclaim", () => {
        const reserved = createRing()(ROOT);
        const snapped = createRing({ fit: "content" })(ROOT);

        expect(snapped.heightRatio * snapped.width, "a ring is as tall as the band is across").toBeCloseTo(
            reserved.width,
        );
        expect(snapped.width, "and no narrower, since a label may reach past the rim it names").toBeGreaterThanOrEqual(
            reserved.width,
        );
    });

    /**
     * Snapping moves the centre of the circle away from the middle of the box, so a wedge drawn about the
     * middle would be wrong. The sector carries the point it turns about for exactly that reason, and this
     * asks whether the two fits report different ones rather than what either of them is.
     */
    it("tells a painter where the circle went, since a snapped box no longer has it in the middle", () => {
        const reserved = createHemisphere()(ROOT);
        const snapped = createHemisphere({ fit: "content" })(ROOT);

        expect(
            snapped.origin!.y,
            "both measure the centre from the same edge in the same units, so the number is the same",
        ).toBeCloseTo(reserved.origin!.y);
        expect(
            snapped.origin!.y / snapped.heightRatio,
            "so as a share of the box's own height the centre has moved down",
        ).toBeGreaterThan(reserved.origin!.y / reserved.heightRatio);
        expect(snapped.placements[0].sector!.origin, "and the sector says the same, for a painter").toEqual(
            snapped.origin,
        );
    });
});

describe("createRing", () => {
    it("with nothing asked for, builds the ready-made ring rather than something near it", () => {
        expect(createRing()(ROOT)).toEqual(ring(ROOT));
    });

    it("centres its first wedge straight up and closes the turn", () => {
        const layout = createRing()(ROOT);

        expect(midAngleOf(layout, 0), "the first wedge sits at twelve o'clock").toBeCloseTo(-90);
        expect(
            midAngleOf(layout, 1) - midAngleOf(layout, 0),
            "and every item takes an equal share of the whole turn",
        ).toBeCloseTo(360 / ITEM_COUNT);
    });

    it("puts the inner edge of every wedge where the hole was asked to end", () => {
        const layout = createRing({ holeRadiusPx: 120 })(ROOT);

        expect(innerRadiusOf(layout)).toBeCloseTo(120);
    });

    it("adds the band outside the hole, so a fatter band grows the wheel and never eats the middle", () => {
        const thin = createRing({ holeRadiusPx: 100, bandWidthPx: 40 })(ROOT);
        const fat = createRing({ holeRadiusPx: 100, bandWidthPx: 90 })(ROOT);

        expect(innerRadiusOf(fat), "the hole is untouched").toBeCloseTo(innerRadiusOf(thin));
        expect(outerRadiusOf(fat) - outerRadiusOf(thin), "and the whole of the difference lands outside").toBeCloseTo(
            50,
        );
        expect(fat.width - thin.width, "which the box has to grow by twice, being a diameter").toBeCloseTo(100);
    });

    it("spends the gap it is given between one wedge and the next", () => {
        const tight = createRing({ wedgeGapDegrees: 0 })(ROOT);
        const loose = createRing({ wedgeGapDegrees: 10 })(ROOT);

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
        const layout = createRing({ holeRadiusPx: 90, centreRadiusPx: 30, hasCentreItem: true })({
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
        const parent = createRing({ holeRadiusPx: 40, levelGapPx: 12 })(ROOT);
        const child = createRing({ holeRadiusPx: 40, levelGapPx: 12 })({
            itemCount: 3,
            path: [0],
            parentWidth: parent.width,
            parentPlacement: parent.placements[0],
        });

        expect(innerRadiusOf(child), "a band starts a gap outside the box the level above filled").toBeCloseTo(
            parent.width / 2 + 12,
        );
    });

    it("aims a deeper band at the wedge that opened it rather than at the whole spread", () => {
        const parent = createRing()(ROOT);
        const opener = parent.placements[2];
        const child = createRing()({
            itemCount: 2,
            path: [2],
            parentWidth: parent.width,
            parentPlacement: opener,
        });
        const openerAngle = (opener.sector!.fromAngle + opener.sector!.toAngle) / 2;
        const blockAngle = (child.placements[0].sector!.fromAngle + child.placements[1].sector!.toAngle) / 2;

        expect(blockAngle, "the block's middle lands on the middle of its opener").toBeCloseTo(openerAngle, 0);
    });

    it("gives a wedge the arc it asks for and shares what is left among the rest", () => {
        const layout = createRing({ computeItemArcs: () => [180] })(ROOT);
        const wide = spanOf(layout, 0);
        const narrow = spanOf(layout, 1);

        expect(wide, "the one that asked takes half the turn").toBeCloseTo(180 - 3);
        expect(narrow, "and the other four split the rest evenly").toBeCloseTo(180 / (ITEM_COUNT - 1) - 3);
    });
});

describe("createHoneycomb", () => {
    /**
     * The first shipped layout with no angle in it, which is what makes it worth testing: everything the
     * others produce is a radius and a bearing, and this one is a grid, so it is the check that the
     * vocabulary a placement is written in is not secretly polar.
     */
    const HEX_HEIGHT_RATIO = 2 / Math.sqrt(3);

    const rowOf = (layout: SizedLayout, index: number) => layout.placements[index].top;

    it("fills a row before starting the next, and steps down by less than a whole cell", () => {
        const layout = createHoneycomb({ perRow: 3, gapPx: 0 })({ itemCount: 6 });

        expect(rowOf(layout, 0), "the first three share a row").toBeCloseTo(rowOf(layout, 2));
        expect(rowOf(layout, 3), "and the next three sit below them").toBeGreaterThan(rowOf(layout, 0));
        expect(
            rowOf(layout, 3) - rowOf(layout, 0),
            "by three quarters of a cell, which is what makes the rows interlock rather than stack",
        ).toBeCloseTo((layout.placements[0].height * 3) / 4);
    });

    it("staggers every other row by half a cell, so a cell sits in the notch between two", () => {
        const layout = createHoneycomb({ perRow: 2 })({ itemCount: 4 });
        const step = layout.placements[1].left - layout.placements[0].left;

        expect(
            layout.placements[2].left - layout.placements[0].left,
            "the second row starts half a step in",
        ).toBeCloseTo(step / 2);
    });

    it("keeps its cells regular hexagons, whatever width they are asked for", () => {
        const narrow = createHoneycomb({ cellWidthPx: 40 })({ itemCount: 3 });
        const wide = createHoneycomb({ cellWidthPx: 90 })({ itemCount: 3 });

        for (const layout of [narrow, wide]) {
            expect(
                layout.placements[0].height / layout.placements[0].width,
                "a hexagon across the points is taller than it is across the flats, by a fixed amount",
            ).toBeCloseTo(HEX_HEIGHT_RATIO);
        }

        expect(wide.width, "and a wider cell makes a wider box").toBeGreaterThan(narrow.width);
    });

    it("picks by nearest rather than by bearing, there being no centre to take a bearing from", () => {
        expect(createHoneycomb()({ itemCount: 4 }).pickRule).toBe("nearest");
    });
});

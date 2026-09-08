import { describe, expect, it } from "vitest";

import type { PlacementLayout } from "../../../Abstracts/Placement/Placement.types";
import { createHemisphere, createRing, ring } from "./MenuLayouts.const";

const ITEM_COUNT = 5;
const ROOT = { itemCount: ITEM_COUNT, path: [], parentWidth: 0 };

// every radius the layout works in comes back as a share of the box, so a spec reads it in pixels again
const toPixels = (layout: PlacementLayout, share: number) => share * layout.width;

const innerRadiusOf = (layout: PlacementLayout) => toPixels(layout, layout.placements[0].sector!.innerRadius);

const outerRadiusOf = (layout: PlacementLayout) => toPixels(layout, layout.placements[0].sector!.outerRadius);

const midAngleOf = (layout: PlacementLayout, index: number) => {
    const { fromAngle, toAngle } = layout.placements[index].sector!;

    return (fromAngle + toAngle) / 2;
};

const spanOf = (layout: PlacementLayout, index: number) => {
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

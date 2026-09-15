import { describe, expect, it } from "vitest";

import type { PlacementRect } from "../../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../../Abstracts/Placement/Placement.utils";
import type { ProximityArrangement } from "../../../Abstracts/Proximity/Proximity.types";
import { ProximityUtils } from "../../../Abstracts/Proximity/Proximity.utils";
import { PlacementLayoutUtils } from "../../Placement/Layouts/PlacementLayouts.utils";
import { ProximityEffectUtils } from "./ProximityEffects.utils";

const ROW_TOP = 0.1;
const ITEM_WIDTH = 0.2;

const itemAt = (left: number): PlacementRect => ({ left, top: ROW_TOP, width: ITEM_WIDTH, height: ITEM_WIDTH });

const UNDER = itemAt(0.5);
const BESIDE = itemAt(0.2);
const AWAY = itemAt(2);

const POINTER = { x: 0.5, y: ROW_TOP };
const PERCENT_TO_SHARE = 0.01;
const STRAIGHT_ANGLE = 180;
const FULL_TURN = 360;

const RUN: ProximityArrangement = { spacing: 0.3, radius: 0, slack: Infinity };

const defsFor = (placement: PlacementRect, prefersReducedMotion = false) =>
    ProximityUtils.toEffectDefs(placement, POINTER, RUN, prefersReducedMotion);

const toNumbers = (value: number | number[] | undefined) => (Array.isArray(value) ? value : [value ?? 0]);

describe("swell", () => {
    const swell = ProximityEffectUtils.createSwell();

    it("grows the item the pointer is on, grows its neighbor less, and leaves a distant one alone", () => {
        const [under] = toNumbers(swell(defsFor(UNDER)).scale);
        const [beside] = toNumbers(swell(defsFor(BESIDE)).scale);
        const [away] = toNumbers(swell(defsFor(AWAY)).scale);

        expect(under).toBeGreaterThan(beside);
        expect(beside).toBeGreaterThan(away);
        expect(away, "a hundred percent is the size it was laid out at").toBe(100);
    });

    it("pushes a neighbor away from the pointer rather than toward it", () => {
        const [across] = toNumbers(swell(defsFor(BESIDE)).translate);

        expect(across, "the pointer is to its right, so it gives way to the left").toBeLessThan(0);
    });

    it("leaves the item under the pointer where it is, since nothing between them has grown", () => {
        expect(toNumbers(swell(defsFor(UNDER)).translate)).toEqual([0, 0]);
    });

    it("answers with brightness instead of size when motion is to be reduced", () => {
        const reduced = swell(defsFor(UNDER, true));

        expect(reduced.scale, "nothing changes size").toBeUndefined();
        expect(reduced.translate, "and nothing moves").toBeUndefined();
        expect(reduced.brightness, "the same curve arrives on a channel that is not motion").toBeGreaterThan(100);
    });
});

describe("swell, around a pivot", () => {
    const ON_RING = { left: 0.5, top: 0.2, width: 0.16, height: 0.16 };
    const ORIGIN = { x: 0.5, y: 0.5 };

    it("gives way around the arrangement rather than across it, so a ring spreads instead of buckling", () => {
        const defs = ProximityUtils.toEffectDefs(
            ON_RING,
            { x: 0.7, y: 0.24 },
            { spacing: 0.2, radius: 0.3, reachRule: "arc", origin: ORIGIN, slack: 1 },
            false,
        );
        const [along, across] = ProximityEffectUtils.swell(defs).translate as number[];
        const moved = {
            x: ON_RING.left + along * PERCENT_TO_SHARE * ON_RING.width,
            y: ON_RING.top + across * PERCENT_TO_SHARE * ON_RING.height,
        };

        expect(along, "the pointer is round to the right, so this item slides left along the ring").toBeLessThan(0);
        expect(
            Math.hypot(moved.x - ORIGIN.x, moved.y - ORIGIN.y),
            "and lands back on the ring rather than inside it, the travel being an arc rather than a tangent",
        ).toBeCloseTo(Math.hypot(ON_RING.left - ORIGIN.x, ON_RING.top - ORIGIN.y));
    });

    it("does not push at all on a run with no room left, there being nowhere on a loop to push into", () => {
        const defs = ProximityUtils.toEffectDefs(
            ON_RING,
            { x: 0.7, y: 0.24 },
            { spacing: 0.2, radius: 0.3, reachRule: "arc", origin: ORIGIN, slack: 0 },
            false,
        );
        const swollen = ProximityEffectUtils.swell(defs);

        expect(swollen.translate, "nothing moves").toBeUndefined();
        expect(swollen.scale, "and the growing is untouched").toBeDefined();
    });

    it("is the straight line to the pointer again where the arrangement names no pivot", () => {
        const defs = ProximityUtils.toEffectDefs(
            ON_RING,
            { x: 0.7, y: 0.24 },
            { spacing: 0.2, radius: 0, slack: Infinity },
            false,
        );
        const [, across] = ProximityEffectUtils.swell(defs).translate as number[];

        expect(across, "the pointer is a little below, so the push has some upward in it").not.toBeCloseTo(0);
    });
});

describe("lift", () => {
    it("draws an item toward the pointer, and away from it when the shift is negative", () => {
        const [toward] = toNumbers(ProximityEffectUtils.createLift({ shiftRatio: 0.25 })(defsFor(BESIDE)).translate);
        const [away] = toNumbers(ProximityEffectUtils.createLift({ shiftRatio: -0.25 })(defsFor(BESIDE)).translate);

        expect(toward, "the pointer is to its right, so it leans right").toBeGreaterThan(0);
        expect(away).toBe(-toward);
    });

    it("answers with nothing at all when motion is to be reduced, movement being the whole of it", () => {
        expect(ProximityEffectUtils.lift(defsFor(BESIDE, true))).toEqual({});
    });
});

describe("glow", () => {
    it("brightens what is near and leaves what is far as it was", () => {
        expect(ProximityEffectUtils.glow(defsFor(UNDER)).brightness).toBeGreaterThan(100);
        expect(ProximityEffectUtils.glow(defsFor(AWAY)).brightness).toBe(100);
    });

    it("answers the same when motion is to be reduced, since a change of brightness is not motion", () => {
        expect(ProximityEffectUtils.glow(defsFor(UNDER, true))).toEqual(ProximityEffectUtils.glow(defsFor(UNDER)));
    });
});

describe("fade", () => {
    it("dims and blurs what is far from the pointer, and does neither to what is under it", () => {
        expect(ProximityEffectUtils.fade(defsFor(AWAY)).opacity).toBeLessThan(100);
        expect(ProximityEffectUtils.fade(defsFor(AWAY)).blur).toBeGreaterThan(0);
        expect(ProximityEffectUtils.fade(defsFor(UNDER)).opacity).toBe(100);
        expect(ProximityEffectUtils.fade(defsFor(UNDER)).blur).toBe(0);
    });

    it("keeps the dimming and drops the blur when motion is to be reduced", () => {
        const reduced = ProximityEffectUtils.fade(defsFor(AWAY, true));

        expect(reduced.opacity, "dimming is not motion, so it stays").toBeLessThan(100);
        expect(reduced.blur, "blurring is, under the erratum to success criterion 2.3.3").toBeUndefined();
    });
});

describe("swell, at the far end of an open arc", () => {
    const ARCH = PlacementLayoutUtils.createArc()({ itemCount: 6 });
    const RUN = ProximityUtils.toArrangement(ARCH);
    const ORIGIN = PlacementUtils.getOrigin(ARCH);

    const unwrap = (angle: number) => ((angle - (RUN.facing ?? 0) + STRAIGHT_ANGLE * 3) % FULL_TURN) - STRAIGHT_ANGLE;

    const toMovedBearing = (index: number, pointer: { x: number; y: number }) => {
        const placement = ARCH.placements[index];
        const [along, across] = ProximityEffectUtils.swell(ProximityUtils.toEffectDefs(placement, pointer, RUN, false))
            .translate as number[];
        const moved = {
            x: placement.left + along * PERCENT_TO_SHARE * placement.width,
            y: placement.top + across * PERCENT_TO_SHARE * placement.height,
        };

        return unwrap(PlacementUtils.getAngle(ORIGIN, moved));
    };

    const toRestingBearing = (index: number) =>
        unwrap(PlacementUtils.getAngle(ORIGIN, PlacementUtils.getCenter(ARCH.placements[index])));

    it("keeps the last two in the order they were laid out in, rather than sending one into the other", () => {
        const pointer = PlacementUtils.getCenter(ARCH.placements[0]);
        const resting = Math.sign(toRestingBearing(5) - toRestingBearing(4));

        expect(
            Math.sign(toMovedBearing(5, pointer) - toMovedBearing(4, pointer)),
            "the far item is exactly half a turn from the pointer, which is where the way round is a coin toss",
        ).toBe(resting);
    });

    it("and the first two, the same thing read from the other end", () => {
        const pointer = PlacementUtils.getCenter(ARCH.placements[5]);
        const resting = Math.sign(toRestingBearing(1) - toRestingBearing(0));

        expect(Math.sign(toMovedBearing(1, pointer) - toMovedBearing(0, pointer))).toBe(resting);
    });
});

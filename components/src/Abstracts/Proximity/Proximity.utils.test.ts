import { describe, expect, it } from "vitest";

import type { PlacementRect } from "../Placement/Placement.types";
import type { ProximityArrangement } from "./Proximity.types";
import { ProximityUtils } from "./Proximity.utils";

const ITEM: PlacementRect = { leftShare: 0.5, topShare: 0.25, widthShare: 0.2, heightShare: 0.1 };

const TILTED: PlacementRect = { ...ITEM, angle: 90 };

describe("getFalloff", () => {
    const RUN: ProximityArrangement = { spacing: 0.3, radius: 0, slack: Infinity };

    const atDistance = (distance: number) =>
        ProximityUtils.toEffectDefs(ITEM, { x: ITEM.leftShare + distance, y: ITEM.topShare }, RUN, false);

    it("is everything under the pointer and nothing at the reach", () => {
        expect(ProximityUtils.getFalloff(atDistance(0), 0.5)).toBe(1);
        expect(ProximityUtils.getFalloff(atDistance(0.5), 0.5)).toBe(0);
    });

    it("stays at nothing beyond the reach rather than turning negative", () => {
        expect(ProximityUtils.getFalloff(atDistance(2), 0.5)).toBe(0);
    });

    it("falls away as the square, so the item under the pointer is the one plainly picked out", () => {
        expect(
            ProximityUtils.getFalloff(atDistance(0.25), 0.5),
            "half the reach keeps three quarters of the effect",
        ).toBeCloseTo(0.75);
    });

    it("answers nothing rather than dividing by a reach of zero", () => {
        expect(ProximityUtils.getFalloff(atDistance(0), 0)).toBe(0);
    });
});

describe("getFalloff, across a turning run", () => {
    const RING = { leftShare: 0.5, topShare: 0.2, widthShare: 0.12, heightShare: 0.12 };
    const ORIGIN = { x: 0.5, y: 0.5 };
    const RUN: ProximityArrangement = {
        spacing: 0.2,
        radius: 0.3,
        reachRule: "arc",
        origin: ORIGIN,
        slack: 0,
    };

    const atRadius = (radius: number) =>
        ProximityUtils.getFalloff(ProximityUtils.toEffectDefs(RING, { x: 0.5, y: 0.5 - radius }, RUN, false), 0.5);

    it("is nothing at the pivot, everything on the band, and nothing again as far out the other side", () => {
        expect(atRadius(0), "the pointer on the pivot, a whole radius off the band").toBe(0);
        expect(atRadius(0.3), "on the band, straight out from the item").toBe(1);
        expect(atRadius(0.6), "as far outside the band as the pivot was inside it").toBe(0);
    });

    it("is symmetric either side of the band, the two sides having the same room to move in", () => {
        expect(atRadius(0.15)).toBeCloseTo(atRadius(0.45));
    });

    it("does not let a turn make up for being off the band, or the far side of a ring would answer", () => {
        const acrossTheRing = ProximityUtils.toEffectDefs(RING, { x: 0.5, y: 0.8 }, RUN, false);

        expect(ProximityUtils.getFalloff(acrossTheRing, 0.5), "half a turn away and on the band").toBe(0);
    });
});

describe("toEffectDefs", () => {
    const RUN: ProximityArrangement = { spacing: 0.3, radius: 0, slack: Infinity };

    const defsAt = (x: number, y: number) => ProximityUtils.toEffectDefs(ITEM, { x, y }, RUN, false);

    it("measures from the item's center, which is what its left and top already name", () => {
        expect(defsAt(0.6, 0.25).offset.x).toBeCloseTo(0.1);
        expect(defsAt(0.6, 0.25).offset.y).toBeCloseTo(0);
        expect(defsAt(0.6, 0.25).distance).toBeCloseTo(0.1);
    });

    it("reports the pointer on the item's own border as a ratio of one, whatever the side", () => {
        expect(defsAt(0.6, 0.25).ratio, "half the width out, to the right").toBeCloseTo(1);
        expect(defsAt(0.5, 0.3).ratio, "half the height down, which is a different distance").toBeCloseTo(1);
    });

    it("reports inside the item as below one and outside it as above", () => {
        expect(defsAt(0.55, 0.25).ratio).toBeLessThan(1);
        expect(defsAt(0.8, 0.25).ratio).toBeGreaterThan(1);
    });

    it("takes the item's own rotation into account, so a turned box reports the side facing the pointer", () => {
        expect(
            ProximityUtils.toEffectDefs(TILTED, { x: 0.55, y: 0.25 }, RUN, false).ratio,
            "a quarter turn puts the short side to the right, so the same point is now on the border",
        ).toBeCloseTo(1);
    });

    it("has no bearing at all when the pointer is on the center, and says so rather than dividing by nothing", () => {
        expect(defsAt(0.5, 0.25).ratio).toBe(0);
        expect(defsAt(0.5, 0.25).distance).toBe(0);
    });

    it("carries the arrangement's spacing through, which is what an effect measures its reach in", () => {
        expect(defsAt(0.6, 0.25).spacing).toBe(RUN.spacing);
    });

    it("passes the motion preference through untouched, since only the consumer can substitute for it", () => {
        expect(ProximityUtils.toEffectDefs(ITEM, { x: 0.6, y: 0.25 }, RUN, true).prefersReducedMotion).toBe(true);
    });
});

describe("toRestingEffectDefs", () => {
    const RUN: ProximityArrangement = { spacing: 0.3, radius: 0, slack: Infinity };

    it("reports the pointer as infinitely far on every axis an effect might read", () => {
        const defs = ProximityUtils.toRestingEffectDefs(ITEM, RUN, false);

        expect(defs.distance).toBe(Infinity);
        expect(defs.overreach).toBe(Infinity);
        expect(defs.ratio).toBe(Infinity);
        expect(defs.offset).toEqual({ x: 0, y: 0 });
    });
});

describe("toTranslation", () => {
    it("divides each axis by the item's own extent, since a CSS translate in percent is of the element", () => {
        expect(ProximityUtils.toTranslation(ITEM, { x: 0.1, y: 0.05 }), "half a width and half a height").toEqual([
            50, 50,
        ]);
    });

    it("undoes the item's rotation, so a displacement points where the layout meant it to", () => {
        const [along, across] = ProximityUtils.toTranslation(TILTED, { x: 0.1, y: 0 });

        expect(along, "a quarter turn sends what was rightward down the item's own short axis").toBeCloseTo(0);
        expect(across, "the whole of it lands on the other axis, measured against the height").toBeCloseTo(-100);
    });

    it("answers nothing rather than dividing by an item with no extent", () => {
        expect(ProximityUtils.toTranslation({ ...ITEM, widthShare: 0, heightShare: 0 }, { x: 0.1, y: 0.1 })).toEqual([
            0, 0,
        ]);
    });
});

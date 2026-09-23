import { describe, expect, it } from "vitest";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import { SatelliteUtils } from "./Satellite.utils";

const SUBJECT = { width: 100, height: 100 };
const SATELLITE = { width: 20, height: 20 };
const NO_OFFSET = { x: 0, y: 0 };

const layoutOf = (placement: AnchorPlacement, offset = NO_OFFSET, satellite = SATELLITE) =>
    SatelliteUtils.computeLayout(SUBJECT, [{ size: satellite, placement, offset }]);

const spell = (placement: AnchorPlacement, offset = NO_OFFSET, satellite = SATELLITE) => {
    const layout = layoutOf(placement, offset, satellite);

    return [
        layout.padding.paddingLeft,
        layout.padding.paddingTop,
        layout.padding.paddingRight,
        layout.padding.paddingBottom,
        layout.satelliteOffsets[0].x,
        layout.satelliteOffsets[0].y,
    ].join(" ");
};

describe("computeLayout", () => {
    it("grows nothing when the satellite sits inside a corner", () => {
        expect(spell({ x: "left-in", y: "top-in" })).toBe("0 0 0 0 0 0");
    });

    it("centers the satellite over the subject without growing either way", () => {
        expect(spell({ x: "center", y: "center" })).toBe("0 0 0 0 40 40");
    });

    it("grows on the side the satellite hangs off, by exactly its overhang", () => {
        expect(spell({ x: "right-out", y: "center" })).toBe("0 0 20 0 100 40");
        expect(spell({ x: "left-out", y: "center" })).toBe("20 0 0 0 0 40");
        expect(spell({ x: "center", y: "top-out" })).toBe("0 20 0 0 40 0");
        expect(spell({ x: "center", y: "bottom-out" })).toBe("0 0 0 20 40 100");
    });

    it("grows on two sides at once for an outward corner", () => {
        expect(spell({ x: "right-out", y: "top-out" })).toBe("0 20 20 0 100 0");
    });

    it("counts an offset that pushes an inside satellite back out again", () => {
        expect(spell({ x: "left-in", y: "top-in" }, { x: -8, y: -8 })).toBe("8 8 0 0 0 0");
    });

    it("nudges without growing while the satellite still fits inside", () => {
        expect(spell({ x: "left-in", y: "top-in" }, { x: 8, y: 8 })).toBe("0 0 0 0 8 8");
    });

    it("grows for a satellite larger than the subject even when it is placed inside", () => {
        expect(spell({ x: "center", y: "center" }, NO_OFFSET, { width: 140, height: 100 })).toBe("20 0 20 0 0 0");
    });

    it("reports no padding at all before either element has been measured", () => {
        expect(
            SatelliteUtils.computeLayout({ width: 0, height: 0 }, [
                { size: { width: 0, height: 0 }, placement: { x: "right-out", y: "top-out" }, offset: NO_OFFSET },
            ]),
        ).toEqual({
            padding: { paddingLeft: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0 },
            satelliteOffsets: [{ x: 0, y: 0 }],
        });
    });

    it("grows nothing and places nothing when there are no satellites", () => {
        expect(SatelliteUtils.computeLayout(SUBJECT, [])).toEqual({
            padding: { paddingLeft: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0 },
            satelliteOffsets: [],
        });
    });
});

describe("computeLayout with several satellites", () => {
    const entry = (placement: AnchorPlacement, size = SATELLITE, offset = NO_OFFSET) => ({ size, placement, offset });

    it("grows each side by the furthest overhang any satellite has there", () => {
        const layout = SatelliteUtils.computeLayout(SUBJECT, [
            entry({ x: "right-out", y: "top-out" }),
            entry({ x: "left-out", y: "center" }, { width: 30, height: 30 }),
            entry({ x: "right-out", y: "center" }, { width: 12, height: 12 }),
        ]);

        expect(layout.padding).toEqual({ paddingLeft: 30, paddingTop: 20, paddingRight: 20, paddingBottom: 0 });
    });

    it("shifts every satellite by the same padding, so one that needed none still moves with the rest", () => {
        const layout = SatelliteUtils.computeLayout(SUBJECT, [
            entry({ x: "left-out", y: "top-out" }),
            entry({ x: "right-in", y: "bottom-in" }),
        ]);

        expect(layout.satelliteOffsets).toEqual([
            { x: 0, y: 0 },
            { x: 100, y: 100 },
        ]);
    });

    it("gives the offsets back in the order the satellites were given", () => {
        const layout = SatelliteUtils.computeLayout(SUBJECT, [
            entry({ x: "center", y: "center" }),
            entry({ x: "left-in", y: "top-in" }),
        ]);

        expect(layout.satelliteOffsets).toEqual([
            { x: 40, y: 40 },
            { x: 0, y: 0 },
        ]);
    });
});

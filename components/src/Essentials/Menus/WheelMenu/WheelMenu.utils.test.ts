import { describe, expect, it } from "vitest";

import { WheelMenuUtils } from "./WheelMenu.utils";

const items = [{ arcDegrees: 180 }, {}, {}, { items: [{}, {}] }];

describe("withCloser", () => {
    it("adds the close control after the consumer's items, named, and only when there is one", () => {
        const withCloser = WheelMenuUtils.withCloser([{ value: "cut" }], "Close");

        expect(withCloser).toHaveLength(2);
        expect(WheelMenuUtils.getIsCloser(withCloser[1].value)).toBe(true);
        expect(WheelMenuUtils.getIsCloser("cut")).toBe(false);
        expect(WheelMenuUtils.withCloser([{ value: "cut" }], undefined)).toHaveLength(1);
    });
});

describe("computeLayout", () => {
    const defs = { items, holeRadius: 20, bandWidth: 30, levelGap: 10, hasCloser: true };

    it("places the close control in the hole, after the wedges", () => {
        const layout = WheelMenuUtils.computeLayout({ itemCount: items.length + 1 }, defs);
        const closer = layout.placements[items.length];

        expect(layout.placements).toHaveLength(items.length + 1);
        expect(closer.sector, "the close control is not a wedge").toBeUndefined();
        expect(closer.widthShare).toBeCloseTo(20 / 50);
    });

    it("puts each band one band and one gap further out, with no second close control", () => {
        const root = WheelMenuUtils.computeLayout({ itemCount: items.length + 1 }, defs);
        const band = WheelMenuUtils.computeLayout(
            { itemCount: 2, path: [3], parentPlacement: root.placements[3] },
            defs,
        );

        expect(root.extent).toBe(100);
        expect(band.extent).toBe(180);
        expect(band.placements).toHaveLength(2);
    });
});

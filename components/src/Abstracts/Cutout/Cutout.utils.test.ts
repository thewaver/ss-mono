import { describe, expect, it } from "vitest";

import type { CutoutHole } from "./Cutout.types";
import { CutoutUtils } from "./Cutout.utils";

const HOLE: CutoutHole = { x: 100, y: 50, width: 200, height: 80 };
const SECOND_HOLE: CutoutHole = { x: 300, y: 50, width: 40, height: 80 };

describe("getMaskStyle", () => {
    it("lays a full-coverage layer over the holes and keeps only what falls outside them", () => {
        const style = CutoutUtils.getMaskStyle([HOLE]);

        expect(style["mask-image"]).toBe("linear-gradient(black, black), linear-gradient(black, black)");
        expect(style["mask-composite"], "the covering layer survives only outside every layer below it").toBe(
            "subtract, add",
        );
        expect(
            style["-webkit-mask-composite"],
            "the prefixed spelling takes different keywords and would override this one where both are read",
        ).toBeUndefined();
    });

    it("puts each hole where its rect says and sizes it to match", () => {
        const style = CutoutUtils.getMaskStyle([HOLE]);

        expect(style["mask-position"], "the covering layer starts at the origin, the hole at the rect").toBe(
            "0 0, 100px 50px",
        );
        expect(style["mask-size"], "and the covering layer fills while the hole takes the rect's size").toBe(
            "auto, 200px 80px",
        );
    });

    it("joins holes to one another rather than excluding them, so overlaps do not reappear", () => {
        const style = CutoutUtils.getMaskStyle([HOLE, SECOND_HOLE]);

        expect(style["mask-composite"]).toBe("subtract, add, add");
        expect(style["mask-position"]).toBe("0 0, 100px 50px, 300px 50px");
        expect(style["mask-size"]).toBe("auto, 200px 80px, 40px 80px");
    });

    it("takes a supplied image per hole, which is how a shaped or soft hole is drawn", () => {
        const style = CutoutUtils.getMaskStyle([{ ...HOLE, image: 'url("data:image/svg+xml,shape")' }, SECOND_HOLE]);

        expect(style["mask-image"]).toBe(
            'linear-gradient(black, black), url("data:image/svg+xml,shape"), linear-gradient(black, black)',
        );
    });

    it("covers everything when there are no holes at all", () => {
        const style = CutoutUtils.getMaskStyle([]);

        expect(style["mask-image"]).toBe("linear-gradient(black, black)");
        expect(style["mask-composite"]).toBe("subtract");
        expect(style["mask-position"]).toBe("0 0");
    });

    it("mirrors every property into its -webkit- spelling", () => {
        const style = CutoutUtils.getMaskStyle([HOLE]);

        expect(style["-webkit-mask-image"]).toBe(style["mask-image"]);
        expect(style["-webkit-mask-position"]).toBe(style["mask-position"]);
        expect(style["-webkit-mask-size"]).toBe(style["mask-size"]);
        expect(style["-webkit-mask-repeat"]).toBe(style["mask-repeat"]);
    });
});

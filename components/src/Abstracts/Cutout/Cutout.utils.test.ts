import { describe, expect, it } from "vitest";

import type { Rect } from "@thewaver/ss-utils";

import { CutoutUtils } from "./Cutout.utils";

const HOLE: Rect = { x: 100, y: 50, width: 200, height: 80 };

describe("getMaskStyle", () => {
    it("lays a full-coverage layer under a hole layer and subtracts one from the other", () => {
        const style = CutoutUtils.getMaskStyle(HOLE);

        expect(style["mask-image"]).toBe("linear-gradient(black, black), linear-gradient(black, black)");
        expect(style["mask-composite"], "exclude is what turns the second layer into a hole").toBe("exclude");
        expect(style["-webkit-mask-composite"], "and xor is the same operator under the old prefixed spelling").toBe(
            "xor",
        );
    });

    it("puts the hole where the rect says and sizes it to match", () => {
        const style = CutoutUtils.getMaskStyle(HOLE);

        expect(style["mask-position"], "the covering layer starts at the origin, the hole at the rect").toBe(
            "0 0, 100px 50px",
        );
        expect(style["mask-size"], "and the covering layer fills while the hole takes the rect's size").toBe(
            "auto, 200px 80px",
        );
    });

    it("takes a supplied image as the hole layer, which is how a shaped or soft hole is drawn", () => {
        const style = CutoutUtils.getMaskStyle(HOLE, 'url("data:image/svg+xml,shape")');

        expect(style["mask-image"]).toBe('linear-gradient(black, black), url("data:image/svg+xml,shape")');
    });

    it("mirrors every property into its -webkit- spelling", () => {
        const style = CutoutUtils.getMaskStyle(HOLE);

        expect(style["-webkit-mask-image"]).toBe(style["mask-image"]);
        expect(style["-webkit-mask-position"]).toBe(style["mask-position"]);
        expect(style["-webkit-mask-size"]).toBe(style["mask-size"]);
        expect(style["-webkit-mask-repeat"]).toBe(style["mask-repeat"]);
    });
});

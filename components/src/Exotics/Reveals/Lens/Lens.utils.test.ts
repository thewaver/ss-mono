import { describe, expect, it } from "vitest";

import { LensUtils } from "./Lens.utils";

const IMAGE = 'url("data:image/svg+xml,lens")';

const scaleAbout = (point: { x: number; y: number }, transform: string, origin: string) => {
    const zoom = parseFloat(transform.replace("scale(", ""));
    const [x, y] = origin.split(" ").map(parseFloat);

    return { x: x + (point.x - x) * zoom, y: y + (point.y - y) * zoom };
};

describe("the layer", () => {
    it("is hidden without a lens, and carries no mask then", () => {
        const style = LensUtils.computeLayerStyle(false, { x: 100, y: 50 }, 40, IMAGE);

        expect(style.visibility).toBe("hidden");
        expect(style["mask-image"]).toBeUndefined();
    });

    it("shows the copy through the lens's image alone, centered on the lens", () => {
        const style = LensUtils.computeLayerStyle(true, { x: 100, y: 50 }, 40, IMAGE);

        expect(style.visibility, "nothing hides the layer while there is a lens").toBeUndefined();
        expect(style["mask-image"], "one layer, with nothing composited against it").toBe(IMAGE);
        expect(style["mask-position"]).toBe("60px 10px");
        expect(style["mask-size"]).toBe("80px 80px");
        expect(style["-webkit-mask-position"]).toBe(style["mask-position"]);
    });
});

describe("the copy", () => {
    it("leaves the point under the lens's center where it is, and pushes everything else outwards by the zoom", () => {
        const center = { x: 120, y: 80 };
        const style = LensUtils.computeCopyStyle(center, 3);

        expect(scaleAbout(center, style.transform, style["transform-origin"])).toEqual(center);
        expect(scaleAbout({ x: 130, y: 80 }, style.transform, style["transform-origin"])).toEqual({ x: 150, y: 80 });
    });
});

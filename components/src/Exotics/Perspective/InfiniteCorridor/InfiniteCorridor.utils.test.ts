import { describe, expect, it } from "vitest";

import { QuadWarpUtils } from "../../../Abstracts/QuadWarp/QuadWarp.utils";
import { InfiniteCorridorUtils } from "./InfiniteCorridor.utils";

describe("toPosition and toProgress", () => {
    it("brings any progress back into one lap, so 1 is the start again", () => {
        expect(InfiniteCorridorUtils.toPosition(0.25, 8)).toBe(2);
        expect(InfiniteCorridorUtils.toPosition(1.25, 8)).toBe(2);
        expect(InfiniteCorridorUtils.toPosition(1, 8)).toBe(0);
        expect(InfiniteCorridorUtils.toPosition(-0.25, 8)).toBe(6);
    });

    it("reverses a position, wrapping one that glided past either end", () => {
        expect(InfiniteCorridorUtils.toProgress(2, 8)).toBe(0.25);
        expect(InfiniteCorridorUtils.toProgress(-2, 8)).toBe(0.75);
        expect(InfiniteCorridorUtils.toProgress(10, 8)).toBe(0.25);
    });

    it("has nowhere to be with no items", () => {
        expect(InfiniteCorridorUtils.toProgress(3, 0)).toBe(0);
    });
});

describe("getCopyCount", () => {
    it("draws the list once when it already fills the reach and the place behind", () => {
        expect(InfiniteCorridorUtils.getCopyCount(40, 25)).toBe(1);
    });

    it("repeats the whole list until it reaches as far as the layout draws", () => {
        expect(InfiniteCorridorUtils.getCopyCount(16, 25)).toBe(2);
        expect(InfiniteCorridorUtils.getCopyCount(16, 25, 12)).toBe(3);
    });

    it("rounds up until the drawn count is a multiple the layout asks for", () => {
        const copies = InfiniteCorridorUtils.getCopyCount(16, 25, 1, 12);

        expect((16 * copies) % 12).toBe(0);
        expect(copies).toBeGreaterThanOrEqual(InfiniteCorridorUtils.getCopyCount(16, 25));
    });

    it("draws once with no items", () => {
        expect(InfiniteCorridorUtils.getCopyCount(0, 25)).toBe(1);
    });
});

describe("getDistance", () => {
    it("measures forwards from the viewer, so almost the whole ring lies ahead", () => {
        expect(InfiniteCorridorUtils.getDistance(12, 10, 20)).toBe(2);
        expect(InfiniteCorridorUtils.getDistance(5, 10, 20)).toBe(15);
    });

    it("counts an item as behind only within the behind distance of having passed", () => {
        expect(InfiniteCorridorUtils.getDistance(9, 9.5, 20)).toBe(-0.5);
        expect(InfiniteCorridorUtils.getDistance(5, 9.5, 20, 6)).toBe(-4.5);
        expect(InfiniteCorridorUtils.getDistance(5, 9.5, 20)).toBe(15.5);
    });
});

describe("getRealPlace", () => {
    it("is the nearest copy still ahead of the viewer, never one behind", () => {
        expect(InfiniteCorridorUtils.getRealPlace(1, 5.5, 4, 2)).toBe(1);
        expect(InfiniteCorridorUtils.getRealPlace(1, 0.5, 4, 2)).toBe(1);
        expect(InfiniteCorridorUtils.getRealPlace(1, 2, 4, 2)).toBe(5);
    });
});

describe("getFocusDistance and getIsInView", () => {
    it("holds the focus distance below the item count, where the next copy would take over", () => {
        expect(InfiniteCorridorUtils.getFocusDistance(4, 16)).toBe(4);
        expect(InfiniteCorridorUtils.getFocusDistance(24, 16)).toBe(15);
    });

    it("counts an item as in view from half the focus distance out to twice it", () => {
        expect(InfiniteCorridorUtils.getIsInView(2, 4)).toBe(true);
        expect(InfiniteCorridorUtils.getIsInView(8, 4)).toBe(true);
        expect(InfiniteCorridorUtils.getIsInView(1.9, 4)).toBe(false);
        expect(InfiniteCorridorUtils.getIsInView(8.1, 4)).toBe(false);
    });
});

describe("getGlideTarget", () => {
    it("moves the very copy that took focus by its own distance, never the short way round", () => {
        expect(InfiniteCorridorUtils.getGlideTarget(0, 11, 1)).toBe(10);
        expect(InfiniteCorridorUtils.getGlideTarget(3, -0.5, 1)).toBe(1.5);
    });
});

describe("rememberWrite and getIsEcho", () => {
    it("keeps only the last few writes", () => {
        const recent = [0.1, 0.2, 0.3, 0.4, 0.5].reduce<number[]>(
            (writes, progress) => InfiniteCorridorUtils.rememberWrite(writes, progress),
            [],
        );

        expect(recent).toEqual([0.2, 0.3, 0.4, 0.5]);
    });

    it("counts a progress near one of them as the corridor's own coming back, the short way round", () => {
        expect(InfiniteCorridorUtils.getIsEcho(0.405, [0.4])).toBe(true);
        expect(InfiniteCorridorUtils.getIsEcho(0.995, [0.002])).toBe(true);
        expect(InfiniteCorridorUtils.getIsEcho(0.5, [0.4])).toBe(false);
        expect(InfiniteCorridorUtils.getIsEcho(0.5, [])).toBe(false);
    });
});

describe("toItemStyle", () => {
    const placement = {
        size: { width: 100, height: 60 },
        offset: { x: 10, y: -20, z: -300 },
        turnDegrees: 45,
        perspectivePx: 800,
        opacity: 1.5,
    };

    it("centers the item on the corridor's middle by its own size", () => {
        const style = InfiniteCorridorUtils.toItemStyle(placement, 2);

        expect(style["margin-left"]).toBe("-50px");
        expect(style["margin-top"]).toBe("-30px");
    });

    it("holds the opacity between 0 and 1", () => {
        expect(InfiniteCorridorUtils.toItemStyle(placement, 2).opacity).toBe("1");
    });

    it("stacks a nearer item over a further one", () => {
        const near = Number(InfiniteCorridorUtils.toItemStyle(placement, 1)["z-index"]);
        const far = Number(InfiniteCorridorUtils.toItemStyle(placement, 5)["z-index"]);

        expect(near).toBeGreaterThan(far);
    });

    describe("with its corners pinned", () => {
        const size = { width: 100, height: 60 };

        const pinned = {
            size,
            corners: {
                top_left: { x: -50, y: -30 },
                top_right: { x: 50, y: -30 },
                bottom_right: { x: 50, y: 30 },
                bottom_left: { x: -50, y: 30 },
            },
            opacity: 1,
        };

        it("stretches the item from its own top left, so corners at its resting place leave it where it is", () => {
            const style = InfiniteCorridorUtils.toItemStyle(pinned, 2);

            expect(style["transform-origin"]).toBe("0 0");
            expect(style.transform).toBe(
                QuadWarpUtils.toTransform(size, QuadWarpUtils.toPixels(QuadWarpUtils.RESTING_CORNERS, size)),
            );
        });

        it("hides an item whose corners cannot be drawn", () => {
            expect(InfiniteCorridorUtils.toItemStyle({ ...pinned, corners: undefined }, 2).opacity).toBe("0");
        });
    });
});

import { describe, expect, it } from "vitest";

import type { CarouselPlacementDefs } from "../../Essentials/Carousel/Carousel.types";
import { CarouselPlacements } from "../../Samples/Carousel/Placements/CarouselPlacements.const";
import { CarouselPlacementUtils } from "./CarouselPlacements.utils";

const BASE: CarouselPlacementDefs = {
    distance: 0,
    index: 0,
    count: 6,
    size: { width: 300, height: 200 },
    orientation: "horizontal",
    isLooping: true,
};

const at = (distance: number, overrides?: Partial<CarouselPlacementDefs>) => ({ ...BASE, ...overrides, distance });

const RULES = CarouselPlacements.SAMPLE_KEYS.map(
    (key) => [key, CarouselPlacementUtils.toPlacementFn(CarouselPlacements.SAMPLE_PLACEMENTS[key])] as const,
);

const numbersOf = (value: number | number[] | undefined) => (value === undefined ? [] : [value].flat());

describe("every sample rule", () => {
    it.each(RULES)("%s answers finite numbers at every distance", (_key, rule) => {
        for (const distance of [-3.5, -1, -0.5, 0, 0.25, 1, 2.75]) {
            const { effect } = rule(at(distance));

            for (const value of Object.values(effect)) {
                for (const number of numbersOf(value)) expect(Number.isFinite(number)).toBe(true);
            }
        }
    });

    it.each(RULES)("%s moves smoothly, with no jump between two nearby distances", (_key, rule) => {
        const before = rule(at(0.49)).effect;
        const after = rule(at(0.51)).effect;

        for (const key of Object.keys(before) as (keyof typeof before)[]) {
            const a = numbersOf(before[key]);
            const b = numbersOf(after[key]);

            a.forEach((value, index) => expect(Math.abs(value - b[index])).toBeLessThan(20));
        }
    });
});

describe("track", () => {
    it("puts each slide one box along from the last, across or down", () => {
        expect(CarouselPlacementUtils.track(at(0)).effect).toEqual({ translateX: 0 });
        expect(CarouselPlacementUtils.track(at(-2)).effect).toEqual({ translateX: -200 });
        expect(CarouselPlacementUtils.track(at(1, { orientation: "vertical" })).effect).toEqual({ translateY: 100 });
    });
});

describe("drum", () => {
    it("faces the slide showing straight at the viewer, and the one opposite away from it", () => {
        const front = CarouselPlacementUtils.drum(at(0));
        const back = CarouselPlacementUtils.drum(at(3));

        expect(front.effect.rotateY).toBe(0);
        expect(numbersOf(front.effect.translate3d)[2]).toBeCloseTo(0);
        expect(back.effect.rotateY).toBe(180);
        expect(back.layer!).toBeLessThan(front.layer!);
    });

    it("keeps its step whatever the slide count once its faces are fixed", () => {
        const drum = CarouselPlacementUtils.createDrum({ faceCount: 18 });

        expect(drum(at(1, { count: 6 })).effect.rotateY).toBe(20);
        expect(drum(at(1, { count: 40 })).effect.rotateY).toBe(20);
    });

    it("draws a slide only while it is less than half a turn away, so the drum never wraps onto itself", () => {
        const drum = CarouselPlacementUtils.createDrum({ faceCount: 18 });

        expect(drum(at(4, { count: 40 })).effect.opacity, "drawn, with no filter to flatten it").toBeUndefined();
        expect(drum(at(12, { count: 40 })).effect.opacity).toBe(0);
    });
});

describe("cover flow", () => {
    it("turns the slides either side towards the middle, mirror images of each other", () => {
        const left = CarouselPlacementUtils.coverFlow(at(-1)).effect;
        const right = CarouselPlacementUtils.coverFlow(at(1)).effect;

        expect(left.rotateY).toBe(-(right.rotateY as number));
        expect(numbersOf(left.translate3d)[0]).toBe(-numbersOf(right.translate3d)[0]);
    });

    it("fades the slides beyond the visible distance", () => {
        expect(CarouselPlacementUtils.coverFlow(at(9)).effect.opacity).toBe(0);
    });
});

describe("folders", () => {
    it("drops and fades the front one as it leaves, and sends it to the back of a looping stack", () => {
        expect(CarouselPlacementUtils.folders(at(-0.5)).effect.opacity).toBe(50);
        expect(CarouselPlacementUtils.folders(at(-1)).layer).toBe(-5);
    });

    it("leaves a passed folder out of a stack that does not loop", () => {
        expect(CarouselPlacementUtils.folders(at(-1, { isLooping: false })).effect.opacity).toBe(0);
    });
});

describe("hinge", () => {
    it("flips a card down about its bottom edge as it is left behind, showing its back", () => {
        const flipping = CarouselPlacementUtils.hinge(at(-0.5));

        expect(flipping.effect.rotateX).toBe(-90);
        expect(flipping.origin).toEqual({ x: 0.5, y: 1 });
        expect(flipping.axis).toBe("column");
    });
});

describe("paddle wheel", () => {
    it("lays the slide showing flat on the box, and turns the rest round the spine at even steps", () => {
        expect(CarouselPlacementUtils.paddleWheel(at(0)).effect.rotateY).toBeCloseTo(0);
        expect(CarouselPlacementUtils.paddleWheel(at(1)).effect.rotateY).toBe(-60);
        expect(CarouselPlacementUtils.paddleWheel(at(3)).effect.rotateY).toBe(-180);
    });

    it("stacks a slide swung towards the viewer over one swung away, and the two lying flat level", () => {
        const towards = CarouselPlacementUtils.paddleWheel(at(1)).layer!;
        const away = CarouselPlacementUtils.paddleWheel(at(-1)).layer!;

        expect(towards).toBeGreaterThan(away);
        expect(CarouselPlacementUtils.paddleWheel(at(0)).layer).toBeCloseTo(0);
        expect(CarouselPlacementUtils.paddleWheel(at(3)).layer).toBeCloseTo(0);
    });

    it("turns the slides about an upright spine across, and a level one up and down, showing backs the same way", () => {
        expect(CarouselPlacementUtils.paddleWheel(at(1)).axis).toBe("row");

        const vertical = CarouselPlacementUtils.paddleWheel(at(1, { orientation: "vertical" }));

        expect(vertical.effect.rotateX).toBe(-60);
        expect(vertical.axis).toBe("column");
    });
});

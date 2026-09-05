import { MathUtils } from "@thewaver/ss-utils";

import type { CarouselStep } from "./Carousel.types";

const HALF = 2;

export namespace CarouselUtils {
    export const wrapIndex = MathUtils.wrapIndex;

    export const getStepTarget = (step: CarouselStep, index: number, count: number) =>
        wrapIndex(index + (step === "previous" ? -1 : 1), count);

    export const getTurnSteps = (from: number, to: number, count: number) => {
        if (count <= 0) return 0;

        const forward = wrapIndex(to - from, count);

        return forward * HALF > count ? forward - count : forward;
    };
}

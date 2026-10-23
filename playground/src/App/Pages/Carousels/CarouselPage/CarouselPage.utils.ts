import type { Span } from "@thewaver/ss-utils";

import { PAIR_SIZE } from "./CarouselPage.const";

export const toPairableSlides = <T>(slides: T[]) => (slides.length % PAIR_SIZE === 0 ? slides : [...slides, ...slides]);

export const computePairs = (count: number) => {
    const pairs: Span[] = [];

    for (let start = 0; start < count; start += PAIR_SIZE) {
        pairs.push({ start, end: Math.min(start + PAIR_SIZE, count) });
    }

    return pairs;
};

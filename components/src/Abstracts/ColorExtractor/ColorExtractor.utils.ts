import { getColor, getPalette } from "colorthief";

import { StoreUtils } from "@thewaver/ss-utils";

import type { ColorExtractor, ColorExtractorDefs, ColorExtractorState } from "./ColorExtractor.types";

/** One color unless more are asked for. */
const DEFAULT_COLOR_COUNT = 1;
/** Every tenth pixel is sampled unless told otherwise. */
const DEFAULT_SAMPLE_PERCENTILE = 10;

/** Nothing extracted yet, and nothing gone wrong. */
const EMPTY_STATE: ColorExtractorState = { colors: [], error: undefined };

/** Reads the dominant colors out of an image. */
export namespace ColorExtractorUtils {
    /**
     * Makes an extractor, which loads one image at a time and reports the colors found in it.
     *
     * The extractor is a store of the colors from the last image that finished, and of the error from the last
     * one that failed; a success clears the error and a failure empties the colors. `load` starts on a new image
     * and returns the function that abandons it, after which nothing it would have reported arrives. Loading a
     * second image abandons the first. The image is fetched with `crossOrigin` set to `anonymous`, so a server that
     * does not allow it produces an error rather than a tainted canvas.
     *
     * @returns The extractor.
     */
    export const createExtractor = (): ColorExtractor => {
        const store = StoreUtils.create(EMPTY_STATE);

        let abandonCurrent: (() => void) | undefined;

        const load = (src: string, defs?: ColorExtractorDefs) => {
            abandonCurrent?.();

            const colorCount = defs?.colorCount ?? DEFAULT_COLOR_COUNT;
            const quality = defs?.samplePercentile ?? DEFAULT_SAMPLE_PERCENTILE;
            const img = new Image();

            let isCurrent = true;

            const abandon = () => {
                if (!isCurrent) return;

                isCurrent = false;
                img.onload = null;
                img.onerror = null;
                img.src = "";

                if (abandonCurrent === abandon) abandonCurrent = undefined;
            };

            abandonCurrent = abandon;

            img.crossOrigin = "anonymous";
            img.src = src;
            img.onerror = () => {
                if (!isCurrent) return;

                console.warn(`ColorExtractor: failed to load image: ${src}`);
                store.set({ colors: [], error: new Error(`Failed to load image: ${src}`) });
            };
            img.onload = () => {
                if (!isCurrent) return;

                const request =
                    colorCount === 1
                        ? getColor(img, { quality }).then((res) => (res ? [res] : []))
                        : getPalette(img, { quality, colorCount });

                request
                    .then((res) => {
                        if (!isCurrent) return;

                        store.set({ colors: res ?? [], error: undefined });
                    })
                    .catch((err) => {
                        if (!isCurrent) return;

                        console.warn("ColorExtractor: color extraction failed:", err);
                        store.set({ colors: [], error: err });
                    });
            };

            return abandon;
        };

        return { get: store.get, subscribe: store.subscribe, load };
    };
}

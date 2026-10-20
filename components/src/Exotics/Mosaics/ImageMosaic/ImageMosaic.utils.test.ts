import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Size2d } from "@thewaver/ss-utils";

import { ImageMosaicUtils } from "./ImageMosaic.utils";

const KEYS = ["constructor", "toString", "__proto__"];

const MEASURED: Size2d = { width: 40, height: 30 };

describe("computeSizes", () => {
    it.each(KEYS)("leaves a source called %s unmeasured when nothing is stored under it", (src) => {
        expect(ImageMosaicUtils.computeSizes([{ src, alt: "" }], {})).toEqual([{ width: 0, height: 0 }]);
    });

    it.each(KEYS)("returns the size stored under the source %s", (src) => {
        const sizes: Record<string, Size2d> = {};

        Object.defineProperty(sizes, src, { value: MEASURED, enumerable: true });

        expect(ImageMosaicUtils.computeSizes([{ src, alt: "" }], sizes)).toEqual([MEASURED]);
    });
});

describe("createSizeLoader", () => {
    const created: { src: string }[] = [];

    beforeEach(() => {
        created.length = 0;

        vi.stubGlobal(
            "Image",
            class {
                src = "";
                decoding = "";
                onload: (() => void) | null = null;
                onerror: (() => void) | null = null;

                constructor() {
                    created.push(this);
                }
            },
        );
        vi.stubGlobal("requestAnimationFrame", () => 0);
        vi.stubGlobal("cancelAnimationFrame", () => {});
    });

    afterEach(() => vi.unstubAllGlobals());

    it.each(KEYS)("fetches a source called %s that has not been measured", (src) => {
        const loader = ImageMosaicUtils.createSizeLoader();

        loader.request([{ src, alt: "" }]);

        expect(created.map((image) => image.src)).toEqual([src]);

        loader.stop();
    });
});

import { StoreUtils } from "@thewaver/ss-utils";
import type { Size2d, Store } from "@thewaver/ss-utils";

import type { MosaicImageSource, MosaicSizeAnchor } from "../../../Primitives/Mosaic/Mosaic.types";
import { MosaicUtils } from "../../../Primitives/Mosaic/Mosaic.utils";

/** The shape an image that cannot be read is given: a square, since its real shape is unknowable. */
const UNREADABLE_IMAGE_SIZE: Size2d = { width: 1, height: 1 };

/** The size an image has before its shape is known, which leaves it unplaced. */
const EMPTY_SIZE: Size2d = { width: 0, height: 0 };

/** The parts of an image mosaic that are not about any framework: learning each picture's shape, and what to aim at. */
export namespace ImageMosaicUtils {
    /**
     * Makes the loader that learns each picture's natural size without mounting anything.
     *
     * Each wanted source is fetched once through an `Image` that is never in the document; its size is buffered and
     * written to the store on the next animation frame, so a wall of pictures arriving together costs one write
     * rather than one each. A picture that fails to load is given a square. Asking for a list drops every source not
     * in it — its request is abandoned and its size forgotten — and leaves every source already known or already
     * requested alone.
     *
     * @returns The store of sizes by source address; `request(sources)`, which takes the list wanted now; and
     * `stop()`, which abandons every request and any pending write, after which `request` starts afresh.
     */
    export const createSizeLoader = () => {
        const store = StoreUtils.create<Record<string, Size2d>>({});
        const requested = new Map<string, HTMLImageElement>();

        let buffered: Record<string, Size2d> = {};
        let flushFrame: number | undefined;

        const release = (src: string) => {
            const image = requested.get(src);

            buffered = Object.fromEntries(Object.entries(buffered).filter(([key]) => key !== src));

            if (!image) return;

            image.onload = null;
            image.onerror = null;
            image.src = "";

            requested.delete(src);
        };

        const bufferSizeOf = (src: string, size: Size2d) => {
            if (!requested.has(src)) return;

            buffered = { ...buffered, [src]: size };

            if (flushFrame !== undefined) return;

            flushFrame = requestAnimationFrame(() => {
                const flushed = buffered;

                flushFrame = undefined;
                buffered = {};

                store.update((sizes) => ({ ...sizes, ...flushed }));
            });
        };

        const request = (sources: MosaicImageSource[]) => {
            const wanted = new Set(sources.map((source) => source.src));

            for (const src of [...requested.keys()]) {
                if (!wanted.has(src)) release(src);
            }

            store.update((sizes) => {
                const kept = Object.entries(sizes).filter(([src]) => wanted.has(src));

                return kept.length === Object.keys(sizes).length ? sizes : Object.fromEntries(kept);
            });

            for (const source of sources) {
                if (requested.has(source.src) || store.get()[source.src]) continue;

                const image = new Image();

                requested.set(source.src, image);

                image.decoding = "async";
                image.onload = () =>
                    bufferSizeOf(source.src, { width: image.naturalWidth, height: image.naturalHeight });
                image.onerror = () => bufferSizeOf(source.src, UNREADABLE_IMAGE_SIZE);
                image.src = source.src;
            }
        };

        const stop = () => {
            if (flushFrame !== undefined) cancelAnimationFrame(flushFrame);

            flushFrame = undefined;

            for (const src of [...requested.keys()]) release(src);
        };

        return { store: store as Store<Record<string, Size2d>>, request, stop };
    };

    /**
     * Each picture's size, in the order the sources were given, with a picture not yet measured at zero by zero.
     *
     * @param sources The pictures.
     * @param sizeBySrc What the loader has learned so far.
     * @returns One size per source.
     */
    export const computeSizes = (sources: MosaicImageSource[], sizeBySrc: Record<string, Size2d>) =>
        sources.map((source) => sizeBySrc[source.src] ?? EMPTY_SIZE);

    /**
     * The target shape in the packer's axes.
     *
     * The consumer states the shape in their own axes, and the base mosaic packs with the anchored side across, so
     * with the height anchored the shape is transposed on the way in.
     *
     * @param targetAspectRatio The shape the consumer aims at.
     * @param sizeAnchor Which side is given.
     * @returns The shape to hand the packer.
     */
    export const computeTargetAspectRatio = (targetAspectRatio: Size2d, sizeAnchor: MosaicSizeAnchor | undefined) =>
        sizeAnchor === "height" ? MosaicUtils.transposeSize(targetAspectRatio) : targetAspectRatio;
}

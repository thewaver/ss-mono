import { createEffect, createMemo, createSignal, onCleanup, untrack } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import { Mosaic } from "../../../Primitives/Mosaic/Mosaic";
import type { ImageMosaicProps } from "../../../Primitives/Mosaic/Mosaic.types";
import { MosaicUtils } from "../../../Primitives/Mosaic/Mosaic.utils";
import { access } from "../../../Utils/propUtils";

import * as styles from "./ImageMosaic.css";

const DEFAULT_TARGET_ASPECT_RATIO: Size2d = { width: 1, height: 1 };
const UNREADABLE_IMAGE_SIZE: Size2d = { width: 1, height: 1 };
const EMPTY_SIZE: Size2d = { width: 0, height: 0 };

export const ImageMosaic = (props: ImageMosaicProps) => {
    const [getSizeBySrc, setSizeBySrc] = createSignal<Record<string, Size2d>>({});

    const requested = new Map<string, HTMLImageElement>();

    let buffered: Record<string, Size2d> = {};
    let flushFrame: number | undefined;

    const release = (src: string) => {
        const image = requested.get(src);

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

            setSizeBySrc((sizes) => ({ ...sizes, ...flushed }));
        });
    };

    createEffect(() => {
        const sources = access(props.sources);
        const wanted = new Set(sources.map((source) => source.src));

        for (const src of [...requested.keys()]) {
            if (!wanted.has(src)) release(src);
        }

        setSizeBySrc((sizes) => Object.fromEntries(Object.entries(sizes).filter(([src]) => wanted.has(src))));

        for (const source of sources) {
            if (requested.has(source.src) || untrack(getSizeBySrc)[source.src]) continue;

            const image = new Image();

            requested.set(source.src, image);

            image.decoding = "async";
            image.onload = () => bufferSizeOf(source.src, { width: image.naturalWidth, height: image.naturalHeight });
            image.onerror = () => bufferSizeOf(source.src, UNREADABLE_IMAGE_SIZE);
            image.src = source.src;
        }
    });

    onCleanup(() => {
        if (flushFrame !== undefined) cancelAnimationFrame(flushFrame);

        for (const src of [...requested.keys()]) release(src);
    });

    const getSizes = createMemo(() => access(props.sources).map((source) => getSizeBySrc()[source.src] ?? EMPTY_SIZE));

    const getTargetAspectRatio = createMemo(() => {
        const targetAspectRatio = access(props.targetAspectRatio) ?? DEFAULT_TARGET_ASPECT_RATIO;

        return access(props.sizeAnchor) === "height" ? MosaicUtils.transposeSize(targetAspectRatio) : targetAspectRatio;
    });

    return (
        <Mosaic
            sizeAnchor={props.sizeAnchor}
            gap={props.gap}
            sizes={getSizes}
            isItemSized={true}
            computePlacements={(defs) => MosaicUtils.packScaled(defs, getTargetAspectRatio())}
            renderItem={(index, getState) => {
                const renderImage = () => (
                    <img
                        class={styles.imageMosaicImage}
                        src={access(props.sources)[index]?.src}
                        alt={access(props.sources)[index]?.alt}
                        decoding="async"
                    />
                );

                return props.renderItem ? props.renderItem(renderImage, getState) : renderImage();
            }}
        />
    );
};

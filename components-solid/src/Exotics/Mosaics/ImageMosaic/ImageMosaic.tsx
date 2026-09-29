import { createEffect, createMemo, onCleanup } from "solid-js";

import {
    IMAGE_MOSAIC_DEFAULTS,
    ImageMosaicUtils,
    MosaicUtils,
    ImageMosaicStyles as styles,
} from "@thewaver/ss-components";

import { Mosaic } from "../../../Primitives/Mosaic/Mosaic";
import type { ImageMosaicProps } from "../../../Primitives/Mosaic/MosaicSolid.types";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";

export const ImageMosaic = (props: ImageMosaicProps) => {
    const loader = ImageMosaicUtils.createSizeLoader();

    const getSizeBySrc = accessStore(loader.store);

    createEffect(() => loader.request(access(props.sources)));

    onCleanup(() => loader.stop());

    const getSizes = createMemo(() => ImageMosaicUtils.computeSizes(access(props.sources), getSizeBySrc()));

    const getKeys = createMemo(() => access(props.sources).map((source) => source.src));

    const getTargetAspectRatio = createMemo(() =>
        ImageMosaicUtils.computeTargetAspectRatio(
            access(props.targetAspectRatio) ?? IMAGE_MOSAIC_DEFAULTS.targetAspectRatio,
            access(props.sizeAnchor),
        ),
    );

    return (
        <Mosaic
            sizeAnchor={props.sizeAnchor}
            gap={props.gap}
            transitionDurationMs={props.transitionDurationMs}
            sizes={getSizes}
            keys={getKeys}
            isItemSized={true}
            computePlacements={(defs) => MosaicUtils.packScaled(defs, getTargetAspectRatio())}
            ariaLabel={props.ariaLabel}
            onActivate={props.onActivate}
            renderItem={(getIndex, getState) => {
                const renderImage = () => (
                    <img
                        class={styles.imageMosaicImage}
                        src={access(props.sources)[getIndex()]?.src}
                        alt={access(props.sources)[getIndex()]?.alt}
                        decoding="async"
                    />
                );

                return props.renderItem ? props.renderItem(renderImage, getState) : renderImage();
            }}
        />
    );
};

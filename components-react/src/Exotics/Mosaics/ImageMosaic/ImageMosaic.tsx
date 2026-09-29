import { useCallback, useEffect, useMemo, useState } from "react";

import type { MosaicPackDefs } from "@thewaver/ss-components";
import { IMAGE_MOSAIC_DEFAULTS, ImageMosaicStyles, ImageMosaicUtils, MosaicUtils } from "@thewaver/ss-components";

import { Mosaic } from "../../../Primitives/Mosaic/Mosaic";
import { useStore } from "../../../Utils/storeUtils";
import type { ImageMosaicProps } from "./ImageMosaic.types";

export const ImageMosaic = (props: ImageMosaicProps) => {
    const [loader] = useState(ImageMosaicUtils.createSizeLoader);

    const sizeBySrc = useStore(loader.store);

    useEffect(() => loader.stop, [loader]);

    useEffect(() => loader.request(props.sources), [loader, props.sources]);

    const sizes = useMemo(() => ImageMosaicUtils.computeSizes(props.sources, sizeBySrc), [props.sources, sizeBySrc]);

    const keys = useMemo(() => props.sources.map((source) => source.src), [props.sources]);

    const target = ImageMosaicUtils.computeTargetAspectRatio(
        props.targetAspectRatio ?? IMAGE_MOSAIC_DEFAULTS.targetAspectRatio,
        props.sizeAnchor,
    );

    const computePlacements = useCallback(
        (defs: MosaicPackDefs) => MosaicUtils.packScaled(defs, { width: target.width, height: target.height }),
        [target.width, target.height],
    );

    return (
        <Mosaic
            sizeAnchor={props.sizeAnchor}
            gap={props.gap}
            transitionDurationMs={props.transitionDurationMs}
            sizes={sizes}
            keys={keys}
            isItemSized={true}
            computePlacements={computePlacements}
            ariaLabel={props.ariaLabel}
            onActivate={props.onActivate}
            renderItem={(index, state) => {
                const renderImage = () => (
                    <img
                        className={ImageMosaicStyles.imageMosaicImage}
                        src={props.sources[index]?.src}
                        alt={props.sources[index]?.alt}
                        decoding="async"
                    />
                );

                return props.renderItem ? props.renderItem(renderImage, state) : renderImage();
            }}
        />
    );
};

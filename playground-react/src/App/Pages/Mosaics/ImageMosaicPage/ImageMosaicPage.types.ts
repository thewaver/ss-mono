import type { MosaicImageSource, MosaicSizeAnchor } from "@thewaver/ss-components-react";
import type { MosaicImages } from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";

export type ImagesExampleProps = {
    sources: MosaicImageSource[];
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
    shapeKey: MosaicImages.SampleShapeKey;
    isDecorated: boolean;
};

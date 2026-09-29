import type { AccessorProps, MosaicImageSource, MosaicSizeAnchor } from "@thewaver/ss-components-solid";
import type { MosaicImages } from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";

export type ImagesExampleProps = AccessorProps<{
    sources: MosaicImageSource[];
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
    shapeKey: MosaicImages.SampleShapeKey;
    isDecorated: boolean;
}>;

import type { MosaicImageSource, MosaicSizeAnchor } from "@thewaver/ss-components";

import type { MosaicImages } from "./MosaicImages.const";

export type BaseImagesExampleValues = {
    sources: MosaicImageSource[];
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
    shapeKey: MosaicImages.SampleShapeKey;
    isDecorated: boolean;
};

export type BaseImagesExampleProps = BaseImagesExampleValues;

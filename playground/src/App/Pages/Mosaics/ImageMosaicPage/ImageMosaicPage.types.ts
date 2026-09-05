import type { AccessorProps, MosaicImageSource, MosaicSizeAnchor } from "@thewaver/ss-components";

import type { MosaicImages } from "./MosaicImages.const";

export type ImagesExampleProps = AccessorProps<{
    sources: MosaicImageSource[];
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    shapeKey: MosaicImages.SampleShapeKey;
    isDecorated: boolean;
}>;

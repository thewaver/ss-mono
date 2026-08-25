import type { AccessorProps, MosaicImageSource, MosaicSizeAnchor } from "@thewaver/ss-components";

import type { MosaicImages } from "../../Samples/MosaicImages/MosaicImages.const";

export type ImageMosaicExampleProps = AccessorProps<{
    sources: MosaicImageSource[];
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    shapeKey: MosaicImages.SampleShapeKey;
}>;

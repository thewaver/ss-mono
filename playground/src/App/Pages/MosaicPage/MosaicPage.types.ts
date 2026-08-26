import type { AccessorProps, MosaicImageSource, MosaicSizeAnchor } from "@thewaver/ss-components";

import type { MosaicImages } from "./MosaicImages.const";

export type PageMosaicTileDefs = {
    name: string;
    width: number;
    height: number;
};

export type MosaicExampleProps = AccessorProps<{
    itemCount: number;
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
}>;

export type ElementsExampleProps = AccessorProps<{
    items: PageMosaicTileDefs[];
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
}>;

export type ImagesExampleProps = AccessorProps<{
    sources: MosaicImageSource[];
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    shapeKey: MosaicImages.SampleShapeKey;
    isDecorated: boolean;
}>;

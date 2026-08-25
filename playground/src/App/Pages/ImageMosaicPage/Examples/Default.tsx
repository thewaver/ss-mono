import { ImageMosaic, access } from "@thewaver/ss-components";

import type { ImageMosaicExampleProps } from "../ImageMosaicPage.types";
import { MosaicImages } from "../MosaicImages.const";

type Props = ImageMosaicExampleProps;

export const DefaultExample = ({ shapeKey, ...otherProps }: Props) => {
    return <ImageMosaic {...otherProps} targetAspectRatio={() => MosaicImages.SAMPLE_SHAPES[access(shapeKey)]} />;
};

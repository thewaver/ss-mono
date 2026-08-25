import { ImageMosaic, access } from "@thewaver/ss-components";

import { MosaicImages } from "../../../Samples/MosaicImages/MosaicImages.const";
import type { ImageMosaicExampleProps } from "../ImageMosaicPage.types";

type Props = ImageMosaicExampleProps;

export const DefaultExample = ({ shapeKey, ...otherProps }: Props) => {
    return <ImageMosaic {...otherProps} targetAspectRatio={() => MosaicImages.SAMPLE_SHAPES[access(shapeKey)]} />;
};

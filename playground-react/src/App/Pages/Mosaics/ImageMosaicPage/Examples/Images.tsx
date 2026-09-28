import { ImageMosaic } from "@thewaver/ss-components-react";
import { MosaicImages } from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";

import { PageMosaicLink } from "../../../../StyledComponents/MosaicContent/MosaicContent";
import type { ImagesExampleProps } from "../ImageMosaicPage.types";

type Props = ImagesExampleProps;

const MOSAIC_ROUTE = "/image-mosaic";

export const ImagesExample = ({ shapeKey, isDecorated, ...otherProps }: Props) => {
    return (
        <ImageMosaic
            {...otherProps}
            targetAspectRatio={MosaicImages.SAMPLE_SHAPES[shapeKey]}
            renderItem={(renderImage, state) =>
                isDecorated ? (
                    <PageMosaicLink href={MOSAIC_ROUTE} caption={`${state.readingIndex + 1} of ${state.itemCount}`}>
                        {renderImage()}
                    </PageMosaicLink>
                ) : (
                    renderImage()
                )
            }
        />
    );
};

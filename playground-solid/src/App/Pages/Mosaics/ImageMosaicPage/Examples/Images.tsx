import { ImageMosaic, access } from "@thewaver/ss-components-solid";
import { MosaicImages } from "@thewaver/ss-playground-core/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";

import { PageMosaicLink } from "../../../../StyledComponents/MosaicContent/MosaicContent";
import type { ImagesExampleProps } from "../ImageMosaicPage.types";

type Props = ImagesExampleProps;

const MOSAIC_ROUTE = "/image-mosaic";

export const ImagesExample = ({ shapeKey, isDecorated, ...otherProps }: Props) => {
    return (
        <ImageMosaic
            {...otherProps}
            targetAspectRatio={() => MosaicImages.SAMPLE_SHAPES[access(shapeKey)]}
            renderItem={(renderImage, getState) =>
                access(isDecorated) ? (
                    <PageMosaicLink
                        href={() => MOSAIC_ROUTE}
                        caption={() => `${getState().readingIndex + 1} of ${getState().itemCount}`}
                    >
                        {renderImage()}
                    </PageMosaicLink>
                ) : (
                    renderImage()
                )
            }
        />
    );
};

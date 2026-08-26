import { ImageMosaic, access } from "@thewaver/ss-components";

import { PageMosaicLink } from "../../../StyledComponents/MosaicContent/MosaicContent";
import { MosaicImages } from "../MosaicImages.const";
import type { ImagesExampleProps } from "../MosaicPage.types";

type Props = ImagesExampleProps;

const MOSAIC_ROUTE = "/mosaic";

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

import { ImageMosaic } from "@thewaver/ss-components-react";
import { MosaicImages } from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";

import { PageMosaicLink } from "../../../../StyledComponents/MosaicContent/MosaicContent";
import type { ImagesExampleProps } from "../ImageMosaicPageReact.types";

type Props = ImagesExampleProps;

const MOSAIC_ROUTE = "/image-mosaic";

export const ImagesExample = (props: Props) => {
    const { shapeKey, isDecorated, ...otherProps } = props;

    return (
        <ImageMosaic
            {...otherProps}
            targetAspectRatio={MosaicImages.SAMPLE_SHAPES[props.shapeKey]}
            renderItem={(renderImage, state) =>
                props.isDecorated ? (
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

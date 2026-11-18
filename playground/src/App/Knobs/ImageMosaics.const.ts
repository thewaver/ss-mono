import type { MosaicImages } from "../Pages/Mosaics/ImageMosaicPage/MosaicImages.const";

export namespace ImageMosaicKnobs {
    export const STARTING_SHAPE_KEY: MosaicImages.SampleShapeKey = "square";
    export const STARTING_IS_DECORATED = false;

    export const SHAPE_KEY_TEXT = {
        label: "Target shape",
        hint: "The contour the tiles are packed into.",
        controls: "Picks the sample shape sent to ImageMosaicProps.targetAspectRatio",
    };

    export const IS_DECORATED_TEXT = {
        label: "Wrapped",
        hint: "Puts each tile in a frame of its own, so the packing can be told apart from the pictures in it.",
        controls: "Decides whether the example ImageMosaicProps.renderItem wraps each image",
    };
}

import { ImageMosaic, Wraparound } from "@thewaver/ss-components-react";
import { MosaicImages } from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";
import { MOSAIC_GAP } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";

import type { WraparoundExampleProps } from "../WraparoundPage.types";

type Props = WraparoundExampleProps;

export const MosaicExample = (props: Props) => (
    <div className={styles.stage}>
        <Wraparound
            ariaLabel={"Pictures, repeating in every direction"}
            renderContent={() => (
                <div className={styles.mosaicTile}>
                    <ImageMosaic
                        sources={MosaicImages.SAMPLE_SOURCES}
                        gap={MOSAIC_GAP}
                        sizeAnchor={"width"}
                        targetAspectRatio={MosaicImages.SAMPLE_SHAPES.landscape}
                        ariaLabel={"Pictures"}
                        onActivate={(index) => props.onPress(`picture ${index + 1}`)}
                        renderItem={(renderImage) => renderImage()}
                    />
                </div>
            )}
        />
    </div>
);

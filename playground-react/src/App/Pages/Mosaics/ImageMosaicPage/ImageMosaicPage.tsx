import { useMemo, useState } from "react";

import { ImageMosaicKnobs } from "@thewaver/ss-playground-core/App/Knobs/ImageMosaics.const";
import { MosaicImages } from "@thewaver/ss-playground-core/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";
import { FIELD_WIDTH, MOSAIC_EXTENT } from "@thewaver/ss-playground-core/App/Pages/Mosaics/Mosaics.const";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import type { MosaicSharedProps } from "../Mosaics.types";
import { useMosaicsControls } from "../Mosaics.utils";
import { PageMosaicsPanel } from "../MosaicsPanel";
import { ImagesExample } from "./Examples/Images";

const EXAMPLES_ROOT = "/src/App/Pages/Mosaics/ImageMosaicPage/Examples";

const ImagesExampleWrapper = (props: MosaicSharedProps) => {
    const [shapeKey, setShapeKey] = useState<MosaicImages.SampleShapeKey>(ImageMosaicKnobs.STARTING_SHAPE_KEY);
    const [isDecorated, setIsDecorated] = useState(ImageMosaicKnobs.STARTING_IS_DECORATED);

    const sources = useMemo(() => MosaicImages.SAMPLE_SOURCES.slice(0, props.itemCount), [props.itemCount]);

    return (
        <>
            <PageMeasureBox
                width={props.sizeAnchor === "width" ? MOSAIC_EXTENT : undefined}
                height={props.sizeAnchor === "height" ? MOSAIC_EXTENT : undefined}
            >
                <ImagesExample
                    sources={sources}
                    gap={props.gap}
                    sizeAnchor={props.sizeAnchor}
                    transitionDurationMs={props.transitionDurationMs}
                    shapeKey={shapeKey}
                    isDecorated={isDecorated}
                />
            </PageMeasureBox>

            <PageExampleKnobs>
                <PageProp itemKey={"shapeKey"} label={"Target shape"} hint={"The outline the tiles are packed into."}>
                    <PageSelectField
                        value={shapeKey}
                        values={MosaicImages.SAMPLE_SHAPE_KEYS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Target shape"}
                        onChange={setShapeKey}
                    />
                </PageProp>

                <PageProp
                    itemKey={"isDecorated"}
                    label={"Wrapped"}
                    hint={
                        "Puts each tile in a frame of its own, so the packing can be told apart from the pictures in it."
                    }
                >
                    <PageCheckField value={isDecorated} ariaLabel={"Wrapped"} onChange={setIsDecorated} />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

export const ImageMosaicPage = () => {
    const controls = useMosaicsControls();

    const examples = [
        {
            key: "images",
            name: "Images the component sizes",
            readout: () =>
                "each row is scaled to fill the fixed side exactly, so the only size asked for is the shape the finished mosaic should come out closest to",
            component: () => <ImagesExampleWrapper {...controls.sharedProps} />,
            path: `${EXAMPLES_ROOT}/Images.tsx`,
        },
    ];

    return (
        <>
            <PageMosaicsPanel controls={controls} />

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};

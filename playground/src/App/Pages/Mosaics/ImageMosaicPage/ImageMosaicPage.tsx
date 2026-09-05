import { createMemo, createSignal } from "solid-js";

import { access } from "@thewaver/ss-components";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageSelectField } from "../../../StyledComponents/Field/Field";
import { FIELD_WIDTH, MOSAIC_EXTENT } from "../Mosaics.const";
import type { MosaicSharedProps } from "../Mosaics.types";
import { createMosaicsControls } from "../Mosaics.utils";
import { PageMosaicsPanel } from "../MosaicsPanel";
import { ImagesExample } from "./Examples/Images";
import { MosaicImages } from "./MosaicImages.const";

const EXAMPLES_ROOT = "/src/App/Pages/Mosaics/ImageMosaicPage/Examples";

const STARTING_SHAPE_KEY: MosaicImages.SampleShapeKey = "square";

const ImagesExampleWrapper = (props: MosaicSharedProps) => {
    const [getShapeKey, setShapeKey] = createSignal<MosaicImages.SampleShapeKey>(STARTING_SHAPE_KEY);
    const [getIsDecorated, setIsDecorated] = createSignal(false);

    const getSources = createMemo(() => MosaicImages.SAMPLE_SOURCES.slice(0, access(props.itemCount)));

    return (
        <>
            <PageMeasureBox
                width={access(props.sizeAnchor) === "width" ? () => MOSAIC_EXTENT : undefined}
                height={access(props.sizeAnchor) === "height" ? () => MOSAIC_EXTENT : undefined}
            >
                <ImagesExample
                    sources={getSources}
                    gap={props.gap}
                    sizeAnchor={props.sizeAnchor}
                    shapeKey={getShapeKey}
                    isDecorated={getIsDecorated}
                />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
                <PageProp key={"shapeKey"} label={"Target shape"}>
                    <PageSelectField
                        value={getShapeKey}
                        values={() => MosaicImages.SAMPLE_SHAPE_KEYS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Target shape"}
                        onChange={(key) => setShapeKey(() => key)}
                    />
                </PageProp>

                <PageProp key={"isDecorated"} label={"Wrapped"}>
                    <PageCheckField value={getIsDecorated} ariaLabel={"Wrapped"} onChange={setIsDecorated} />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};

export const ImageMosaicPage = () => {
    const controls = createMosaicsControls();

    const getExamples = createMemo(() => [
        {
            key: "images",
            name: "Images the component sizes",
            readout: () =>
                "each row is scaled to fill the fixed side exactly, so the only size asked for is the shape the finished mosaic should come out closest to",
            component: () => <ImagesExampleWrapper {...controls.getSharedProps()} />,
            path: `${EXAMPLES_ROOT}/Images.tsx`,
        },
    ]);

    return (
        <>
            <PageMosaicsPanel controls={controls} />

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

import { createMemo, createSignal } from "solid-js";

import type { MosaicSizeAnchor } from "@thewaver/ss-components";
import { access } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { ElementsExample } from "./Examples/Elements";
import { ImagesExample } from "./Examples/Images";
import { MosaicImages } from "./MosaicImages.const";
import type { MosaicExampleProps, PageMosaicTileDefs } from "./MosaicPage.types";

const MIN_ITEM_COUNT = 1;
const MAX_ITEM_COUNT = 12;
const ITEM_COUNT_STEP = 1;
const MIN_GAP = 0;
const MAX_GAP = 24;
const GAP_STEP = 2;
const FIELD_WIDTH = 130;
const MOSAIC_EXTENT = 380;
const EXAMPLES_ROOT = "/src/App/Pages/MosaicPage/Examples";

const SIZE_ANCHORS: MosaicSizeAnchor[] = ["width", "height"];

const STARTING_ITEM_COUNT = 9;
const STARTING_GAP = 8;
const STARTING_SIZE_ANCHOR: MosaicSizeAnchor = "width";
const STARTING_SHAPE_KEY: MosaicImages.SampleShapeKey = "square";

const TILES: PageMosaicTileDefs[] = [
    { name: "Aurora", width: 150, height: 90 },
    { name: "Basalt", width: 90, height: 140 },
    { name: "Cinder", width: 120, height: 60 },
    { name: "Drift", width: 70, height: 70 },
    { name: "Ember", width: 190, height: 50 },
    { name: "Fathom", width: 100, height: 110 },
    { name: "Glimmer", width: 60, height: 160 },
    { name: "Hollow", width: 140, height: 80 },
    { name: "Iris", width: 80, height: 100 },
    { name: "Jetty", width: 110, height: 130 },
    { name: "Kelp", width: 160, height: 70 },
    { name: "Loam", width: 50, height: 90 },
];

const ElementsExampleWrapper = (props: MosaicExampleProps) => {
    const getItems = createMemo(() => TILES.slice(0, access(props.itemCount)));

    return (
        <PageMeasureBox
            width={access(props.sizeAnchor) === "width" ? () => MOSAIC_EXTENT : undefined}
            height={access(props.sizeAnchor) === "height" ? () => MOSAIC_EXTENT : undefined}
        >
            <ElementsExample items={getItems} gap={props.gap} sizeAnchor={props.sizeAnchor} />
        </PageMeasureBox>
    );
};

const ImagesExampleWrapper = (props: MosaicExampleProps) => {
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

export const MosaicPage = () => {
    const [getItemCount, setItemCount] = createSignal(STARTING_ITEM_COUNT);
    const [getGap, setGap] = createSignal(STARTING_GAP);
    const [getSizeAnchor, setSizeAnchor] = createSignal<MosaicSizeAnchor>(STARTING_SIZE_ANCHOR);

    const getExamples = createMemo(() => {
        const commonProps: MosaicExampleProps = {
            itemCount: getItemCount,
            gap: getGap,
            sizeAnchor: getSizeAnchor,
        };

        return [
            {
                key: "elements",
                name: "Elements the consumer sizes",
                component: () => <ElementsExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Elements.tsx`,
            },
            {
                key: "images",
                name: "Images the component sizes",
                component: () => <ImagesExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Images.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"itemCount"} label={"Items"}>
                    <PageNumberField
                        value={getItemCount}
                        min={() => MIN_ITEM_COUNT}
                        max={() => MAX_ITEM_COUNT}
                        step={() => ITEM_COUNT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Items"}
                        onInput={setItemCount}
                    />
                </PageProp>

                <PageProp key={"gap"} label={"Gap (px)"}>
                    <PageNumberField
                        value={getGap}
                        min={() => MIN_GAP}
                        max={() => MAX_GAP}
                        step={() => GAP_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Gap in pixels"}
                        onInput={setGap}
                    />
                </PageProp>

                <PageProp key={"sizeAnchor"} label={"Fixed side"}>
                    <PageSelectField
                        value={getSizeAnchor}
                        values={() => SIZE_ANCHORS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Fixed side"}
                        onChange={(anchor) => setSizeAnchor(() => anchor)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

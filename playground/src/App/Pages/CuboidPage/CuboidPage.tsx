import { createMemo, createSignal } from "solid-js";

import { CuboidUtils } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField } from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";

const MIN_EXTENT = 40;
const MAX_EXTENT = 400;
const EXTENT_STEP = 10;
const STARTING_WIDTH = 200;
const STARTING_HEIGHT = 260;
const STARTING_DEPTH = 120;

const MIN_DURATION_MS = 0;
const MAX_DURATION_MS = 3000;
const DURATION_STEP_MS = 100;
const STARTING_DURATION_MS = 600;

const FIELD_WIDTH = 110;
const EXAMPLES_ROOT = "/src/App/Pages/CuboidPage/Examples";

export const CuboidPage = () => {
    const [getWidth, setWidth] = createSignal(STARTING_WIDTH);
    const [getHeight, setHeight] = createSignal(STARTING_HEIGHT);
    const [getDepth, setDepth] = createSignal(STARTING_DEPTH);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(STARTING_DURATION_MS);

    const yawSignal = createSignal(0);
    const pitchSignal = createSignal(0);

    const getSize = createMemo(() => ({ width: getWidth(), height: getHeight(), depth: getDepth() }));

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "Six faces, two turns",
            readout: () =>
                `${CuboidUtils.getFacing(yawSignal[0](), pitchSignal[0]())} — across ${yawSignal[0]()}, up ${pitchSignal[0]()}; the two counts are quarter turns rather than a face, so the box always takes the way it was pushed`,
            component: () => (
                <DefaultExample
                    yawSignal={yawSignal}
                    pitchSignal={pitchSignal}
                    size={getSize}
                    transitionDurationMs={getTransitionDurationMs}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"width"} label={"Width (px)"}>
                    <PageNumberField
                        value={getWidth}
                        min={() => MIN_EXTENT}
                        max={() => MAX_EXTENT}
                        step={() => EXTENT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Width in pixels"}
                        onInput={setWidth}
                    />
                </PageProp>

                <PageProp key={"height"} label={"Height (px)"}>
                    <PageNumberField
                        value={getHeight}
                        min={() => MIN_EXTENT}
                        max={() => MAX_EXTENT}
                        step={() => EXTENT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Height in pixels"}
                        onInput={setHeight}
                    />
                </PageProp>

                <PageProp key={"depth"} label={"Depth (px)"}>
                    <PageNumberField
                        value={getDepth}
                        min={() => MIN_EXTENT}
                        max={() => MAX_EXTENT}
                        step={() => EXTENT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Depth in pixels"}
                        onInput={setDepth}
                    />
                </PageProp>

                <PageProp key={"transitionDurationMs"} label={"Turn duration (ms)"}>
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={() => MIN_DURATION_MS}
                        max={() => MAX_DURATION_MS}
                        step={() => DURATION_STEP_MS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Turn duration in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};

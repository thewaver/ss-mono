import { For, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { SVGDefsSamples } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import {
    type WithNoSample,
    splitEntriesIntoGroups,
    toGroupEntriesWithNoSample,
} from "../../PageComponents/SampleGroups/SampleGroups.const";
import {
    PageColorField,
    PageGroupedSelectField,
    PageNumberField,
    PageSelectField,
} from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import type { SVGPatternsExampleProps } from "./SVGPatternsPage.types";

import * as styles from "./SVGPatternsPage.css";

const GROUPPED_PATTERNS = splitEntriesIntoGroups(SVGDefsSamples.Pattern.SAMPLE_CONFIGS);

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGPatternsPage/Examples/Default.tsx";

const MIN_CELL_SIZE = 10;
const MAX_CELL_SIZE = 160;
const CELL_SIZE_STEP = 10;
const MIN_BLUR_WIDTH = 0;
const MAX_BLUR_WIDTH = 40;
const BLUR_WIDTH_STEP = 1;
const MIN_DURATION_MS = 1000;
const MAX_DURATION_MS = 5000;
const DURATION_STEP_MS = 100;

export const SVGPatternsPage = () => {
    const [getConfigKey, setConfigKey] = createSignal<WithNoSample<SVGDefsSamples.Pattern.SampleKey>>("hexagon_pt_2");
    const [getIterationConfigKey, setIterationConfigKey] = createSignal<SVGDefsSamples.Iteration.SampleKey>("constant");
    const [getAnimationDurationMs, setAnimationDurationMs] = createSignal(2000);
    const [getCellSize, setCellSize] = createSignal(60);
    const [getBlurWidth, setBlurWidth] = createSignal(0);
    const [colors, setColors] = createStore({ ...SVGDefsSamples.SAMPLE_COLORS });

    const getExamples = createMemo(() => {
        const commonProps: SVGPatternsExampleProps = {
            configKey: getConfigKey,
            iterationConfigKey: getIterationConfigKey,
            animationDurationMs: getAnimationDurationMs,
            colors: () => colors,
            cellSize: () => ({ width: getCellSize(), height: getCellSize() }),
            blurWidth: getBlurWidth,
        };

        return [
            {
                key: "default",
                name: "Default",
                component: () => <DefaultExample {...commonProps} />,
                path: DEFAULT_EXAMPLE_PATH,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"configKey"} label={"Pattern"}>
                    <PageGroupedSelectField
                        value={getConfigKey}
                        groups={() => toGroupEntriesWithNoSample(GROUPPED_PATTERNS)}
                        ariaLabel={"Pattern"}
                        onChange={(config) => setConfigKey(() => config)}
                    />
                </PageProp>

                <PageProp key={"cellSize"} label={"Cell Size (px)"}>
                    <PageNumberField
                        value={getCellSize}
                        min={() => MIN_CELL_SIZE}
                        max={() => MAX_CELL_SIZE}
                        step={() => CELL_SIZE_STEP}
                        ariaLabel={"Cell size"}
                        onInput={setCellSize}
                    />
                </PageProp>

                <PageProp key={"colors"} label={"Colors"}>
                    <div class={styles.colorList}>
                        <For each={Object.keys(colors)}>
                            {(key) => (
                                <PageColorField
                                    value={() => colors[key as keyof typeof colors]}
                                    ariaLabel={() => key}
                                    onInput={(value) => setColors(key as keyof typeof colors, value)}
                                />
                            )}
                        </For>
                    </div>
                </PageProp>

                <PageProp key={"blurWidth"} label={"Blur (px)"}>
                    <PageNumberField
                        value={getBlurWidth}
                        min={() => MIN_BLUR_WIDTH}
                        max={() => MAX_BLUR_WIDTH}
                        step={() => BLUR_WIDTH_STEP}
                        ariaLabel={"Blur width"}
                        onInput={setBlurWidth}
                    />
                </PageProp>

                <PageProp key={"animationDurationMs"} label={"Animation duration (ms)"}>
                    <PageNumberField
                        value={getAnimationDurationMs}
                        min={() => MIN_DURATION_MS}
                        max={() => MAX_DURATION_MS}
                        step={() => DURATION_STEP_MS}
                        ariaLabel={"Animation duration"}
                        onInput={setAnimationDurationMs}
                    />
                </PageProp>

                <PageProp key={"iterationConfigKey"} label={"Iteration Pattern"}>
                    <PageSelectField
                        value={getIterationConfigKey}
                        values={() =>
                            Object.keys(
                                SVGDefsSamples.Iteration.SAMPLE_CONFIGS,
                            ) as (keyof typeof SVGDefsSamples.Iteration.SAMPLE_CONFIGS)[]
                        }
                        ariaLabel={"Iteration pattern"}
                        onChange={(config) => setIterationConfigKey(() => config)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

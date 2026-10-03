import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { SVGDefsSamples } from "@thewaver/ss-components-solid";
import { toGroupEntriesWithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";

import { SVGPatternKnobs } from "../../../Knobs/SVGPatterns.const";
import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageGroupedSelectField, PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { GROUPPED_TIMED_PATTERNS } from "../SVGPatterns.const";
import type { TimedPatternExampleProps } from "../SVGPatterns.types";
import { PageSVGPatternsProps } from "../SVGPatternsProps";
import { DefaultExample } from "./Examples/Default";

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGPatterns/TimedPatternsPage/Examples/Default.tsx";

export const TimedPatternsPage = () => {
    const [getConfigKey, setConfigKey] = createSignal<WithNoSample<SVGDefsSamples.Pattern.Timed.SampleKey>>(
        SVGPatternKnobs.STARTING_TIMED_PATTERN_KEY,
    );
    const [getIterationConfigKey, setIterationConfigKey] = createSignal<SVGDefsSamples.Iteration.SampleKey>(
        SVGPatternKnobs.STARTING_ITERATION_KEY,
    );
    const [getAnimationDurationMs, setAnimationDurationMs] = createSignal(SVGPatternKnobs.STARTING_DURATION_MS);
    const cellSizeSignal = createSignal(SVGPatternKnobs.STARTING_CELL_SIZE);
    const blurWidthSignal = createSignal(SVGPatternKnobs.STARTING_BLUR_WIDTH);
    const [colors, setColors] = createStore({ ...SVGDefsSamples.SAMPLE_COLORS });

    const getExamples = createMemo(() => {
        const commonProps: TimedPatternExampleProps = {
            configKey: getConfigKey,
            iterationConfigKey: getIterationConfigKey,
            animationDurationMs: getAnimationDurationMs,
            colors: () => colors,
            cellSize: () => ({ width: cellSizeSignal[0](), height: cellSizeSignal[0]() }),
            blurWidth: blurWidthSignal[0],
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
                <PageProp key={"configKey"} label={"Pattern"} hint={"Which repeating pattern is shown."}>
                    <PageGroupedSelectField
                        value={getConfigKey}
                        groups={() => toGroupEntriesWithNoSample(GROUPPED_TIMED_PATTERNS)}
                        ariaLabel={"Pattern"}
                        onChange={(config) => setConfigKey(() => config)}
                    />
                </PageProp>

                <PageSVGPatternsProps
                    controls={{
                        cellSize: cellSizeSignal,
                        blurWidth: blurWidthSignal,
                        colors,
                        setColor: (key, value) => setColors(key, value),
                    }}
                />

                <PageProp
                    key={"animationDurationMs"}
                    label={"Animation duration (ms)"}
                    hint={"How long one pass of the pattern's animation takes."}
                >
                    <PageNumberField
                        value={getAnimationDurationMs}
                        min={() => SVGPatternKnobs.MIN_DURATION_MS}
                        max={() => SVGPatternKnobs.MAX_DURATION_MS}
                        step={() => SVGPatternKnobs.DURATION_STEP_MS}
                        ariaLabel={"Animation duration"}
                        onInput={setAnimationDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"iterationConfigKey"}
                    label={"Iteration Pattern"}
                    hint={"How the animation repeats: once, endlessly, or back and forth."}
                >
                    <PageSelectField
                        value={getIterationConfigKey}
                        values={() => SVGDefsSamples.Iteration.SAMPLE_KEYS}
                        ariaLabel={"Iteration pattern"}
                        onChange={(config) => setIterationConfigKey(() => config)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

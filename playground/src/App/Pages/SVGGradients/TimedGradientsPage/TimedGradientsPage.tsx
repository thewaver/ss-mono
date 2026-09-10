import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import type { SampleKnob } from "@thewaver/ss-components";
import { SVGDefsSamples, TimedGradientKnobs } from "@thewaver/ss-components";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageKnobs } from "../../../PageComponents/Knobs/Knobs";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { NO_SAMPLE_KEY, toGroupEntriesWithNoSample } from "../../../PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "../../../PageComponents/SampleGroups/SampleGroups.types";
import { PageGroupedSelectField, PageNumberField, PageSelectField } from "../../../StyledComponents/Field/Field";
import { DURATION_STEP_MS, GROUPPED_TIMED_GRADIENTS, MAX_DURATION_MS, MIN_DURATION_MS } from "../SVGGradients.const";
import type { SVGGradientsPaintKind, TimedGradientExampleProps } from "../SVGGradients.types";
import { PageSVGGradientsProps } from "../SVGGradientsProps";
import { DefaultExample } from "./Examples/Default";

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGGradients/TimedGradientsPage/Examples/Default.tsx";

export const TimedGradientsPage = () => {
    const [getConfigKey, setConfigKey] =
        createSignal<WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>>("sweep_diag_1v1");
    const [configDefs, setConfigDefs] = createStore<Record<string, Record<string, number | boolean>>>({});

    const getKnobs = () => {
        const key = getConfigKey();

        return key === NO_SAMPLE_KEY ? {} : (TimedGradientKnobs.KNOBS_BY_FAMILY[key] as Record<string, SampleKnob>);
    };
    const getConfigDefs = () => configDefs[getConfigKey()] ?? {};
    const [getIterationConfigKey, setIterationConfigKey] = createSignal<SVGDefsSamples.Iteration.SampleKey>("constant");
    const [getAnimationDurationMs, setAnimationDurationMs] = createSignal(2000);
    const paintKindSignal = createSignal<SVGGradientsPaintKind>("fill");
    const blurWidthSignal = createSignal(0);
    const [colors, setColors] = createStore({ ...SVGDefsSamples.SAMPLE_COLORS });

    const getExamples = createMemo(() => {
        const commonProps: TimedGradientExampleProps = {
            configDefs: getConfigDefs,
            configKey: getConfigKey,
            paintKind: paintKindSignal[0],
            iterationConfigKey: getIterationConfigKey,
            animationDurationMs: getAnimationDurationMs,
            colors: () => colors,
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
                <PageProp key={"configKey"} label={"Gradient"}>
                    <PageGroupedSelectField
                        value={getConfigKey}
                        groups={() => toGroupEntriesWithNoSample(GROUPPED_TIMED_GRADIENTS)}
                        ariaLabel={"Gradient"}
                        onChange={(config) => setConfigKey(() => config)}
                    />
                </PageProp>

                <PageKnobs
                    knobs={getKnobs}
                    defaults={() => ({})}
                    values={getConfigDefs}
                    onInput={(key, value) =>
                        setConfigDefs(getConfigKey(), (previous) => ({ ...previous, [key]: value }))
                    }
                />

                <PageSVGGradientsProps
                    controls={{
                        paintKindSignal,
                        blurWidthSignal,
                        colors,
                        setColor: (key, value) => setColors(key, value),
                    }}
                />

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

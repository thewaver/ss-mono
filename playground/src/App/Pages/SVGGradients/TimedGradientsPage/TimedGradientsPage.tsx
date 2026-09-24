import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { SVGDefsSamples, TimedGradientDefaults } from "@thewaver/ss-components";

import { SVGGradientKnobs } from "../../../Knobs/SVGGradients.const";
import { TimedGradientKnobs } from "../../../Knobs/TimedGradients.const";
import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageKnobs } from "../../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../../PageComponents/Knobs/Knobs.types";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { NO_SAMPLE_KEY, toGroupEntriesWithNoSample } from "../../../PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "../../../PageComponents/SampleGroups/SampleGroups.types";
import { PageGroupedSelectField, PageNumberField, PageSelectField } from "../../../StyledComponents/Field/Field";
import { GROUPPED_TIMED_GRADIENTS } from "../SVGGradients.const";
import type { SVGGradientsPaintKind, TimedGradientExampleProps } from "../SVGGradients.types";
import { PageSVGGradientsProps } from "../SVGGradientsProps";
import { DefaultExample } from "./Examples/Default";

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGGradients/TimedGradientsPage/Examples/Default.tsx";

export const TimedGradientsPage = () => {
    const [getConfigKey, setConfigKey] = createSignal<WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>>(
        SVGGradientKnobs.STARTING_TIMED_GRADIENT_KEY,
    );
    const [configDefs, setConfigDefs] = createStore<Record<string, Record<string, number | boolean>>>({});

    const getKnobs = () => {
        const key = getConfigKey();

        return key === NO_SAMPLE_KEY ? {} : (TimedGradientKnobs.KNOBS_BY_FAMILY[key] as Record<string, Knob>);
    };
    const getDefaults = () => {
        const key = getConfigKey();

        return key === NO_SAMPLE_KEY ? {} : (TimedGradientDefaults.DEFAULTS_BY_FAMILY[key] as Record<string, unknown>);
    };
    const getConfigDefs = () => configDefs[getConfigKey()] ?? {};
    const [getIterationConfigKey, setIterationConfigKey] = createSignal<SVGDefsSamples.Iteration.SampleKey>(
        SVGGradientKnobs.STARTING_ITERATION_KEY,
    );
    const [getAnimationDurationMs, setAnimationDurationMs] = createSignal(SVGGradientKnobs.STARTING_DURATION_MS);
    const paintKindSignal = createSignal<SVGGradientsPaintKind>(SVGGradientKnobs.STARTING_PAINT_KIND);
    const blurWidthSignal = createSignal(SVGGradientKnobs.STARTING_BLUR_WIDTH);
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
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        key={"configKey"}
                        label={"Gradient"}
                        hint={"Which animated gradient is shown. Choosing one brings its own knobs with it."}
                    >
                        <PageGroupedSelectField
                            value={getConfigKey}
                            groups={() => toGroupEntriesWithNoSample(GROUPPED_TIMED_GRADIENTS)}
                            ariaLabel={"Gradient"}
                            onChange={(config) => setConfigKey(() => config)}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={getKnobs}
                        defaults={() => getDefaults()}
                        values={getConfigDefs}
                        onInput={(key, value) =>
                            setConfigDefs(getConfigKey(), (previous) => ({ ...previous, [key]: value }))
                        }
                    />
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageSVGGradientsProps
                        controls={{
                            paintKindSignal,
                            blurWidthSignal,
                            colors,
                            setColor: (key, value) => setColors(key, value),
                        }}
                    />

                    <PageProp
                        key={"animationDurationMs"}
                        label={"Animation duration (ms)"}
                        hint={"How long one pass of the gradient's animation takes."}
                    >
                        <PageNumberField
                            value={getAnimationDurationMs}
                            min={() => SVGGradientKnobs.MIN_DURATION_MS}
                            max={() => SVGGradientKnobs.MAX_DURATION_MS}
                            step={() => SVGGradientKnobs.DURATION_STEP_MS}
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
            </PagePropsGroups>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

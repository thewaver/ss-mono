import { useState } from "react";

import { SVGDefsSamples, TimedGradientDefaults } from "@thewaver/ss-components-react";
import {
    NO_SAMPLE_KEY,
    toGroupEntriesWithNoSample,
} from "@thewaver/ss-playground-core/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground-core/App/PageComponents/SampleGroups/SampleGroups.types";

import { SVGGradientKnobs } from "../../../Knobs/SVGGradients.const";
import { TimedGradientKnobs } from "../../../Knobs/TimedGradients.const";
import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageGroupedSelectField, PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageKnobs } from "../../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../../PageComponents/Knobs/Knobs.types";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { GROUPPED_TIMED_GRADIENTS } from "../SVGGradients.const";
import type { SVGGradientsPaintKind, TimedGradientExampleProps } from "../SVGGradients.types";
import { PageSVGGradientsProps } from "../SVGGradientsProps";
import { DefaultExample } from "./Examples/Default";

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGGradients/TimedGradientsPage/Examples/Default.tsx";

const TIMED_GRADIENT_GROUPS = toGroupEntriesWithNoSample(GROUPPED_TIMED_GRADIENTS);

export const TimedGradientsPage = () => {
    const [configKey, setConfigKey] = useState<WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>>(
        SVGGradientKnobs.STARTING_TIMED_GRADIENT_KEY,
    );
    const [configDefsByKey, setConfigDefsByKey] = useState<Record<string, Record<string, number | boolean>>>({});

    const knobs =
        configKey === NO_SAMPLE_KEY ? {} : (TimedGradientKnobs.KNOBS_BY_FAMILY[configKey] as Record<string, Knob>);
    const defaults =
        configKey === NO_SAMPLE_KEY
            ? {}
            : (TimedGradientDefaults.DEFAULTS_BY_FAMILY[configKey] as Record<string, unknown>);
    const configDefs = configDefsByKey[configKey] ?? {};
    const [iterationConfigKey, setIterationConfigKey] = useState<SVGDefsSamples.Iteration.SampleKey>(
        SVGGradientKnobs.STARTING_ITERATION_KEY,
    );
    const [animationDurationMs, setAnimationDurationMs] = useState(SVGGradientKnobs.STARTING_DURATION_MS);
    const paintKindState = useState<SVGGradientsPaintKind>(SVGGradientKnobs.STARTING_PAINT_KIND);
    const blurWidthState = useState(SVGGradientKnobs.STARTING_BLUR_WIDTH);
    const [colors, setColors] = useState({ ...SVGDefsSamples.SAMPLE_COLORS });

    const commonProps: TimedGradientExampleProps = {
        configDefs,
        configKey,
        paintKind: paintKindState[0],
        iterationConfigKey,
        animationDurationMs,
        colors,
        blurWidth: blurWidthState[0],
    };

    const examples = [
        {
            key: "default",
            name: "Default",
            component: () => <DefaultExample {...commonProps} />,
            path: DEFAULT_EXAMPLE_PATH,
        },
    ];

    return (
        <>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        itemKey={"configKey"}
                        label={"Gradient"}
                        hint={"Which animated gradient is shown. Choosing one brings its own knobs with it."}
                    >
                        <PageGroupedSelectField
                            value={configKey}
                            groups={TIMED_GRADIENT_GROUPS}
                            ariaLabel={"Gradient"}
                            onChange={(config) => setConfigKey(config)}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={knobs}
                        defaults={defaults}
                        values={configDefs}
                        onInput={(key, value) =>
                            setConfigDefsByKey((previous) => ({
                                ...previous,
                                [configKey]: { ...previous[configKey], [key]: value },
                            }))
                        }
                    />
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageSVGGradientsProps
                        controls={{
                            paintKindState,
                            blurWidthState,
                            colors,
                            setColor: (key, value) => setColors((previous) => ({ ...previous, [key]: value })),
                        }}
                    />

                    <PageProp
                        itemKey={"animationDurationMs"}
                        label={"Animation duration (ms)"}
                        hint={"How long one pass of the gradient's animation takes."}
                    >
                        <PageNumberField
                            value={animationDurationMs}
                            min={SVGGradientKnobs.MIN_DURATION_MS}
                            max={SVGGradientKnobs.MAX_DURATION_MS}
                            step={SVGGradientKnobs.DURATION_STEP_MS}
                            ariaLabel={"Animation duration"}
                            onInput={setAnimationDurationMs}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"iterationConfigKey"}
                        label={"Iteration Pattern"}
                        hint={"How the animation repeats: once, endlessly, or back and forth."}
                    >
                        <PageSelectField
                            value={iterationConfigKey}
                            values={SVGDefsSamples.Iteration.SAMPLE_KEYS}
                            ariaLabel={"Iteration pattern"}
                            onChange={(config) => setIterationConfigKey(config)}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};

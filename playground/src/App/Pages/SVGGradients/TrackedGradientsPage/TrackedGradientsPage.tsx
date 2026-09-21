import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import type { SampleKnob } from "@thewaver/ss-components";
import { SVGDefsSamples, TrackedGradientKnobs } from "@thewaver/ss-components";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageKnobs } from "../../../PageComponents/Knobs/Knobs";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { NO_SAMPLE_KEY, toGroupEntriesWithNoSample } from "../../../PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "../../../PageComponents/SampleGroups/SampleGroups.types";
import { PageGroupedSelectField } from "../../../StyledComponents/Field/Field";
import { GROUPPED_TRACKED_GRADIENTS } from "../SVGGradients.const";
import type { SVGGradientsPaintKind, TrackedGradientExampleProps } from "../SVGGradients.types";
import { PageSVGGradientsProps } from "../SVGGradientsProps";
import { ContinuityExample } from "./Examples/Continuity";
import { DefaultExample } from "./Examples/Default";

const EXAMPLES_ROOT = "/src/App/Pages/SVGGradients/TrackedGradientsPage/Examples";

const STARTING_BLUR_WIDTH = 0;

export const TrackedGradientsPage = () => {
    const [getConfigKey, setConfigKey] =
        createSignal<WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>>("spot_1");
    const [configDefs, setConfigDefs] = createStore<Record<string, Record<string, number | boolean>>>({});

    const getKnobs = () => {
        const key = getConfigKey();

        return key === NO_SAMPLE_KEY ? {} : (TrackedGradientKnobs.KNOBS_BY_FAMILY[key] as Record<string, SampleKnob>);
    };
    const getDefaults = () => {
        const key = getConfigKey();

        return key === NO_SAMPLE_KEY ? {} : (TrackedGradientKnobs.DEFAULTS_BY_FAMILY[key] as Record<string, unknown>);
    };
    const getConfigDefs = () => configDefs[getConfigKey()] ?? {};
    const paintKindSignal = createSignal<SVGGradientsPaintKind>("fill");
    const blurWidthSignal = createSignal(STARTING_BLUR_WIDTH);
    const [colors, setColors] = createStore({ ...SVGDefsSamples.SAMPLE_COLORS });

    const getExamples = createMemo(() => {
        const commonProps: TrackedGradientExampleProps = {
            configDefs: getConfigDefs,
            configKey: getConfigKey,
            paintKind: paintKindSignal[0],
            colors: () => colors,
            blurWidth: blurWidthSignal[0],
        };

        return [
            {
                key: "default",
                name: "Default",
                component: () => <DefaultExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
            {
                key: "continuity",
                name: "Continuity",
                readout: () =>
                    "four boxes, each reading the pointer against its own — a pool spans them, a hand does not",
                component: () => <ContinuityExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Continuity.tsx`,
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
                        hint={"Which pointer-following gradient is shown. Choosing one brings its own knobs with it."}
                    >
                        <PageGroupedSelectField
                            value={getConfigKey}
                            groups={() => toGroupEntriesWithNoSample(GROUPPED_TRACKED_GRADIENTS)}
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
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

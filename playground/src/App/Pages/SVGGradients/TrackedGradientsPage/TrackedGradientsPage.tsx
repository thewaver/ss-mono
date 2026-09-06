import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { SVGDefsSamples } from "@thewaver/ss-components";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { type WithNoSample, toGroupEntriesWithNoSample } from "../../../PageComponents/SampleGroups/SampleGroups.const";
import { PageGroupedSelectField } from "../../../StyledComponents/Field/Field";
import { GROUPPED_TRACKED_GRADIENTS } from "../SVGGradients.const";
import type { SVGGradientsPaintKind, TrackedGradientExampleProps } from "../SVGGradients.types";
import { PageSVGGradientsProps } from "../SVGGradientsProps";
import { DefaultExample } from "./Examples/Default";

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGGradients/TrackedGradientsPage/Examples/Default.tsx";

export const TrackedGradientsPage = () => {
    const [getConfigKey, setConfigKey] =
        createSignal<WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>>("sheen_flare_1");
    const paintKindSignal = createSignal<SVGGradientsPaintKind>("fill");
    const blurWidthSignal = createSignal(0);
    const [colors, setColors] = createStore({ ...SVGDefsSamples.SAMPLE_COLORS });

    const getExamples = createMemo(() => {
        const commonProps: TrackedGradientExampleProps = {
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
                        groups={() => toGroupEntriesWithNoSample(GROUPPED_TRACKED_GRADIENTS)}
                        ariaLabel={"Gradient"}
                        onChange={(config) => setConfigKey(() => config)}
                    />
                </PageProp>

                <PageSVGGradientsProps
                    controls={{
                        paintKindSignal,
                        blurWidthSignal,
                        colors,
                        setColor: (key, value) => setColors(key, value),
                    }}
                />
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

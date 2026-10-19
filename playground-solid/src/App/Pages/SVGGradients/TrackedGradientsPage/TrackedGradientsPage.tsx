import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { SVGDefsSamples, TrackedGradientDefaults } from "@thewaver/ss-components-solid";
import { SVGGradientKnobs } from "@thewaver/ss-playground/App/Knobs/SVGGradients.const";
import { TrackedGradientKnobs } from "@thewaver/ss-playground/App/Knobs/TrackedGradients.const";
import {
    NO_SAMPLE_KEY,
    toGroupEntriesWithNoSample,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import { GROUPPED_TRACKED_GRADIENTS } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/SVGGradients/TrackedGradientsPage/TrackedGradientsPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageGroupedSelectField } from "../../../PageComponents/Field/Field";
import { PageKnobs } from "../../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../../PageComponents/Knobs/Knobs.types";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { PageSVGGradientsProps } from "../SVGGradientsProps";
import type { SVGGradientsPaintKind, TrackedGradientExampleProps } from "../SVGGradientsSolid.types";
import { ContinuityExample } from "./Examples/Continuity";
import { DefaultExample } from "./Examples/Default";
import { ScreenOverlayExample } from "./Examples/ScreenOverlay";
import { SharedExample } from "./Examples/Shared";

export const TrackedGradientsPage = () => {
    const [getConfigKey, setConfigKey] = createSignal<WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>>(
        SVGGradientKnobs.STARTING_TRACKED_GRADIENT_KEY,
    );
    const [configDefs, setConfigDefs] = createStore<Record<string, Record<string, number | boolean>>>({});

    const getKnobs = () => {
        const key = getConfigKey();

        return key === NO_SAMPLE_KEY ? {} : (TrackedGradientKnobs.KNOBS_BY_FAMILY[key] as Record<string, Knob>);
    };
    const getDefaults = () => {
        const key = getConfigKey();

        return key === NO_SAMPLE_KEY
            ? {}
            : (TrackedGradientDefaults.DEFAULTS_BY_FAMILY[key] as Record<string, unknown>);
    };
    const getConfigDefs = () => configDefs[getConfigKey()] ?? {};
    const paintKindSignal = createSignal<SVGGradientsPaintKind>(SVGGradientKnobs.STARTING_PAINT_KIND);
    const blurWidthSignal = createSignal(SVGGradientKnobs.STARTING_BLUR_WIDTH);
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
                name: EXAMPLE_NAMES.default,
                component: () => <DefaultExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
            {
                key: "continuity",
                name: EXAMPLE_NAMES.continuity,
                readout: () =>
                    "four boxes, each reading the pointer against its own — a pool spans them, a hand does not",
                component: () => <ContinuityExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Continuity.tsx`,
            },
            {
                key: "shared",
                name: EXAMPLE_NAMES.shared,
                readout: () =>
                    "the same four boxes, now reading the pointer against the group and painting one gradient laid across all of it, so each box shows its own part of a single picture",
                component: () => <SharedExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Shared.tsx`,
            },
            {
                key: "screenOverlay",
                name: EXAMPLE_NAMES.screenOverlay,
                readout: () =>
                    "the gradient on a layer over the whole window, following the pointer everywhere; clicks pass through it, a button in the top-right corner closes it, and its sizes are a quarter of what the knobs say, since the box it fills is the whole window",
                component: () => <ScreenOverlayExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/ScreenOverlay.tsx`,
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
                        controls={
                            "Picks the sample gradient the example sends to ShapeProps.computeFillDefs or ShapeProps.computeStrokeDefs"
                        }
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
                            paintKind: paintKindSignal,
                            blurWidth: blurWidthSignal,
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

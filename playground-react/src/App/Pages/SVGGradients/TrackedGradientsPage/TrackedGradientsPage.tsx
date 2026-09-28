import { useState } from "react";

import { SVGDefsSamples, TrackedGradientDefaults } from "@thewaver/ss-components-react";
import {
    NO_SAMPLE_KEY,
    toGroupEntriesWithNoSample,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";

import { SVGGradientKnobs } from "../../../Knobs/SVGGradients.const";
import { TrackedGradientKnobs } from "../../../Knobs/TrackedGradients.const";
import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCheckField, PageGroupedSelectField } from "../../../PageComponents/Field/Field";
import { PageKnobs } from "../../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../../PageComponents/Knobs/Knobs.types";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { GROUPPED_TRACKED_GRADIENTS } from "../SVGGradients.const";
import type { SVGGradientsPaintKind, TrackedGradientExampleProps } from "../SVGGradients.types";
import { PageSVGGradientsProps } from "../SVGGradientsProps";
import { ContinuityExample } from "./Examples/Continuity";
import { DefaultExample } from "./Examples/Default";
import { TrackedGradientOverlay } from "./TrackedGradientOverlay";

const EXAMPLES_ROOT = "/src/App/Pages/SVGGradients/TrackedGradientsPage/Examples";

const TRACKED_GRADIENT_GROUPS = toGroupEntriesWithNoSample(GROUPPED_TRACKED_GRADIENTS);

export const TrackedGradientsPage = () => {
    const [configKey, setConfigKey] = useState<WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>>(
        SVGGradientKnobs.STARTING_TRACKED_GRADIENT_KEY,
    );
    const [configDefsByKey, setConfigDefsByKey] = useState<Record<string, Record<string, number | boolean>>>({});

    const knobs =
        configKey === NO_SAMPLE_KEY ? {} : (TrackedGradientKnobs.KNOBS_BY_FAMILY[configKey] as Record<string, Knob>);
    const defaults =
        configKey === NO_SAMPLE_KEY
            ? {}
            : (TrackedGradientDefaults.DEFAULTS_BY_FAMILY[configKey] as Record<string, unknown>);
    const configDefs = configDefsByKey[configKey] ?? {};
    const [isOverlayShown, setIsOverlayShown] = useState(TrackedGradientKnobs.STARTING_IS_OVERLAY_SHOWN);
    const paintKindState = useState<SVGGradientsPaintKind>(SVGGradientKnobs.STARTING_PAINT_KIND);
    const blurWidthState = useState(SVGGradientKnobs.STARTING_BLUR_WIDTH);
    const [colors, setColors] = useState({ ...SVGDefsSamples.SAMPLE_COLORS });

    const commonProps: TrackedGradientExampleProps = {
        configDefs,
        configKey,
        paintKind: paintKindState[0],
        colors,
        blurWidth: blurWidthState[0],
    };

    const examples = [
        {
            key: "default",
            name: "Default",
            component: () => <DefaultExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "continuity",
            name: "Continuity",
            readout: () => "four boxes, each reading the pointer against its own — a pool spans them, a hand does not",
            component: () => <ContinuityExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Continuity.tsx`,
        },
    ];

    return (
        <>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        itemKey={"configKey"}
                        label={"Gradient"}
                        hint={"Which pointer-following gradient is shown. Choosing one brings its own knobs with it."}
                    >
                        <PageGroupedSelectField
                            value={configKey}
                            groups={TRACKED_GRADIENT_GROUPS}
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
                        itemKey={"isOverlayShown"}
                        label={"Screen overlay"}
                        hint={
                            "Draws the gradient on a layer over the whole window, so it follows the pointer everywhere. Clicks pass through it, and a button in the top-right corner turns it off. Its sizes are a quarter of what the knobs say, since the box it fills is the whole window."
                        }
                    >
                        <PageCheckField
                            value={isOverlayShown}
                            ariaLabel={"Screen overlay"}
                            onChange={setIsOverlayShown}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={examples} layout={"flow"} />

            <TrackedGradientOverlay
                isShown={isOverlayShown}
                configDefs={configDefs}
                configKey={configKey}
                colors={colors}
                blurWidth={blurWidthState[0]}
                onClose={() => setIsOverlayShown(false)}
            />
        </>
    );
};

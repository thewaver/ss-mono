import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { SVGDefsSamples, TrackedPatternDefaults } from "@thewaver/ss-components-solid";
import {
    NO_SAMPLE_KEY,
    toGroupEntriesWithNoSample,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";

import { SVGPatternKnobs } from "../../../Knobs/SVGPatterns.const";
import { TrackedPatternKnobs } from "../../../Knobs/TrackedPatterns.const";
import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageGroupedSelectField } from "../../../PageComponents/Field/Field";
import { PageKnobs } from "../../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../../PageComponents/Knobs/Knobs.types";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { GROUPPED_TRACKED_PATTERNS } from "../SVGPatterns.const";
import type { TrackedPatternExampleProps } from "../SVGPatterns.types";
import { PageSVGPatternsProps } from "../SVGPatternsProps";
import { DefaultExample } from "./Examples/Default";

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGPatterns/TrackedPatternsPage/Examples/Default.tsx";

export const TrackedPatternsPage = () => {
    const [getConfigKey, setConfigKey] = createSignal<WithNoSample<SVGDefsSamples.Pattern.Tracked.SampleKey>>(
        SVGPatternKnobs.STARTING_TRACKED_PATTERN_KEY,
    );
    const [configDefs, setConfigDefs] = createStore<Record<string, Record<string, number | boolean>>>({});

    const getKnobs = () => {
        const key = getConfigKey();

        return key === NO_SAMPLE_KEY ? {} : (TrackedPatternKnobs.KNOBS_BY_FAMILY[key] as Record<string, Knob>);
    };
    const getDefaults = () => {
        const key = getConfigKey();

        return key === NO_SAMPLE_KEY ? {} : (TrackedPatternDefaults.DEFAULTS_BY_FAMILY[key] as Record<string, unknown>);
    };
    const getConfigDefs = () => configDefs[getConfigKey()] ?? {};
    const cellSizeSignal = createSignal(SVGPatternKnobs.STARTING_CELL_SIZE);
    const blurWidthSignal = createSignal(SVGPatternKnobs.STARTING_BLUR_WIDTH);
    const [colors, setColors] = createStore({ ...SVGDefsSamples.SAMPLE_COLORS });

    const getExamples = createMemo(() => {
        const commonProps: TrackedPatternExampleProps = {
            configKey: getConfigKey,
            configDefs: getConfigDefs,
            colors: () => colors,
            cellSize: () => ({ width: cellSizeSignal[0](), height: cellSizeSignal[0]() }),
            blurWidth: blurWidthSignal[0],
        };

        return [
            {
                key: "default",
                name: "Default",
                readout: () =>
                    "drag the corner to resize the box: drawn as one tile, the cell count follows the size; tiled, the copies appear and all of them react",
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
                        label={"Pattern"}
                        hint={"Which pointer-following pattern is shown. Choosing one brings its own knobs with it."}
                    >
                        <PageGroupedSelectField
                            value={getConfigKey}
                            groups={() => toGroupEntriesWithNoSample(GROUPPED_TRACKED_PATTERNS)}
                            ariaLabel={"Pattern"}
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
                    <PageSVGPatternsProps
                        controls={{
                            cellSize: cellSizeSignal,
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

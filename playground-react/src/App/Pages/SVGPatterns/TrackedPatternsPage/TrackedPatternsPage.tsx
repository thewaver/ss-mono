import { useMemo, useState } from "react";

import { SVGDefsSamples, TrackedPatternDefaults } from "@thewaver/ss-components-react";
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

const TRACKED_PATTERN_GROUPS = toGroupEntriesWithNoSample(GROUPPED_TRACKED_PATTERNS);

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGPatterns/TrackedPatternsPage/Examples/Default.tsx";

export const TrackedPatternsPage = () => {
    const [configKey, setConfigKey] = useState<WithNoSample<SVGDefsSamples.Pattern.Tracked.SampleKey>>(
        SVGPatternKnobs.STARTING_TRACKED_PATTERN_KEY,
    );
    const [configDefsByKey, setConfigDefsByKey] = useState<Record<string, Record<string, number | boolean>>>({});

    const knobs =
        configKey === NO_SAMPLE_KEY ? {} : (TrackedPatternKnobs.KNOBS_BY_FAMILY[configKey] as Record<string, Knob>);
    const defaults =
        configKey === NO_SAMPLE_KEY
            ? {}
            : (TrackedPatternDefaults.DEFAULTS_BY_FAMILY[configKey] as Record<string, unknown>);
    const configDefs = configDefsByKey[configKey] ?? {};
    const cellSizeState = useState(SVGPatternKnobs.STARTING_CELL_SIZE);
    const blurWidthState = useState(SVGPatternKnobs.STARTING_BLUR_WIDTH);
    const [colors, setColors] = useState({ ...SVGDefsSamples.SAMPLE_COLORS });

    const cellSize = cellSizeState[0];
    const cellSize2d = useMemo(() => ({ width: cellSize, height: cellSize }), [cellSize]);

    const commonProps: TrackedPatternExampleProps = {
        configKey,
        configDefs,
        colors,
        cellSize: cellSize2d,
        blurWidth: blurWidthState[0],
    };

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () =>
                "drag the corner to resize the box: drawn as one tile, the cell count follows the size; tiled, the copies appear and all of them react",
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
                        label={"Pattern"}
                        hint={"Which pointer-following pattern is shown. Choosing one brings its own knobs with it."}
                    >
                        <PageGroupedSelectField
                            value={configKey}
                            groups={TRACKED_PATTERN_GROUPS}
                            ariaLabel={"Pattern"}
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
                    <PageSVGPatternsProps
                        controls={{
                            cellSize: cellSizeState,
                            blurWidth: blurWidthState,
                            colors,
                            setColor: (key, value) => setColors((previous) => ({ ...previous, [key]: value })),
                        }}
                    />
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};

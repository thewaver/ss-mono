import { useMemo, useState } from "react";

import { SVGDefsSamples } from "@thewaver/ss-components-react";
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

const TIMED_PATTERN_GROUPS = toGroupEntriesWithNoSample(GROUPPED_TIMED_PATTERNS);

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGPatterns/TimedPatternsPage/Examples/Default.tsx";

export const TimedPatternsPage = () => {
    const [configKey, setConfigKey] = useState<WithNoSample<SVGDefsSamples.Pattern.Timed.SampleKey>>(
        SVGPatternKnobs.STARTING_TIMED_PATTERN_KEY,
    );
    const [iterationConfigKey, setIterationConfigKey] = useState<SVGDefsSamples.Iteration.SampleKey>(
        SVGPatternKnobs.STARTING_ITERATION_KEY,
    );
    const [animationDurationMs, setAnimationDurationMs] = useState(SVGPatternKnobs.STARTING_DURATION_MS);
    const cellSizeState = useState(SVGPatternKnobs.STARTING_CELL_SIZE);
    const blurWidthState = useState(SVGPatternKnobs.STARTING_BLUR_WIDTH);
    const [colors, setColors] = useState({ ...SVGDefsSamples.SAMPLE_COLORS });

    const cellSize = cellSizeState[0];
    const cellSize2d = useMemo(() => ({ width: cellSize, height: cellSize }), [cellSize]);

    const commonProps: TimedPatternExampleProps = {
        configKey,
        iterationConfigKey,
        animationDurationMs,
        colors,
        cellSize: cellSize2d,
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
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"configKey"} label={"Pattern"} hint={"Which repeating pattern is shown."}>
                    <PageGroupedSelectField
                        value={configKey}
                        groups={TIMED_PATTERN_GROUPS}
                        ariaLabel={"Pattern"}
                        onChange={(config) => setConfigKey(config)}
                    />
                </PageProp>

                <PageSVGPatternsProps
                    controls={{
                        cellSize: cellSizeState,
                        blurWidth: blurWidthState,
                        colors,
                        setColor: (key, value) => setColors((previous) => ({ ...previous, [key]: value })),
                    }}
                />

                <PageProp
                    itemKey={"animationDurationMs"}
                    label={"Animation duration (ms)"}
                    hint={"How long one pass of the pattern's animation takes."}
                >
                    <PageNumberField
                        value={animationDurationMs}
                        min={SVGPatternKnobs.MIN_DURATION_MS}
                        max={SVGPatternKnobs.MAX_DURATION_MS}
                        step={SVGPatternKnobs.DURATION_STEP_MS}
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

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};

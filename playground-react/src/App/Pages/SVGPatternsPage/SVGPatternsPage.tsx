import { useMemo, useState } from "react";

import { SVGDefsSamples } from "@thewaver/ss-components-react";
import {
    splitEntriesIntoGroups,
    toGroupEntriesWithNoSample,
} from "@thewaver/ss-playground-core/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground-core/App/PageComponents/SampleGroups/SampleGroups.types";
import * as styles from "@thewaver/ss-playground-core/App/Pages/SVGPatternsPage/SVGPatternsPage.css";

import { SVGPatternKnobs } from "../../Knobs/SVGPatterns.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import {
    PageColorField,
    PageGroupedSelectField,
    PageNumberField,
    PageSelectField,
} from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DefaultExample } from "./Examples/Default";
import type { SVGPatternsExampleProps } from "./SVGPatternsPage.types";

const GROUPPED_PATTERNS = splitEntriesIntoGroups(SVGDefsSamples.Pattern.SAMPLE_CONFIGS);
const PATTERN_GROUPS = toGroupEntriesWithNoSample(GROUPPED_PATTERNS);

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGPatternsPage/Examples/Default.tsx";

export const SVGPatternsPage = () => {
    const [configKey, setConfigKey] = useState<WithNoSample<SVGDefsSamples.Pattern.SampleKey>>(
        SVGPatternKnobs.STARTING_PATTERN_KEY,
    );
    const [iterationConfigKey, setIterationConfigKey] = useState<SVGDefsSamples.Iteration.SampleKey>(
        SVGPatternKnobs.STARTING_ITERATION_KEY,
    );
    const [animationDurationMs, setAnimationDurationMs] = useState(SVGPatternKnobs.STARTING_DURATION_MS);
    const [cellSize, setCellSize] = useState(SVGPatternKnobs.STARTING_CELL_SIZE);
    const [blurWidth, setBlurWidth] = useState(SVGPatternKnobs.STARTING_BLUR_WIDTH);
    const [colors, setColors] = useState({ ...SVGDefsSamples.SAMPLE_COLORS });

    const cellSize2d = useMemo(() => ({ width: cellSize, height: cellSize }), [cellSize]);

    const commonProps: SVGPatternsExampleProps = {
        configKey,
        iterationConfigKey,
        animationDurationMs,
        colors,
        cellSize: cellSize2d,
        blurWidth,
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
                        groups={PATTERN_GROUPS}
                        ariaLabel={"Pattern"}
                        onChange={(config) => setConfigKey(config)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"cellSize"}
                    label={"Cell Size (px)"}
                    hint={"How large one tile of the pattern is before it repeats."}
                >
                    <PageNumberField
                        value={cellSize}
                        min={SVGPatternKnobs.MIN_CELL_SIZE}
                        max={SVGPatternKnobs.MAX_CELL_SIZE}
                        step={SVGPatternKnobs.CELL_SIZE_STEP}
                        ariaLabel={"Cell size"}
                        onInput={setCellSize}
                    />
                </PageProp>

                <PageProp
                    itemKey={"colors"}
                    label={"Colors"}
                    hint={"The colors the pattern is drawn from. Each sample uses as many of them as it needs."}
                >
                    <div className={styles.colorList}>
                        {(Object.keys(colors) as (keyof typeof colors)[]).map((key) => (
                            <PageColorField
                                key={key}
                                value={colors[key]}
                                ariaLabel={key}
                                onInput={(value) => setColors((previous) => ({ ...previous, [key]: value }))}
                            />
                        ))}
                    </div>
                </PageProp>

                <PageProp
                    itemKey={"blurWidth"}
                    label={"Blur (px)"}
                    hint={"How far the pattern is blurred outward, which is what gives it its glow."}
                >
                    <PageNumberField
                        value={blurWidth}
                        min={SVGPatternKnobs.MIN_BLUR_WIDTH}
                        max={SVGPatternKnobs.MAX_BLUR_WIDTH}
                        step={SVGPatternKnobs.BLUR_WIDTH_STEP}
                        ariaLabel={"Blur width"}
                        onInput={setBlurWidth}
                    />
                </PageProp>

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

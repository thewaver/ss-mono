import { useMemo, useState } from "react";

import { STAIRCASE_DEFAULTS, STAIRCASE_DIRS, StaircaseIndents } from "@thewaver/ss-components-react";
import type { StaircaseDir } from "@thewaver/ss-components-react";
import { StaircaseKnobs } from "@thewaver/ss-playground-core/App/Knobs/Staircases.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DefaultExample } from "./Examples/Default";
import type { StaircaseExampleProps } from "./StaircasePage.types";

const FIELD_WIDTH = 110;
const STAIRCASE_WIDTH = 340;
const EXAMPLES_ROOT = "/src/App/Pages/StaircasePage/Examples";

const STAGES = [
    "Visitors",
    "Signed up",
    "Activated",
    "Subscribed",
    "Renewed",
    "Advocates",
    "Champions",
    "Partners",
    "Investors",
    "Founders",
];

const DefaultExampleWrapper = (props: StaircaseExampleProps) => {
    return (
        <PageMeasureBox width={STAIRCASE_WIDTH}>
            <DefaultExample {...props} />
        </PageMeasureBox>
    );
};

export const StaircasePage = () => {
    const [stepCount, setStepCount] = useState(StaircaseKnobs.STARTING_STEP_COUNT);
    const [indent, setIndent] = useState(StaircaseKnobs.STARTING_INDENT);
    const [gap, setGap] = useState(STAIRCASE_DEFAULTS.gap);
    const [indentKey, setIndentKey] = useState<StaircaseIndents.SampleKey>(StaircaseKnobs.STARTING_INDENT_KEY);
    const [dir, setDir] = useState<StaircaseDir>(STAIRCASE_DEFAULTS.dir);

    const steps = useMemo(() => STAGES.slice(0, stepCount), [stepCount]);

    const commonProps: StaircaseExampleProps = {
        steps,
        indent,
        gap,
        dir,
        indentKey,
    };

    const examples = [
        {
            key: "default",
            name: "Default",
            component: () => <DefaultExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"stepCount"} label={"Steps"} hint={"How many steps the staircase holds."}>
                    <PageNumberField
                        value={stepCount}
                        min={StaircaseKnobs.MIN_STEP_COUNT}
                        max={StaircaseKnobs.MAX_STEP_COUNT}
                        step={StaircaseKnobs.STEP_COUNT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Steps"}
                        onInput={setStepCount}
                    />
                </PageProp>

                <PageProp
                    itemKey={"indent"}
                    label={"Indent (px)"}
                    hint={"How far one step is set in from the one before it."}
                >
                    <PageNumberField
                        value={indent}
                        min={StaircaseKnobs.MIN_INDENT}
                        max={StaircaseKnobs.MAX_INDENT}
                        step={StaircaseKnobs.INDENT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Indent"}
                        onInput={setIndent}
                    />
                </PageProp>

                <PageProp itemKey={"gap"} label={"Gap (px)"} hint={"The space between one step and the next."}>
                    <PageNumberField
                        value={gap}
                        min={StaircaseKnobs.MIN_GAP}
                        max={StaircaseKnobs.MAX_GAP}
                        step={StaircaseKnobs.GAP_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Gap"}
                        onInput={setGap}
                    />
                </PageProp>

                <PageProp itemKey={"dir"} label={"Direction"} hint={"Which way the staircase runs."}>
                    <PageSelectField
                        value={dir}
                        values={STAIRCASE_DIRS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Direction"}
                        onChange={setDir}
                    />
                </PageProp>

                <PageProp
                    itemKey={"indentKey"}
                    label={"Indent function"}
                    hint={"How the indent grows down the run: evenly, faster and faster, or in and out again."}
                >
                    <PageSelectField
                        value={indentKey}
                        values={StaircaseIndents.SAMPLE_KEYS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Indent function"}
                        onChange={setIndentKey}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};

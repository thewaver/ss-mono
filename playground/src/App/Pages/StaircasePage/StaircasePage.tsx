import { createMemo, createSignal } from "solid-js";

import { STAIRCASE_DEFAULTS, STAIRCASE_DIRS, StaircaseIndents } from "@thewaver/ss-components";
import type { StaircaseDir } from "@thewaver/ss-components";

import { StaircaseKnobs } from "../../Knobs/Staircases.const";
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
        <PageMeasureBox width={() => STAIRCASE_WIDTH}>
            <DefaultExample {...props} />
        </PageMeasureBox>
    );
};

export const StaircasePage = () => {
    const [getStepCount, setStepCount] = createSignal(StaircaseKnobs.STARTING_STEP_COUNT);
    const [getIndent, setIndent] = createSignal(StaircaseKnobs.STARTING_INDENT);
    const [getGap, setGap] = createSignal(STAIRCASE_DEFAULTS.gap);
    const [getIndentKey, setIndentKey] = createSignal<StaircaseIndents.SampleKey>(StaircaseKnobs.STARTING_INDENT_KEY);
    const [getDir, setDir] = createSignal<StaircaseDir>(STAIRCASE_DEFAULTS.dir);

    const getSteps = createMemo(() => STAGES.slice(0, getStepCount()));

    const getExamples = createMemo(() => {
        const commonProps: StaircaseExampleProps = {
            steps: getSteps,
            indent: getIndent,
            gap: getGap,
            dir: getDir,
            indentKey: getIndentKey,
        };

        return [
            {
                key: "default",
                name: "Default",
                component: () => <DefaultExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"stepCount"} label={"Steps"} hint={"How many steps the staircase holds."}>
                    <PageNumberField
                        value={getStepCount}
                        min={() => StaircaseKnobs.MIN_STEP_COUNT}
                        max={() => StaircaseKnobs.MAX_STEP_COUNT}
                        step={() => StaircaseKnobs.STEP_COUNT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Steps"}
                        onInput={setStepCount}
                    />
                </PageProp>

                <PageProp
                    key={"indent"}
                    label={"Indent (px)"}
                    hint={"How far one step is set in from the one before it."}
                >
                    <PageNumberField
                        value={getIndent}
                        min={() => StaircaseKnobs.MIN_INDENT}
                        max={() => StaircaseKnobs.MAX_INDENT}
                        step={() => StaircaseKnobs.INDENT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Indent"}
                        onInput={setIndent}
                    />
                </PageProp>

                <PageProp key={"gap"} label={"Gap (px)"} hint={"The space between one step and the next."}>
                    <PageNumberField
                        value={getGap}
                        min={() => StaircaseKnobs.MIN_GAP}
                        max={() => StaircaseKnobs.MAX_GAP}
                        step={() => StaircaseKnobs.GAP_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Gap"}
                        onInput={setGap}
                    />
                </PageProp>

                <PageProp key={"dir"} label={"Direction"} hint={"Which way the staircase runs."}>
                    <PageSelectField
                        value={getDir}
                        values={() => STAIRCASE_DIRS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Direction"}
                        onChange={(dir) => setDir(() => dir)}
                    />
                </PageProp>

                <PageProp
                    key={"indentKey"}
                    label={"Indent function"}
                    hint={"How the indent grows down the run: evenly, faster and faster, or in and out again."}
                >
                    <PageSelectField
                        value={getIndentKey}
                        values={() => StaircaseIndents.SAMPLE_KEYS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Indent function"}
                        onChange={(key) => setIndentKey(() => key)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

import { useState } from "react";

import { Button } from "@thewaver/ss-components-react";
import type { Step } from "@thewaver/ss-components-react";
import { StepperKnobs } from "@thewaver/ss-playground/App/Knobs/Steppers.const";
import { LABELS, ORDER } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";
import { ArcExample } from "./Examples/Arc";
import { BareExample } from "./Examples/Bare";
import { DetailedExample } from "./Examples/Detailed";
import { FailedExample } from "./Examples/Failed";
import { LinearExample } from "./Examples/Linear";
import { StackedExample } from "./Examples/Stacked";
import { STATE_WORDS } from "./StepperPage.const";

const STARTING_LINEAR: StepValue = "address";
const STARTING_FAILED: StepValue = "payment";
const STARTING_STACKED: StepValue = "address";
const STARTING_DETAILED: StepValue = "payment";
const EXAMPLES_ROOT = "/src/App/Pages/StepperPage/Examples";

export const StepperPage = () => {
    const [isFreeNavigation, setIsFreeNavigation] = useState(StepperKnobs.STARTING_IS_FREE_NAVIGATION);

    const [linearCurrent, setLinearCurrent] = useState<StepValue>(STARTING_LINEAR);
    const [failedCurrent, setFailedCurrent] = useState<StepValue>(STARTING_FAILED);
    const [stackedCurrent, setStackedCurrent] = useState<StepValue>(STARTING_STACKED);
    const [detailedCurrent, setDetailedCurrent] = useState<StepValue>(STARTING_DETAILED);
    const [arcCurrent, setArcCurrent] = useState<StepValue>(STARTING_LINEAR);

    const reset = () => {
        setLinearCurrent(STARTING_LINEAR);
        setFailedCurrent(STARTING_FAILED);
        setStackedCurrent(STARTING_STACKED);
        setDetailedCurrent(STARTING_DETAILED);
        setArcCurrent(STARTING_LINEAR);
    };

    const computeState = (value: StepValue, current: StepValue): PageStepState => {
        if (value === current) return "current";

        return ORDER.indexOf(value) < ORDER.indexOf(current) ? "done" : "ahead";
    };

    const buildSteps = (
        current: StepValue,
        overrides: Partial<Record<StepValue, PageStepState>> = {},
    ): Step<StepValue, PageStepState>[] =>
        ORDER.map((value) => {
            const state = overrides[value] ?? computeState(value, current);

            return {
                value,
                state,
                isNavigable: isFreeNavigation || state === "done" || state === "failed",
            };
        });

    const describe = (step: Step<StepValue, PageStepState>, index: number) =>
        `Step ${index + 1} of ${ORDER.length}, ${LABELS[step.value]}, ${STATE_WORDS[step.state]}`;

    const examples = [
        {
            key: "linear",
            name: "Linear",
            readout: () =>
                `current: ${linearCurrent} — only the steps behind you can be pressed, unless free navigation is on`,
            component: () => (
                <LinearExample
                    steps={buildSteps(linearCurrent)}
                    currentValue={linearCurrent}
                    computeStepAriaLabel={describe}
                    onCurrentChange={setLinearCurrent}
                />
            ),
            path: `${EXAMPLES_ROOT}/Linear.tsx`,
        },
        {
            key: "failed",
            name: "A step that failed",
            readout: () =>
                `current: ${failedCurrent} — the failed step is reachable by keyboard so its tooltip can be read, and its name carries the state as words`,
            component: () => (
                <FailedExample
                    steps={buildSteps(failedCurrent, { address: "failed", details: "skipped" })}
                    currentValue={failedCurrent}
                    computeStepAriaLabel={describe}
                    onCurrentChange={setFailedCurrent}
                />
            ),
            path: `${EXAMPLES_ROOT}/Failed.tsx`,
        },
        {
            key: "stacked",
            name: "Stacked",
            readout: () => `current: ${stackedCurrent} — the same steps down the page`,
            component: () => (
                <StackedExample
                    steps={buildSteps(stackedCurrent)}
                    currentValue={stackedCurrent}
                    computeStepAriaLabel={describe}
                    onCurrentChange={setStackedCurrent}
                />
            ),
            path: `${EXAMPLES_ROOT}/Stacked.tsx`,
        },
        {
            key: "detailed",
            name: "Steps that carry their own content",
            readout: () =>
                `current: ${detailedCurrent} — each step holds a body beside the connector, so the line runs past the content rather than stopping at it`,
            component: () => (
                <DetailedExample
                    steps={buildSteps(detailedCurrent)}
                    currentValue={detailedCurrent}
                    computeStepAriaLabel={describe}
                    onCurrentChange={setDetailedCurrent}
                />
            ),
            path: `${EXAMPLES_ROOT}/Detailed.tsx`,
        },
        {
            key: "arc",
            span: 2,
            name: "The same steps, bent along an arc",
            readout: () =>
                `current: ${arcCurrent} — one layout function, and the run between two steps follows the curve they sit on rather than cutting across it`,
            component: () => (
                <ArcExample
                    steps={buildSteps(arcCurrent)}
                    currentValue={arcCurrent}
                    computeStepAriaLabel={describe}
                    onCurrentChange={setArcCurrent}
                />
            ),
            path: `${EXAMPLES_ROOT}/Arc.tsx`,
        },
        {
            key: "bare",
            name: "No connector",
            readout: () => "the connector slot is optional, so a bare strip renders nothing between the steps",
            component: () => (
                <BareExample
                    steps={buildSteps(linearCurrent)}
                    currentValue={linearCurrent}
                    computeStepAriaLabel={describe}
                    onCurrentChange={setLinearCurrent}
                />
            ),
            path: `${EXAMPLES_ROOT}/Bare.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"isFreeNavigation"}
                    label={"Free navigation"}
                    hint={"Lets any step be jumped to directly, instead of making each one be reached in order."}
                >
                    <PageCheckField
                        value={isFreeNavigation}
                        ariaLabel={"Free navigation"}
                        onChange={setIsFreeNavigation}
                    />
                </PageProp>

                <PageProp
                    itemKey={"currentStep"}
                    label={"Current step"}
                    hint={"Puts the examples back to the step they started on."}
                >
                    <Button
                        renderContent={(flags) => <PageButtonContent flags={flags}>Reset</PageButtonContent>}
                        onClick={async () => {
                            reset();
                        }}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};

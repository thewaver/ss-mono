import { createMemo, createSignal } from "solid-js";

import { Button } from "@thewaver/ss-components";
import type { Step } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageCheckField } from "../../StyledComponents/Field/Field";
import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";
import { BareExample } from "./Examples/Bare";
import { DetailedExample } from "./Examples/Detailed";
import { FailedExample } from "./Examples/Failed";
import { LinearExample } from "./Examples/Linear";
import { StackedExample } from "./Examples/Stacked";
import { LABELS, ORDER, STATE_WORDS } from "./StepperPage.const";
import type { StepValue } from "./StepperPage.types";

const STARTING_LINEAR: StepValue = "address";
const STARTING_FAILED: StepValue = "payment";
const STARTING_STACKED: StepValue = "address";
const STARTING_DETAILED: StepValue = "payment";
const EXAMPLES_ROOT = "/src/App/Pages/StepperPage/Examples";

export const StepperPage = () => {
    const [getIsFreeNavigation, setIsFreeNavigation] = createSignal(false);

    const [getLinearCurrent, setLinearCurrent] = createSignal<StepValue>(STARTING_LINEAR);
    const [getFailedCurrent, setFailedCurrent] = createSignal<StepValue>(STARTING_FAILED);
    const [getStackedCurrent, setStackedCurrent] = createSignal<StepValue>(STARTING_STACKED);
    const [getDetailedCurrent, setDetailedCurrent] = createSignal<StepValue>(STARTING_DETAILED);

    const reset = () => {
        setLinearCurrent(STARTING_LINEAR);
        setFailedCurrent(STARTING_FAILED);
        setStackedCurrent(STARTING_STACKED);
        setDetailedCurrent(STARTING_DETAILED);
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
                isNavigable: getIsFreeNavigation() || state === "done" || state === "failed",
            };
        });

    const describe = (step: Step<StepValue, PageStepState>, index: number) =>
        `Step ${index + 1} of ${ORDER.length}, ${LABELS[step.value]}, ${STATE_WORDS[step.state]}`;

    const getExamples = createMemo(() => [
        {
            key: "linear",
            name: "Linear",
            readout: () =>
                `current: ${getLinearCurrent()} — only the steps behind you can be pressed, unless free navigation is on`,
            component: () => (
                <LinearExample
                    steps={() => buildSteps(getLinearCurrent())}
                    currentValue={getLinearCurrent}
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
                `current: ${getFailedCurrent()} — the failed step is reachable by keyboard so its tooltip can be read, and its name carries the state as words`,
            component: () => (
                <FailedExample
                    steps={() => buildSteps(getFailedCurrent(), { address: "failed", details: "skipped" })}
                    currentValue={getFailedCurrent}
                    computeStepAriaLabel={describe}
                    onCurrentChange={setFailedCurrent}
                />
            ),
            path: `${EXAMPLES_ROOT}/Failed.tsx`,
        },
        {
            key: "stacked",
            name: "Stacked",
            readout: () => `current: ${getStackedCurrent()} — the same steps down the page`,
            component: () => (
                <StackedExample
                    steps={() => buildSteps(getStackedCurrent())}
                    currentValue={getStackedCurrent}
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
                `current: ${getDetailedCurrent()} — each step holds a body beside the connector, so the line runs past the content rather than stopping at it`,
            component: () => (
                <DetailedExample
                    steps={() => buildSteps(getDetailedCurrent())}
                    currentValue={getDetailedCurrent}
                    computeStepAriaLabel={describe}
                    onCurrentChange={setDetailedCurrent}
                />
            ),
            path: `${EXAMPLES_ROOT}/Detailed.tsx`,
        },
        {
            key: "bare",
            name: "No connector",
            readout: () => "the connector slot is optional, so a bare strip renders nothing between the steps",
            component: () => (
                <BareExample
                    steps={() => buildSteps(getLinearCurrent())}
                    currentValue={getLinearCurrent}
                    computeStepAriaLabel={describe}
                    onCurrentChange={setLinearCurrent}
                />
            ),
            path: `${EXAMPLES_ROOT}/Bare.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"isFreeNavigation"} label={"Free navigation"}>
                    <PageCheckField
                        value={getIsFreeNavigation}
                        ariaLabel={"Free navigation"}
                        onChange={setIsFreeNavigation}
                    />
                </PageProp>

                <PageProp key={"currentStep"} label={"Current step"}>
                    <Button
                        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reset</PageButtonContent>}
                        onClick={async () => {
                            reset();
                        }}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};

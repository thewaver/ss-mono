import { useState } from "react";

import { Stepper } from "@thewaver/ss-components-react";
import { FAILED_OVERRIDES, STARTING_FAILED } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import { PageStepConnector, PageStepContent } from "../../../StyledComponents/StepContent/StepContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { StepperDocsExampleProps } from "../StepperPageReact.types";

const FAILURE_REASON = "The card was declined, so this step has to be repeated before the order can be reviewed.";
const LOCKED_REASON = "Review opens once payment succeeds, so there is nothing to look at here yet.";

const REASONS = { failed: FAILURE_REASON, ahead: LOCKED_REASON };

type Props = StepperDocsExampleProps;

export const FailedDocsExample = (props: Props) => {
    const [current, setCurrent] = useState<StepValue>(STARTING_FAILED);

    return (
        <Stepper
            steps={StepperPageUtils.buildSteps("failed", current, props.isFreeNavigation, FAILED_OVERRIDES)}
            currentValue={current}
            gap={STEPPER_GAP}
            ariaLabel={"Checkout with a failure"}
            computeStepAriaLabel={StepperPageUtils.describeStep}
            computeTooltipDefs={(step) => {
                const reason = step.state === "failed" || step.state === "ahead" ? REASONS[step.state] : undefined;

                if (!reason) return undefined;

                return {
                    placement: { x: "center", y: "top_out" },
                    offset: { x: 0, y: 10 },
                    hoverShowDelayMs: 0,
                    renderContent: (visibilityTarget, transitionDurationMs) => (
                        <PageTooltipContent
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                        >
                            {reason}
                        </PageTooltipContent>
                    ),
                };
            }}
            onCurrentChange={setCurrent}
            renderStep={(step, flags) => (
                <PageStepContent
                    flags={flags}
                    state={step.state}
                    ordinal={ORDER.indexOf(step.value) + 1}
                    orientation={"horizontal"}
                >
                    {LABELS[step.value]}
                </PageStepContent>
            )}
            renderConnector={() => <PageStepConnector orientation={"horizontal"} />}
        />
    );
};

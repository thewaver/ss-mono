import { Stepper } from "@thewaver/ss-components-react";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";

import { PageStepConnector, PageStepContent } from "../../../StyledComponents/StepContent/StepContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { StepperExampleProps } from "../StepperPage.types";

const FAILURE_REASON = "The card was declined, so this step has to be repeated before the order can be reviewed.";
const LOCKED_REASON = "Review opens once payment succeeds, so there is nothing to look at here yet.";

const REASONS = { failed: FAILURE_REASON, ahead: LOCKED_REASON };

type Props = StepperExampleProps;

export const FailedExample = (props: Props) => {
    return (
        <Stepper
            steps={props.steps}
            currentValue={props.currentValue}
            gap={STEPPER_GAP}
            ariaLabel={"Checkout with a failure"}
            computeStepAriaLabel={props.computeStepAriaLabel}
            computeTooltipDefs={(step) => {
                const reason = step.state === "failed" || step.state === "ahead" ? REASONS[step.state] : undefined;

                if (!reason) return undefined;

                return {
                    placement: { x: "center", y: "top-out" },
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
            onCurrentChange={props.onCurrentChange}
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

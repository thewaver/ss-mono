<script setup lang="ts">
import { h, shallowRef } from "vue";

import { Stepper } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, Step, StepperFlags } from "@thewaver/ss-components-vue";
import { FAILED_OVERRIDES, STARTING_FAILED } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import PageStepConnector from "../../../StyledComponents/StepContent/PageStepConnector.vue";
import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.vue";
import type { PageStepState } from "../../../StyledComponents/StepContent/StepContentVue.types";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { StepperDocsExampleProps } from "../StepperPageVue.types";

const FAILURE_REASON = "The card was declined, so this step has to be repeated before the order can be reviewed.";
const LOCKED_REASON = "Review opens once payment succeeds, so there is nothing to look at here yet.";

const REASONS = { failed: FAILURE_REASON, ahead: LOCKED_REASON };

type Props = StepperDocsExampleProps;

const props = defineProps<Props>();

const current = shallowRef<StepValue>(STARTING_FAILED);

const computeTooltipDefs = (step: Step<StepValue, PageStepState>): InteractionTooltipDefs<StepperFlags> | undefined => {
    const reason = step.state === "failed" || step.state === "ahead" ? REASONS[step.state] : undefined;

    if (!reason) return undefined;

    return {
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        hoverShowDelayMs: 0,
        renderContent: ({ visibilityTarget, transitionDurationMs }) =>
            h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => reason),
    };
};
</script>

<template>
    <Stepper
        :steps="StepperPageUtils.buildSteps('failed', current, props.isFreeNavigation, FAILED_OVERRIDES)"
        :current-value="current"
        :gap="STEPPER_GAP"
        ariaLabel="Checkout with a failure"
        :compute-step-aria-label="StepperPageUtils.describeStep"
        :compute-tooltip-defs="computeTooltipDefs"
        @current-change="(value: StepValue) => (current = value)"
    >
        <template #renderStep="{ step, flags }">
            <PageStepContent
                :flags="flags"
                :state="step.state"
                :ordinal="ORDER.indexOf(step.value) + 1"
                orientation="horizontal"
                >{{ LABELS[step.value as StepValue] }}</PageStepContent
            >
        </template>

        <template #renderConnector>
            <PageStepConnector orientation="horizontal" />
        </template>
    </Stepper>
</template>

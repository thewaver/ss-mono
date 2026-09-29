<script setup lang="ts">
import { Stepper } from "@thewaver/ss-components-vue";
import { BODIES, LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import PageStepBody from "../../../StyledComponents/StepContent/PageStepBody.vue";
import PageStepConnector from "../../../StyledComponents/StepContent/PageStepConnector.vue";
import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.vue";
import type { StepperExampleProps } from "../StepperPage.types";

type Props = StepperExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <Stepper
        :steps="steps"
        :current-value="currentValue"
        orientation="vertical"
        :gap="STEPPER_GAP"
        ariaLabel="Checkout with notes"
        :compute-step-aria-label="computeStepAriaLabel"
        @current-change="props.onCurrentChange"
    >
        <template #renderStep="{ step, flags }">
            <PageStepContent
                :flags="flags"
                :state="step.state"
                :ordinal="ORDER.indexOf(step.value) + 1"
                orientation="vertical"
                >{{ LABELS[step.value as StepValue] }}</PageStepContent
            >
        </template>

        <template #renderBody="{ step }">
            <PageStepBody>{{ BODIES[step.value as StepValue] }}</PageStepBody>
        </template>

        <template #renderConnector>
            <PageStepConnector orientation="vertical" is-rail />
        </template>
    </Stepper>
</template>

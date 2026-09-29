<script setup lang="ts">
import { Stepper } from "@thewaver/ss-components-vue";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

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
        ariaLabel="Stacked checkout"
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

        <template #renderConnector>
            <PageStepConnector orientation="vertical" />
        </template>
    </Stepper>
</template>

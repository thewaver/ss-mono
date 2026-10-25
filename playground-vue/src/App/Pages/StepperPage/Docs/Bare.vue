<script setup lang="ts">
import { shallowRef } from "vue";

import { Stepper } from "@thewaver/ss-components-vue";
import { STARTING_LINEAR } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.vue";
import type { StepperDocsExampleProps } from "../StepperPageVue.types";

type Props = StepperDocsExampleProps;

const props = defineProps<Props>();

const current = shallowRef<StepValue>(STARTING_LINEAR);
</script>

<template>
    <Stepper
        :steps="StepperPageUtils.buildSteps('bare', current, props.isFreeNavigation)"
        :current-value="current"
        :gap="STEPPER_GAP"
        ariaLabel="Checkout without connectors"
        :compute-step-aria-label="StepperPageUtils.describeStep"
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
    </Stepper>
</template>

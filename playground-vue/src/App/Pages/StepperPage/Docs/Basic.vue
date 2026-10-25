<script setup lang="ts">
import { shallowRef } from "vue";

import { Stepper } from "@thewaver/ss-components-vue";
import { STARTING_LINEAR } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import PageStepConnector from "../../../StyledComponents/StepContent/PageStepConnector.vue";
import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.vue";
import type { StepperBasicDocsExampleProps } from "../StepperPageVue.types";

type Props = StepperBasicDocsExampleProps;

const props = defineProps<Props>();

const current = shallowRef<StepValue>(STARTING_LINEAR);
</script>

<template>
    <Stepper
        :steps="StepperPageUtils.buildSteps('basic', current, props.isFreeNavigation)"
        :current-value="current"
        :orientation="orientation"
        :gap="STEPPER_GAP"
        ariaLabel="Checkout"
        :compute-step-aria-label="StepperPageUtils.describeStep"
        @current-change="(value: StepValue) => (current = value)"
    >
        <template #renderStep="{ step, flags }">
            <PageStepContent
                :flags="flags"
                :state="step.state"
                :ordinal="ORDER.indexOf(step.value) + 1"
                :orientation="orientation"
                >{{ LABELS[step.value as StepValue] }}</PageStepContent
            >
        </template>

        <template #renderConnector>
            <PageStepConnector :orientation="orientation" />
        </template>
    </Stepper>
</template>

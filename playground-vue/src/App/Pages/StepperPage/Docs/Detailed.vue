<script setup lang="ts">
import { shallowRef } from "vue";

import { Stepper } from "@thewaver/ss-components-vue";
import { STARTING_DETAILED } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
import { BODIES, LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import PageStepBody from "../../../StyledComponents/StepContent/PageStepBody.vue";
import PageStepConnector from "../../../StyledComponents/StepContent/PageStepConnector.vue";
import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.vue";
import type { StepperDocsExampleProps } from "../StepperPageVue.types";

type Props = StepperDocsExampleProps;

const props = defineProps<Props>();

const current = shallowRef<StepValue>(STARTING_DETAILED);
</script>

<template>
    <Stepper
        :steps="StepperPageUtils.buildSteps('detailed', current, props.isFreeNavigation)"
        :current-value="current"
        orientation="vertical"
        :gap="STEPPER_GAP"
        ariaLabel="Checkout with notes"
        :compute-step-aria-label="StepperPageUtils.describeStep"
        @current-change="(value: StepValue) => (current = value)"
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

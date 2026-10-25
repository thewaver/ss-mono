<script setup lang="ts">
import { shallowRef } from "vue";

import { Stepper } from "@thewaver/ss-components-vue";
import {
    ARC_LAYOUT,
    ARC_WIDTH,
    STARTING_LINEAR,
} from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
import { LABELS, ORDER } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import PageStepArcCell from "../../../StyledComponents/StepContent/PageStepArcCell.vue";
import PageStepArcConnector from "../../../StyledComponents/StepContent/PageStepArcConnector.vue";
import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.vue";
import type { StepperDocsExampleProps } from "../StepperPageVue.types";

type Props = StepperDocsExampleProps;

const props = defineProps<Props>();

const current = shallowRef<StepValue>(STARTING_LINEAR);
</script>

<template>
    <div :style="{ width: ARC_WIDTH }">
        <Stepper
            :steps="StepperPageUtils.buildSteps('arc', current, props.isFreeNavigation)"
            :current-value="current"
            ariaLabel="Checkout, on an arc"
            :compute-layout="ARC_LAYOUT"
            :compute-step-aria-label="StepperPageUtils.describeStep"
            @current-change="(value: StepValue) => (current = value)"
        >
            <template #renderStep="{ step, flags }">
                <PageStepArcCell>
                    <PageStepContent
                        :flags="flags"
                        :state="step.state"
                        :ordinal="ORDER.indexOf(step.value) + 1"
                        orientation="horizontal"
                        >{{ LABELS[step.value as StepValue] }}</PageStepContent
                    >
                </PageStepArcCell>
            </template>

            <template #renderConnector="defs">
                <PageStepArcConnector :defs="defs" />
            </template>
        </Stepper>
    </div>
</template>

<script setup lang="ts">
import { PlacementLayoutUtils, Stepper } from "@thewaver/ss-components-vue";
import type { ArcDefs } from "@thewaver/ss-components-vue";
import { LABELS, ORDER } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import PageStepArcCell from "../../../StyledComponents/StepContent/PageStepArcCell.vue";
import PageStepArcConnector from "../../../StyledComponents/StepContent/PageStepArcConnector.vue";
import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.vue";
import type { StepperExampleProps } from "../StepperPage.types";

const ARC_DEFS: ArcDefs = {
    curveHeightRatio: 1,
    spreadDegrees: 135,
    itemWidthRatio: 0.222,
    itemHeightRatio: 0.403,
};

const ARC_LAYOUT = PlacementLayoutUtils.createArc(ARC_DEFS);

type Props = StepperExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <Stepper
        :steps="steps"
        :current-value="currentValue"
        ariaLabel="Checkout, on an arc"
        :compute-layout="ARC_LAYOUT"
        :compute-step-aria-label="computeStepAriaLabel"
        @current-change="props.onCurrentChange"
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
</template>

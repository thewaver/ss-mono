<script setup lang="ts">
import { Button } from "@thewaver/ss-components-vue";

import PageNumberInputStepperContent from "../../StyledComponents/NumberInputStepperContent/PageNumberInputStepperContent.vue";
import PageNumberInputStepperFrame from "../../StyledComponents/NumberInputStepperContent/PageNumberInputStepperFrame.vue";
import type { NumberInputStepperProps } from "./NumberInputStepper.types";

defineProps<NumberInputStepperProps>();
</script>

<template>
    <PageNumberInputStepperFrame>
        <Button
            :is-disabled="flags.isDisabled || flags.isReadOnly || stepper.getIsAtMax()"
            @pointer-down="stepper.startSteppingUp"
            @pointer-up="stepper.stopStepping"
            @mouse-leave="stepper.stopStepping"
        >
            <template #renderContent="buttonFlags">
                <PageNumberInputStepperContent :flags="buttonFlags" direction="up">Increase</PageNumberInputStepperContent>
            </template>
        </Button>

        <Button
            :is-disabled="flags.isDisabled || flags.isReadOnly || stepper.getIsAtMin()"
            @pointer-down="stepper.startSteppingDown"
            @pointer-up="stepper.stopStepping"
            @mouse-leave="stepper.stopStepping"
        >
            <template #renderContent="buttonFlags">
                <PageNumberInputStepperContent :flags="buttonFlags" direction="down">Decrease</PageNumberInputStepperContent>
            </template>
        </Button>
    </PageNumberInputStepperFrame>
</template>

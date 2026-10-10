<script setup lang="ts">
import { shallowRef } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import type { Step } from "@thewaver/ss-components-vue";
import { StepperKnobs } from "@thewaver/ss-playground/App/Knobs/Steppers.const";
import { LABELS, ORDER } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";
import ArcExample from "./Examples/Arc.vue";
import BareExample from "./Examples/Bare.vue";
import DetailedExample from "./Examples/Detailed.vue";
import FailedExample from "./Examples/Failed.vue";
import LinearExample from "./Examples/Linear.vue";
import StackedExample from "./Examples/Stacked.vue";
import { STATE_WORDS } from "./StepperPage.const";

const STARTING_LINEAR: StepValue = "address";
const STARTING_FAILED: StepValue = "payment";
const STARTING_STACKED: StepValue = "address";
const STARTING_DETAILED: StepValue = "payment";
const EXAMPLES_ROOT = "/src/App/Pages/StepperPage/Examples";

const isFreeNavigation = shallowRef(StepperKnobs.STARTING_IS_FREE_NAVIGATION);

const linearCurrent = shallowRef<StepValue>(STARTING_LINEAR);
const failedCurrent = shallowRef<StepValue>(STARTING_FAILED);
const stackedCurrent = shallowRef<StepValue>(STARTING_STACKED);
const detailedCurrent = shallowRef<StepValue>(STARTING_DETAILED);
const arcCurrent = shallowRef<StepValue>(STARTING_LINEAR);

const reset = () => {
    linearCurrent.value = STARTING_LINEAR;
    failedCurrent.value = STARTING_FAILED;
    stackedCurrent.value = STARTING_STACKED;
    detailedCurrent.value = STARTING_DETAILED;
    arcCurrent.value = STARTING_LINEAR;
};

const computeState = (value: StepValue, current: StepValue): PageStepState => {
    if (value === current) return "current";

    return ORDER.indexOf(value) < ORDER.indexOf(current) ? "done" : "ahead";
};

const buildSteps = (
    current: StepValue,
    overrides: Partial<Record<StepValue, PageStepState>> = {},
): Step<StepValue, PageStepState>[] =>
    ORDER.map((value) => {
        const state = overrides[value] ?? computeState(value, current);

        return {
            value,
            state,
            isNavigable: isFreeNavigation.value || state === "done" || state === "failed",
        };
    });

const describe = (step: Step<StepValue, PageStepState>, index: number) =>
    `Step ${index + 1} of ${ORDER.length}, ${LABELS[step.value]}, ${STATE_WORDS[step.state]}`;

const examples: ExampleDefs[] = [
    {
        key: "stacked",
        name: "Stacked",
        readout: () => `current: ${stackedCurrent.value} — the same steps down the page`,
        path: `${EXAMPLES_ROOT}/Stacked.vue`,
    },
    {
        key: "detailed",
        name: "Steps that carry their own content",
        readout: () =>
            `current: ${detailedCurrent.value} — each step holds a body beside the connector, so the line runs past the content rather than stopping at it`,
        path: `${EXAMPLES_ROOT}/Detailed.vue`,
    },
    {
        key: "linear",
        name: "Linear",
        readout: () =>
            `current: ${linearCurrent.value} — only the steps behind you can be pressed, unless free navigation is on`,
        path: `${EXAMPLES_ROOT}/Linear.vue`,
    },
    {
        key: "failed",
        name: "A step that failed",
        readout: () =>
            `current: ${failedCurrent.value} — the failed step is reachable by keyboard so its tooltip can be read, and its name carries the state as words`,
        path: `${EXAMPLES_ROOT}/Failed.vue`,
    },
    {
        key: "bare",
        name: "No connector",
        readout: () => "the connector slot is optional, so a bare strip renders nothing between the steps",
        path: `${EXAMPLES_ROOT}/Bare.vue`,
    },
    {
        key: "arc",
        span: 2,
        name: "The same steps, bent along an arc",
        readout: () =>
            `current: ${arcCurrent.value} — one layout function, and the run between two steps follows the curve they sit on rather than cutting across it`,
        path: `${EXAMPLES_ROOT}/Arc.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="isFreeNavigation"
            label="Free navigation"
            hint="Lets any step be jumped to directly, instead of making each one be reached in order."
        >
            <PageCheckField
                :value="isFreeNavigation"
                ariaLabel="Free navigation"
                @change="(value: boolean) => (isFreeNavigation = value)"
            />
        </PageProp>

        <PageProp
            item-key="currentStep"
            label="Current step"
            hint="Puts the examples back to the step they started on."
        >
            <Button @click="async () => reset()">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Reset</PageButtonContent>
                </template>
            </Button>
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #linear>
            <LinearExample
                :steps="buildSteps(linearCurrent)"
                :current-value="linearCurrent"
                :compute-step-aria-label="describe"
                @current-change="(value: StepValue) => (linearCurrent = value)"
            />
        </template>

        <template #failed>
            <FailedExample
                :steps="buildSteps(failedCurrent, { address: 'failed', details: 'skipped' })"
                :current-value="failedCurrent"
                :compute-step-aria-label="describe"
                @current-change="(value: StepValue) => (failedCurrent = value)"
            />
        </template>

        <template #stacked>
            <StackedExample
                :steps="buildSteps(stackedCurrent)"
                :current-value="stackedCurrent"
                :compute-step-aria-label="describe"
                @current-change="(value: StepValue) => (stackedCurrent = value)"
            />
        </template>

        <template #detailed>
            <DetailedExample
                :steps="buildSteps(detailedCurrent)"
                :current-value="detailedCurrent"
                :compute-step-aria-label="describe"
                @current-change="(value: StepValue) => (detailedCurrent = value)"
            />
        </template>

        <template #arc>
            <ArcExample
                :steps="buildSteps(arcCurrent)"
                :current-value="arcCurrent"
                :compute-step-aria-label="describe"
                @current-change="(value: StepValue) => (arcCurrent = value)"
            />
        </template>

        <template #bare>
            <BareExample
                :steps="buildSteps(linearCurrent)"
                :current-value="linearCurrent"
                :compute-step-aria-label="describe"
                @current-change="(value: StepValue) => (linearCurrent = value)"
            />
        </template>
    </PageExamples>
</template>

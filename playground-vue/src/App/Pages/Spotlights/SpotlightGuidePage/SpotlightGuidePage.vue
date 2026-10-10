<script setup lang="ts">
import { shallowRef } from "vue";

import {
    RICH_TOUR_STEPS,
    TOUR_STORAGE_KEY,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
import { TOUR_STEPS } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import GuideExample from "./Examples/Guide.vue";
import TourExample from "./Examples/Tour.vue";

const EXAMPLES_ROOT = "/src/App/Pages/Spotlights/SpotlightGuidePage/Examples";

const readStoredStep = () => {
    try {
        const stored = sessionStorage.getItem(TOUR_STORAGE_KEY);
        const step = stored === null ? Number.NaN : Number(stored);

        return Number.isInteger(step) && step >= 0 && step < RICH_TOUR_STEPS.length ? step : undefined;
    } catch {
        return undefined;
    }
};

const writeStoredStep = (step: number | undefined) => {
    try {
        if (step === undefined) sessionStorage.removeItem(TOUR_STORAGE_KEY);
        else sessionStorage.setItem(TOUR_STORAGE_KEY, `${step}`);
    } catch {
        return;
    }
};

const step = shallowRef(0);
const finished = shallowRef("not started");

const visibility = shallowRef(false);

const tourStep = shallowRef(0);
const resumeStep = shallowRef(readStoredStep());
const tourStatus = shallowRef(resumeStep.value === undefined ? "not started" : "paused");
const basketCount = shallowRef(0);

const tourGuide = shallowRef(false);
const tourPrompt = shallowRef(false);

const changeTourStep = (nextStep: number) => {
    tourStep.value = nextStep;
    resumeStep.value = nextStep;
    writeStoredStep(nextStep);
};

const startGuide = () => {
    step.value = 0;
    finished.value = "running";
};

const endGuide = (reason: string) => {
    visibility.value = false;
    finished.value = reason;
};

const startTour = () => {
    changeTourStep(resumeStep.value ?? 0);
    tourStatus.value = "running";
};

const endTour = (reason: string) => {
    tourGuide.value = false;
    tourPrompt.value = false;
    tourStatus.value = reason;
    resumeStep.value = undefined;
    writeStoredStep(undefined);
};

const examples: ExampleDefs[] = [
    {
        key: "tour",
        name: "A tour with a step the reader does",
        span: 2,
        readout: () =>
            `step: ${tourStep.value + 1} of ${RICH_TOUR_STEPS.length} — ${tourStatus.value} — basket: ${basketCount.value}. The guide holds the whole page still, so on step 2 it closes and a prompt lights the button instead, and pressing it reopens the guide; the step is kept in sessionStorage, so reloading offers to resume`,
        path: `${EXAMPLES_ROOT}/Tour.vue`,
    },
    {
        key: "guide",
        name: "Guide",
        readout: () => `step: ${step.value + 1} of ${TOUR_STEPS.length} — ${finished.value}`,
        path: `${EXAMPLES_ROOT}/Guide.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #guide>
            <GuideExample
                v-model:visibility="visibility"
                :step="step"
                @step-change="(next: number) => (step = next)"
                @start="startGuide"
                @end="endGuide"
            />
        </template>

        <template #tour>
            <TourExample
                v-model:guide="tourGuide"
                v-model:prompt="tourPrompt"
                :step="tourStep"
                :resume-step="resumeStep"
                :basket-count="basketCount"
                @step-change="changeTourStep"
                @start="startTour"
                @end="endTour"
                @add="basketCount++"
            />
        </template>
    </PageExamples>
</template>

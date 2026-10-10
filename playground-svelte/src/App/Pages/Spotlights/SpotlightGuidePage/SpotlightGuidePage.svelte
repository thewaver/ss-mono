<script lang="ts">
    import {
        RICH_TOUR_STEPS,
        TOUR_STORAGE_KEY,
    } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
    import { TOUR_STEPS } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import GuideExample from "./Examples/Guide.svelte";
    import TourExample from "./Examples/Tour.svelte";

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

    const storedStep = readStoredStep();

    let step = $state(0);
    let finished = $state("not started");

    let visibility = $state(false);

    let tourStep = $state(0);
    let resumeStep = $state(storedStep);
    let tourStatus = $state(storedStep === undefined ? "not started" : "paused");
    let basketCount = $state(0);

    let tourGuide = $state(false);
    let tourPrompt = $state(false);

    const changeTourStep = (nextStep: number) => {
        tourStep = nextStep;
        resumeStep = nextStep;
        writeStoredStep(nextStep);
    };

    const examples: ExampleDefs[] = [
        {
            key: "tour",
            name: "A tour with a step the reader does",
            span: 2,
            readout: () =>
                `step: ${tourStep + 1} of ${RICH_TOUR_STEPS.length} — ${tourStatus} — basket: ${basketCount}. The guide holds the whole page still, so on step 2 it closes and a prompt lights the button instead, and pressing it reopens the guide; the step is kept in sessionStorage, so reloading offers to resume`,
            component: tourExample,
            path: `${EXAMPLES_ROOT}/Tour.svelte`,
        },
        {
            key: "guide",
            name: "Guide",
            readout: () => `step: ${step + 1} of ${TOUR_STEPS.length} — ${finished}`,
            component: guideExample,
            path: `${EXAMPLES_ROOT}/Guide.svelte`,
        },
    ];
</script>

{#snippet guideExample()}
    <GuideExample
        bind:visibility
        {step}
        onStepChange={(next) => {
            step = next;
        }}
        onStart={() => {
            step = 0;
            finished = "running";
        }}
        onEnd={(reason) => {
            visibility = false;
            finished = reason;
        }}
    />
{/snippet}

{#snippet tourExample()}
    <TourExample
        bind:guide={tourGuide}
        bind:prompt={tourPrompt}
        step={tourStep}
        {resumeStep}
        {basketCount}
        onStepChange={changeTourStep}
        onStart={() => {
            changeTourStep(resumeStep ?? 0);
            tourStatus = "running";
        }}
        onEnd={(reason) => {
            tourGuide = false;
            tourPrompt = false;
            tourStatus = reason;
            resumeStep = undefined;
            writeStoredStep(undefined);
        }}
        onAdd={() => {
            basketCount += 1;
        }}
    />
{/snippet}

<PageExamples items={examples} />

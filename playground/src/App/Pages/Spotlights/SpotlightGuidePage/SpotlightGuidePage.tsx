import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { TOUR_STEPS } from "../Spotlights.const";
import { GuideExample } from "./Examples/Guide";
import { TourExample } from "./Examples/Tour";
import { RICH_TOUR_STEPS, TOUR_STORAGE_KEY } from "./SpotlightGuidePage.const";

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

export const SpotlightGuidePage = () => {
    const [getStep, setStep] = createSignal(0);
    const [getFinished, setFinished] = createSignal("not started");

    const visibilitySignal = createSignal(false);

    const [getTourStep, setTourStep] = createSignal(0);
    const [getResumeStep, setResumeStep] = createSignal(readStoredStep());
    const [getTourStatus, setTourStatus] = createSignal(getResumeStep() === undefined ? "not started" : "paused");
    const [getBasketCount, setBasketCount] = createSignal(0);

    const tourGuideSignal = createSignal(false);
    const tourPromptSignal = createSignal(false);

    const changeTourStep = (step: number) => {
        setTourStep(step);
        setResumeStep(step);
        writeStoredStep(step);
    };

    const getExamples = createMemo(() => [
        {
            key: "guide",
            name: "Guide",
            readout: () => `step: ${getStep() + 1} of ${TOUR_STEPS.length} — ${getFinished()}`,
            component: () => (
                <GuideExample
                    visibilitySignal={visibilitySignal}
                    step={getStep}
                    onStepChange={setStep}
                    onStart={() => {
                        setStep(0);
                        setFinished("running");
                    }}
                    onEnd={(reason) => {
                        visibilitySignal[1](false);
                        setFinished(reason);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Guide.tsx`,
        },
        {
            key: "tour",
            name: "A tour with a step the reader does",
            readout: () =>
                `step: ${getTourStep() + 1} of ${RICH_TOUR_STEPS.length} — ${getTourStatus()} — basket: ${getBasketCount()}. The guide holds the whole page still, so on step 2 it closes and a prompt lights the button instead, and pressing it reopens the guide; the step is kept in sessionStorage, so reloading offers to resume`,
            component: () => (
                <TourExample
                    guideSignal={tourGuideSignal}
                    promptSignal={tourPromptSignal}
                    step={getTourStep}
                    resumeStep={getResumeStep}
                    basketCount={getBasketCount}
                    onStepChange={changeTourStep}
                    onStart={() => {
                        changeTourStep(getResumeStep() ?? 0);
                        setTourStatus("running");
                    }}
                    onEnd={(reason) => {
                        tourGuideSignal[1](false);
                        tourPromptSignal[1](false);
                        setTourStatus(reason);
                        setResumeStep(undefined);
                        writeStoredStep(undefined);
                    }}
                    onAdd={() => {
                        setBasketCount((prev) => prev + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Tour.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};

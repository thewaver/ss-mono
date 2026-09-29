import { useState } from "react";

import {
    RICH_TOUR_STEPS,
    TOUR_STORAGE_KEY,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
import { TOUR_STEPS } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { GuideExample } from "./Examples/Guide";
import { TourExample } from "./Examples/Tour";

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
    const [step, setStep] = useState(0);
    const [finished, setFinished] = useState("not started");

    const visibilityState = useState(false);

    const [tourStep, setTourStep] = useState(0);
    const [resumeStep, setResumeStep] = useState(readStoredStep);
    const [tourStatus, setTourStatus] = useState(() => (resumeStep === undefined ? "not started" : "paused"));
    const [basketCount, setBasketCount] = useState(0);

    const tourGuideState = useState(false);
    const tourPromptState = useState(false);

    const changeTourStep = (nextStep: number) => {
        setTourStep(nextStep);
        setResumeStep(nextStep);
        writeStoredStep(nextStep);
    };

    const examples = [
        {
            key: "guide",
            name: "Guide",
            readout: () => `step: ${step + 1} of ${TOUR_STEPS.length} — ${finished}`,
            component: () => (
                <GuideExample
                    visibility={visibilityState}
                    step={step}
                    onStepChange={setStep}
                    onStart={() => {
                        setStep(0);
                        setFinished("running");
                    }}
                    onEnd={(reason) => {
                        visibilityState[1](false);
                        setFinished(reason);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Guide.tsx`,
        },
        {
            key: "tour",
            name: "A tour with a step the reader does",
            span: 2,
            readout: () =>
                `step: ${tourStep + 1} of ${RICH_TOUR_STEPS.length} — ${tourStatus} — basket: ${basketCount}. The guide holds the whole page still, so on step 2 it closes and a prompt lights the button instead, and pressing it reopens the guide; the step is kept in sessionStorage, so reloading offers to resume`,
            component: () => (
                <TourExample
                    guide={tourGuideState}
                    prompt={tourPromptState}
                    step={tourStep}
                    resumeStep={resumeStep}
                    basketCount={basketCount}
                    onStepChange={changeTourStep}
                    onStart={() => {
                        changeTourStep(resumeStep ?? 0);
                        setTourStatus("running");
                    }}
                    onEnd={(reason) => {
                        tourGuideState[1](false);
                        tourPromptState[1](false);
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
    ];

    return <PageExamples items={examples} />;
};

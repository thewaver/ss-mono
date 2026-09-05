import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { TOUR_STEPS } from "../Spotlights.const";
import { GuideExample } from "./Examples/Guide";

const EXAMPLES_ROOT = "/src/App/Pages/Spotlights/SpotlightGuidePage/Examples";

export const SpotlightGuidePage = () => {
    const [getStep, setStep] = createSignal(0);
    const [getFinished, setFinished] = createSignal("not started");

    const visibilitySignal = createSignal(false);

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
    ]);

    return <PageExamples items={getExamples} />;
};

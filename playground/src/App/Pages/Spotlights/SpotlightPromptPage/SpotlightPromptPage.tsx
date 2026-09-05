import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PromptExample } from "./Examples/Prompt";

const EXAMPLES_ROOT = "/src/App/Pages/Spotlights/SpotlightPromptPage/Examples";

export const SpotlightPromptPage = () => {
    const [getBought, setBought] = createSignal(0);

    const visibilitySignal = createSignal(false);

    const getExamples = createMemo(() => [
        {
            key: "prompt",
            name: "Prompt",
            readout: () => `bought: ${getBought()} — nothing else on the page answers until you do`,
            component: () => (
                <PromptExample
                    visibilitySignal={visibilitySignal}
                    onBuy={() => {
                        setBought((previous) => previous + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Prompt.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};

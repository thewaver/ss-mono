import { createMemo, createSignal } from "solid-js";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightPromptPage/SpotlightPromptPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PromptExample } from "./Examples/Prompt";

export const SpotlightPromptPage = () => {
    const [getBought, setBought] = createSignal(0);

    const visibilitySignal = createSignal(false);

    const getExamples = createMemo(() => [
        {
            key: "prompt",
            name: EXAMPLE_NAMES.prompt,
            readout: () => `bought: ${getBought()} — nothing else on the page answers until you do`,
            component: () => (
                <PromptExample
                    visibility={visibilitySignal}
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

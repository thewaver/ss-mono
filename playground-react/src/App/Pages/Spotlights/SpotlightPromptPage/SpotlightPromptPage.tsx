import { useState } from "react";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightPromptPage/SpotlightPromptPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PromptExample } from "./Examples/Prompt";

export const SpotlightPromptPage = () => {
    const [bought, setBought] = useState(0);

    const visibilityState = useState(false);

    const examples = [
        {
            key: "prompt",
            name: EXAMPLE_NAMES.prompt,
            readout: () => `bought: ${bought} — nothing else on the page answers until you do`,
            component: () => (
                <PromptExample
                    visibility={visibilityState}
                    onBuy={() => {
                        setBought((previous) => previous + 1);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Prompt.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};

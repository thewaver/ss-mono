import { useState } from "react";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PromptExample } from "./Examples/Prompt";

const EXAMPLES_ROOT = "/src/App/Pages/Spotlights/SpotlightPromptPage/Examples";

export const SpotlightPromptPage = () => {
    const [bought, setBought] = useState(0);

    const visibilityState = useState(false);

    const examples = [
        {
            key: "prompt",
            name: "Prompt",
            readout: () => `bought: ${bought} — nothing else on the page answers until you do`,
            component: () => (
                <PromptExample
                    visibilityState={visibilityState}
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

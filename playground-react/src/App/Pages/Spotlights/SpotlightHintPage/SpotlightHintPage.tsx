import { useState } from "react";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { HintExample } from "./Examples/Hint";

const EXAMPLES_ROOT = "/src/App/Pages/Spotlights/SpotlightHintPage/Examples";

export const SpotlightHintPage = () => {
    const [index, setIndex] = useState(0);

    const visibilityState = useState(false);

    const examples = [
        {
            key: "hint",
            name: "Hint",
            readout: () => `open: ${visibilityState[0]} — a click anywhere or any real key puts it away`,
            component: () => <HintExample visibilityState={visibilityState} index={index} onIndexChange={setIndex} />,
            path: `${EXAMPLES_ROOT}/Hint.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};

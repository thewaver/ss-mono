import { useState } from "react";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightHintPage/SpotlightHintPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { HintExample } from "./Examples/Hint";

export const SpotlightHintPage = () => {
    const [index, setIndex] = useState(0);

    const visibilityState = useState(false);

    const examples = [
        {
            key: "hint",
            name: EXAMPLE_NAMES.hint,
            readout: () => `open: ${visibilityState[0]} — a click anywhere or any real key puts it away`,
            component: () => <HintExample visibility={visibilityState} index={index} onIndexChange={setIndex} />,
            path: `${EXAMPLES_ROOT}/Hint.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};

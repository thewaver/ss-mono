import { createMemo, createSignal } from "solid-js";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightHintPage/SpotlightHintPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { HintExample } from "./Examples/Hint";

export const SpotlightHintPage = () => {
    const [getIndex, setIndex] = createSignal(0);

    const visibilitySignal = createSignal(false);

    const getExamples = createMemo(() => [
        {
            key: "hint",
            name: EXAMPLE_NAMES.hint,
            readout: () => `open: ${visibilitySignal[0]()} — a click anywhere or any real key puts it away`,
            component: () => <HintExample visibility={visibilitySignal} index={getIndex} onIndexChange={setIndex} />,
            path: `${EXAMPLES_ROOT}/Hint.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};

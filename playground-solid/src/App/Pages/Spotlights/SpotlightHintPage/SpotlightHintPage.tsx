import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { HintExample } from "./Examples/Hint";

const EXAMPLES_ROOT = "/src/App/Pages/Spotlights/SpotlightHintPage/Examples";

export const SpotlightHintPage = () => {
    const [getIndex, setIndex] = createSignal(0);

    const visibilitySignal = createSignal(false);

    const getExamples = createMemo(() => [
        {
            key: "hint",
            name: "Hint",
            readout: () => `open: ${visibilitySignal[0]()} — a click anywhere or any real key puts it away`,
            component: () => (
                <HintExample visibilitySignal={visibilitySignal} index={getIndex} onIndexChange={setIndex} />
            ),
            path: `${EXAMPLES_ROOT}/Hint.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};

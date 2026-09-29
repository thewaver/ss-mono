import { useState } from "react";

import type { RangeValues } from "@thewaver/ss-components-react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { DisabledPairExample } from "./Examples/DisabledPair";
import { ErroredExample } from "./Examples/Errored";
import { KnobExample } from "./Examples/Knob";
import { PairExample } from "./Examples/Pair";
import { PriceExample } from "./Examples/Price";
import { ReachableExample } from "./Examples/Reachable";
import { SteppedExample } from "./Examples/Stepped";
import { VerticalExample } from "./Examples/Vertical";

const STEP_COUNT = 5;
const EXAMPLES_ROOT = "/src/App/Pages/RangePage/Examples";

export const RangePage = () => {
    const volumeState = useState(40);
    const stepsState = useState(3);
    const verticalState = useState(60);
    const disabledState = useState(25);
    const reachableState = useState(75);
    const erroredState = useState(90);
    const knobState = useState(30);

    const priceState = useState<RangeValues>({ start: 20, end: 80 });
    const budgetState = useState<RangeValues>({ start: 100, end: 350 });
    const [settledBudget, setSettledBudget] = useState("not yet");
    const verticalPairState = useState<RangeValues>({ start: 30, end: 70 });
    const disabledPairState = useState<RangeValues>({ start: 35, end: 65 });

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${volumeState[0]}`,
            component: () => <DefaultExample value={volumeState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "stepped",
            name: "Stepped",
            readout: () => `value: ${stepsState[0]} of ${STEP_COUNT}`,
            component: () => <SteppedExample value={stepsState} />,
            path: `${EXAMPLES_ROOT}/Stepped.tsx`,
        },
        {
            key: "pair",
            name: "Pair",
            readout: () => `start: ${priceState[0].start} | end: ${priceState[0].end}`,
            component: () => <PairExample range={priceState} />,
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "priceRange",
            name: "Price range, read as prices",
            readout: () =>
                `start: ${budgetState[0].start} | end: ${budgetState[0].end} | settled: ${settledBudget} — each thumb reads its value as a price, and "settled" changes only when a drag lets go or a key is pressed`,
            component: () => (
                <PriceExample
                    range={budgetState}
                    onChangeEnd={(values) => {
                        setSettledBudget(values.join("–"));
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Price.tsx`,
        },
        {
            key: "vertical",
            name: "Vertical",
            readout: () =>
                `single: ${verticalState[0]} | pair: ${verticalPairState[0].start}–${verticalPairState[0].end}`,
            component: () => <VerticalExample value={verticalState} range={verticalPairState} />,
            path: `${EXAMPLES_ROOT}/Vertical.tsx`,
        },
        {
            key: "knob",
            name: "Knob",
            readout: () =>
                `value: ${knobState[0]} — computeValueAtPoint reads the pointer by its angle round the center, so dragging turns it; the arrow keys still step it`,
            component: () => <KnobExample value={knobState} />,
            path: `${EXAMPLES_ROOT}/Knob.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `value: ${disabledState[0]}`,
            component: () => <DisabledExample value={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "disabledPair",
            name: "Disabled pair",
            readout: () =>
                `start: ${disabledPairState[0].start} | end: ${disabledPairState[0].end} — both thumbs must be out of the tab order`,
            component: () => <DisabledPairExample range={disabledPairState} />,
            path: `${EXAMPLES_ROOT}/DisabledPair.tsx`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `value: ${reachableState[0]}`,
            component: () => <ReachableExample value={reachableState} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `value: ${erroredState[0]}`,
            component: () => <ErroredExample value={erroredState} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};

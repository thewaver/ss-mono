import { useState } from "react";

import { EXAMPLES_ROOT, EXAMPLE_NAMES, STEP_COUNT } from "@thewaver/ss-playground/App/Pages/RangePage/RangePage.const";
import type { Span } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { DisabledPairExample } from "./Examples/DisabledPair";
import { ErroredExample } from "./Examples/Errored";
import { KnobExample } from "./Examples/Knob";
import { PairExample } from "./Examples/Pair";
import { PriceExample } from "./Examples/Price";
import { ReachableExample } from "./Examples/Reachable";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { SteppedExample } from "./Examples/Stepped";
import { VerticalExample } from "./Examples/Vertical";

export const RangePage = () => {
    const volumeState = useState(40);
    const stepsState = useState(3);
    const verticalState = useState(60);
    const disabledState = useState(25);
    const reachableState = useState(75);
    const erroredState = useState(90);
    const knobState = useState(30);

    const priceState = useState<Span>({ start: 20, end: 80 });
    const rightToLeftState = useState<Span>({ start: 20, end: 80 });
    const budgetState = useState<Span>({ start: 100, end: 350 });
    const [settledBudget, setSettledBudget] = useState("not yet");
    const verticalPairState = useState<Span>({ start: 30, end: 70 });
    const disabledPairState = useState<Span>({ start: 35, end: 65 });

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `value: ${volumeState[0]}`,
            component: () => <DefaultExample value={volumeState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "stepped",
            name: EXAMPLE_NAMES.stepped,
            readout: () => `value: ${stepsState[0]} of ${STEP_COUNT}`,
            component: () => <SteppedExample value={stepsState} />,
            path: `${EXAMPLES_ROOT}/Stepped.tsx`,
        },
        {
            key: "pair",
            name: EXAMPLE_NAMES.pair,
            readout: () => `start: ${priceState[0].start} | end: ${priceState[0].end}`,
            component: () => <PairExample range={priceState} />,
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "rightToLeft",
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `start: ${rightToLeftState[0].start} | end: ${rightToLeftState[0].end} — the box around the range sets dir="rtl", so the track runs from the right and the lowest price is the thumb on the right`,
            component: () => <RightToLeftExample range={rightToLeftState} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "priceRange",
            name: EXAMPLE_NAMES.priceRange,
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
            name: EXAMPLE_NAMES.vertical,
            readout: () =>
                `single: ${verticalState[0]} | pair: ${verticalPairState[0].start}–${verticalPairState[0].end}`,
            component: () => <VerticalExample value={verticalState} range={verticalPairState} />,
            path: `${EXAMPLES_ROOT}/Vertical.tsx`,
        },
        {
            key: "knob",
            name: EXAMPLE_NAMES.knob,
            readout: () =>
                `value: ${knobState[0]} — computeValueAtPoint reads the pointer by its angle round the center, so dragging turns it; the arrow keys still step it`,
            component: () => <KnobExample value={knobState} />,
            path: `${EXAMPLES_ROOT}/Knob.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `value: ${disabledState[0]}`,
            component: () => <DisabledExample value={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "disabledPair",
            name: EXAMPLE_NAMES.disabledPair,
            readout: () =>
                `start: ${disabledPairState[0].start} | end: ${disabledPairState[0].end} — both thumbs must be out of the tab order`,
            component: () => <DisabledPairExample range={disabledPairState} />,
            path: `${EXAMPLES_ROOT}/DisabledPair.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `value: ${reachableState[0]}`,
            component: () => <ReachableExample value={reachableState} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `value: ${erroredState[0]}`,
            component: () => <ErroredExample value={erroredState} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};

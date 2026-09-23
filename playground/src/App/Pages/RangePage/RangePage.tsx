import { createMemo, createSignal } from "solid-js";

import type { RangeValues } from "@thewaver/ss-components";

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
    const volumeSignal = createSignal(40);
    const stepsSignal = createSignal(3);
    const verticalSignal = createSignal(60);
    const disabledSignal = createSignal(25);
    const reachableSignal = createSignal(75);
    const erroredSignal = createSignal(90);
    const knobSignal = createSignal(30);

    const priceSignal = createSignal<RangeValues>({ start: 20, end: 80 });
    const budgetSignal = createSignal<RangeValues>({ start: 100, end: 350 });
    const [getSettledBudget, setSettledBudget] = createSignal("not yet");
    const verticalPairSignal = createSignal<RangeValues>({ start: 30, end: 70 });
    const disabledPairSignal = createSignal<RangeValues>({ start: 35, end: 65 });

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${volumeSignal[0]()}`,
            component: () => <DefaultExample valueSignal={volumeSignal} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "stepped",
            name: "Stepped",
            readout: () => `value: ${stepsSignal[0]()} of ${STEP_COUNT}`,
            component: () => <SteppedExample valueSignal={stepsSignal} />,
            path: `${EXAMPLES_ROOT}/Stepped.tsx`,
        },
        {
            key: "pair",
            name: "Pair",
            readout: () => `start: ${priceSignal[0]().start} | end: ${priceSignal[0]().end}`,
            component: () => <PairExample rangeSignal={priceSignal} />,
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "priceRange",
            name: "Price range, read as prices",
            readout: () =>
                `start: ${budgetSignal[0]().start} | end: ${budgetSignal[0]().end} | settled: ${getSettledBudget()} — each thumb reads its value as a price, and "settled" changes only when a drag lets go or a key is pressed`,
            component: () => (
                <PriceExample
                    rangeSignal={budgetSignal}
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
                `single: ${verticalSignal[0]()} | pair: ${verticalPairSignal[0]().start}–${verticalPairSignal[0]().end}`,
            component: () => <VerticalExample valueSignal={verticalSignal} rangeSignal={verticalPairSignal} />,
            path: `${EXAMPLES_ROOT}/Vertical.tsx`,
        },
        {
            key: "knob",
            name: "Knob",
            readout: () =>
                `value: ${knobSignal[0]()} — computeValueAtPoint reads the pointer by its angle round the center, so dragging turns it; the arrow keys still step it`,
            component: () => <KnobExample valueSignal={knobSignal} />,
            path: `${EXAMPLES_ROOT}/Knob.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `value: ${disabledSignal[0]()}`,
            component: () => <DisabledExample valueSignal={disabledSignal} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "disabledPair",
            name: "Disabled pair",
            readout: () =>
                `start: ${disabledPairSignal[0]().start} | end: ${disabledPairSignal[0]().end} — both thumbs must be out of the tab order`,
            component: () => <DisabledPairExample rangeSignal={disabledPairSignal} />,
            path: `${EXAMPLES_ROOT}/DisabledPair.tsx`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `value: ${reachableSignal[0]()}`,
            component: () => <ReachableExample valueSignal={reachableSignal} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `value: ${erroredSignal[0]()}`,
            component: () => <ErroredExample valueSignal={erroredSignal} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};

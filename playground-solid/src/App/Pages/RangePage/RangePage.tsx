import { createMemo, createSignal } from "solid-js";

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
    const volumeSignal = createSignal(40);
    const stepsSignal = createSignal(3);
    const verticalSignal = createSignal(60);
    const disabledSignal = createSignal(25);
    const reachableSignal = createSignal(75);
    const erroredSignal = createSignal(90);
    const knobSignal = createSignal(30);

    const priceSignal = createSignal<Span>({ start: 20, end: 80 });
    const rightToLeftSignal = createSignal<Span>({ start: 20, end: 80 });
    const budgetSignal = createSignal<Span>({ start: 100, end: 350 });
    const [getSettledBudget, setSettledBudget] = createSignal("not yet");
    const verticalPairSignal = createSignal<Span>({ start: 30, end: 70 });
    const disabledPairSignal = createSignal<Span>({ start: 35, end: 65 });

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `value: ${volumeSignal[0]()}`,
            component: () => <DefaultExample value={volumeSignal} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "stepped",
            name: EXAMPLE_NAMES.stepped,
            readout: () => `value: ${stepsSignal[0]()} of ${STEP_COUNT}`,
            component: () => <SteppedExample value={stepsSignal} />,
            path: `${EXAMPLES_ROOT}/Stepped.tsx`,
        },
        {
            key: "pair",
            name: EXAMPLE_NAMES.pair,
            readout: () => `start: ${priceSignal[0]().start} | end: ${priceSignal[0]().end}`,
            component: () => <PairExample range={priceSignal} />,
            path: `${EXAMPLES_ROOT}/Pair.tsx`,
        },
        {
            key: "rightToLeft",
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `start: ${rightToLeftSignal[0]().start} | end: ${rightToLeftSignal[0]().end} — the box around the range sets dir="rtl", so the track runs from the right and the lowest price is the thumb on the right`,
            component: () => <RightToLeftExample range={rightToLeftSignal} />,
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "priceRange",
            name: EXAMPLE_NAMES.priceRange,
            readout: () =>
                `start: ${budgetSignal[0]().start} | end: ${budgetSignal[0]().end} | settled: ${getSettledBudget()} — each thumb reads its value as a price, and "settled" changes only when a drag lets go or a key is pressed`,
            component: () => (
                <PriceExample
                    range={budgetSignal}
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
                `single: ${verticalSignal[0]()} | pair: ${verticalPairSignal[0]().start}–${verticalPairSignal[0]().end}`,
            component: () => <VerticalExample value={verticalSignal} range={verticalPairSignal} />,
            path: `${EXAMPLES_ROOT}/Vertical.tsx`,
        },
        {
            key: "knob",
            name: EXAMPLE_NAMES.knob,
            readout: () =>
                `value: ${knobSignal[0]()} — computeValueAtPoint reads the pointer by its angle round the center, so dragging turns it; the arrow keys still step it`,
            component: () => <KnobExample value={knobSignal} />,
            path: `${EXAMPLES_ROOT}/Knob.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `value: ${disabledSignal[0]()}`,
            component: () => <DisabledExample value={disabledSignal} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "disabledPair",
            name: EXAMPLE_NAMES.disabledPair,
            readout: () =>
                `start: ${disabledPairSignal[0]().start} | end: ${disabledPairSignal[0]().end} — both thumbs must be out of the tab order`,
            component: () => <DisabledPairExample range={disabledPairSignal} />,
            path: `${EXAMPLES_ROOT}/DisabledPair.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `value: ${reachableSignal[0]()}`,
            component: () => <ReachableExample value={reachableSignal} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `value: ${erroredSignal[0]()}`,
            component: () => <ErroredExample value={erroredSignal} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};

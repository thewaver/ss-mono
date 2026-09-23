import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { FractionalStepExample } from "./Examples/FractionalStep";
import { GermanExample } from "./Examples/German";
import { LabeledExample } from "./Examples/Labeled";
import { ReachableExample } from "./Examples/Reachable";
import { ReadOnlyExample } from "./Examples/ReadOnly";
import { SteppedClampedExample } from "./Examples/SteppedClamped";
import { UnitExample } from "./Examples/Unit";
import { AMOUNT_STEP, GERMAN_LOCALE, QUANTITY_MIN, QUANTITY_STEP, RATING_STEP } from "./NumberInputPage.const";

const EXAMPLES_ROOT = "/src/App/Pages/NumberInputPage/Examples";

export const NumberInputPage = () => {
    const defaultSignal = createSignal<number | undefined>(undefined);
    const quantitySignal = createSignal<number | undefined>(13);
    const ratingSignal = createSignal<number | undefined>(3.7);
    const unitSignal = createSignal<number | undefined>(72);
    const germanSignal = createSignal<number | undefined>(1234.5);
    const readOnlySignal = createSignal<number | undefined>(1024);
    const disabledSignal = createSignal<number | undefined>(7);
    const reachableSignal = createSignal<number | undefined>(7);
    const erroredSignal = createSignal<number | undefined>(0);
    const labeledSignal = createSignal<number | undefined>(undefined);

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${defaultSignal[0]()} — an empty field has no value at all`,
            component: () => <DefaultExample valueSignal={defaultSignal} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "steppedClamped",
            name: "Stepped and clamped",
            readout: () =>
                `value: ${quantitySignal[0]()} — steps of ${QUANTITY_STEP} counted from ${QUANTITY_MIN}; an out-of-range value is held back until the field is left`,
            component: () => <SteppedClampedExample valueSignal={quantitySignal} />,
            path: `${EXAMPLES_ROOT}/SteppedClamped.tsx`,
        },
        {
            key: "fractionalStep",
            name: "Fractional step",
            readout: () => `value: ${ratingSignal[0]()} — a step of ${RATING_STEP} must not drift`,
            component: () => <FractionalStepExample valueSignal={ratingSignal} />,
            path: `${EXAMPLES_ROOT}/FractionalStep.tsx`,
        },
        {
            key: "german",
            name: "German conventions",
            readout: () =>
                `value: ${germanSignal[0]()} — under ${GERMAN_LOCALE} "1.000" is one thousand and "1,5" is one and a half; PageUp and PageDown move ${AMOUNT_STEP * 10}, ten steps`,
            component: () => <GermanExample valueSignal={germanSignal} />,
            path: `${EXAMPLES_ROOT}/German.tsx`,
        },
        {
            key: "unit",
            name: "With a unit",
            readout: () => `value: ${unitSignal[0]()} — one slot holds both the unit and the stepper`,
            component: () => <UnitExample valueSignal={unitSignal} />,
            path: `${EXAMPLES_ROOT}/Unit.tsx`,
        },
        {
            key: "readOnly",
            name: "Read-only",
            readout: () => `value: ${readOnlySignal[0]()} — the stepper is refused along with the keyboard`,
            component: () => <ReadOnlyExample valueSignal={readOnlySignal} />,
            path: `${EXAMPLES_ROOT}/ReadOnly.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `value: ${disabledSignal[0]()}`,
            component: () => <DisabledExample valueSignal={disabledSignal} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
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
            readout: () => `value: ${erroredSignal[0]()} — anything but a positive count is an error`,
            component: () => <ErroredExample valueSignal={erroredSignal} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
        {
            key: "label",
            name: "In a Label",
            readout: () => `value: ${labeledSignal[0]()}`,
            component: () => <LabeledExample valueSignal={labeledSignal} />,
            path: `${EXAMPLES_ROOT}/Labeled.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};

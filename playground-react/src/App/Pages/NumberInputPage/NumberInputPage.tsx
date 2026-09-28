import { useState } from "react";

import {
    AMOUNT_STEP,
    GERMAN_LOCALE,
    QUANTITY_MIN,
    QUANTITY_STEP,
    RATING_STEP,
} from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";

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

const EXAMPLES_ROOT = "/src/App/Pages/NumberInputPage/Examples";

export const NumberInputPage = () => {
    const defaultState = useState<number | undefined>(undefined);
    const quantityState = useState<number | undefined>(13);
    const ratingState = useState<number | undefined>(3.7);
    const unitState = useState<number | undefined>(72);
    const germanState = useState<number | undefined>(1234.5);
    const readOnlyState = useState<number | undefined>(1024);
    const disabledState = useState<number | undefined>(7);
    const reachableState = useState<number | undefined>(7);
    const erroredState = useState<number | undefined>(0);
    const labeledState = useState<number | undefined>(undefined);

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${defaultState[0]} — an empty field has no value at all`,
            component: () => <DefaultExample valueState={defaultState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "steppedClamped",
            name: "Stepped and clamped",
            readout: () =>
                `value: ${quantityState[0]} — steps of ${QUANTITY_STEP} counted from ${QUANTITY_MIN}; an out-of-range value is held back until the field is left`,
            component: () => <SteppedClampedExample valueState={quantityState} />,
            path: `${EXAMPLES_ROOT}/SteppedClamped.tsx`,
        },
        {
            key: "fractionalStep",
            name: "Fractional step",
            readout: () => `value: ${ratingState[0]} — a step of ${RATING_STEP} must not drift`,
            component: () => <FractionalStepExample valueState={ratingState} />,
            path: `${EXAMPLES_ROOT}/FractionalStep.tsx`,
        },
        {
            key: "german",
            name: "German conventions",
            readout: () =>
                `value: ${germanState[0]} — under ${GERMAN_LOCALE} "1.000" is one thousand and "1,5" is one and a half; PageUp and PageDown move ${AMOUNT_STEP * 10}, ten steps`,
            component: () => <GermanExample valueState={germanState} />,
            path: `${EXAMPLES_ROOT}/German.tsx`,
        },
        {
            key: "unit",
            name: "With a unit",
            readout: () => `value: ${unitState[0]} — one slot holds both the unit and the stepper`,
            component: () => <UnitExample valueState={unitState} />,
            path: `${EXAMPLES_ROOT}/Unit.tsx`,
        },
        {
            key: "readOnly",
            name: "Read-only",
            readout: () => `value: ${readOnlyState[0]} — the stepper is refused along with the keyboard`,
            component: () => <ReadOnlyExample valueState={readOnlyState} />,
            path: `${EXAMPLES_ROOT}/ReadOnly.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `value: ${disabledState[0]}`,
            component: () => <DisabledExample valueState={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `value: ${reachableState[0]}`,
            component: () => <ReachableExample valueState={reachableState} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `value: ${erroredState[0]} — anything but a positive count is an error`,
            component: () => <ErroredExample valueState={erroredState} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
        {
            key: "label",
            name: "In a Label",
            readout: () => `value: ${labeledState[0]}`,
            component: () => <LabeledExample valueState={labeledState} />,
            path: `${EXAMPLES_ROOT}/Labeled.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};

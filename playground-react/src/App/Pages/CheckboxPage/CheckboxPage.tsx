import { useEffect, useState } from "react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DecoratedExample } from "./Examples/Decorated";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { MixedExample } from "./Examples/Mixed";
import { ReachableExample } from "./Examples/Reachable";
import { RefusedWriteExample } from "./Examples/RefusedWrite";

const EXAMPLES_ROOT = "/src/App/Pages/CheckboxPage/Examples";

export const CheckboxPage = () => {
    const defaultState = useState(false);
    const decoratedState = useState(true);
    const disabledState = useState(true);
    const reachableState = useState(true);
    const erroredState = useState(false);

    const allState = useState(false);
    const firstChildState = useState(true);
    const secondChildState = useState(false);

    const emailState = useState(true);
    const smsState = useState(false);

    const [, setAll] = allState;
    const [isFirstChecked] = firstChildState;
    const [isSecondChecked] = secondChildState;

    const isAllMixed = isFirstChecked !== isSecondChecked;

    useEffect(() => {
        setAll(isFirstChecked && isSecondChecked);
    }, [isFirstChecked, isSecondChecked]);

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () => `checked: ${defaultState[0]}`,
            component: () => <DefaultExample checkedState={defaultState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "decorated",
            name: "Decorated",
            readout: () => `checked: ${decoratedState[0]}`,
            component: () => <DecoratedExample checkedState={decoratedState} />,
            path: `${EXAMPLES_ROOT}/Decorated.tsx`,
        },
        {
            key: "mixed",
            name: "Mixed",
            readout: () =>
                `mixed: ${isAllMixed} | all: ${allState[0]} | children: ${firstChildState[0]}, ${secondChildState[0]}`,
            component: () => (
                <MixedExample
                    allState={allState}
                    firstChildState={firstChildState}
                    secondChildState={secondChildState}
                    isMixed={isAllMixed}
                />
            ),
            path: `${EXAMPLES_ROOT}/Mixed.tsx`,
        },
        {
            key: "refusedWrite",
            name: "Refused write",
            readout: () =>
                `email: ${emailState[0]} | sms: ${smsState[0]} — whichever is the last one on refuses to go off`,
            component: () => <RefusedWriteExample emailState={emailState} smsState={smsState} />,
            path: `${EXAMPLES_ROOT}/RefusedWrite.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `checked: ${disabledState[0]}`,
            component: () => <DisabledExample checkedState={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `checked: ${reachableState[0]}`,
            component: () => <ReachableExample checkedState={reachableState} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `checked: ${erroredState[0]}`,
            component: () => <ErroredExample checkedState={erroredState} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};

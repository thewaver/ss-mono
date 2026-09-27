import { useEffect, useState } from "react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DecoratedExample } from "./Examples/Decorated";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { MixedExample } from "./Examples/Mixed";
import { ReachableExample } from "./Examples/Reachable";

const EXAMPLES_ROOT = "/src/App/Pages/TogglePage/Examples";

export const TogglePage = () => {
    const defaultState = useState(false);
    const decoratedState = useState(true);
    const disabledState = useState(true);
    const reachableState = useState(true);
    const erroredState = useState(false);

    const allState = useState(false);
    const firstChildState = useState(true);
    const secondChildState = useState(false);

    const isAllMixed = firstChildState[0] !== secondChildState[0];

    const [, setAll] = allState;

    useEffect(() => {
        setAll(firstChildState[0] && secondChildState[0]);
    }, [firstChildState[0], secondChildState[0]]);

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () => `on: ${defaultState[0]}`,
            component: () => <DefaultExample checkedState={defaultState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "decorated",
            name: "Decorated",
            readout: () => `on: ${decoratedState[0]}`,
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
            key: "disabled",
            name: "Disabled",
            readout: () => `on: ${disabledState[0]}`,
            component: () => <DisabledExample checkedState={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `on: ${reachableState[0]}`,
            component: () => <ReachableExample checkedState={reachableState} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `on: ${erroredState[0]}`,
            component: () => <ErroredExample checkedState={erroredState} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};

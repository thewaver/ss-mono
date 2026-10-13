import { useEffect, useState } from "react";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/TogglePage/TogglePage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DecoratedExample } from "./Examples/Decorated";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { MixedExample } from "./Examples/Mixed";
import { ReachableExample } from "./Examples/Reachable";

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
            name: EXAMPLE_NAMES.default,
            readout: () => `on: ${defaultState[0]}`,
            component: () => <DefaultExample checked={defaultState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "decorated",
            name: EXAMPLE_NAMES.decorated,
            readout: () => `on: ${decoratedState[0]}`,
            component: () => <DecoratedExample checked={decoratedState} />,
            path: `${EXAMPLES_ROOT}/Decorated.tsx`,
        },
        {
            key: "mixed",
            name: EXAMPLE_NAMES.mixed,
            readout: () =>
                `mixed: ${isAllMixed} | all: ${allState[0]} | children: ${firstChildState[0]}, ${secondChildState[0]}`,
            component: () => (
                <MixedExample
                    all={allState}
                    firstChild={firstChildState}
                    secondChild={secondChildState}
                    isMixed={isAllMixed}
                />
            ),
            path: `${EXAMPLES_ROOT}/Mixed.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `on: ${disabledState[0]}`,
            component: () => <DisabledExample checked={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `on: ${reachableState[0]}`,
            component: () => <ReachableExample checked={reachableState} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `on: ${erroredState[0]}`,
            component: () => <ErroredExample checked={erroredState} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};

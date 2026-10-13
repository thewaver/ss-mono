import { createEffect, createMemo, createSignal } from "solid-js";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/TogglePage/TogglePage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DecoratedExample } from "./Examples/Decorated";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { MixedExample } from "./Examples/Mixed";
import { ReachableExample } from "./Examples/Reachable";

export const TogglePage = () => {
    const defaultSignal = createSignal(false);
    const decoratedSignal = createSignal(true);
    const disabledSignal = createSignal(true);
    const reachableSignal = createSignal(true);
    const erroredSignal = createSignal(false);

    const allSignal = createSignal(false);
    const firstChildSignal = createSignal(true);
    const secondChildSignal = createSignal(false);

    const getIsAllMixed = createMemo(() => firstChildSignal[0]() !== secondChildSignal[0]());

    createEffect(() => {
        allSignal[1](firstChildSignal[0]() && secondChildSignal[0]());
    });

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `on: ${defaultSignal[0]()}`,
            component: () => <DefaultExample checked={defaultSignal} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "decorated",
            name: EXAMPLE_NAMES.decorated,
            readout: () => `on: ${decoratedSignal[0]()}`,
            component: () => <DecoratedExample checked={decoratedSignal} />,
            path: `${EXAMPLES_ROOT}/Decorated.tsx`,
        },
        {
            key: "mixed",
            name: EXAMPLE_NAMES.mixed,
            readout: () =>
                `mixed: ${getIsAllMixed()} | all: ${allSignal[0]()} | children: ${firstChildSignal[0]()}, ${secondChildSignal[0]()}`,
            component: () => (
                <MixedExample
                    all={allSignal}
                    firstChild={firstChildSignal}
                    secondChild={secondChildSignal}
                    isMixed={getIsAllMixed}
                />
            ),
            path: `${EXAMPLES_ROOT}/Mixed.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `on: ${disabledSignal[0]()}`,
            component: () => <DisabledExample checked={disabledSignal} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `on: ${reachableSignal[0]()}`,
            component: () => <ReachableExample checked={reachableSignal} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `on: ${erroredSignal[0]()}`,
            component: () => <ErroredExample checked={erroredSignal} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};

import { createEffect, createMemo, createSignal } from "solid-js";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/CheckboxPage/CheckboxPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DecoratedExample } from "./Examples/Decorated";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { ErroredExample } from "./Examples/Errored";
import { MixedExample } from "./Examples/Mixed";
import { ReachableExample } from "./Examples/Reachable";
import { RefusedWriteExample } from "./Examples/RefusedWrite";

export const CheckboxPage = () => {
    const defaultSignal = createSignal(false);
    const decoratedSignal = createSignal(true);
    const disabledSignal = createSignal(true);
    const reachableSignal = createSignal(true);
    const erroredSignal = createSignal(false);

    const allSignal = createSignal(false);
    const firstChildSignal = createSignal(true);
    const secondChildSignal = createSignal(false);

    const emailSignal = createSignal(true);
    const smsSignal = createSignal(false);

    const getIsAllMixed = createMemo(() => firstChildSignal[0]() !== secondChildSignal[0]());

    createEffect(() => {
        allSignal[1](firstChildSignal[0]() && secondChildSignal[0]());
    });

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `checked: ${defaultSignal[0]()}`,
            component: () => <DefaultExample checked={defaultSignal} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "decorated",
            name: EXAMPLE_NAMES.decorated,
            readout: () => `checked: ${decoratedSignal[0]()}`,
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
            key: "refusedWrite",
            name: EXAMPLE_NAMES.refusedWrite,
            readout: () =>
                `email: ${emailSignal[0]()} | sms: ${smsSignal[0]()} — whichever is the last one on refuses to go off`,
            component: () => <RefusedWriteExample email={emailSignal} sms={smsSignal} />,
            path: `${EXAMPLES_ROOT}/RefusedWrite.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `checked: ${disabledSignal[0]()}`,
            component: () => <DisabledExample checked={disabledSignal} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `checked: ${reachableSignal[0]()}`,
            component: () => <ReachableExample checked={reachableSignal} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `checked: ${erroredSignal[0]()}`,
            component: () => <ErroredExample checked={erroredSignal} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
